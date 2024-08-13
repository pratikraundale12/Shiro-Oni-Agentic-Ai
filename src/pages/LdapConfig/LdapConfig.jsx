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
  margin-top: 46px;
  width: 100%;
  display: flex;
  gap: 20px;
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
  margin-top: 40px;
`;

const SmallButtonFlex = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
    renderCell: data => <></>,
  },
];

export const LdapConfig = () => {
  const [mappingOepn, setMappingOpen] = useState(false);
  const {
    register,
    // handleSubmit,
    // control,
    watch,
    // setValue,
    formState: { errors },
  } = useForm();

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
      <InputFieldFlex>
        <InputField
          name="username"
          type="text"
          label="LDAP URL"
          placeholder="Enter your Username"
          icon={<LinkIcon />}
        />
        <InputField
          name="username"
          type="text"
          label="LDAP Base DN"
          placeholder="Enter your Username"
          icon={<QRIcons />}
        />
        <PasswordField
          name="password"
          register={register}
          errors={errors}
          watch={watch}
          required
          label="Password"
        />
      </InputFieldFlex>
      <ButtonFlex>
        <div>
          <StyledButton size="md">Test Configuration</StyledButton>
        </div>
        <SmallButtonFlex>
          <Button>Fetch LDAP Groups</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setMappingOpen(true);
            }}
          >
            Create Mapping
          </Button>
        </SmallButtonFlex>
      </ButtonFlex>
      {/* <CompactTable data={DATA} columns={EVENTCOLUMNS} theme={tableTheme} />{' '} */}
      <Table data={tableData} columns={EVENTCOLUMNS} />
      <CreateMapping isOpen={mappingOepn} setIsOpen={setMappingOpen} />
    </Wrapper>
  );
};
