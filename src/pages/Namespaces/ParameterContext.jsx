/* eslint-disable react/prop-types */
import { has, isEmpty, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ArrowIcon, NoDataIcon, PencilIcon, RefrenceIcon } from '../../assets';
import {
  EnhancedTextRender,
  IconButton,
  LoaderContainer,
  Table,
  TextRender,
} from '../../components';
import { KDFM } from '../../constants';
// import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import {
  // SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
// import AddParameterContext from './AddParameterContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button } from '../../shared';
import AddParameterContext from './AddParameterContext';
import Collapsible from './Collapsible';
import RefreshModal from './RefreshModal';

const ArrowButton = styled.button`
  background-color: white;
  border-radius: 50%;
  border: 1px solid grey;
`;
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

const ParameterTable = styled.div`
  table thead tr th:nth-child(3) {
    text-align: center;
  }
`;

const ParameterContext = ({
  isOpen,
  isAddParameterContextOpen,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  isParameterContextOpen,
}) => {
  const [selectedParentContextId, setSelectedParentContextId] = useState('');
  const dispatch = useDispatch();
  const [isTableOpen, setIsTableOpen] = useState(false);
  const newlyAddParameters = useSelector(
    NamespacesSelectors.getNewlyAddedParameterContext
  );
  const parameterContextItem = useSelector(
    NamespacesSelectors.getParameterContextItem
  );
  const parameterDetails = useSelector(NamespacesSelectors.getParameterDetails);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const parameterContextObjectAtDeloy = useSelector(
    NamespacesSelectors.getParameterContextListAtDeploy
  );
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );
  const copyParameterDetailsData =
    parameterDetails?.[deployOrUpgradeDetails?.parameterContextId] ||
    parameterDetails?.[singleNamespaceData?.parameterContextId] ||
    parameterContextObjectAtDeloy?.parameterContexts ||
    [];

  const tableData = [...copyParameterDetailsData, ...newlyAddParameters];
  const targetId =
    deployOrUpgradeDetails?.parameterContextId ||
    singleNamespaceData?.parameterContextId;

  const sortedArray = tableData.sort((a, b) => {
    if (a.parentParameterId === targetId) return -1;
    if (b.parentParameterId === targetId) return 1;
    return 0;
  });

  const [tableStateData, setTableStateData] = useState();
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  const schduleParameterData =
    checkDestCluster?.additionalData?.filteredParameterData;
  const [refreshItem, setRefreshItem] = useState(null);

  useEffect(() => {
    if (
      singleNamespaceData?.parameterContextId ||
      deployOrUpgradeDetails?.parameterContextId
    ) {
      dispatch(NamespacesActions.fetchParameterContext());
    }
  }, [
    singleNamespaceData?.parameterContextId,
    deployOrUpgradeDetails?.parameterContextId,
  ]);

  useEffect(() => {
    if (schedularFromList) {
      setTableStateData(schduleParameterData);
      dispatch(
        NamespacesActions.setScheduleNamespaceParameterContext(
          schduleParameterData
        )
      );
    }
  }, [schedularFromList, schduleParameterData]);

  useEffect(() => {
    if (!schedularFromList) {
      const uniqueData = uniqBy(sortedArray, 'name');
      setTableStateData(uniqueData);
    }
  }, [
    parameterDetails?.[deployOrUpgradeDetails?.parameterContextId],
    parameterContextObjectAtDeloy?.parameterContexts,
  ]);

  const isParentEdit = useSelector(NamespacesSelectors.getParameterEditParent);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const permissions = singleNamespaceData?.permissions;
  const { canWrite } = permissions || {};

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
      renderCell: item => {
        return (
          <EnhancedTextRender
            key={item?.value}
            text={
              (item.sensitive === true || item.sensitive === 'true') &&
              !item?.value
                ? KDFM.NO_VALUE_SET
                : item.sensitive === true || item.sensitive === 'true'
                  ? KDFM.SENSITIVE_VALUE_SET
                  : item.value
                    ? truncateString(item.value, 40)
                    : item.check
                      ? KDFM.EMPTY_STRING_SET
                      : KDFM.NO_VALUE_SET
            }
            tooltipText={
              (item.sensitive === true || item.sensitive === 'true') &&
              !item?.value &&
              !item.check
                ? KDFM.NO_VALUE_SET
                : item.sensitive === true || item.sensitive === 'true'
                  ? KDFM.SENSITIVE_VALUE_SET
                  : item.value
                    ? item.value
                    : item.check
                      ? KDFM.EMPTY_STRING_SET
                      : KDFM.NO_VALUE_SET
            }
          />
        );
      },
    },
    {
      label: 'Referencing Component',
      renderCell: item => (
        <div className="text-center">
          {!isEmpty(item?.referencingComponents) && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => {
                  setRefreshItem(item);
                  dispatch(NamespacesActions.setRefreshmodalOpen(true));
                }}
                data-tooltip-id={`Reference-${item?.id}`}
                aria-label="Reference"
              >
                <RefrenceIcon />
              </button>
              <ReactTooltip
                id={`Reference-${item?.id}`}
                place="left"
                content="Reference"
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
        </div>
      ),
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {item.parentParameterId ===
            deployOrUpgradeDetails?.parameterContextId ||
          singleNamespaceData?.parameterContextId ||
          !has(item, 'parentParameterId') ? (
            <IconButton
              style={{
                opacity: canWrite ? 1 : 0.3,
                cursor: canWrite ? 'pointer' : 'not-allowed',
              }}
              onClick={() => {
                if (canWrite) {
                  setIsAddParameterContextOpen({ isOpen: true, mode: 'edit' });
                  if (isParameterContextOpen?.schedule) {
                    setIsParameterContextOpen({
                      isOpen: false,
                      schedule: true,
                    });
                  } else {
                    setIsParameterContextOpen({
                      isOpen: false,
                      schedule: false,
                    });
                  }
                  dispatch(NamespacesActions.setParameterContextItem(item));
                  if (!isParentEdit?.parent) {
                    dispatch(
                      NamespacesActions.setParameterEditParent({
                        parent: false,
                        id:
                          deployOrUpgradeDetails?.parameterContextId ||
                          singleNamespaceData?.parameterContextId,
                      })
                    );
                  }
                }
              }}
            >
              {<PencilIcon color="black" />}
            </IconButton>
          ) : (
            <ArrowButton
              type="button"
              onClick={() => {
                if (canWrite) {
                  setSelectedParentContextId(item?.parentParameterId);
                  dispatch(NamespacesActions.setNewlyAddedParameterContext([]));
                  dispatch(
                    NamespacesActions.setParameterEditParent({
                      parent: true,
                      id: item.parentParameterId,
                    })
                  );
                  dispatch(NamespacesActions.setDeployedModal());
                }
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
    // setLoading(true);
    const uniqueDataSorted = uniqBy(newlyAddParameters, 'name');
    dispatch(
      NamespacesActions.updateParameterContext({
        modifiedPayloadData: [...uniqueDataSorted],
      })
    );
    // setLoading(false);
    dispatch(NamespacesActions.setNewlyAddedParameterContext([]));
    setIsParameterContextOpen({ isOpen: false, schedule: false });
    dispatch(NamespacesActions.setNamespaceSummaryLoadingState(true));
    setTimeout(() => {
      // setIsParameterContextOpen({ isOpen: true, schedule: false });
      dispatch(NamespacesActions.setNamespaceSummaryLoadingState(false));
      dispatch(NamespacesActions.fetchParameterContext());
      // getParamerterContext();
    }, 1000);
  };

  // const backSchedule = () => {
  //   setIsParameterContextOpen({ isOpen: false, schedule: true });
  //   dispatch(SchedularActions.setScheduleDeployModal());
  // };

  selectedParentContextId;
  useEffect(() => {
    if (isParentEdit?.parent) {
      dispatch(NamespacesActions.fetchParameterContext());
    }
  }, [isParentEdit?.id]);

  useEffect(() => {
    if (isParentEdit?.parent && !schedularFromList) {
      const copyParameterDetailsData =
        parameterDetails?.parameterContexts || [];
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
      if (!isEmpty(updatedData)) {
        setTableStateData(updatedData);
      }
    } else if (schedularFromList) {
      const updatedData = schduleParameterData.map(copyItem => {
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
      setTableStateData([...updatedData]);
      dispatch(
        NamespacesActions.setScheduleNamespaceParameterContext([...updatedData])
      );
    }
  }, [parameterDetails, isOpen, newlyAddParameters]);
  const closeAddParameterContext = () => {
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
    dispatch(NamespacesActions.setParameterContextItem({}));
    if (isParameterContextOpen.schedule) {
      setIsParameterContextOpen({ isOpen: true, schedule: true });
    } else {
      setIsParameterContextOpen({ isOpen: true, schedule: false });
    }
  };
  const toggleCollapsible = () => setIsTableOpen(!isTableOpen);
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {tableStateData && tableStateData.length > 0 ? (
          <Collapsible
            title={KDFM.PARAMETER_CONTEXT}
            isTableOpen={isTableOpen}
            toggleCollapsible={toggleCollapsible}
            isAddBtnVisible={false}
          >
            <ParameterTable>
              <Table
                data={tableStateData}
                columns={COLUMNS}
                className={'parameter-context-table'}
              />
            </ParameterTable>
            <Button
              type="button"
              className="w-auto mt-2"
              size="sm"
              onClick={handleSaveParameterContext}
              disabled={!canWrite}
            >
              Save
            </Button>

            <AddParameterContext
              key={isParameterContextOpen.mode}
              isParameterContextOpen={isParameterContextOpen}
              parameterContextItem={parameterContextItem}
              isAddParameterContextOpen={isAddParameterContextOpen}
              closePopup={closeAddParameterContext}
              setIsAddParameterContextOpen={setIsAddParameterContextOpen}
              setIsParameterContextOpen={setIsParameterContextOpen}
            />
          </Collapsible>
        ) : (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <NoDataText>No Parameter Context Found!!</NoDataText>
          </LoaderContainer>
        )}
        <RefreshModal refreshItem={refreshItem} />
      </ScrollSetGrey>
    </DataWrapper>
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
