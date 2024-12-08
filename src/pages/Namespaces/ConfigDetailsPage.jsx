import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import ControllerServiceTab from '../ControllerService/ControllerServiceTab';
import VariableTab from './VariableTab';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import ParameterContextTab from './ParameterContextTab';

const TopTitleBar = styled.div`
  height: 37px;
  align-items: center;
  justify-content: space-between !important;
`;
const MainTitleDiv = styled.div`
  gap: 10px;
  align-items: center;
`;
const MainTitleHfour = styled.h4`
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  color: #444445;
  text-transform: capitalize;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;
const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
  }
`;

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
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
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
`;

const ConfigDetailsPage = () => {
  const dispatch = useDispatch();
  const breadcrumbDataOnDeploy = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    { label: 'Registry & Flow Name', path: '/process-group/deployPage' },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details' },
  ];
  const breadcrumbDataOnUpgrade = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details' },
  ];
  const [variableData, setVariableData] = useState([]);
  const [PcData, setPcData] = useState({});
  const [activeTab, setActiveTab] = useState(KDFM.PARAMETER_CONTEXT);
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);

  const handleBackClick = () => {
    history.push('/process-group/flow-details');
  };

  const handleContinue = () => {
    dispatch(NamespacesActions.setRegistryDeployVariable(variableData));
    dispatch(NamespacesActions.setRegistryDeployParameterContext(PcData));
    history.push('/process-group/summary');
  };

  //need to add the components for respective tabs
  const renderContent = () => {
    switch (activeTab) {
      case KDFM.PARAMETER_CONTEXT:
        return <ParameterContextTab PcData={PcData} setPcData={setPcData} />;
      case KDFM.VARIABLES:
        return (
          <VariableTab
            variableData={variableData}
            setVariableData={setVariableData}
          />
        );
      case KDFM.CONTROLLER_SERVICE:
        return <ControllerServiceTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {!isUpgrade ? KDFM.UPGRADE_NAMESPACE : KDFM.DEPLOY_NAMESPACE}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          module="upgrade"
          path={!isUpgrade ? breadcrumbDataOnUpgrade : breadcrumbDataOnDeploy}
        />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <TabWrapper className="nav">
          <Tab
            active={activeTab === KDFM.PARAMETER_CONTEXT}
            onClick={() => setActiveTab(KDFM.PARAMETER_CONTEXT)}
            className="nav-item"
          >
            {KDFM.PARAMETER_CONTEXT}
          </Tab>
          <Tab
            active={activeTab === KDFM.VARIABLES}
            onClick={() => setActiveTab(KDFM.VARIABLES)}
            className="nav-item"
          >
            {KDFM.VARIABLES}{' '}
          </Tab>
          <Tab
            active={activeTab === KDFM.CONTROLLER_SERVICE}
            onClick={() => setActiveTab(KDFM.CONTROLLER_SERVICE)}
            className="nav-item"
          >
            {KDFM.CONTROLLER_SERVICE}{' '}
          </Tab>
        </TabWrapper>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button onClick={handleContinue}>{KDFM.CONTINUE}</Button>
        </BottomButtonDiv>
      </BottomButton>
    </div>
  );
};

export default ConfigDetailsPage;
