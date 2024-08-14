import React, { useState } from 'react';
import styled from 'styled-components';
import { LinkIcon, QRIcons, TodoIcon } from '../../assets';
import { Button, CheckboxField, InputField, PasswordField } from '../../shared';
import { CreateMapping } from './components/CreateMapping';
import { useForm } from 'react-hook-form';
import { Table } from '../../components/CustomGrid/Table';

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

const LabelButton = styled(Button)`
  width: auto;
  height: 32px;
  margin-left: 330px;
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
  {
    label: <LabelButton variant="secondary">Click Me</LabelButton>,
    key: 'actions', // You can use any key here; it's not used in renderCell
    renderCell: () => {},
  },
];

export const LdapConfig = () => {
  const [mappingOepn, setMappingOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log(data, 'DATA');
  };

  return (
    <Wrapper>
      <Heading>
        <Flex>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
          <Title>LDAP Configuration Fields</Title>
        </Flex>
        <CheckboxField name="check" />
      </Heading>
      <InputFieldFlex className="row">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="ldapUrl"
            type="text"
            register={register}
            label="LDAP URL"
            errors={errors}
            placeholder="Enter your LDAP URL"
            icon={<LinkIcon />}
          />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="loginDN"
            type="text"
            register={register}
            label="Login DN"
            errors={errors}
            placeholder="Enter your Login DN"
            icon={<QRIcons />}
          />
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <PasswordField
            name="password"
            register={register}
            errors={errors}
            watch={watch}
            required
            label="Password"
          />
        </div>
      </InputFieldFlex>
      <ButtonFlex>
        <div>
          <StyledButton size="md" onClick={handleSubmit(onSubmit)}>
            Test Configuration
          </StyledButton>
        </div>
      </ButtonFlex>
      <InputFieldFlex className="row">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="baseDN"
            type="text"
            label="Base DN"
            placeholder="Enter your Base DN"
            icon={<LinkIcon />}
          />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="groupsDN"
            type="text"
            label="Groups DN"
            placeholder="Enter your Groups DN"
            icon={<QRIcons />}
          />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="usersDN"
            type="text"
            label="Users DN"
            placeholder="Enter your Users DN"
            icon={<QRIcons />}
          />
        </div>
      </InputFieldFlex>
      <InputFieldFlex className="row">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="userUniqueIdentifier"
            type="text"
            label="User Unique Identifier"
            placeholder="Enter User Identifier"
            icon={<LinkIcon />}
          />
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
          <InputField
            name="groupUniqueIdentifier"
            type="text"
            label="Group Unique Identifier"
            placeholder="Enter Group Identifier"
            icon={<LinkIcon />}
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
            onClick={() => {
              setMappingOpen(true);
            }}
          >
            Save
          </Button>
        </div>
      </SmallButtonFlex>
      {/* <CompactTable data={DATA} columns={EVENTCOLUMNS} theme={tableTheme} />{' '} */}
      <Table data={tableData} columns={EVENTCOLUMNS} />
      <CreateMapping isOpen={mappingOepn} setIsOpen={setMappingOpen} />
    </Wrapper>
  );
};
