/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  LinkIcon,
  PlusCircleIcon,
  QRIcons,
  TagIcon,
  TodoIcon,
} from '../../assets';
import { FullPageLoader } from '../../components';
import { Table } from '../../components/CustomGrid/Table';
import {
  Button,
  InputField,
  PasswordField,
  SelectField,
  SyncUsersSuccess,
} from '../../shared';
import AddNewRoleModal from '../../shared/AddNewRoleModal';
import Breadcrumb from '../../shared/Breadcrumb';
import { LoadingSelectors, RolesActions, RolesSelectors } from '../../store';
import { SettingsSelectors } from '../../store/settings';
import {
  checkLdapConfig,
  getExistingMapping,
  groupMappingApi,
  testConfigApi,
} from '../../store/apis/ldap';
import { SuccessTestModal } from '../Clusters/components/SuccessTestModal';
import { CreateMapping } from './components/CreateMapping';
import SelectCellRender from './components/SelectCellRender';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 88%;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  line-height: 27.24px;
  margin-bottom: 0px !important;
  @media screen and (max-width: 1400px) {
    font-size: 18px !important;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
  }
`;

const InputFieldFlex = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
`;

// Use SmallButton to adjust button size
const StyledButton = styled(Button)`
  width: auto;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-right: 28px;
  padding-left: 28px;
  height: 55px;
  span {
    font-size: 18px;
  }
`;

const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
`;

const SmallButtonFlex = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CustomTable = styled(Table)`
  tr td:last-child div {
    overflow: visible;
  }
`;

const SyncButton = styled(Button)`
  width: auto;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-right: 17px;
  padding-left: 17px;
  height: 40px;
  margin-bottom: 5px;
