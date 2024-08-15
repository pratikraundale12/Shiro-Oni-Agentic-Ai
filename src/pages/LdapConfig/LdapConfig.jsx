import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkIcon, QRIcons, TodoIcon } from '../../assets';
import { Button, InputField, PasswordField } from '../../shared';
import { CreateMapping } from './components/CreateMapping';
import { useForm } from 'react-hook-form';
import { Table } from '../../components/CustomGrid/Table';
import { SwitchButton } from '../../shared';
import {
  checkLdapConfig,
  ldapConfig,
  getLdapGroupAPI,
} from '../../store/apis/ldap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { testConfigApi, getRolesAPI } from '../../store/apis/ldap';
import { SuccessTestModal } from '../Clusters/components/SuccessTestModal';

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

const EVENTCOLUMNS = [
  {
    label: 'LDAP Groups',
    key: 'ldapUrl',
    renderCell: data => data.cn,
  },
  {
    label: 'KDFM Groups',
    key: 'name',
    renderCell: data => data.name,
  },
];
export const schemaForm1 = Yup.object().shape({
  ldapUrl: Yup.string().required('LDAP URL is required'),
  loginDn: Yup.string().required('Login DN is required'),
  password: Yup.string().required('Password is required'),
});

// Schema for the second form
export const schemaForm2 = Yup.object().shape({
  baseDn: Yup.string().required('Base DN is required'),
  groupsDn: Yup.string().required('Groups DN is required'),
  usersDn: Yup.string().required('Users DN is required'),
  userUniqueIdentifier: Yup.string().required(
    'User Unique Identifier is required'
  ),
  groupUniqueIdentifier: Yup.string().required(
    'Group Unique Identifier is required'
  ),
});
export const LdapConfig = () => {
  const [ldapInitialConfig, setLdapInitialConfig] = useState(false);
  const [secondFormState, setSecondFormState] = useState(false);
  const [createMappingShow, setCreatMappingShow] = useState(false);
  const [successTest, setSuccessTest] = useState(false);
  const [displayList, setDisplayList] = useState(true);
  const [testFormData, setTestFormData] = useState({});
  const [listData, setListData] = useState();
  setDisplayList;
  displayList;
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
    watch,
  } = useForm({
    resolver: yupResolver(schemaForm1),
    // defaultValues: formData,
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

  const onSubmitForm1 = async data => {
    console.log('Form 1 Data:', data);
    setTestFormData({
      url: data.ldapUrl,
      password: data.password,
      loginDn: data.loginDn,
    });
    const payload = {
      url: data.ldapUrl,
      password: data.password,
      loginDn: data.loginDn,
    };

    const response = await testConfigApi(payload);
    if (response?.status === 200) {
      setSecondFormState(true);
      setSuccessTest(true);
      console.log(response, 'ressssss');
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
  };

  const onSubmitForm2 = async data => {
    console.log(testFormData, 'Data Form1');
    console.log('Form 2 Data:', data);

    const payload = {
      ldapEnabled: true,
      url: testFormData.url,
      password: testFormData.password,
      loginDn: testFormData.loginDn,
      baseDn: data.baseDn,
      groupDn: data.groupDn,
      userDn: data.userDn,
      userUniqueIdentifier: data.userUniqueIdentifier,
      groupUniqueIdentifier: data.groupUniqueIdentifier,
    };

    const response = await ldapConfig(payload);
    if (response?.status === 200) {
      console.log(response, 'ressssss');
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
  };

  const handleCheckLdapConfig = async () => {
    const response = await checkLdapConfig();
    if (response.status === 200) {
      console.log(response, '...??????//');
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
    console.log(listData, 'DATA');
    handleCheckLdapConfig();
  }, []);

  const getLDAPGroup = async () => {
    const response = await getLdapGroupAPI();
    if (response?.status === 200) {
      console.log(response, '>>>>>>>>>', response.data.groups);
      setListData(response?.data.groups);
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
    const response1 = await getRolesAPI();
    if (response1?.status === 200) {
      console.log(listData, 'LISTTTT');
      console.log(response1.data.data, 'RESPONSE!!!!!');

      const sortedArray = listData?.map(item => {
        // Find the matching object in listData based on ldapGroupName and cn
        const matchedItem = response1?.data?.data?.find(
          listItem => listItem?.ldap_group_name === item.cn
        );

        return {
          ...item,
          name: matchedItem ? matchedItem?.name : 'NA', // If a match is found, use the name; otherwise, set it to 'NA'
        };
      });
      console.log(sortedArray, 'sortedArray');
      if (sortedArray) setListData(sortedArray);
    } else {
      toast.error(
        response1?.message || 'Something went wrong. Please try again'
      );
    }
  };

  useEffect(() => {
    console.log(listData, 'DATADATA');
    if (!displayList) {
      getLDAPGroup();
    }
  }, [displayList]);

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
                size="md"
                onClick={handleSubmitForm1(onSubmitForm1)}
                disabled={!ldapInitialConfig}
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
                disabled={!secondFormState}
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
                disabled={!secondFormState}
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
                disabled={!secondFormState}
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
                disabled={!secondFormState}
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
                disabled={!secondFormState}
              />
            </div>
          </InputFieldFlex>
          <SmallButtonFlex className="row">
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele ">
              <Button
                onClick={() => {
                  setDisplayList(false);
                }}
                disabled={!successTest}
              >
                Fetch LDAP Groups
              </Button>
            </div>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <Button
                variant="secondary"
                onClick={handleSubmitForm2(onSubmitForm2)}
                disabled={!successTest}
              >
                Save
              </Button>
            </div>
          </SmallButtonFlex>
        </>
      ) : (
        <>
          <Table
            data={listData}
            columns={EVENTCOLUMNS}
            // breadcrumb={}
          />
          <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mt-4">
            <Button
              variant="secondary"
              onClick={() => setCreatMappingShow(true)}
            >
              Create Mapping
            </Button>
          </div>
        </>
      )}
      <CreateMapping
        isOpen={createMappingShow}
        setIsOpen={setCreatMappingShow}
      />

      <SuccessTestModal
        successTest={successTest}
        setSuccessTest={setSuccessTest}
      />
    </Wrapper>
  );
};
