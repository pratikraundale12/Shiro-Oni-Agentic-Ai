const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { omit, isEmpty, filter } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const dns = require('dns');
const multer = require('../middlewares/multer');
const normalizeNullString = require('../middlewares/normalizeNullStrings');
const { logger } = require('../utils/common');
const { ClientError, AuthorizationError } = require('../Error');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Nifi = require('../Nifi');
const { USER, FILE, ALLOWED_IMAGE_EXTENSIONS } = require('../constants');
const {
  verifyLicense,
  decryptLicense,
  removeFiles,
  validateAllowedImgType,
  checkLdapEnabled,
  sendEmail,
  constructUrl,
} = require('../utils/helpers');
const {
  createAndBindLdapClient,
  ldapSearch,
  unbindLdap,
  groupSearchOptions,
} = require('../utils/ldap');
const schemaValidator = require('../utils/validators');
const Role = require('../models/Role');
const {
  registerUserSchema,
  loginAdminSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  createUserSchema,
  updateUserSchema,
  loginUserSchema,
  testLdapSchema,
  ldapConfigSchema,
} = require('../fieldSchemas/userSchema');
const { getUserListSchema } = require('../fieldSchemas/querySchema');
const { idParamSchema } = require('../fieldSchemas/paramsSchema');
const { auditLog } = require('../utils/audit.js');
const checkPermissions = require('../middlewares/checkPermissions');
const Setting = require('../models/Setting.js');
const Ldap = require('../models/Ldap.js');

//helpers
function timeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(new ClientError({ message: 'Connection timeout' })),
      timeout
    );
  });
}

function processMemberUids(memberUids, userUniqueIdentifier) {
  logger.debug('Processing memberUids: ', { memberUids, userUniqueIdentifier });
  if (
    userUniqueIdentifier === 'distinguishedName' ||
    userUniqueIdentifier === 'dn'
  ) {
    return memberUids;
  } else {
    return memberUids.map(uid => {
      const parts = uid.split(',');
      const firstPart = parts[0];
      const parseIdentifier = parts[0].toLowerCase();
      if (parseIdentifier.startsWith(userUniqueIdentifier + '=')) {
        return firstPart.split('=')[1];
      }
      return uid;
    });
  }
}

const formatLdapUsers = (ldapUser = {}, ldapMappedRoles = [], userId) => {
  const roleId = ldapMappedRoles.filter(
    role => role.ldap_group_name === ldapUser.groupname
  );

  return {
    ...ldapUser,
    role_id: roleId[0]?.role_id || userId,
  };
};

const createFilterString = () => {
  const currentDate = new Date();
  const thirtyMinutesAgo = new Date(
    currentDate.getTime() - 30 * 60 * 1000
  ).toISOString();
  const dateString = thirtyMinutesAgo.split('T')[0].split('-').join('');
  const timeString = thirtyMinutesAgo.split('T')[1].split(':').join('');
  const final = dateString + timeString;

  return `(|(createTimestamp>=${final.split('.')[0] + 'Z'})(modifyTimestamp>=${final.split('.')[0] + 'Z'}))`;
};

const upsertUsers = async (knex, usersToBeInserted) => {
  await knex.transaction(async trx => {
    const insertions = usersToBeInserted.map(record => {
      let username = getUserName(record?.username);
      logger.debug('Username for users:', {
        username: username,
        first_name: record.first_name,
        last_name: record.last_name,
        role_id: record.role_id,
      });
      return trx('users')
        .insert({
          username: username,
          email: record.email,
          first_name: record.first_name,
          last_name: record.last_name,
          role_id: record.role_id,
        })
        .onConflict('username')
        .merge();
    });
    await Promise.all(insertions);
  });
};

const getUserRoleId = async knex => {
  const user = await knex('roles').where('name', 'user').select('id');
  return user[0]?.id;
};

// TODO, remove once ldap structure is corrected.
function getLdapUserDn(username, ldapConfig) {
  logger.debug('Getting LDAP user DN: ', username, ldapConfig);
  const filterUsername = username?.split('.'); // Split username by the period

  let parsedUsername;
  if (filterUsername.length === 2) {
    parsedUsername = filterUsername[0] + ' ' + filterUsername[1];
  } else {
    parsedUsername = username;
  }

  if (ldapConfig.userDn === ldapConfig.baseDn) {
    return `cn=${parsedUsername},${ldapConfig.baseDn}`;
  } else if (ldapConfig.userUniqueIdentifier === 'distinguishedName') {
    return `cn=${parsedUsername},${ldapConfig.userDn},${ldapConfig.baseDn}`;
  } else {
    return `${ldapConfig.userUniqueIdentifier}=${parsedUsername},${ldapConfig.userDn},${ldapConfig.baseDn}`;
  }
}

// Check if hostname resolves before proceeding with LDAP bind
function checkHostname(url) {
  return new Promise((resolve, reject) => {
    const hostname = new URL(url).hostname;
    dns.lookup(hostname, (err, address) => {
      if (err) {
        reject(new Error(`LDAP URL not reachable.`));
      } else {
        resolve(address);
      }
    });
  });
}

