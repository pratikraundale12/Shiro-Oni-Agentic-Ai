import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import styled from 'styled-components';
import { Table } from '../../components';
import { PencilIcon, PlusCircleIcon } from '../../assets';

const ModalBody = styled.div`
  padding: 35px 16px 25px;
  position: relative;
  flex: 1 1 auto;
`;

const COLUMNS = [
  {
    label: 'Name',
    renderCell: item => <div>{item.name}</div>,
  },
  {
    label: 'Value',
    renderCell: item => <div>{item.id}</div>,
  },
  {
    renderCell: () => <PencilIcon color="white" />,
  },
];

const generateDummyData = count => {
  return Array.from({ length: count }, (_, index) => ({
    id: `ID-${index + 1}`,
    name: `Name-${index + 1}`,
  }));
};

const ParameterContext = ({ isOpen, closePopup, openAddParameterContext }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dummyData = generateDummyData(5);
    setData(dummyData);
  }, []);

  return (
    <Modal
      title="Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText="Add Parameter Context"
      primaryButtonText="Navigate"
      secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
      //   onSubmit={handleSubmit(onSubmit)}
    >
      <ModalBody className="modal-body">
        <Table data={data} columns={COLUMNS} />
      </ModalBody>
    </Modal>
  );
};

ParameterContext.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  openAddParameterContext: PropTypes.func,
};

export default ParameterContext;
