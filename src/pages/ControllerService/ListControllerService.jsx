/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  FlashCutIcon,
  FlashIcon,
  RefreshIcon,
  SettingSmallIcon,
  SmallSearchIcon,
  TriangleExclamationMarkIcon,
} from '../../assets';

import { isEmpty } from 'lodash';
import { FullPageLoader, Spinner, Table, TextRender } from '../../components';
import { KDFM, SEARCH_INPUT_ERROR } from '../../constants';
import { Button, FieldErrorMessage, ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  ErrorsSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import AddControllerServiceModal from './AddControllerServiceModal';
import AddProperties from './AddProperties';
import ConfigControllerService from './ConfigControllerService';
import ConfigurePropertyModal from './ConfigurePropertyModal';
import PropertyDropdownModal from './ProprtyDropdownModel';

const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;
const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;
const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const RefreshIocnPanel = styled.div`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 4px;
`;

const statusColors = {
  DISABLED: '#b5b5bd',
  SCHEDULED: '#0cbf59',
  INVALID: 'red',
  'IN PROGRESS': '#444445',
  DEFAULT: '#F2891F',
  ENABLED: '#0cbf59',
  DISABLING: '#F2891F',
  ENABLING: '#F2891F',
  VALIDATING: '#F2891F',
};

const ValidationIconWrapper = styled.div`
  cursor: pointer;
  margin-right: 8px;
  visibility: ${props => (props.hasErrors ? 'visible' : 'hidden')};
`;

const TooltipList = styled.ul`
  padding-left: 8px;
  marign: 0;
`;

const StatusText = ({ text = '', item }) => {
  const color = statusColors[text] || statusColors.DEFAULT;
  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
    <>
      <StatusTexts color={color} data-tooltip-id={`tooltip-cs-${item?.id}`}>
        {capitalizeFirstLetter(text)}
      </StatusTexts>{' '}
    </>
  );
};
export const ListControllerService = () => {
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchErrorMsg, setSearchErrorMsg] = useState({});

  const [updatedData, setUpdatedData] = useState([]);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const controllerServicesList = useSelector(
    NamespacesSelectors.getRootControllerServiceNamespace
  );
  const [listData, setListData] = useState(
    useSelector(NamespacesSelectors?.getRootControllerServiceNamespace)
  );
  useEffect(() => {
    setListData(controllerServicesList);
  }, [controllerServicesList]);
  const refreshedControllerService = useSelector(
    NamespacesSelectors.getRefreshedControllerService
  );
  useEffect(() => {
    setListData(prevList =>
      prevList.map(item =>
        item.id === refreshedControllerService?.data?.id
          ? refreshedControllerService?.data
          : item
      )
    );
  }, [refreshedControllerService]);
  const csPermission = useSelector(NamespacesSelectors?.getCsPermissions);
  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsAddControllerServiceMOdalOpen
  );
  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );
  const [referenceListPropertyTableData, setReferenceListPropertyTableData] =
    useState(selectedItemFromList?.properties);
  const [isResetNotRequired, setIsResetNotRequired] = useState(false);
  const filteredModulesData = useMemo(
    () =>
      !isEmpty(listData)
        ? listData?.filter(
            module =>
              module?.name?.toLowerCase().includes(search.toLowerCase()) ||
              module?.type?.toLowerCase().includes(search.toLowerCase())
          )
        : [],
    [listData, search]
  );
  const [isUserCanWrite, setIsUserCanWrite] = useState(csPermission?.canWrite);

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const error = useSelector(state =>
    ErrorsSelectors.getError(state, 'fetchClusters')
  );

  const fetchingClusters = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusters')
  );
  const [hasTriedFetchingClusters, setHasTriedFetchingClusters] =
    useState(false);
  useEffect(() => {
    if (!fetchingClusters) {
      setHasTriedFetchingClusters(true);
    }
  }, [fetchingClusters]);

  useEffect(() => {
    const isUnauthorized =
      error &&
      (error?.error?.raw?.status === 401 ||
        error?.error?.code === 'invalid_token' ||
        (error?.message &&
          error?.message.toLowerCase().includes('user session expired.')));
    if (isUnauthorized) return;

    if (
      hasTriedFetchingClusters &&
      !fetchingClusters &&
      isEmpty(selectedCluster?.value)
    ) {
      toast.info(KDFM.PLEASE_LOGIN_TO_CLUSTER, {
        toastId: 'please-login-cluster-toast',
      });
    }
  }, [
    selectedCluster?.value,
    fetchingClusters,
    hasTriedFetchingClusters,
    error,
  ]);

  useEffect(() => {
    setIsUserCanWrite(csPermission?.canWrite);
  }, [csPermission]);
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );
  const [refreshingRowId, setRefreshingRowId] = useState(null);
  const handleEnableClick = item => {
    setSelectedItemFromList(item);
    setIsEnableModalOpen(true);
  };

  const handleDeleteClick = item => {
    setSelectedItemFromList(item);
    setIsDeleteModalOpen(true);
  };
  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state == 'DISABLED' ||
          selectedItemFromList?.state == 'DISABLING'
            ? 'ENABLED'
            : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
        referencingComponents:
          selectedItemFromList?.referencingComponents || {},
      })
    );

    setIsEnableModalOpen(false);
  };
  const handleDeleteControllerServiceClick = () => {
    setIsResetNotRequired(true);
    dispatch(
      NamespacesActions.deleteControllerService({
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );
    setIsDeleteModalOpen(false);
    setIsResetNotRequired(true);
  };

  const controllerPermissions = useSelector(
    AuthenticationSelectors.getPermissions
  );

  const handleRefreshClick = item => {
    setRefreshingRowId(item.id);
    const result = dispatch(
      NamespacesActions.refreshControllerService({ controllerId: item?.id })
    );
    if (result && typeof result.finally === 'function') {
      result.finally(() => setRefreshingRowId(null));
    } else {
      setTimeout(() => setRefreshingRowId(null), 1000);
    }
  };

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div className="d-flex">
          {
            <>
              <ValidationIconWrapper
                hasErrors={item?.validationErrors?.length > 0}
                data-tooltip-id={`tooltip-${item?.id}-validationErrors`}
              >
                <TriangleExclamationMarkIcon
                  height={18}
                  width={18}
                  color="#CF9F5D"
                />{' '}
              </ValidationIconWrapper>
              {item?.validationErrors?.length > 0 && (
                <ReactTooltip
                  id={`tooltip-${item?.id}-validationErrors`}
                  place="right"
                  render={() => (
                    <TooltipList>
                      {item?.validationErrors?.map(h => {
                        return <li key={h}>{h}</li>;
                      })}
                    </TooltipList>
                  )}
                  style={{
                    maxWidth: '500px',
                    whiteSpace: 'normal',
                    zIndex: 9999,
                  }}
                />
              )}
            </>
          }
          <TextRender
            text={item?.name}
            data-tooltip-id={`tooltip-${item.id}-name`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-name`}
            place="right"
            content={item?.name}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </div>
      ),
      width: '21%',
      resize: true,
    },
    {
      label: 'Type',
      renderCell: item => (
        <>
          <TextRender
            text={item?.typeValue}
            data-tooltip-id={`tooltip-${item.id}-typeValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-typeValue`}
            place="right"
            content={item?.typeValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: 'auto',
      resize: true,
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <>
          <TextRender
            text={item?.bundleValue}
            data-tooltip-id={`tooltip-${item.id}-bundleValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-bundleValue`}
            place="right"
            content={item?.bundleValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'State',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '12%',
      resize: true,
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '12%',
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => {
        const isBtnDisabled =
          item?.state === 'INVALID' ||
          item?.state === 'VALIDATING' ||
          item?.state === 'DISABLING' ||
          !item?.canWrite ||
          (item?.state === 'DISABLED' &&
            item?.validationStatus === 'INVALID') ||
          !controllerPermissions.includes('edit_controller_services');
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            {controllerPermissions.includes('edit_controller_services') && (
              <>
                <button
                  className="border-0 bg-white"
                  onClick={event => {
                    handleSettingClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={'Settings'}
                  disabled={
                    item?.state === 'ENABLING' ||
                    item?.state === 'ENABLED' ||
                    !item?.canWrite
                  }
                  style={{
                    opacity:
                      item?.state === 'ENABLING' ||
                      item?.state === 'ENABLED' ||
                      !item?.canWrite
                        ? 0.3
                        : 1,
                    cursor:
                      item?.state === 'ENABLING' ||
                      item?.state === 'ENABLED' ||
                      !item?.canWrite
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  <SettingSmallIcon />
                </button>
                <ReactTooltip
                  id={'Settings'}
                  place="left"
                  content={'Settings'}
                  style={{
                    width: '130px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
            {
              <>
                <button
                  disabled={isBtnDisabled}
                  style={{ opacity: isBtnDisabled ? 0.3 : 1 }}
                  className="border-0 bg-white ms-1"
                  onClick={event => {
                    handleEnableClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={item?.id}
                >
                  {item?.state !== 'DISABLED' ? (
                    <FlashCutIcon />
                  ) : (
                    <FlashIcon />
                  )}
                </button>
                {!isBtnDisabled && (
                  <ReactTooltip
                    id={item?.id}
                    place="left"
                    content={item?.state !== 'DISABLED' ? 'Disable' : 'Enable'}
                    style={{
                      width: '130px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  />
                )}
              </>
            }
            {item?.state != 'ENABLED' &&
              item?.state != 'ENABLING' &&
              item?.state != 'DISABLING' &&
              controllerPermissions.includes('delete_controller_services') && (
                <>
                  <button
                    className="border-0 bg-white ms-1"
                    onClick={event => {
                      handleDeleteClick(item);
                      event.currentTarget.blur();
                    }}
                    data-tooltip-id={'Delete'}
                    disabled={!item?.canWrite}
                    style={{ opacity: !item?.canWrite ? 0.3 : 1 }}
                  >
                    <DeleteSmallIcon color="black" height="28" />
                  </button>
                  <ReactTooltip
                    id={'Delete'}
                    place="left"
                    content={'Delete'}
                    style={{
                      width: '130px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  />
                </>
              )}

            {(item?.state === 'ENABLING' || item?.state === 'DISABLING') && (
              <>
                <button
                  className={`border-0 bg-white ms-1 ${refreshingRowId === item?.id || refreshingRowId === item?.updatedValue ? 'mt-2' : ''}`}
                  onClick={event => {
                    handleRefreshClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={'Refresh'}
                  disabled={refreshingRowId === item.id}
                >
                  {refreshingRowId === item.id ? (
                    <div>
                      <Spinner size={20} color={theme.colors.primary} />
                    </div>
                  ) : (
                    <RefreshIcon color="black" height="28" />
                  )}
                </button>
                <ReactTooltip
                  id={'Refresh'}
                  place="left"
                  content={'Refresh'}
                  style={{
                    width: '130px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
          </div>
        );
      },
      width: '11%',
      resize: true,
    },
  ];
  useEffect(() => {
    dispatch(NamespacesActions.getRootControllerServiceNamespace([]));
  }, []);
  useEffect(() => {
    if (!modalOpenState && selectedCluster?.value) {
      dispatch(NamespacesActions.getControllerServiceList());
    }
  }, [dispatch, modalOpenState, selectedCluster]);

  const handleSettingClick = item => {
    const filteredData = isEmpty(item?.properties)
      ? []
      : item?.properties
          ?.filter(
            item =>
              isEmpty(item?.dependencies) ||
              item?.dependencies?.every(dep =>
                item?.properties?.some(
                  obj =>
                    obj?.name === dep?.propertyName &&
                    dep?.dependentValues?.includes(obj?.value)
                )
              )
          )
          .map(item => ({
            ...item,
            old_val: item?.value,
          }));
    setSelectedItemFromList(item);
    setListPropertTableData(filteredData);
    const properties = item?.properties?.map(item => ({
      ...item,
      old_val: item?.value,
    }));
    setReferenceListPropertyTableData(properties);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    setUpdatedData([]);
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit({
      ...item,
      check: item?.value === '' ? true : false,
      value: item?.sensitive ? null : item?.value,
    });
  };

  const handleRefresh = () => {
    if (selectedCluster?.value && !isEmpty(selectedCluster?.value)) {
      setSearch('');
      setSearchErrorMsg({});
      setSearchText('');
      dispatch(NamespacesActions.getControllerServiceList());
    }
  };

  const statusLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'changeStatusControllerService')
  );
  return (
    <>
      <FullPageLoader loading={statusLoading || loading} />

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <HeadingStyle>Controller Services List</HeadingStyle>
          </div>
        </div>
        {controllerPermissions.includes('add_controller_services') && (
          <div className="mb-2 d-flex align-items-center">
            <Button
              isBtnDisable={!isUserCanWrite}
              type="button"
              size={'md'}
              onClick={() =>
                dispatch(NamespacesActions.setIsAddControllerServiceModal(true))
              }
            >
              Add
            </Button>
            <RefreshIocnPanel
              onClick={handleRefresh}
              style={{
                opacity: 1,
                minWidth: '37px',
                cursor:
                  selectedCluster?.value && !isEmpty(selectedCluster?.value)
                    ? 'pointer'
                    : 'not-allowed',
              }}
              data-tooltip-id={`tooltip-group-namespace-refresh`}
            >
              <RefreshIcon
                style={{
                  cursor:
                    selectedCluster?.value && !isEmpty(selectedCluster?.value)
                      ? 'pointer'
                      : 'not-allowed',
                }}
              />
            </RefreshIocnPanel>
            {
              <ReactTooltip
                id={`tooltip-group-namespace-refresh`}
                place="left"
                content={
                  !(selectedCluster?.value && !isEmpty(selectedCluster?.value))
                    ? 'Login to the cluster'
                    : 'Refresh'
                }
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            }
          </div>
        )}
      </div>

      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={searchText}
          placeholder="Search Controller Service by Name"
          onChange={e => {
            setIsResetNotRequired(false);
            const value = e.target.value;
            setSearchText(value);
            setSearchErrorMsg({
              search: {
                message: SEARCH_INPUT_ERROR,
              },
            });
            if (
              value.length <= 100 &&
              (value.length >= 2 || value?.length === 0)
            ) {
              setSearchErrorMsg({});
              setSearch(value);
            }
          }}
        />
      </SearchContainer>
      <FieldErrorMessage
        name="search"
        errors={searchErrorMsg}
        className={'mb-1'}
      />
      <AddControllerServiceModal />

      <Table
        showPagination={true}
        data={filteredModulesData}
        columns={COLUMNS}
        controllerModule={true}
        csList={true}
        isResetNotRequired={isResetNotRequired}
      />
      <ConfigControllerService
        isOpen={isListProprtyModel}
        onClose={handleCloseModal}
        selectedItemFromList={selectedItemFromList}
        handleAddValueModal={handleAddValueModal}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        updatedData={updatedData}
        setUpdatedData={setUpdatedData}
        referenceListPropertyTableData={referenceListPropertyTableData}
        setReferenceListPropertyTableData={setReferenceListPropertyTableData}
      />
      <AddProperties
        isOpen={isAddpropertiesModalOpen}
        onClose={() => {
          setIsAddpropertiesModalOpen(false);
          dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
        }}
        selectedPropertyToEdit={selectedPropertyToEdit}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setIsAddpropertiesModalOpen={setIsAddpropertiesModalOpen}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
        setReferenceListPropertyTableData={setReferenceListPropertyTableData}
      />
      <PropertyDropdownModal
        selectedItemFromList={selectedItemFromList}
        selectedPropertyToEdit={selectedPropertyToEdit}
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
        referenceListPropertyTableData={referenceListPropertyTableData}
        setReferenceListPropertyTableData={setReferenceListPropertyTableData}
      />
      <ConfigurePropertyModal
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
        selectedItemFromList={selectedItemFromList}
        selectedPropertyToEdit={selectedPropertyToEdit}
        listPropertyTableData={listPropertyTableData}
      />
      <ModalWithIcon
        title={`${selectedItemFromList?.state !== 'DISABLED' && selectedItemFromList?.state !== 'DISABLING' ? 'Disable' : 'Enable'}  : ${selectedItemFromList?.name}`}
        primaryButtonText={
          selectedItemFromList?.state !== 'DISABLED' ? 'Disable' : 'Enable'
        }
        secondaryButtonText="Cancel"
        icon={<ConfirmScheduleDeploymentIcon />}
        isOpen={isEnableModalOpen}
        onRequestClose={() => setIsEnableModalOpen(false)}
        primaryText={`Are you sure you want to ${selectedItemFromList?.state !== 'DISABLED' ? 'disable' : 'enable'} ${selectedItemFromList?.name}?`}
        onSubmit={handleStatusClick}
      />
      <ModalWithIcon
        title={`Delete : ${selectedItemFromList?.name}`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        primaryText={`Are you sure you want to delete ${selectedItemFromList?.name}?`}
        onSubmit={handleDeleteControllerServiceClick}
      />
    </>
  );
};

export default ListControllerService;
