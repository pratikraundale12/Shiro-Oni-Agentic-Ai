/* eslint-disable  */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { DeleteSmallIcon, PencilIcon, QRIcons } from '../../assets';
import { Table } from '../../components';
import { KDFM } from '../../constants';
import { Button, InputField, Modal } from '../../shared';
import { NamespacesActions } from '../../store';
import ValueRender from './ValueRender';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

export const ConfigControllerService = ({
  isOpen,
  onClose,
  handleAddValueModal,
  selectedItemFromList,
  listPropertyTableData,
  setListPropertTableData,
  setSelectedPropertyToEdit,
  updatedData,
  setUpdatedData,
  isFromControllerServiceTab,
  handlePropertyUpdate,
  isFromExternalService = false,
  versionList,
  isFromPgDetails = false,
}) => {
  const dispatch = useDispatch();

  const handleDeleteClick = item => {
    const filterData = updatedData.filter(ele => {
      return ele.name != item.name;
    });

    const sortedList = listPropertyTableData.filter(
      element => element.displayName !== item.displayName
    );
    setListPropertTableData(sortedList);
    if (item?.dynamic) {
      setUpdatedData(() => [
        ...filterData,
        {
          name: item?.name,
          value: null,
          sensitive: item?.sensitive || false,
        },
      ]);
    } else {
      const sortedUpdatedList = updatedData.filter(
        element => element.name !== item.displayName
      );
      setUpdatedData(sortedUpdatedList);
    }
    toast.success(KDFM.PROPERTY_DELETED);
  };

  const handleOpenPropertyDropDownModal = item => {
    dispatch(NamespacesActions.setIsAddPropertyDropdownModalOpen(true));
    setSelectedPropertyToEdit(item);
  };

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div className="d-flex">
          <div
            className="mt-1"
            data-tooltip-id={`name-${item?.name}`}
            aria-label={item?.description}
          >
            {item?.displayName || item?.name}
          </div>
          {item?.description && (
            <ReactTooltip
              id={`name-${item?.name}`}
              place="bottom"
              render={() => (
                <div
                  style={{
                    maxWidth: '500px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                >
                  {item?.description && <p>{item?.description}</p>}
                  {item?.expressionLanguageScope && (
                    <p>
                      <strong>Expression Language Scope:</strong>{' '}
                      {item?.expressionLanguageScope}
                    </p>
                  )}
                  {item.hasOwnProperty('sensitive') && (
                    <p>
                      <strong>Sensitive Property:</strong>{' '}
                      {item?.sensitive ? 'true' : 'false'}
                    </p>
                  )}
                </div>
              )}
              style={{
                maxWidth: '500px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                zIndex: 1000, // Ensure tooltip is on top
              }}
            />
          )}
        </div>
      ),
      width: '40%',
    },
    {
      label: 'Value',
      renderCell: item => (
        <ValueRender
          item={item}
          setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        />
      ),
      width: '50%',
    },
    {
      label: 'Action',
      renderCell: item => (
        <div className="d-flex gap-2">
          {(item?.new_added || item.dynamic) && (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleDeleteClick(item)}
            >
              {' '}
              <DeleteSmallIcon color="black" height="28" />
            </div>
          )}
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              !item?.isSelective
                ? handleAddValueModal(item)
                : handleOpenPropertyDropDownModal(item)
            }
          >
            {' '}
            <PencilIcon height="28" />
          </div>
        </div>
      ),
      width: '10%',
    },
  ];

  const { register, handleSubmit, reset } = useForm({});

  const updateProperties = (targetObject, newProperties) => {
    const existingProperties = targetObject.properties || [];
    const updatedProperties = [...existingProperties];
    newProperties.forEach(newProp => {
      const existingPropIndex = updatedProperties.findIndex(
        prop => prop.name === newProp.name
      );

      if (existingPropIndex !== -1) {
        updatedProperties[existingPropIndex] = {
          ...updatedProperties[existingPropIndex],
          ...newProp,
        };
      } else {
        updatedProperties.push(newProp);
      }
    });
    return {
      ...targetObject,
      properties: updatedProperties,
    };
  };
  const handleFormSubmit = data => {
    const resultObject = updatedData.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    const sensitiveNames = updatedData
      .filter(item => item.sensitive === true)
      .map(item => item.name);

    const currentVersion = versionList?.find(
      version =>
        version?.uniqueId ===
        (selectedItemFromList?.id || selectedItemFromList?.updatedValue)
    );
    const payload = {
      id: selectedItemFromList.id || selectedItemFromList?.updatedValue,
      version: currentVersion?.version
        ? currentVersion?.version
        : selectedItemFromList?.version,
      properties: resultObject,
      sensitiveDynamicPropertyNames: sensitiveNames,
      currentState: selectedItemFromList?.state,
      name: data?.name,
      use_service_account: isFromExternalService ? true : false,
    };
    const configPayload = updateProperties(selectedItemFromList, updatedData);
    if (isFromControllerServiceTab && !isFromExternalService) {
      handlePropertyUpdate(configPayload);
      onClose();
    } else {
      dispatch(NamespacesActions.addPropertyControllerService(payload));
      onClose();
      if (!isFromExternalService && !isFromPgDetails) {
        setTimeout(() => {
          dispatch(NamespacesActions.getControllerServiceList());
        }, 500);
      } else if (isFromPgDetails) {
        setTimeout(() => {
          dispatch(
            NamespacesActions.getControllerServiceList({ localOnly: true })
          );
        }, 500);
      }
    }
    setUpdatedData([]);
  };

  useEffect(() => {
    reset({
      name: selectedItemFromList?.name || '',
    });
  }, [reset, isOpen]);
  return (
    <Modal
      title={` ${selectedItemFromList?.name} : Properties`}
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Apply"
      onSubmit={handleSubmit(handleFormSubmit)}
      footerAlign="start"
      contentStyles={{ maxWidth: '60%', maxHeight: '70%' }}
      secondaryButtonText="Back"
    >
      <ModalBody className="modal-body">
        <div className=" row d-flex justify-content-between">
          <div className="col ">
            <InputField
              name="name"
              type="text"
              label="Name"
              icon={<QRIcons />}
              register={register}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            />
          </div>

          <div className=" col-auto mt-4 pt-2">
            <Button
              type="button"
              onClick={() =>
                dispatch(
                  NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(
                    true
                  )
                )
              }
            >
              <div className="h2 mb-0">+</div>
            </Button>
          </div>
        </div>
        <Table
          data={listPropertyTableData || []}
          columns={COLUMNS}
          className="variables-table"
        />
      </ModalBody>
    </Modal>
  );
};

export default ConfigControllerService;
