import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import styled from 'styled-components';
import { Table } from '../../components';
import { PencilIcon, PlusCircleIcon } from '../../assets';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;
// can_write
// :
// true
// context_name
// :
// "Interest"
// description
// :
// ""
// name
// :
// "SQLDB"
// provided
// :
// false
// sensitive
// :
// false
// value
// :

// "Cricket

const COLUMNS = [
  {
    label: 'Name',
    renderCell: item => <div>{item.context_name}</div>,
  },
  {
    label: 'Value',
    renderCell: item => <div>{item.value}</div>,
  },
  {
    renderCell: () => <PencilIcon color="red" />,
  },
];

const ParameterContext = ({
  isOpen,
  closePopup,
  openAddParameterContext,
  parameterDetails,
}) => {
  const parameterDetialsData = parameterDetails?.data || {};
  delete parameterDetialsData.version;
  console.log(parameterDetialsData, 'parameterDetialsData');
  const dummay = Object.values(parameterDetialsData).flat();
  console.log(dummay, 'dummay');
  // let dataToRender = [];
  // // if (parameterIds && parameterIds.length) {
  // //   parameterIds.forEach(key => {
  // //     dataToRender = [...dataToRender, parameterDetails?.data?.[key]];
  // //   });
  // // }

  // console.log(dataToRender);
  // console.log({ dataToRender, parameterIds, parameterDetails });
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
        <Table data={dummay} columns={COLUMNS} />
      </ModalBody>
    </Modal>
  );
};

ParameterContext.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  openAddParameterContext: PropTypes.func,
  parameterDetails: PropTypes.string,
  parameterIds: PropTypes.array,
};

export default ParameterContext;
