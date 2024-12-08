import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import { KDFM } from '../../constants';
import Breadcrumb from '../../shared/Breadcrumb';
import { NamespacesActions } from '../../store';
import ControllerServiceTab from '../ControllerService/ControllerServiceTab';
import AuditLog from './AuditLog';
import FlowControl from './FlowControl';
import ListVariables from './Listvariables';
import ParameterContext from './ParameterContext';
import SummaryDetails from './SummaryDetails';

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
  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    { label: 'Process Group Details', path: '/process-group/deployPage' },
  ];
  const [variablesModalOpen, setVariablesModalOpen] = useState(false);
  const [isAddParameterContextOpen, setIsAddParameterContextOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [isParameterContextOpen, setIsParameterContextOpen] = useState({
    isOpen: false,
    schedule: false,
  });
  // const [PcData, setPcData] = useState({});
  const [activeTab, setActiveTab] = useState('Summary');
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(NamespacesActions.setSourceNamespaceId(id));
    dispatch(NamespacesActions.singleNamespaceData(id));
  }, [id]);

  //need to add the components for respective tabs
  const renderContent = () => {
    switch (activeTab) {
      case 'Summary':
        return <SummaryDetails />;
      case 'Flow Control':
        return <FlowControl />;
      case KDFM.PARAMETER_CONTEXT:
        return (
          <ParameterContext
            setIsAddParameterContextOpen={setIsAddParameterContextOpen}
            isAddParameterContextOpen={isAddParameterContextOpen}
            isParameterContextOpen={isParameterContextOpen}
            setIsParameterContextOpen={setIsParameterContextOpen}
          />
        );
      case KDFM.VARIABLES:
        return (
          <ListVariables
            isOpen={{ isOpen: true }}
            isVariablesModalOpen={variablesModalOpen}
            setVariablesModalOpen={setVariablesModalOpen}
          />
        );
      case KDFM.CONTROLLER_SERVICE:
        return <ControllerServiceTab />;

      case 'Audit Log':
        return <AuditLog />;
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
            {KDFM.DEPLOY_NAMESPACE}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb module="upgrade" path={breadcrumbData} />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <TabWrapper className="nav">
          <Tab
            active={activeTab === 'Summary'}
            onClick={() => setActiveTab('Summary')}
            className="nav-item"
          >
            {KDFM.SUMMARY}
          </Tab>
          <Tab
            active={activeTab === 'Flow Control'}
            onClick={() => setActiveTab('Flow Control')}
            className="nav-item"
          >
            Flow Control
          </Tab>
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
            {KDFM.VARIABLES}
          </Tab>
          <Tab
            active={activeTab === KDFM.CONTROLLER_SERVICE}
            onClick={() => setActiveTab(KDFM.CONTROLLER_SERVICE)}
            className="nav-item"
          >
            {KDFM.CONTROLLER_SERVICE}{' '}
          </Tab>
          <Tab
            active={activeTab === 'Audit Log'}
            onClick={() => setActiveTab('Audit Log')}
            className="nav-item"
          >
            Audit Log
          </Tab>
        </TabWrapper>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
    </div>
  );
};

export default ConfigDetailsPage;
