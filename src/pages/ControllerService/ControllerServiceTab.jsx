import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { SettingSmallIcon } from '../../assets';
import { Table } from '../../components';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import Collapsible from '../Namespaces/Collapsible';
import ConfigurePage from './ConfigurePage';
import NewAddControllerService from './NewAddControllerService';

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
const ConfigureButton = styled.button`
  padding: 5px 10px;
  background-color: #ff7a00;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ff7a00;
  }
`;

const ControllerServiceTab = () => {
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const registryAllDetails = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  console.log(
    registryAllDetails?.controllerServicesData?.externalControllerServices?.[0]
      .name,
    'registryAllDetails'
  );
  const localServicesdata =
    registryAllDetails?.controllerServicesData?.localServices?.map(
      service => service?.controllerService
    );

  console.log(localServicesdata, 'localServicesdata');

  const controllerServicesData =
    registryAllDetails?.controllerServicesData?.externalControllerServices;

  const COLUMNS = [
    { label: 'Name', renderCell: item => item?.name, width: '21%' },
    { label: 'Type', renderCell: item => item?.typeValue, width: '20%' },
    { label: 'Bundle', renderCell: item => item?.bundleValue, width: '18%' },
    { label: 'State', renderCell: item => item?.state, width: '16%' },
    { label: 'Scope', renderCell: item => item?.scope, width: '11%' },
    {
      label: 'Action',
      renderCell: item => (
        <ConfigureButton onClick={() => handleConfigure(item)}>
          Configure
        </ConfigureButton>
      ),
      width: '14%',
    },
  ];
  const COLUMNS_2 = [
    {
      label: 'Name',
      renderCell: item => item?.name || 'N/A',
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => item?.type || 'N/A',
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundleValue || 'N/A',
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => item?.state || 'N/A',
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope || 'N/A',
      width: '11%',
    },
    {
      label: 'Action',
      renderCell: item => (
        <>
          <button
            className="border-0 bg-white"
            // onClick={() => handleSettingClick(item)}
            data-tooltip-id={`Settings-${item?.id}`}
            aria-label="Settings"
          >
            <SettingSmallIcon />
          </button>
          <ReactTooltip
            id={`Settings-${item?.id}`} // Match tooltip ID
            place="left"
            content="Settings"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '14%',
    },
  ];

  const handleConfigure = item => {
    setSelectedService(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleToggle = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const collapsibles = [
    {
      id: 1,
      title: 'External Controller Service',
      content: (
        <Table
          data={controllerServicesData}
          columns={COLUMNS}
          className={'variables-table'}
        />
      ),
    },
    // Dynamically add multiple child entries with logging
    ...(registryAllDetails?.controllerServicesData?.localServices?.map(
      (service, index) => {
        // Log the current service data
        console.log('Service Details:', service, index);

        // Return the collapsible object
        return {
          id: `child-${index + 3}`,
          title: `${service?.processGroupName}`,
          content: (
            <Table
              data={service?.controllerService} // Assuming this is the child data
              columns={COLUMNS_2}
              className={'variables-table'}
            />
          ),
        };
      }
    ) || []),
  ];

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {collapsibles.map((item, index) => (
          <Collapsible
            key={item.id}
            title={item.title}
            isTableOpen={openIndex === index}
            toggleCollapsible={() => handleToggle(index)}
            onBtnClick={() =>
              dispatch(
                NamespacesActions.setIsNewAddControllerServiceModal(true)
              )
            }
          >
            {item.content}
          </Collapsible>
        ))}
      </ScrollSetGrey>

      {isModalOpen && (
        <ConfigurePage
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
      <NewAddControllerService />
    </DataWrapper>
  );
};

export default ControllerServiceTab;