// Parse username to first child branch, like: cn=abc,dc=xyc to abc
function getUserName(username) {
  if (!username) {
    return null;
  }
  if (username.includes('=')) {
    const parts = username.split(',');
    const keyValue = parts.length > 1 ? parts[0].split('=') : '';
    return keyValue[1];
  }

  return username;
}

module.exports = function (app, knex) {
  // app.post(
  //   '/api/register',
  //   schemaValidator(registerUserSchema),
  //   async (req, res, next) => {
  //     const auditLogObject = { entity: 'User', event: 'Add' };
  //     let auditError = {};
  //     try {
  //       const payload = req.body;
  //       const user = await User.getByUsername(payload.username);
  //       if (user) {
  //         return res
  //           .status(400)
  //           .send(new ClientError({ message: USER.USERNAME_ALREADY_EXISTS }));
  //       }
  //       if (!verifyLicense()) {
  //         throw new ClientError({ message: 'License Expired.' });
  //       }

  //       const licenseInformation = decryptLicense();
  //       const salt = bcrypt.genSaltSync(10);
  //       const hash = bcrypt.hashSync(payload.password, salt);

  //       const newUser = await (
  //         await User.create({
  //           email: payload.email,
  //           username: payload.username,
  //           password: hash,
  //           role_id: payload.role_id,
  //         })
  //       ).save();
  //       const token = jwt.sign(
  //         {
  //           id: newUser?._data?.id,
  //           email: newUser?._data?.email,
  //           license: licenseInformation.validTill,
  //           licenseType: licenseInformation.productType,
  //         },
  //         process.env.JWT_SECRET
  //       );
  //       auditLogObject.id = newUser?._data?.id;
  //       res.status(200).json({ token });
  //     } catch (error) {
  //       logger.error({ message: 'users.js /api/users register', error });
  //       auditError = { error };
  //       next(error);
  //     } finally {
  //       const message = !isEmpty(auditError)
  //         ? `Failed to create user `
  //         : `User created successfully`;
  //       const status = !isEmpty(auditError) ? 'Failed' : 'Success';
  //       await auditLog({
  //         event: auditLogObject.event,
  //         entity: auditLogObject.entity,
  //         recordId: auditLogObject.id,
  //         createdBy: req?.auth?.id || 'admin',
  //         message,
  //         status,
  //       });
  //     }
  //   }
  // );

  app.post(
    '/api/login/admin',
    schemaValidator(loginAdminSchema),
    async (req, res, next) => {
      try {
        const payload = req.body;

        logger.debug('Admin login attempt initiated', {
          email: payload.email,
        });

        const user = await User.getByEmail(payload.email);
        if (!user || !user.is_active) {
          logger.error('Invalid admin login attempt', {
            email: payload.email,
            exists: !!user,
            isActive: user?.is_active,
          });
          return res
            .status(401)
            .send(
              new AuthorizationError({ message: USER.INVALID_CREDENTIALS })
            );
        }

        const role = await Role.getById(user.role_id);
        if (role.name !== 'superadmin') {
          logger.error('Non-admin user attempted admin login', {
            email: payload.email,
            userId: user.id,
            actualRole: role.name,
          });
          return res
            .status(401)
            .send(
              new AuthorizationError({ message: USER.INVALID_CREDENTIALS })
            );
        }

        const isMatch = bcrypt.compareSync(payload.password, user.password);
        if (!isMatch) {
          logger.error('Invalid password for admin login', {
            email: payload.email,
            userId: user.id,
          });
          return res
            .status(401)
            .send(
              new AuthorizationError({ message: USER.INVALID_CREDENTIALS })
            );
        }

        if (!verifyLicense()) {
          logger.error('Admin login attempted with expired license', {
            email: payload.email,
            userId: user.id,
          });
          throw new ClientError({ message: 'License Expired.' });
        }

        logger.debug('Generating admin JWT token', {
          userId: user.id,
          email: user.email,
        });

        const licenseInformation = decryptLicense();
        logger.debug('Gettting liscene info', { licenseInformation });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            license: licenseInformation.validTill,
            licenseType: licenseInformation.productType,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );
        logger.debug('Token generated successfully', { token });

        logger.info('Admin login successful', {
          email: user.email,
          userId: user.id,
        });

        res.status(200).json({ token });
      } catch (error) {
        logger.error('Admin login failed', {
          error: error.message,
          email: req.body?.email,
          path: '/api/users/admin/login',
        });
        next(error);
      }
    }
  );

  app.post(
    '/api/login/user',
    schemaValidator(loginUserSchema),
    async (req, res, next) => {
      let ldapClient;
      const ldapConfig = await Ldap.getDecryptedLdapData();

      try {
        const { username, password } = req.body;

        logger.debug('Login attempt initiated', {
          username,
        });

        const settings = await Setting.getData();

        const ldapEnabled = settings._data.ldapEnabled;

        if (!ldapEnabled) {
          throw new ClientError({
            message: 'Ldap is not enabled on your application.',
          });
        }

        if (ldapConfig === undefined) {
          throw new ClientError({
            message: 'Ldap is not configured',
          });
        }
        logger.debug('Binding Admin DN');
        const ldapClientAdmin = await createAndBindLdapClient(
          ldapConfig.url,
          ldapConfig.loginDn,
          ldapConfig.password
        );
        let userDn;

        if (ldapConfig.userDn === ldapConfig.baseDn) {
          userDn = ldapConfig.userDn;
        } else {
          userDn = `${ldapConfig.userDn},${ldapConfig.baseDn}`;
        }
        const searchUser = {
          base: userDn,
          options: {
            filter: `(${ldapConfig.usernameIdentifier}=${username})`,
            scope: 'sub',
          },
        };

        logger.debug('Searching user on ldap');
        const userOnLdap = await ldapSearch({
          ldapClient: ldapClientAdmin,
          search: searchUser,
          dn: ldapConfig.userDn,
        });

        logger.debug('Available user on LDAP', { userOnLdap });
        if (isEmpty(userOnLdap)) {
          throw new ClientError({ message: 'Invalid Credentials' });
        }

        let userLoginDn = userOnLdap[0]?.distinguishedName
          ? userOnLdap[0]?.distinguishedName
          : getLdapUserDn(username, ldapConfig);

        logger.debug('Connecting LDAP: ', {
          userDn,
          url: ldapConfig.url,
        });

        ldapClient = await createAndBindLdapClient(
          ldapConfig.url,
          userLoginDn,
          password
        );
        logger.debug('User authenticated on LDAP');

        logger.debug('Finding User on DFM');
        const user = await User.getByUsername(username);
        if (!user) {
          throw new ClientError({ message: 'User not Found.' });
        } else if (!user.is_active) {
          logger.error('Inactive user login attempt', {
            username,
            userId: user.id,
          });
          throw new ClientError({
            message: 'User is inactive. Contact the system administrator.',
          });
        }
        logger.debug('User Found');

        logger.debug('Authorizing User: ', { username, userId: user.id });

        if (!verifyLicense()) {
          logger.error('License expired');
          throw new ClientError({ message: 'License Expired.' });
        }

        const licenseInformation = decryptLicense();
        logger.debug('license info', { licenseInformation });
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            license: licenseInformation.validTill,
            licenseType: licenseInformation.productType,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );

        const result = {
          token,
        };

        logger.info('Login successful', {
          username,
          userId: user.id,
        });

        res.status(200).json({ ...result });
      } catch (error) {
        logger.error('Login failed', {
          error: error.message,
          username: req.body?.username,
        });
        next(error);
      } finally {
        if (ldapClient) {
          logger.debug('Unbinding LDAP client');
          unbindLdap(ldapClient);
        }
      }
    }
  );

  app.post(
    '/api/reset-password-request',
    schemaValidator(resetPasswordRequestSchema),
    async (req, res, next) => {
      try {
        logger.debug('Reset password request initiated.');
        const { email } = req.body;
        logger.debug('Finding user with Email: ', { email });
        const user = await User.getByEmail(email);
        if (isEmpty(user._data)) {
          throw new ClientError({
            message: `${USER.INVALID_CREDENTIALS}`,
          });
        }

        // verfiy if user exists and user has role of superadmin
        logger.debug('Getting user role');
        const userRole = await Role.getById(user.role_id);
        logger.debug('User role is:', { userRole });
        if (userRole.name !== 'superadmin') {
          throw new ClientError({
            message: 'Only superadmin can reset password.',
          });
        }

        const payload = {
          email,
        };

        // Sign the token with your secret key and set an expiration time (e.g., 1 hour)
        const resetToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_TOKEN_EXPIRATION,
        });
        const link = constructUrl(`reset?token=${resetToken}`);

        // Logo
        const settings = await Setting.getData();
        if (
          settings?._data?.logo !== null &&
          !settings?._data?.logo.startsWith('http://') &&
          !settings?._data?.logo.startsWith('https://') &&
          !settings?._data?.logo.startsWith('/media/settings/')
        ) {
          settings.logo = `/media/settings/${settings?._data?.logo}`;
        }

        const emailTemplate = await ejs.renderFile(
          path.join(__dirname, '..', 'views', 'reset_password.ejs'),
          {
            user,
            resetLink: link,
            logo: settings?.logo ? settings.logo : '/DFM-logo.svg',
          }
        );
        const options = {
          to: email,
          subject: `Request to change ${settings._data.title ? settings._data.title : 'Data Flow Manager'} Password`,
          html: emailTemplate,
        };
        // send this token via node mailer service
        await sendEmail(options, true);

        res.status(204).json({ message: 'Password reset link sent.' });
      } catch (error) {
        logger.error({ message: 'users.js /api/users post', error });
        next(error);
      }
    }
  );

  app.post(
    '/api/reset-password',
    schemaValidator(resetPasswordSchema),
    async (req, res, next) => {
      const auditLogObject = { entity: 'User', event: 'Update' };
      let auditError = {};
      try {
        logger.debug('Reseting Password.');
        const { password } = req.body;
        const token = req.query.token;
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;
        const user = await User.getByEmail(email);
        if (isEmpty(user._data)) {
          throw new ClientError({ message: ' No user found with the email.' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        logger.debug('Saving updated password');
        await user.save({
          password: hash,
        });
        auditLogObject.recordId = user?._data?.id;
        logger.info('Returning 204 No Content status');
        return res.sendStatus(204);
      } catch (error) {
        logger.error({ message: 'users.js /api/reset-password', error });
        auditError = { error };
        next(error);
      } finally {
        const message = !isEmpty(auditError)
          ? `Failed to reset password for user`
          : `Password reset successfully`;
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: auditLogObject.recordId,
          createdBy: 'admin',
          message,
          status,
        });
      }
    }
  );

  app.get(
    '/api/users',
    checkPermissions(['view_user', 'view_namespace']),
    schemaValidator(getUserListSchema),
    async (req, res, next) => {
      try {
        logger.debug('Fetching Users');
        const searchFields = [
          'username',
          'email',
          "CONCAT_WS(' ', first_name, middle_name, last_name)",
          "CONCAT_WS(' ', first_name, last_name)",
        ];

        const search = req.query.search;
        const { is_active, role_id } = req.query;
        const sort = req.query.sort;
        const page = parseInt(req.query?.page || 1, 10);
        const limit = parseInt(req.query?.limit || 10, 10);
        const filters = { is_active, role_id };
        const exclude = { username: 'superadmin' };
        const users = await User.getWithPagination({
          page,
          limit,
          search,
          searchFields,
          sort: '-updated_at',
          filters,
          exclude,
        });
        res.status(200).json(users);
      } catch (error) {
        logger.error({ message: 'users.js /api/users get', error });
        auditError = { error };
        next(error);
      }
    }
  );

  app.post(
    '/api/users',
    checkPermissions(['add_user']),
    multer('users', [{ name: 'photo', maxCount: 1 }]),
    schemaValidator(createUserSchema),
    normalizeNullString,
    async (req, res, next) => {
      logger.debug('Creating user', { body: req?.body, files: req?.files });
      const { photo: [{ originalname: file, filename: fileName } = {}] = [] } =
        req?.files || {};
      const filePath = `users/${fileName}`;
      const auditLogObject = { entity: 'User', event: 'Add' };
      let auditError = {};
      try {
        const payload = req.body;
        logger.debug('Validating payload', payload);
        if (file && !validateAllowedImgType(file, ALLOWED_IMAGE_EXTENSIONS)) {
          throw new ClientError({ message: FILE.INVALID_FILE_TYPE });
        }

        const user = await User.getByUsername(payload.username);
        if (user) {
          return res
            .status(400)
            .send(new ClientError({ message: USER.USERNAME_ALREADY_EXISTS }));
        }

        const newUser = await User.saveUser({
          id: fileName?.split('.')[0] || uuidv4(),
          ...payload,
          photo: fileName,
          created_by: req.auth.id,
        });
        auditLogObject.recordId = newUser._data.id;
        const savedData = newUser._data;
        res
          .status(201)
          .json(
            savedData?.password ? omit(savedData._data, 'password') : savedData
          );
      } catch (error) {
        removeFiles(filePath);
        logger.error({ message: 'users.js /api/users post', error });
        auditError = { error };
        next(error);
      } finally {
        const message = !isEmpty(auditError)
          ? `Failed to Create user `
          : `User created successfully`;
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: auditLogObject.recordId,
          createdBy: req.auth?.id,
          message,
          status,
        });
      }
    }
  );

  app.get(
    '/api/users/:id',
    checkPermissions(['view_user']),
    schemaValidator(idParamSchema, 'params'),
    async (req, res, next) => {
      try {
        logger.debug('Finding User by ID', { id: req?.params?.id });
        const user = (await User.getById(req.params.id))?._data;
        const role = await Role.getById(user.role_id);
        user.role = role.name;
        res.status(200).json(user);
      } catch (error) {
        logger.error({ message: 'users.js /api/users get', error });
        next(error);
      }
    }
  );

  app.patch(
    '/api/users/:id',
    checkPermissions(['edit_user']),
    multer('users', [{ name: 'photo', maxCount: 1 }]),
    schemaValidator(idParamSchema, 'params'),
    schemaValidator(updateUserSchema),
    normalizeNullString,
    async (req, res, next) => {
      logger.debug('Update User');
      let { photo: [{ originalname: file, filename } = {}] = [] } =
        req?.files || {};
      const auditLogObject = { entity: 'User', event: 'Edit' };
      let auditError = {};
      try {
        const user = await User.getById(req.params.id);

        if (file && !validateAllowedImgType(file, ALLOWED_IMAGE_EXTENSIONS)) {
          const filePath = `users/${filename}`;
          removeFiles(filePath);
          throw new ClientError({ message: FILE.INVALID_FILE_TYPE });
        }

        if (!file && req.body?.photo === null && user._data.photo) {
          const filePath =
            user._data.photo &&
            `users/${req.params.id}${path.extname(user._data.photo)}`;
          filename = null;
          removeFiles(filePath);
        } else if (file && user._data.photo) {
          if (path.extname(user._data.photo) !== path.extname(file)) {
            const filePath = `users/${req.params.id}${path.extname(user._data.photo)}`;
            removeFiles(filePath);
          }
        }

        if (!req.user?.userPolicies.includes('edit_user')) {
          logger.debug(`Updating user's own details`);
          req.body = {
            ...(req.body.first_name && { first_name: req.body.first_name }),
            ...(req.body.last && { last_name: req.body.last_name }),
            ...(req.body.has_accepted_terms && {
              has_accepted_terms: req.body.has_accepted_terms,
            }),
          };
        }
        if (req.user?.userPolicies.includes('edit_user') && req.body.password) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.password, salt);
          req.body.password = hash;
        }
        const updatedUser = await user.save({
          ...req.body,
          photo: filename,
          updated_by: req.auth.id,
        });
        if (updatedUser.photo || (user._data.photo && filename === undefined)) {
          updatedUser.photo = updatedUser.photo
            ? `/media/users/${updatedUser.photo}`
            : user._data.photo;
        }
        res.status(200).json({ ...omit(updatedUser._data, 'password') });
      } catch (error) {
        logger.error({ message: 'users.js /api/users patch', error });
        auditError = { error };
        next(error);
      } finally {
        const message = !isEmpty(auditError)
          ? `Failed to update user `
          : `User updated successfully`;
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: req.params.id,
          createdBy: req.auth.id,
          message,
          status,
        });
      }
    }
  );

  app.delete(
    '/api/users/:id',
    checkPermissions(['delete_user']),
    schemaValidator(idParamSchema, 'params'),
    async (req, res, next) => {
      const auditLogObject = { entity: 'User', event: 'Delete' };
      let auditError = {};
      try {
        await User.delete(req.params.id, req.auth.id);
        res.sendStatus(204);
      } catch (error) {
        logger.error({ message: 'users.js /api/users delete', error });
        auditError = { error };
        next(error);
      } finally {
        const message = !isEmpty(auditError)
          ? `Failed to delete user `
          : `User deleted successfully`;
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: req.params.id,
          createdBy: req.auth.id,
          message,
          status,
        });
      }
    }
  );

  app.get('/api/current-user', async (req, res, next) => {
    try {
      logger.debug('Current user data: ', { body: req.body });
      const { id, license, licenseType, userPolicies } = req.user;

      const user = await User.getById(id);
      const role = await Role.getById(user._data.role_id);
      user._data.role = role?.name;
      res.status(200).json({
        license,
        licenseType,
        permissions: userPolicies,
        ...omit(user._data, 'password'),
      });
    } catch (error) {
      logger.error({ message: 'users.js /api/current-user get', error });
      next(error);
    }
  });

  app.post(
    '/api/ldap-group',
    checkPermissions(['add_ldap']),
    schemaValidator(ldapConfigSchema),
    async (req, res, next) => {
      const auditLogObject = { entity: 'Ldap', event: 'Add' };
      const ldapConfig = await Ldap.getDecryptedLdapData();
      const config = req.body.loginDn ? req.body : ldapConfig;
      let auditError = {};
      let ldapClientUsers, ldapClientGroups;

      try {
        logger.info('Request recieved for /api/ldap-group');

        logger.debug('Request details : ', { ...req.body });

        if (!config || isEmpty(config)) {
          throw new ClientError({ message: 'No ldap Details available.' });
        }
        const dn = `${config.loginDn}`;
        let userDn;

        if (config.userDn === config.baseDn) {
          userDn = config.userDn;
        } else {
          userDn = `${config.userDn},${config.baseDn}`;
        }
        logger.debug('ldap client users', { ldapClientUsers });
        ldapClientUsers = await createAndBindLdapClient(
          config.url,
          dn,
          config.password
        );
        logger.debug('ldap client groups', { ldapClientGroups });
        ldapClientGroups = await createAndBindLdapClient(
          config.url,
          dn,
          config.password
        );

        const searchUsers = {
          base: userDn,
        };
        logger.debug('creating ldap search users', { searchUsers });
        const searchGroups = {
          base: config?.filter
            ? `${config.baseDn}`
            : `${config.groupDn},${config.baseDn}`,
          options: {
            scope: config?.scope ?? 'one',
            filter: `${config?.filter ? `&${config.filter}` : ''}(|${groupSearchOptions(config)})`,
          },
        };

        logger.debug('Fetching Groups with config: ', { searchGroups });
        logger.debug('Fetching Users with config: ', { searchUsers });
        let [groups, users] = await Promise.all([
          ldapSearch({
            ldapClient: ldapClientGroups,
            search: searchGroups,
            dn: config?.groupDn,
            groupDn: true,
          }),
          ldapSearch({
            ldapClient: ldapClientUsers,
            search: searchUsers,
            dn: config?.userDn,
          }),
        ]);
        logger.debug('LDAP-GROUP groups: ', { users, groups });

        groups = groups
          .map(group => {
            return {
              name: group[`${config.groupUniqueIdentifier}`],
            };
          })
          .filter(group => group.name !== undefined);

        await Ldap.saveData(config);
        logger.debug('Response of the api:', { groups });
        res.status(200).json({ groups });
      } catch (error) {
        auditError = { error };
        logger.error('Error for users.js /api/ldap-group post', { error });
        next(error);
      } finally {
        if (ldapClientUsers) unbindLdap(ldapClientUsers);
        if (ldapClientGroups) unbindLdap(ldapClientGroups);

        const message = !isEmpty(auditError)
          ? `Failed to update LDAP configuration`
          : `LDAP configuration updated successfully`;
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: req.auth.id,
          createdBy: req.auth.id,
          message,
          status,
        });
      }
    }
  );

  app.get('/api/license-info', async (req, res, next) => {
    try {
      logger.info('Request received for /api/license-info');

      logger.debug('Verifying license status...');

      const isLicenseValid = verifyLicense();

      if (isLicenseValid) {
        logger.info('License is valid');
        return res.status(200).json({ isLicenseValid });
      } else {
        logger.info('License is not valid');
        return res.status(409).json({ isLicenseValid });
      }
    } catch (err) {
      logger.error('Error occurred while verifying license', { error: err });
      next(new AuthorizationError({ message: 'Error reading license' }));
    }
  });

  app.get(
    '/api/check-ldap',
    checkPermissions(['view_ldap']),
    async (req, res, next) => {
      try {
        const getConfigData = await checkLdapEnabled();
        console.log(getConfigData);
        if (!isEmpty(getConfigData)) {
          return res.status(200).json(omit(getConfigData, 'password'));
        }
        return res.status(200).json({ ldapEnabled: false });
      } catch (err) {
        if (err.code === 'ENOENT')
          return res.status(200).json({ ldapEnabled: false });
        next(err);
      }
    }
  );

  app.post(
    '/api/test-ldap',
    checkPermissions(['view_ldap']),
    schemaValidator(testLdapSchema),
    async (req, res, next) => {
      let ldapClient;
      try {
        await checkHostname(req.body.url);

        ldapClient = await Promise.race([
          createAndBindLdapClient(
            req.body.url,
            req.body.loginDn,
            req.body.password
          ),
          timeoutPromise(5000),
        ]);

        return res.status(200).json({ message: 'Test successfull.' });
      } catch (err) {
        next(err);
      } finally {
        if (ldapClient) unbindLdap(ldapClient);
      }
    }
  );

  app.patch(
    '/api/group-mapping',
    checkPermissions(['add_ldap']),
    async (req, res, next) => {
      logger.info('Reques recieved for /api/group-mapping');
      const { data } = req.body;
      logger.debug('request payload : ', { data });
      const auditLogObject = { entity: 'Group-mapping', event: 'Edit' };
      let auditError = {};
      let ldapClientGroups, ldapClientUsers;

      const ldapConfig = await Ldap.getDecryptedLdapData();
      logger.debug('current ldap config', { ldapConfig });
      try {
        const batchRecords = data.map(item => ({
          id: item.role_id,
          ldap_group_name: item.ldap_group_name,
        }));
        logger.debug('creating batch records for group mapping', {
          batchRecords,
        });
        const dn = ldapConfig.loginDn;
        logger.debug('Group Mapping: ldap config: ', {
          ldapConfig: omit(ldapConfig, 'password'),
        });
        ldapClientGroups = await createAndBindLdapClient(
          ldapConfig.url,
          dn,
          ldapConfig.password
        );
        logger.debug('current ldap client groups', { ldapClientGroups });
        ldapClientUsers = await createAndBindLdapClient(
          ldapConfig.url,
          dn,
          ldapConfig.password
        );
        logger.debug('current ldap client users', { ldapClientUsers });
        let userDn;
        if (ldapConfig.userDn === ldapConfig.baseDn) {
          userDn = ldapConfig.userDn;
        } else {
          userDn = `${ldapConfig.userDn},${ldapConfig.baseDn}`;
        }
        logger.debug('check ldapclient user dn and base dn', { ldapConfig });
        const searchUsers = {
          base: userDn,
          options: {
            scope: 'one',
          },
        };

        const searchGroups = {
          base: ldapConfig?.filter
            ? `${ldapConfig.baseDn}`
            : `${ldapConfig.groupDn},${ldapConfig.baseDn}`,
          options: {
            scope: ldapConfig?.scope ?? 'one',
            filter: `${ldapConfig?.filter ? `&${ldapConfig.filter}` : ''}(|${groupSearchOptions(ldapConfig)})`,
          },
        };
        logger.debug('LDAP Searching Params: ', { searchGroups, searchUsers });
        const [ldapUsers, ldapGroups] = await Promise.all([
          ldapSearch({ ldapClient: ldapClientUsers, search: searchUsers }),
          ldapSearch({ ldapClient: ldapClientGroups, search: searchGroups }),
        ]);
        if (!isEmpty(ldapGroups)) {
          logger.debug('Group structure: ', { ldapGroup: ldapGroups });
          logger.debug('Users structure: ', { ldapUser: ldapUsers });

          ldapGroups?.map(group => {
            if (group.memberUid) {
              group.memberUid = processMemberUids(
                group.memberUid,
                ldapConfig.userUniqueIdentifier
              );
            }
          });
        }

        await knex.transaction(async trx => {
          await trx('role_ldap_assignment').del();

          // Update ldap_group_name for each record
          const updates = batchRecords.map(record =>
            trx('role_ldap_assignment').insert({
              role_id: record.id,
              ldap_group_name: record.ldap_group_name || 'user',
            })
          );
          await Promise.all(updates);
        });

        // Extract user groups from LDAP groups
        const ldapUserGroups = ldapGroups.flatMap(group =>
          group?.memberUid?.map(item => {
            if (ldapConfig.userUniqueIdentifier === 'distinguishedName') {
              return {
                groupname: group[ldapConfig.groupUniqueIdentifier],
                username: item,
              };
            } else {
              const username = getUserName(item);
              return {
                groupname: group[ldapConfig.groupUniqueIdentifier],
                username,
              };
            }
          })
        );

        // Find users having ldap groups
        const ldapUserWithGroups = ldapUsers
          .filter(user =>
            ldapUserGroups.some(
              groupUser =>
                groupUser?.username === user[ldapConfig.userUniqueIdentifier]
            )
          )
          .map(userItem => {
            return {
              username: userItem[ldapConfig.usernameIdentifier]
                ? userItem[ldapConfig.usernameIdentifier]
                : getUserName(userItem[ldapConfig.userUniqueIdentifier]),
              ...(userItem.sn && { last_name: userItem.sn }),
              first_name:
                userItem.givenName ||
                getUserName(userItem[ldapConfig.userUniqueIdentifier]),
              email: userItem.mail,
              groupname: ldapUserGroups.filter(
                groupUser =>
                  groupUser?.username ===
                  userItem[ldapConfig.userUniqueIdentifier]
              )[0]?.groupname,
            };
          })
          .filter(user => user.groupname !== undefined);
        const { data: roleData } = await Role.getWithPagination({});
        const localRoles = roleData.map(role => role._data);

        const parsedRoles = await Promise.all(
          localRoles.map(async lr => {
            const mappedData = await knex('role_ldap_assignment')
              .where('role_id', lr.id)
              .select('role_id', 'ldap_group_name');

            if (mappedData.length > 0) {
              return mappedData.map(item => ({
                id: item.role_id,
                name: lr.name,
                ldap_group_name: item.ldap_group_name,
              }));
            } else {
              return [
                {
                  id: lr.id,
                  name: lr.name,
                  ldap_group_name: null,
                },
              ];
            }
          })
        );

        // Flatten the array of arrays into a single array
        const flattenedRoles = parsedRoles.flat();
        const defaultRoleId = flattenedRoles.find(
          role => role.name === 'user'
        )?.id;

        const userGroupMapping = ldapUserWithGroups
          .map(user => {
            const role = flattenedRoles.find(role => {
              return role.ldap_group_name === user.groupname;
            });
            return role
              ? { role_id: role.id, ...user }
              : { role_id: defaultRoleId, ...user };
          })
          .filter(Boolean);

        const groupMapping = [...userGroupMapping];
        // Transaction begin
        await knex.transaction(async trx => {
          const insertions = groupMapping.map(record => {
            let username = getUserName(record?.username);
            logger.debug('Username for users:', {
              username: username,
              email: record.email,
              first_name: record.first_name,
              last_name: record.last_name,
              role_id: record.role_id,
            });
            return trx('users')
              .insert({
                username: username,
                email: record.email,
                first_name: record.first_name,
                last_name: record.last_name,
                role_id: record.role_id,
              })
              .onConflict('username')
              .merge();
          });
          await Promise.all(insertions);
        });
        res.status(200).json({ message: 'Groups updated successfully' });
      } catch (error) {
        auditError = { error };
        if (error?.routine === '_bt_check_unique') {
          return next(
            new ClientError({
              message: 'Duplication in users or groups is not allowed.',
            })
          );
        }
        next(error);
      } finally {
        if (ldapClientGroups) unbindLdap(ldapClientGroups);
        if (ldapClientUsers) unbindLdap(ldapClientUsers);

        // Audit log
        const message = !isEmpty(auditError)
          ? 'Failed to update group mapping'
          : 'Group mapping updated successfully';
        const status = !isEmpty(auditError) ? 'Failed' : 'Success';
        await auditLog({
          event: auditLogObject.event,
          entity: auditLogObject.entity,
          recordId: null,
          createdBy: req.auth.id,
          message,
          status,
        });
      }
    }
  );

  app.post('/api/ldap-sync', async (req, res, next) => {
    let auditError = {};
    const ldapConfig = await checkLdapEnabled();
    if (!ldapConfig) {
      throw new ClientError({
        message: 'Ldap is not enabled on your application.',
      });
    }
    const auditLogObject = {
      entity: 'LDAP user manual sync',
      event: 'API call',
    };
    let ldapClientGroups, ldapClientUsers, usersToBeInserted;
    const filter = createFilterString();
    try {
      const userId = await getUserRoleId(knex);
      const dn = ldapConfig.loginDn;

      ldapClientUsers = await createAndBindLdapClient(
        ldapConfig.url,
        dn,
        ldapConfig.password
      );

      ldapClientGroups = await createAndBindLdapClient(
        ldapConfig.url,
        dn,
        ldapConfig.password
      );

      logger.debug('current ldap client users', { ldapClientUsers });
      let userDn;
      if (ldapConfig.userDn === ldapConfig.baseDn) {
        userDn = ldapConfig.userDn;
      } else {
        userDn = `${ldapConfig.userDn},${ldapConfig.baseDn}`;
      }

      const searchUsers = {
        base: userDn,
        options: {
          filter,
          scope: 'one',
          attributes: '*',
        },
      };

      const searchGroups = {
        base: ldapConfig?.filter
          ? `${ldapConfig.baseDn}`
          : `${ldapConfig.groupDn},${ldapConfig.baseDn}`,
        options: {
          scope: ldapConfig?.scope ?? 'one',
          filter: `${ldapConfig?.filter ? `&${ldapConfig.filter}` : ''}(|${groupSearchOptions(ldapConfig)})`,
        },
      };

      logger.debug('LDAP Searching Params: ', { searchGroups, searchUsers });
      const [ldapUsers, ldapGroups] = await Promise.all([
        ldapSearch({ ldapClient: ldapClientUsers, search: searchUsers }),
        ldapSearch({ ldapClient: ldapClientGroups, search: searchGroups }),
      ]);

      if (!isEmpty(ldapGroups)) {
        logger.debug('Group structure: ', { ldapGroup: ldapGroups });
        logger.debug('Users structure: ', { ldapUser: ldapUsers });

        ldapGroups?.map(group => {
          if (group.memberUid) {
            group.memberUid = processMemberUids(
              group.memberUid,
              ldapConfig.userUniqueIdentifier
            );
          }
        });
      }

      // Extract user groups from LDAP groups
      const ldapUserGroups = ldapGroups.flatMap(group =>
        group?.memberUid?.map(item => {
          if (ldapConfig.userUniqueIdentifier === 'distinguishedName') {
            return {
              groupname: group[ldapConfig.groupUniqueIdentifier],
              username: item,
            };
          } else {
            const username = getUserName(item);
            return {
              groupname: group[ldapConfig.groupUniqueIdentifier],
              username,
            };
          }
        })
      );

      // Find users having ldap groups
      const formattedUsers = ldapUsers
        .map(userItem => {
          if (!userItem[ldapConfig.userUniqueIdentifier]) return;
          return {
            username: userItem[ldapConfig.usernameIdentifier]
              ? userItem[ldapConfig.usernameIdentifier]
              : getUserName(userItem[ldapConfig.userUniqueIdentifier]),
            ...(userItem.sn && { last_name: userItem.sn }),
            first_name:
              userItem.givenName ||
              getUserName(userItem[ldapConfig.userUniqueIdentifier]),
            email: userItem.mail,
            groupname: ldapUserGroups.filter(
              groupUser =>
                groupUser?.username ===
                userItem[ldapConfig.userUniqueIdentifier]
            )[0]?.groupname,
          };
        })
        .filter(user => user !== undefined);

      const mappedData = await knex('role_ldap_assignment').select('*');

      usersToBeInserted = formattedUsers.map(user =>
        formatLdapUsers(user, mappedData, userId)
      );

      // Transaction begin
      await upsertUsers(knex, usersToBeInserted);
      // Transaction ended

      logger.debug(`Synced ${usersToBeInserted.length} users from LDAP`);
      res.status(200).json({ message: 'Users synced successfully' });
    } catch (error) {
      auditError = { error };
      if (error?.routine === '_bt_check_unique') {
        throw new Error({
          message: 'Duplication in users or groups is not allowed.',
        });
      }
    } finally {
      if (ldapClientGroups) unbindLdap(ldapClientGroups);
      if (ldapClientUsers) unbindLdap(ldapClientUsers);

      // Audit log
      const message = !isEmpty(auditError)
        ? 'Failed to update group mapping'
        : 'Group mapping updated successfully';
      const status = !isEmpty(auditError) ? 'Failed' : 'Success';
      await auditLog({
        event: auditLogObject.event,
        entity: auditLogObject.entity,
        recordId: null,
        message,
        status,
      });
      return usersToBeInserted || [];
    }
  });
};
