import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';
import {
  deleteParameterContextService,
  updateParameterContextService,
} from '../../store/apis';
import { useGlobalContext } from '../../utils';

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
  getParamerterContext,
}) => {
  const [loading, setLoading] = useState(false);

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

  const { state } = useGlobalContext();
  const parameterDetailsData = state.parameterDetails?.data || {};
  delete parameterDetailsData.version;
  const dummyData = [
    ...Object.values(parameterDetailsData).flat(),
    ...newlyAddedPrameterContext,
  ];

  const handleSaveParameterContext = async () => {
    if (!newlyAddedPrameterContext) return;
    setLoading(true);
    try {
      const response = await updateParameterContextService(
        state.selectedClusterId,
        state.deployCountDetails?.data?.parameterContextId ||
          state?.updatedCount?.parameterContextId,
        { version: state.parameterVersion },
        [...newlyAddedPrameterContext]
      );

      if (response?.status === 200) {
        if (response?.data?.requestId) {
          const response2 = await deleteParameterContextService(
            state.selectedClusterId,
            state.deployCountDetails?.data?.parameterContextId ||
              state?.updatedCount?.parameterContextId,
            response?.data?.requestId,
            'get'
          );

          const startTime = Date.now();
          let isComplete = response2?.data?.complete;

          while (!isComplete && Date.now() - startTime < 15000) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const checkResponse = await deleteParameterContextService(
              state.selectedClusterId,
              state.deployCountDetails?.data?.parameterContextId ||
                state?.updatedCount?.parameterContextId,
              response2?.data?.requestId,
              'get'
            );
            isComplete = checkResponse?.data?.complete;
          }

          if (isComplete) {
            const responseAfterCompletion = await deleteParameterContextService(
              state.selectedClusterId,
              state.deployCountDetails?.data?.parameterContextId ||
                state?.updatedCount?.parameterContextId,
              response2?.data?.requestId
            );
            if (responseAfterCompletion?.status !== 204) {
              toast.error('Error: The operation did not complete.');
            }
          } else {
            toast.error(
              'Error: The operation did not complete within 15 seconds.'
            );
          }
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
      setNewlyAddedParameterContext([]);
      getParamerterContext();
    }
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
        <Table data={dummyData} columns={COLUMNS} />
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
