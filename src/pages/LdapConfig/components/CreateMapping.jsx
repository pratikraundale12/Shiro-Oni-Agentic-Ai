import React from 'react';
import { Modal } from '../../../shared';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { SelectField } from '../../../shared';

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
export const CreateMapping = ({ isOpen, setIsOpen }) => {
  const { control } = useForm();

  const fieldData = [
    { label: 'Admin' },
    { label: 'Manager' },
    { label: 'Developer' },
    { label: 'Tester' },
    { label: 'Sales' },
    { label: 'Consultant' },
    { label: 'Designer' },
    { label: 'IT Admin' },
  ];

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
    >
      <TableContainer>
        <Table>
          <tbody>
            {fieldData.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>
                  <StyledSelectField options={[]} control={control} />
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
};
