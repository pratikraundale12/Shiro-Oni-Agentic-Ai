/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { LinkIcon, QRIcons, TodoIcon } from '../../assets';
import {
  Button,
  InputField,
  PasswordField,
  SyncUsersSuccess,
} from '../../shared';
import { CreateMapping } from './components/CreateMapping';
import { useForm } from 'react-hook-form';
import { Table } from '../../components/CustomGrid/Table';
import { SwitchButton } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { checkLdapConfig, groupMappingApi } from '../../store/apis/ldap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { testConfigApi } from '../../store/apis/ldap';
import { SuccessTestModal } from '../Clusters/components/SuccessTestModal';
import SelectCellRender from './components/SelectCellRender';
import { RolesActions, RolesSelectors, LoadingSelectors } from '../../store';
import AddNewRoleModal from '../../shared/AddNewRoleModal';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 88%;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  line-height: 27.24px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
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
  padding-right: 17px;
  padding-left: 17px;
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
});
const breadcrumbData = [
  { label: 'LDAP Configuration Fields' },
  { label: 'LDAP Group List' },
];
export const LdapConfig = () => {
  const [ldapInitialConfig, setLdapInitialConfig] = useState(false);
  const [secondFormState, setSecondFormState] = useState(false);
  const [createMappingShow, setCreatMappingShow] = useState(false);
  const [successTest, setSuccessTest] = useState(false);
  const [testFormData, setTestFormData] = useState({});
  const [listData, setListData] = useState();
  const [saveButtonStatus, setSaveButtonStatus] = useState(false);
  const [formPayload, setFormPayload] = useState([]);
  const [syncUsers, setSyncUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const roles = useSelector(RolesSelectors.getRoles);
  const ldapGroup = useSelector(RolesSelectors.getLdapGroup);
  const displayList = useSelector(RolesSelectors.getDiplayData);

  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
    watch,
  } = useForm({
    resolver: yupResolver(schemaForm1),
  });

  // Second form
  const {
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
        <SelectCellRender data={data} onChange={onChange} roles={roles} />
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

  useEffect(() => {
    const filteredPayload = ldapGroup.filter(
      group => group.role_id !== undefined
    );
    setFormPayload(filteredPayload);
  }, [ldapGroup]);

  const handleCheckLdapConfig = async () => {
    const response = await checkLdapConfig();
    if (response.status === 200) {
      setLdapInitialConfig(response?.data?.ldapEnabled);
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
        });
      }
    } else {
      toast.error(response?.message || 'Something went wrong');
    }
  };

  const handleCheckMark = () => {
    setLdapInitialConfig(!ldapInitialConfig);
  };
  useEffect(() => {
    handleCheckLdapConfig();
  }, []);

  const getLDAPGroup = async data => {
    const payload = {
      ldapEnabled: true,
      url: testFormData.url,
      password: testFormData.password,
      loginDn: testFormData.loginDn,
      baseDn: data?.baseDn,
      groupDn: data?.groupDn,
      userDn: data?.userDn,
      userUniqueIdentifier: data?.userUniqueIdentifier,
      groupUniqueIdentifier: data?.groupUniqueIdentifier,
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
      dispatch(RolesActions.displayGroup());
    } else {
      dispatch(RolesActions.displayGroup());
    }
  };

  useEffect(() => {
    dispatch(RolesActions.fetchRoles());
  }, [dispatch]);
  return (
    <Wrapper>
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
          <div className="d-flex justify-content-end me-4">
            <SwitchButton
              id="openModalInput"
              name="LDAP"
              checked={ldapInitialConfig}
              onChange={handleCheckMark}
            />
          </div>
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
                disabled={!ldapInitialConfig}
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
                disabled={!ldapInitialConfig}
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
                disabled={!ldapInitialConfig}
              />
            </div>
          </InputFieldFlex>
          <ButtonFlex>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <StyledButton
                size="sm"
                onClick={handleSubmitForm1(onSubmitForm1)}
                disabled={!ldapInitialConfig}
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
                icon={<LinkIcon />}
                disabled={!secondFormState || !ldapInitialConfig}
                errors={errorsForm2}
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
                disabled={!secondFormState || !ldapInitialConfig}
                errors={errorsForm2}
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
                disabled={!secondFormState || !ldapInitialConfig}
                errors={errorsForm2}
              />
            </div>
          </InputFieldFlex>
          <InputFieldFlex className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="userUniqueIdentifier"
                type="text"
                register={registerForm2}
                label="User Unique Identifier"
                placeholder="Enter User Identifier"
                icon={<LinkIcon />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapInitialConfig}
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="groupUniqueIdentifier"
                type="text"
                register={registerForm2}
                label="Group Unique Identifier"
                placeholder="Enter Group Identifier"
                icon={<LinkIcon />}
                errors={errorsForm2}
                disabled={!secondFormState || !ldapInitialConfig}
              />
            </div>
          </InputFieldFlex>
          <SmallButtonFlex className="row">
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <Button
                onClick={handleSubmitForm2(getLDAPGroup)}
                disabled={!saveButtonStatus || !ldapInitialConfig}
                loading={loadings && 'Fetching..'}
              >
                Continue
              </Button>
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
            <SyncButton onClick={() => dispatch(RolesActions.roleModal())}>
              Add New Role
            </SyncButton>
          </div>

          <CustomTable data={ldapGroup} columns={EVENTCOLUMNS} />
          <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mt-4">
            <Button onClick={onSubmit} loading={loading}>
              Save
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
