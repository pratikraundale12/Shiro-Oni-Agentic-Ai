import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
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
      label: KDFM.NAME,
      renderCell: item => <TextRender text={item?.name || KDFM.NA} />,
    },
    {
      label: KDFM.VALUE,
      renderCell: item => (
        <TextRender
          text={
            item.sensitive === true || item.sensitive === 'true'
              ? KDFM.SENSITIVE_VALUE_SET
              : item.value
                ? item.value
                : item.check
                  ? KDFM.EMPTY_STRING_SET
                  : KDFM.NO_VALUE_SET
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
      title={KDFM.PARAMETER_CONTEXT}
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      isLoading={loading}
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText={KDFM.ADD_PARAMETER_CONTEXT}
      primaryButtonDisabled={!newlyAddedPrameterContext?.length || loading}
      primaryButtonText={KDFM.SAVE}
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
