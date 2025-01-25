import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { KDFM } from '../../constants';
import DiffScheduleVariables from './DiffScheduleVariables';
import DiffScheduleParameter from './DiffScheduleParamter';
import DiffScheduleCS from './DiffScheduleControllerService';
import { theme } from '../../styles';
const GreyBoxNamespace = styled.div`
  padding: 5px 10px 0px 10px;
  border-radius: 20px;
`;

const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;

const TabContent = styled.div`
  width: 100%;
  padding: 0px 0.5rem;
  border-radius: 0.25rem;
`;
const WarningSection = styled.div`
  font-size: 16px;
  // color: ${props => props.theme.colors.primary};
`;
export const DiffModalScheduleList = props => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(KDFM.PARAMETER_CONTEXT);
  const modalOpen = useSelector(SchedularSelectors.getIsDiffModalOpen);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  console.log(scheduleDiffData, 'scheduleDiffData');
  const renderContent = () => {
    switch (activeTab) {
      case KDFM.PARAMETER_CONTEXT:
        return <DiffScheduleParameter />;
      case KDFM.VARIABLES:
        return <DiffScheduleVariables />;
      case KDFM.CONTROLLER_SERVICE:
        return <DiffScheduleCS />;
      default:
        return null;
    }
  };

  const closeModal = () => {
    dispatch(SchedularActions.setDiffAllData({}));
    dispatch(SchedularActions.setIsDiffModalOpen(false));
    setActiveTab(KDFM.PARAMETER_CONTEXT);
  };
  const handleSetTab = tab => {
    setActiveTab(tab);
  };

  return (
    <div {...props}>
      <Modal
        size="lg"
        title={`${selectedSchedule?.namespace_name} : Schedule Deployment Changes`}
        isOpen={modalOpen}
        onRequestClose={closeModal}
        primaryButtonText="Close"
        onSubmit={() => closeModal()}
        footerAlign="start"
        contentStyles={{ minWidth: '65%' }}
        noPadding={true}
      >
        <GreyBoxNamespace className="w-100  mb-3">
          <div className="d-flex" style={{ fontSize: '16px' }}>
            <WarningSection style={{ color: ` ${theme.colors.primary}` }}>
              Version changes &nbsp; : &nbsp;
            </WarningSection>
            V {scheduleDiffData?.previous_version || null} to V
            {scheduleDiffData?.current_version}
          </div>

          <TabWrapper className="nav">
            <Tab
              active={activeTab === KDFM.PARAMETER_CONTEXT}
              onClick={() => handleSetTab(KDFM.PARAMETER_CONTEXT)}
              className="nav-item"
            >
              {KDFM.PARAMETER_CONTEXT}
            </Tab>
            <Tab
              active={activeTab === KDFM.VARIABLES}
              onClick={() => handleSetTab(KDFM.VARIABLES)}
              className="nav-item"
            >
              {KDFM.VARIABLES}{' '}
            </Tab>
            <Tab
              active={activeTab === KDFM.CONTROLLER_SERVICE}
              onClick={() => handleSetTab(KDFM.CONTROLLER_SERVICE)}
              className="nav-item"
            >
              {KDFM.CONTROLLER_SERVICE}{' '}
            </Tab>
          </TabWrapper>
          <TabContent>{renderContent()}</TabContent>
        </GreyBoxNamespace>
      </Modal>
    </div>
  );
};
