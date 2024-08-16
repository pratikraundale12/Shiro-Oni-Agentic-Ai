import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const ParameterContext = ({
  isOpen,
  closePopup,
  openAddParameterContext,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  setParameterContextItem,
  newlyAddedPrameterContext,
  setNewlyAddedParameterContext,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const parameterDetails = useSelector(NamespacesSelectors.getParameterDetails);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const copyParameterDetailsData =
    parameterDetails?.[deployOrUpgradeDetails?.parameterContextId] || [];
  const tableData = [...copyParameterDetailsData, ...newlyAddedPrameterContext];

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item?.name || 'N/A'} />,
    },
    {
      label: 'Value',
      renderCell: item => (
        <TextRender
          text={
            item.sensitive === true || item.sensitive === 'true'
              ? 'Sensitive value set'
              : item.value
                ? item.value
                : item.check
                  ? 'Empty string set'
                  : 'No value set'
          }
        />
      ),
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            disabled={loading}
            onClick={() => {
              setIsAddParameterContextOpen({ isOpen: true, mode: 'edit' });
              setIsParameterContextOpen(false);
              setParameterContextItem(item);
            }}
          >
            <PencilIcon color="black" />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleSaveParameterContext = async () => {
    if (!newlyAddedPrameterContext) return;
    setLoading(true);
    dispatch(
      NamespacesActions.updateParameterContext({
        modifiedPayloadData: [...newlyAddedPrameterContext],
      })
    );
    setLoading(false);
    setNewlyAddedParameterContext([]);
  };

  return (
    <Modal
      title="Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      isLoading={loading}
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText="Add Parameter Context"
      primaryButtonDisabled={!newlyAddedPrameterContext?.length || loading}
      primaryButtonText="Save"
      onSubmit={handleSaveParameterContext}
      secondaryButtonProps={{ icons: <PlusCircleIcon />, disabled: loading }}
    >
      <ModalBody className="modal-body">
        <Table data={tableData} columns={COLUMNS} />
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
  setIsAddParameterContextOpen: PropTypes.func.isRequired,
  setIsParameterContextOpen: PropTypes.func.isRequired,
  setParameterContextItem: PropTypes.func,
  newlyAddedPrameterContext: PropTypes.array,
  getParamerterContext: PropTypes.func.isRequired,
  setNewlyAddedParameterContext: PropTypes.func.isRequired,
};

export default ParameterContext;
