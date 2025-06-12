import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { ActivityHistorySelectors } from '../../store/activityHistory';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import DiffLocalChanges from './DiffLocalChanges';
import DiffSanityCheck from './DiffSanityCheck';
import DiffScheduleCS from './DiffScheduleControllerService';
import DiffScheduleParameter from './DiffScheduleParamter';
import DiffScheduleVariables from './DiffScheduleVariables';
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

export const DiffModalScheduleList = props => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(KDFM.PARAMETER_CONTEXT);
  const modalOpen = useSelector(SchedularSelectors.getIsDiffModalOpen);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const scheduleDiffData = useSelector(SchedularSelectors.getDiffAllData);
  const selectedItem = useSelector(ActivityHistorySelectors.getSelectedItem);

  const renderContent = () => {
    switch (activeTab) {
      case KDFM.PARAMETER_CONTEXT:
        return (
          <DiffScheduleParameter
            isFromDeploySummary={props?.isFromDeploySummary || false}
            parametersData={props?.parametersData}
          />
        );
      case KDFM.VARIABLES:
        return (
          <DiffScheduleVariables
            isFromDeploySummary={props?.isFromDeploySummary || false}
            variablesData={props?.variablesData}
          />
        );
      case KDFM.CONTROLLER_SERVICE:
        return (
          <DiffScheduleCS
            isFromDeploySummary={props?.isFromDeploySummary || false}
            csData={props?.csData}
          />
        );
      case 'Local Changes':
        return <DiffLocalChanges />;

      case 'Sanity Check':
        return <DiffSanityCheck />;
      default:
        return null;
    }
  };

  const closeModal = () => {
    dispatch(SchedularActions.setDiffAllData({}));
    dispatch(SchedularActions.setIsDiffModalOpen(false));
    props?.setIsModalOpen && props?.setIsModalOpen(false);
    setActiveTab(KDFM.PARAMETER_CONTEXT);
  };
  const handleSetTab = tab => {
    if (tab === 'Sanity Check') {
      setActiveTab(tab);
    } else {
      setActiveTab(tab);
    }
  };
  return (
    <div {...props}>
      <Modal
        size="lg"
        title={
          props?.title ||
          `${selectedSchedule?.namespace_name || selectedItem?.namespace} : Schedule Deployment Changes`
        }
        isOpen={props?.isModalOpen || modalOpen}
        onRequestClose={closeModal}
        primaryButtonText="Close"
        onSubmit={() => closeModal()}
        footerAlign="start"
        contentStyles={{ minWidth: '65%' }}
        noPadding={true}
      >
        <GreyBoxNamespace className="w-100  mb-3">
          <div className="d-flex align-items-center justify-content-end mt-2">
            <div
              className="py-2 d-flex align-items-center gap-2 px-3"
              style={{
                backgroundColor: '#F5F7FA',
                borderRadius: '10px',
                fontSize: '16px',
                border: `1px solid ${theme.colors.primary}`,
                color: '#444445',
              }}
            >
              {props?.versionText || scheduleDiffData?.versionDetailText}
            </div>
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
            <Tab
              active={activeTab === 'Local Changes'}
              onClick={() => handleSetTab('Local Changes')}
              className="nav-item"
            >
              Local Changes
            </Tab>
            {selectedSchedule?.has_sanity_permission && (
              <Tab
                active={activeTab === 'Sanity Check'}
                onClick={() => handleSetTab('Sanity Check')}
                className="nav-item"
              >
                Sanity Check
              </Tab>
            )}
          </TabWrapper>
          <TabContent>{renderContent()}</TabContent>
        </GreyBoxNamespace>
      </Modal>
    </div>
  );
};

DiffModalScheduleList.propTypes = {
  versionText: PropTypes.string,
  title: PropTypes.string,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  isFromDeploySummary: PropTypes.bool,
  parametersData: PropTypes.array,
  variablesData: PropTypes.array,
  csData: PropTypes.array,
};
