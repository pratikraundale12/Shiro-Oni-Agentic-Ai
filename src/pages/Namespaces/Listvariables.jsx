/*eslint-disable*/
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PencilIcon, PlusCircleIcon } from '../../assets';
import {
  IconButton,
  LoaderContainer,
  Table,
  TextRender,
} from '../../components';
import { KDFM } from '../../constants';
import { Button, Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
// import { SchedularActions } from '../../store/schedular/redux';
import { isEmpty, uniqBy } from 'lodash';
import { singleNamespaceData } from '../../store/namespaces';
import { SchedularSelectors } from '../../store/schedular/redux';
import AddVariables from './AddVariables';
import Collapsible from './Collapsible';

const DataWrapper = styled.div`
  width: 100%;
  height: 596px;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const Listvariables = ({
  isOpen,
  closePopup,
  isVariablesModalOpen,
  setVariablesModalOpen,
}) => {
  const variableContextItem = useSelector(
    NamespacesSelectors.getVariableContextItem
  );
  const newlyAddVariables = useSelector(
    NamespacesSelectors.getNewlyAddVariables
  );

  const variableList = useSelector(NamespacesSelectors.getVariableList);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  const schduleVariableData = checkDestCluster?.additionalData?.variables;
  const combinedVaribalesListSchedule = useSelector(
    NamespacesSelectors.getScheduleNamespaceVariables
  );
  const [isTableOpen, setIsTableOpen] = useState(false);
  const variableLoadingStateAPI = useSelector(
    NamespacesSelectors.getVariableListLoading
  );
  const sortedScheduleVariableArray = useMemo(
    () =>
      schduleVariableData?.map(item => ({
        variable: {
          name: item?.name,
          value: item?.value,
          check: item?.check || false,
        },
      })),
    [schduleVariableData]
  );
  const sortednewlyAddVariables = newlyAddVariables?.map(item => ({
    variable: {
      name: item?.name,
      value: item?.value,
      check: item?.check || false,
    },
  }));
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );

  useEffect(() => {
    if (schedularFromList) {
      dispatch(
        NamespacesActions.setScheduleNamespaceVariable({
          ...variableList,
          variables: sortedScheduleVariableArray,
        })
      );
    }
  }, [variableList, sortedScheduleVariableArray, isOpen.isOpen]);

  useEffect(() => {
    if (schedularFromList && !_.isEmpty(newlyAddVariables)) {
      const uniqueVariables = uniqBy(
        [
          ...(combinedVaribalesListSchedule?.variables || []),
          ...sortednewlyAddVariables,
        ],
        item => item.variable.name
      );

      dispatch(
        NamespacesActions.setScheduleNamespaceVariable({
          ...combinedVaribalesListSchedule,
          variables: uniqueVariables,
        })
      );
    }
  }, [newlyAddVariables, isVariablesModalOpen]);
  const permissions = singleNamespaceData?.permissions;
  const { canWrite } = permissions || {};
  const COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.variable?.name}
          text={item?.variable?.name}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <TextRender
            key={item?.variable?.value}
            text={
              item?.variable?.check || item?.variable?.value === ''
                ? KDFM.EMPTY_STRING_SET
                : item?.variable?.value
                  ? item?.variable?.value
                  : KDFM.NO_VALUE_SET
            }
            capitalizeText={false}
          />
        );
      },
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              if (canWrite) {
                setIsAddVariablesOpen({ isOpen: true, mode: 'edit' });
                if (isVariablesModalOpen?.schedule) {
                  setVariablesModalOpen({
                    isOpen: true,
                    mode: 'add',
                    schedule: true,
                  });
                } else {
                  setVariablesModalOpen({
                    isOpen: true,
                    mode: 'add',
                    schedule: false,
                  });
                }
                dispatch(NamespacesActions.setVariableContextItem(item));
              }
            }}
            style={{
              opacity: canWrite ? 1 : 0.3,
              cursor: canWrite ? 'pointer' : 'not-allowed',
            }}
          >
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  let variablesData = [];
  if (variableList && variableList?.variables) {
    const variables = newlyAddVariables.map(item => {
      return {
        variable: {
          name: item.name,
          value: item.value,
          check: item?.check,
        },
      };
    });
    const allVariables = [...variableList?.variables, ...variables];
    const uniqueVariables = Array.from(
      new Map(allVariables.map(item => [item.variable.name, item])).values()
    );

    variablesData = uniqueVariables;
  }

  const openVariable = () => {
    setIsAddVariablesOpen({ isOpen: true, mode: 'add' });
    dispatch(NamespacesActions.setVariableContextItem({}));
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
  };
  useEffect(() => {
    dispatch(NamespacesActions.fetchVariableList());
  }, [dispatch]);

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    dispatch(NamespacesActions.setVariableContextItem({}));
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    dispatch(
      NamespacesActions.addVariableServices({
        variables: newlyAddVariables,
      })
    );

    setLoading(false);

    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.fetchVariableList());
  };
  const scheduleSubmit = async () => {
    setVariablesModalOpen({ isOpen: false, mode: 'add', schedule: true });
  };
  const toggleCollapsible = () => setIsTableOpen(!isTableOpen);

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {variablesData && variablesData?.length > 0 ? (
          <Collapsible
            title="Variables"
            isTableOpen={isTableOpen}
            toggleCollapsible={toggleCollapsible}
            isAddBtnVisible={false}
          >
            <Table
              data={variablesData || []}
              columns={COLUMNS}
              className={'variables-table'}
              loading={variableLoadingStateAPI}
            />
            <Button
              type="button"
              disabled={!canWrite}
              className="w-auto mt-2"
              size="sm"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Collapsible>
        ) : (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <NoDataText>No Variables Found!!</NoDataText>
          </LoaderContainer>
        )}

        {isAddVariablesOpen && (
          <AddVariables
            isVariablesModalOpen={isVariablesModalOpen}
            variableContextItem={variableContextItem}
            isOpen={isAddVariablesOpen}
            closePopup={closeAddVariablesModal}
            isAddVariablesOpen={isAddVariablesOpen}
            setIsAddVariablesOpen={setIsAddVariablesOpen}
            setVariablesModalOpen={setVariablesModalOpen}
          />
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

Listvariables.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  setVariablesModalOpen: PropTypes.func.isRequired,
  setVariables: PropTypes.func,
  isVariablesModalOpen: PropTypes.object,
  variables: PropTypes.array,
  handleTertiaryButton: PropTypes.func,
};

export default Listvariables;
