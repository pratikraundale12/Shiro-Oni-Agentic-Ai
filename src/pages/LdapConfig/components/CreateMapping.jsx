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
  // overflow: hidden;
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

  const getLDAPGroup = async () => {
    try {
      const [ldapResponse, rolesResponse] = await Promise.all([
        getLdapGroupAPI(),
        getRolesAPI(),
      ]);
      console.log(ldapResponse, 'ldapResponse');

      if (ldapResponse?.status === 200) {
        setLdapList(ldapResponse.data.groups);
      } else {
        toast.error(ldapResponse?.message || 'Failed to load LDAP groups');
      }

      if (rolesResponse?.status === 200) {
        const sortedArray = rolesResponse?.data?.data?.map(item => ({
          label: item.name,
          value: item.id,
          ldapGroupname: item.ldap_group_name,
        }));
        setKdfList(sortedArray);
      } else {
        toast.error(rolesResponse?.message || 'Failed to load roles');
      }
    } catch (error) {
      toast.error('An error occurred while loading data');
    }
  };

  useEffect(() => {
    if (isOpen) {
      getLDAPGroup();
    }
  }, [isOpen]);

  const handleChange = (event, item) => {
    const newItem = { id: event.value, ldap_group_name: item.cn };
    const existingIndex = formPayload.findIndex(
      payload => payload.id === newItem.id
    );

    if (existingIndex >= 0) {
      const updatedPayload = [...formPayload];
      updatedPayload[existingIndex] = newItem;
      setFormPayload(updatedPayload);
    } else {
      setFormPayload([...formPayload, newItem]);
    }
  };

  const onSubmit = async () => {
    const response = await groupMappingApi({ data: formPayload });
    if (response?.status === 200) {
      toast.success('LDAP and KDFM Mapping is Successful');
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
      contentStyles={{ minWidth: '50%', maxHeight: '90%' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TableContainer>
        <Table>
          <tbody>
            {ldapList.map((item, index) => {
              const defaultValue = kdfList.find(
                option => option.ldapGroupname === item.cn
              );
              return (
                <tr key={index}>
                  <td>{item.cn}</td>
                  <td>
                    {kdfList.length > 0 && (
                      <StyledSelectField
                        options={kdfList}
                        control={control}
                        defaultValue={
                          defaultValue
                            ? {
                                label: defaultValue.label,
                                value: defaultValue.value,
                              }
                            : null
                        }
                        onChange={event => handleChange(event, item)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
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