`;

const StyledSecondButton = styled(Button)`
  width: auto;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-right: 70px;
  padding-left: 70px;
  height: 55px;
  span {
    font-size: 18px;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0.9rem;
`;

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const TagsInput = styled.input`
  flex-grow: 1;
  padding: 0.5em 0;
  border: none;
  outline: none;
`;

const TagsInputContainer = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  border-radius: 3px;
  width: 100%;
  font-size: 14px;
  color: #444445;
  margin-top: 10px;
  display: flex;
  align-items: center;
  overflow: auto;
  gap: 0.5em;
  margin-bottom: 40px;
  input::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
  input:focus-visible {
    outline: none;
  }
  input:focus {
    border: none;
  }
`;
const IconTag = styled.span`
  position: sticky;
  top: 2px;
  left: 2px;
  bottom: 2px;
  z-index: 1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
`;
const TagItem = styled.div`
  background-color: rgb(218, 216, 216);
  display: flex;
  padding: 0.5em 0.75em;
  border-radius: 20px;
`;
const CloseButton = styled.span`
  padding-top: 3px;
  height: 20px;
  width: 20px;
  background-color: rgb(48, 48, 48);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 18px;
  cursor: pointer;
`;
const CharacterCount = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`;
const TagLable = styled.label`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;

export const schemaForm1 = Yup.object().shape({
  url: Yup.string().required('LDAP URL is required'),
  loginDn: Yup.string().required('Login DN is required'),
  password: Yup.string().required('Password is required'),
});

// Schema for the second form
export const schemaForm2 = Yup.object().shape({
  baseDn: Yup.string().required('Base DN is required'),
  groupDn: Yup.string().required('Groups DN is required'),
  userDn: Yup.string().required('Users DN is required'),
  userUniqueIdentifier: Yup.string().required(
    'User Unique Identifier is required'
  ),
  groupUniqueIdentifier: Yup.string().required(
    'Group Unique Identifier is required'
  ),
  usernameIdentifier: Yup.string().required('Username Identifier is required'),
});
const breadcrumbData = [
  { label: 'LDAP Configuration Fields' },
  { label: 'LDAP Group List' },
];
export const LdapConfig = () => {
  const [secondFormState, setSecondFormState] = useState(false);
  const [createMappingShow, setCreatMappingShow] = useState(false);
  const [successTest, setSuccessTest] = useState(false);
  const [testFormData, setTestFormData] = useState({});
  const [listData, setListData] = useState();
  const [saveButtonStatus, setSaveButtonStatus] = useState(false);
  const [formPayload, setFormPayload] = useState([]);
  const [syncUsers, setSyncUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingMappingArray, setExistingMappingArray] = useState([]);
  const dispatch = useDispatch();
  const roles = useSelector(RolesSelectors.getRoles);
  const ldapGroup = useSelector(RolesSelectors.getLdapGroup);
  const displayList = useSelector(RolesSelectors.getDiplayData);
  const settingData = useSelector(SettingsSelectors.getSettings);
  const { ldapEnabled } = settingData || {};
  const [tags, setTags] = useState([]);
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
    watch,
  } = useForm({
    resolver: yupResolver(schemaForm1),
  });
  const {
    control,
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    formState: { errors: errorsForm2 },
    reset: reset2,
  } = useForm({
    resolver: yupResolver(schemaForm2),
    // defaultValues: formData,
  });
  const onChange = (data, option) => {
    const updatedData = ldapGroup.map(item =>
      item.ldap_group_name === data.ldap_group_name
        ? { ...item, role_id: option.value }
        : item
    );
    dispatch(RolesActions.updateLdapGroup(updatedData));
  };
  const EVENTCOLUMNS = [
    {
      label: 'LDAP Groups',
      key: 'url',
      renderCell: data => data.ldap_group_name,
    },
    {
      label: 'DFM Groups',
      key: 'name',
      renderCell: data => (
        <SelectCellRender
          data={data}
          onChange={onChange}
          roles={roles}
          existingMappingArray={existingMappingArray}
        />
      ),
    },
  ];

  const onSubmitForm1 = async data => {
    setLoading(true);
    setTestFormData({
      url: data.url,
      password: data.password,
      loginDn: data.loginDn,
    });
    const payload = {
      url: data.url,
      password: data.password,
      loginDn: data.loginDn,
    };

    const response = await testConfigApi(payload);
    if (response?.status === 200) {
      setSecondFormState(true);
      setSuccessTest(true);
      setSaveButtonStatus(true);
      setLoading(false);
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
      setLoading(false);
    }
  };
  const getExistingMap = async () => {
    const responseMap = await getExistingMapping();
    if (responseMap?.status === 200) {
      setExistingMappingArray(responseMap?.data);
      dispatch(RolesActions.updateLdapGroup(responseMap?.data));
    } else {
      toast.error(responseMap?.message || 'Something went wrong');
    }
  };
  useEffect(() => {
    if (!displayList) {
      getExistingMap();
    }
  }, [displayList]);

  useEffect(() => {
    const filteredPayload = ldapGroup.filter(
      group => group.role_id !== undefined
    );
    setFormPayload(filteredPayload);
  }, [ldapGroup]);

  const handleCheckLdapConfig = async () => {
    const response = await checkLdapConfig();
    if (response.status === 200) {
      if (response?.data?.ldapEnabled) {
        reset1({
          url: response?.data?.url,
          password: response?.data?.password,
          loginDn: response?.data?.loginDn,
        });
        reset2({
          baseDn: response?.data?.baseDn,
          groupDn: response?.data?.groupDn,
          userDn: response?.data?.userDn,
          userUniqueIdentifier: response?.data?.userUniqueIdentifier,
          groupUniqueIdentifier: response?.data?.groupUniqueIdentifier,
          filter: response?.data?.filter,
          scope: response?.data?.scope,
          groupObjectClass: response?.data?.groupObjectClass,
          usernameIdentifier: response?.data?.usernameIdentifier,
        });
      } else {
        reset1({
          url: response?.data?.url || '',
          password: response?.data?.password || '',
          loginDn: response?.data?.loginDn || '',
        });
        reset2({
          baseDn: response?.data?.baseDn || '',
          groupDn: response?.data?.groupDn || '',
          userDn: response?.data?.userDn || '',
          userUniqueIdentifier: response?.data?.userUniqueIdentifier || '',
          groupUniqueIdentifier: response?.data?.groupUniqueIdentifier || '',
          filter: response?.data?.filter || '',
          scope: response?.data?.scope || '',
          groupObjectClass: response?.data?.groupObjectClass || [],
          usernameIdentifier: response?.data?.usernameIdentifier || '',
        });
      }
    } else {
      toast.error(response?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    handleCheckLdapConfig();
  }, []);

  const getLDAPGroup = async data => {
    const payload = {
      url: testFormData.url,
      password: testFormData.password,
      loginDn: testFormData.loginDn,
      baseDn: data?.baseDn,
      groupDn: data?.groupDn,
      userDn: data?.userDn,
      userUniqueIdentifier: data?.userUniqueIdentifier,
      groupUniqueIdentifier: data?.groupUniqueIdentifier,
      ...(data?.filter && { filter: data.filter }),
      ...(data?.scope && { scope: data.scope }),
      groupObjectClass: tags,
      ...(data?.usernameIdentifier && {
        usernameIdentifier: data.usernameIdentifier,
      }),
    };

    dispatch(RolesActions.fetchLdap({ ...payload }));
  };
  const loadings = useSelector(state =>
    LoadingSelectors.getLoading(state, 'ldapGroups')
  );

  const onSubmit = async () => {
    setLoading(true);
    const response = await groupMappingApi({ data: formPayload });
    if (response?.status === 200) {
      setSyncUsers(true);
      setLoading(false);
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
      setLoading(false);
    }
  };

  const onBreadCrumbClick = ldapPath => {
    if (ldapPath === 'LDAP Configuration Fields') {
      dispatch(RolesActions.displayGroup(true));
    } else {
      dispatch(RolesActions.displayGroup(false));
    }
  };

  useEffect(() => {
    if (isEmpty(roles)) {
      dispatch(RolesActions.fetchRoles());
    }
  }, [dispatch, roles]);

  useEffect(() => {
    dispatch(RolesActions.displayGroup(true));
  }, []);

  const scopeOptions = [
    {
      label: 'Subtree',
      value: 'sub',
    },
    {
      label: 'One',
      value: 'one',
    },
    {
      label: 'Base',
      value: 'base',
    },
  ];
  const handleKeyDown = e => {
    const value = e.target.value.trim();

    if (e.key === 'Enter' || e.key === ',' || (e.type === 'blur' && value)) {
      if (tags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        e.target.value = '';
        return;
      }
      if (!tags.includes(value)) {
        setTags([...tags, value]);
        e.target.value = '';
      } else {
        toast.error('Tag already exists');
      }
    } else if (e.key === 'Backspace' && !value) {
      removeTag(tags[tags.length - 1]);
    }
  };
  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const closePopup = () => {
    dispatch(RolesActions.setIsRoleListModalOpen(false));
    dispatch(RolesActions.setRoleListSelectedItem({}));
  };
  const handleOpenAddModal = () => {
    dispatch(RolesActions.roleModal(true));
    closePopup();
  };
  return (
    <Wrapper>
      {loading && <FullPageLoader loading={loading} />}
      <Heading>
        <Flex>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
          <Title>LDAP Configuration Fields</Title>
        </Flex>
      </Heading>
      {displayList ? (
        <>
          <InputFieldFlex className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="url"
                type="text"
                register={registerForm1}
                label="LDAP URL"
                errors={errorsForm1}
                placeholder="Enter your LDAP URL"
                icon={<LinkIcon />}
                disabled={!ldapEnabled}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="loginDn"
                type="text"
                register={registerForm1}
                label="Login DN"
                errors={errorsForm1}
                placeholder="Enter your Login DN"
                icon={<QRIcons />}
                disabled={!ldapEnabled}
                required
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <PasswordField
                name="password"
                register={registerForm1}
                errors={errorsForm1}
                watch={watch}
                required
                label="Password"
                disabled={!ldapEnabled}
              />
            </div>
          </InputFieldFlex>
          <ButtonFlex>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <StyledButton
                size="sm"
                onClick={handleSubmitForm1(onSubmitForm1)}
                disabled={!ldapEnabled}
                loading={loading}
              >
                Test Configuration
              </StyledButton>
            </div>
          </ButtonFlex>

          <InputFieldFlex className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="baseDn"
                register={registerForm2}
                type="text"
                label="Base DN"
                placeholder="Enter your Base DN"
                icon={<QRIcons />}
                disabled={!secondFormState || !ldapEnabled}
                errors={errorsForm2}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="groupDn"
                register={registerForm2}
                type="text"
                label="Groups DN"
                placeholder="Enter your Groups DN"
                icon={<QRIcons />}
                disabled={!secondFormState || !ldapEnabled}
                errors={errorsForm2}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="userDn"
                type="text"
                register={registerForm2}
                label="Users DN"
                placeholder="Enter your Users DN"
                icon={<QRIcons />}
                disabled={!secondFormState || !ldapEnabled}
                errors={errorsForm2}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="userUniqueIdentifier"
                type="text"
                register={registerForm2}
                label="User Unique Identifier"
                placeholder="Enter User Identifier"
                icon={<QRIcons />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapEnabled}
                required
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="groupUniqueIdentifier"
                type="text"
                register={registerForm2}
                label="Group Unique Identifier"
                placeholder="Enter Group Identifier"
                icon={<QRIcons />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapEnabled}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <TagLable htmlFor="tags-input" className="tags-input-label">
                Group Object Class
              </TagLable>

              <TagsInputContainer>
                <IconTag>
                  <TagIcon />
                </IconTag>
                {tags.map((tag, index) => (
                  <TagItem key={index}>
                    <CharacterCount>
                      {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
                    </CharacterCount>
                    <CloseButton onClick={() => removeTag(tag)}>
                      &times;
                    </CloseButton>
                  </TagItem>
                ))}
                <TagsInput
                  type="text"
                  name="groupObjectClass"
                  onKeyDown={handleKeyDown}
                  placeholder={tags.length === 0 ? 'Group Object Class' : ''}
                  disabled={!secondFormState || !ldapEnabled}
                  register={registerForm2}
                  onBlur={handleKeyDown}
                  aria-label="Group Object Class"
                />
              </TagsInputContainer>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="usernameIdentifier"
                type="text"
                register={registerForm2}
                label="Username identifier"
                placeholder="Enter Username identifier"
                icon={<QRIcons />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapEnabled}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="filter"
                type="text"
                register={registerForm2}
                label="Filter"
                placeholder="Enter Filter"
                icon={<QRIcons />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapEnabled}
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mt-1 mb-2">
              <LabelSelect className="mb-3">Select Scope</LabelSelect>
              <StyledSelectField
                name="scope"
                size="sm"
                options={scopeOptions || []}
                control={control}
                placeholder="Select Scope"
                title="Select Scope"
                disabled={!secondFormState || !ldapEnabled}
                defaultValue={{
                  label: 'One',
                  value: 'one',
                }}
              />
            </div>
          </InputFieldFlex>
          <SmallButtonFlex className="row">
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <StyledSecondButton
                onClick={handleSubmitForm2(getLDAPGroup)}
                disabled={!saveButtonStatus || !ldapEnabled}
                loading={loadings && 'Fetching..'}
              >
                Continue
              </StyledSecondButton>
            </div>
          </SmallButtonFlex>
        </>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Breadcrumb
              onClick={onBreadCrumbClick}
              path={breadcrumbData}
              module="ldap"
            />
            <SyncButton
              icon={<PlusCircleIcon width={16} height={16} color="black" />}
              onClick={handleOpenAddModal}
              variant="secondary"
              size="sm"
            >
              Add New Role
            </SyncButton>
          </div>

          <CustomTable data={ldapGroup} columns={EVENTCOLUMNS} />
          <div className=" form-ele mt-4">
            <Button
              className="w-auto"
              onClick={onSubmit}
              loading={loading}
              size="sm"
            >
              Save Mapping
            </Button>
          </div>
        </>
      )}
      <CreateMapping
        isOpen={createMappingShow}
        setIsOpen={setCreatMappingShow}
        getLDAPGroupForMapping={getLDAPGroup}
      />
      <SuccessTestModal
        successTest={successTest}
        setSuccessTest={setSuccessTest}
        name="Configuration"
      />
      <SyncUsersSuccess successTest={syncUsers} setSuccessTest={setSyncUsers} />
      <AddNewRoleModal />
    </Wrapper>
  );
};
