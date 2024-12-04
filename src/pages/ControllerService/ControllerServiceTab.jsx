import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Table } from '../../components';
import { NamespacesActions } from '../../store';
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

  const controllerServicesData = [
    {
      id: 1,
      name: 'Service A',
      typeValue: '',
      bundleValue: '',
      state: '',
      scope: '',
    },
    {
      id: 2,
      name: 'Service B',
      typeValue: '',
      bundleValue: '',
      state: '',
      scope: '',
    },
    {
      id: 3,
      name: 'Service C',
      typeValue: '',
      bundleValue: '',
      state: '',
      scope: '',
    },
    {
      id: 4,
      name: 'Service D',
      typeValue: '',
      bundleValue: '',
      state: '',
      scope: '',
    },
  ];

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
    {
      id: 2,
      title: 'Controller Service Flow',
      content: (
        <Table
          data={controllerServicesData}
          columns={COLUMNS}
          className={'variables-table'}
        />
      ),
    },
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
