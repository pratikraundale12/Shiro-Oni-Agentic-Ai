import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkIcon, QRIcons, TodoIcon } from '../../assets';
import { Button, CheckboxField, InputField, PasswordField } from '../../shared';
import { CreateMapping } from './components/CreateMapping';
import { useForm } from 'react-hook-form';
import { Table } from '../../components/CustomGrid/Table';
import { checkLdapConfig } from '../../store/apis/ldap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { testConfigApi } from '../../store/apis/ldap';

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

const tableData = [
  {
    id: 1,
    ldapUrl: 'ldap://example.com',
  },
  {
    id: 2,
    ldapUrl: 'ldap://example.org',
  },
  {
    id: 3,
    ldapUrl: 'ldap://example.net',
  },
];

const EVENTCOLUMNS = [
  {
    label: 'LDAP Groups',
    key: 'ldapUrl',
    renderCell: data => data.ldapUrl, // Adjust based on how `CompactTable` expects cell rendering
  },
  {
    label: 'KDFM Groups',
    key: 'id',
    renderCell: data => data.id,
  },
];
export const schemaForm1 = Yup.object().shape({
  ldapUrl: Yup.string().required('LDAP URL is required'),
  loginDN: Yup.string().required('Login DN is required'),
  password: Yup.string().required('Password is required'),
});

// Schema for the second form
export const schemaForm2 = Yup.object().shape({
  baseDN: Yup.string().required('Base DN is required'),
  groupsDN: Yup.string().required('Groups DN is required'),
  usersDN: Yup.string().required('Users DN is required'),
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
  const [displayList, setDisplayList] = useState(true);
  setDisplayList;
  displayList;
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    watch,
  } = useForm({ resolver: yupResolver(schemaForm1) });

  // Second form
  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    formState: { errors: errorsForm2 },
  } = useForm({
    resolver: yupResolver(schemaForm2),
  });

  const onSubmitForm1 = async data => {
    console.log('Form 1 Data:', data);
    // "url": "ldap://ec2-3-111-156-231.ap-south-1.compute.amazonaws.com:389",
    // "password": "ksolves",
    // "loginDn": "cn=admin,dc=user,dc=ksolves,dc=co"

    const payload = {
      url: data.ldapUrl,
      password: data.password,
      loginDn: data.loginDN,
    };

    const response = await testConfigApi(payload);
    if (response?.status === 200) {
      setSecondFormState(true);
      console.log(response, 'ressssss');
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
  };

  const onSubmitForm2 = data => {
    console.log('Form 2 Data:', data);
  };

  const handleCheckLdapConfig = async () => {
    const response = await checkLdapConfig();
    if (response.status === 200) {
      setLdapInitialConfig(response?.data?.ldapEnabled);
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
            <CheckboxField
              name="check"
              checked={ldapInitialConfig}
              onClick={handleCheckMark}
            />
          </div>
          <InputFieldFlex className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <InputField
                name="ldapUrl"
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
                name="loginDN"
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
            <div>
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
                name="baseDN"
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
                name="groupsDN"
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
                name="usersDN"
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
              <Button>Fetch LDAP Groups</Button>
            </div>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
              <Button
                variant="secondary"
                onClick={handleSubmitForm2(onSubmitForm2)}
              >
                Save
              </Button>
            </div>
          </SmallButtonFlex>
        </>
      ) : (
        <Table data={tableData} columns={EVENTCOLUMNS} />
      )}
      <CreateMapping />
    </Wrapper>
  );
};
