import React, { useEffect, useState } from 'react';
import { Modal } from '../../../shared';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { SelectField } from '../../../shared';
import {
  getLdapGroupAPI,
  getRolesAPI,
  groupMappingApi,
} from '../../../store/apis/ldap';
import { toast } from 'react-toastify';

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;

  .react-select__control {
    border-radius: 8px;
  }

  .react-select__value-container {
    padding: 2px;
  }

  .react-select__multi-value {
    background-color: ${props => props.theme.colors.lightGrey};
    border-radius: 6px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    &:nth-of-type(even) {
      background-color: #f5f7fa;
    }

    td:first-child {
      padding: 1rem 0;
      padding-left: 1rem;
      width: 15%;
      min-width: 15%;
      max-width: 15%;
      text-transform: capitalize;
    }
    td:last-child {
      padding: 1rem 0;
      padding-right: 1rem;
      min-width: 85%;
      max-width: 85%;
    }
  }
`;
export const CreateMapping = ({
  isOpen,
  setIsOpen,
  getLDAPGroupForMapping,
}) => {
  const { control, handleSubmit } = useForm();
  const [ldapList, setLdapList] = useState([]);
  const [kdfList, setKdfList] = useState([]);
  const [formPayload, setFormPayload] = useState([]);

  // const fieldData = [
  //   { label: 'Admin' },
  //   { label: 'Manager' },
  //   { label: 'Developer' },
  //   { label: 'Tester' },
  //   { label: 'Sales' },
  //   { label: 'Consultant' },
  //   { label: 'Designer' },
  //   { label: 'IT Admin' },
  // ];

  const getLDAPGroup = async () => {
    const response = await getLdapGroupAPI();
    if (response?.status === 200) {
      setLdapList(response.data.groups);
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
    const response1 = await getRolesAPI();
    if (response1?.status === 200) {
      console.log(response1.data.data, 'RESEPONSE!!!!!');
      const sortedArray = response1?.data?.data?.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setKdfList(sortedArray);
    } else {
      toast.error(
        response1?.message || 'Something went wrong. Please try again'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      getLDAPGroup();
    }
  }, [isOpen]);

  console.log(kdfList, 'kdfmList');
  console.log(ldapList, 'ldaplist');
  const temp = kdfList?.map(item => item.cn);
  console.log(temp, '<>><><><');

  const handleChange = (event, item) => {
    console.log(event.value, item, '??????????');
    const sortedArray = kdfList.filter(item => item.value !== event.value);
    setKdfList(sortedArray);
    setFormPayload([
      ...formPayload,
      { id: event.value, ldap_group_name: item.cn },
    ]);
  };

  const onSubmit = async data => {
    console.log(data);
    const response = await groupMappingApi({ data: formPayload });
    if (response?.status === 200) {
      console.log(response, '>>>>>>>>>', response);
      toast.success('LDAP and KDFM Mapping is SuccessFully');
      setIsOpen(false);
      getLDAPGroupForMapping();
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
      setIsOpen(false);
    }
  };

  return (
    <Modal
      title="Enable Cluster"
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      size="lg"
      secondaryButtonText="Back"
      primaryButtonText="Submit"
      footerAlign="start"
      contentStyles={{ minWidth: '50%' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TableContainer>
        <Table>
          <tbody>
            {ldapList.map((item, index) => (
              <tr key={index}>
                <td>{item.cn}</td>
                <td>
                  <StyledSelectField
                    options={kdfList}
                    control={control}
                    onChange={event => handleChange(event, item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Modal>
  );
};

CreateMapping.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  getLDAPGroupForMapping: PropTypes.func,
};
