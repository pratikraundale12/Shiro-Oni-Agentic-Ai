import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ArrowIcon, PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { has } from 'lodash';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;

  & .parameter-context-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;
const ArrowButton = styled.button`
  background-color: white;
  border-radius: 50%;
  border: 1px solid grey;
`;

const ParameterContext = ({
  isOpen,
  closePopup,
  openAddParameterContext,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  isParameterContextOpen,
  parameterContextId = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedParentContextId, setSelectedParentContextId] = useState('');
  const dispatch = useDispatch();
  const newlyAddParameters = useSelector(
    NamespacesSelectors.getNewlyAddedParameterContext
  );
  const parameterDetails = useSelector(NamespacesSelectors.getParameterDetails);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const copyParameterDetailsData =
    parameterDetails?.[deployOrUpgradeDetails?.parameterContextId] || [];
  const tableData = [...copyParameterDetailsData, ...newlyAddParameters];
  const targetId = deployOrUpgradeDetails?.parameterContextId;
  // const isParameterDeployOpen = useSelector(
  //   NamespacesSelectors.getDeployedModal
  // );

  const sortedArray = tableData.sort((a, b) => {
    if (a.parentParameterId === targetId) return -1;
    if (b.parentParameterId === targetId) return 1;
    return 0;
  });
  const [tableStateData, setTableStateData] = useState();
  useEffect(() => {
    setTableStateData(sortedArray);
  }, [parameterDetails?.[deployOrUpgradeDetails?.parameterContextId]]);

  const isParentEdit = useSelector(NamespacesSelectors.getParameterEditParent);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={item?.name || KDFM.NA}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => (
        <TextRender
          key={item?.value}
          text={
            item.sensitive === true || item.sensitive === 'true'
              ? KDFM.SENSITIVE_VALUE_SET
              : item.value
                ? truncateString(item.value, 40)
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
          {item.parentParameterId == parameterContextId ||
          isParentEdit?.parent ||
          !has(item, 'parentParameterId') ? (
            <IconButton
              disabled={loading}
              onClick={() => {
                setIsAddParameterContextOpen({ isOpen: true, mode: 'edit' });
                if (isParameterContextOpen?.schedule) {
                  setIsParameterContextOpen({ isOpen: false, schedule: true });
                } else {
                  setIsParameterContextOpen({ isOpen: false, schedule: false });
                }
                dispatch(NamespacesActions.setParameterContextItem(item));

                if (!isParentEdit?.parent) {
                  dispatch(
                    NamespacesActions.setParameterEditParent({
                      parent: false,
                      id: parameterContextId,
                    })
                  );
                }
              }}
            >
              {<PencilIcon color="black" />}
            </IconButton>
          ) : (
            <ArrowButton
              type="button"
              onClick={() => {
                setSelectedParentContextId(item?.parentParameterId);
                dispatch(NamespacesActions.setNewlyAddedParameterContext([]));
                dispatch(
                  NamespacesActions.setParameterEditParent({
                    parent: true,
                    id: item.parentParameterId,
                  })
                );
                dispatch(NamespacesActions.setDeployedModal());
                // if (isParameterContextOpen?.schedule) {
                //   setIsParameterContextOpen({ isOpen: false, schedule: false });
                // }
              }}
            >
              <ArrowIcon />
            </ArrowButton>
          )}
        </div>
      ),
    },
  ];
  const handleSaveParameterContext = async () => {
    if (!newlyAddParameters) return;
    setLoading(true);
    dispatch(
      NamespacesActions.updateParameterContext({
        modifiedPayloadData: [...newlyAddParameters],
      })
    );
    setLoading(false);
    dispatch(NamespacesActions.setNewlyAddedParameterContext([]));
  };

  const backSchedule = () => {
    setIsParameterContextOpen({ isOpen: false, schedule: true });
    dispatch(SchedularActions.setScheduleDeployModal());
  };

  selectedParentContextId;

  useEffect(() => {
    if (isParentEdit?.parent) {
      dispatch(NamespacesActions.fetchParameterContext());
    }
  }, [isParentEdit?.id]);
  useEffect(() => {
    if (isParentEdit?.parent) {
      const copyParameterDetailsData =
        parameterDetails?.[isParentEdit?.id] || [];
      const updatedData = copyParameterDetailsData.map(copyItem => {
        const match = newlyAddParameters.find(
          newItem => newItem.name.toLowerCase() === copyItem.name.toLowerCase()
        );

        return match ? match : copyItem;
      });

      newlyAddParameters.forEach(newItem => {
        const exists = updatedData.some(
          updatedItem =>
            updatedItem.name.toLowerCase() === newItem.name.toLowerCase()
        );

        if (!exists) {
          updatedData.push(newItem);
        }
      });
      setTableStateData(updatedData);
    }
  }, [parameterDetails, isOpen, newlyAddParameters]);

  return (
    <Modal
      title={KDFM.PARAMETER_CONTEXT}
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      isLoading={loading}
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText={KDFM.ADD_PARAMETER_CONTEXT}
      primaryButtonDisabled={
        !newlyAddParameters?.length || !newlyAddParameters?.length || loading
      }
      primaryButtonText={isParameterContextOpen?.schedule ? 'Back' : KDFM.SAVE}
      onSubmit={
        isParameterContextOpen?.schedule
          ? backSchedule
          : handleSaveParameterContext
      }
      footerAlign="start"
      secondaryButtonProps={{ icon: <PlusCircleIcon />, disabled: loading }}
      contentStyles={{ maxWidth: '45%', maxHeight: '60%' }}
    >
      <ModalBody className="modal-body">
        <Table
          data={tableStateData}
          columns={COLUMNS}
          className={'parameter-context-table'}
        />
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
  isParameterContextOpen: PropTypes.object,
  parameterContextId: PropTypes.string,
};

export default ParameterContext;
