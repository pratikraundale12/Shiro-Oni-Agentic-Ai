import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  AuditLogIcon,
  ControllerServicesIcon,
  FlowControlIcon,
  ParameterContextIcon,
  SanityCheckIcon,
  SummaryIcon,
  VariablesIcon,
} from '../../assets';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  ClustersActions,
  ClustersSelectors,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import AuditLog from './AuditLog';
import FlowControl from './FlowControl';
import ListControllerService from './ListControllerServiceNamespace';
import ListVariables from './Listvariables';
import ParameterContext from './ParameterContext';
import SummaryDetails from './SummaryDetails';
import SanityVerifictionReport from './SanityVerifictionReport';
import { isEmpty } from 'lodash';

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
const BreadcrumbItem = styled.span`
  cursor: pointer;
  font-size: 16px;
  &::after {
    content: '>';
    padding: 0 8px;
    text-decoration: none;
  }

  &:last-child::after {
    content: '';
  }

  &:last-child {
    color: #ff7a00;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const IconContent = styled.div`
  display: inline;
  margin-right: 6px;

  svg path {
    transition: stroke 0.3s;
  }

  ${Tab}:hover & svg path {
    fill: rgba(255, 122, 0, 1);
  }
`;

const IconContentV2 = styled.div`
  display: inline;
  margin-right: 6px;

  svg path {
    transition: stroke 0.3s;
  }

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
`;

const ConfigDetailsPage = () => {
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );
  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
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
  const [activeTab, setActiveTab] = useState('Summary');
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(NamespacesActions.setSourceNamespaceId(id));
    dispatch(NamespacesActions.singleNamespaceData(id));
  }, [id]);
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, 'namespaces')
  );

  const selectedClusterMethod = useSelector(
    NamespacesSelectors.getSelectedCluster
  );
  useEffect(() => {
    if (!isEmpty(selectedClusterMethod?.value)) {
      dispatch(ClustersActions.fetchClusters());
    }
  }, [dispatch, selectedClusterMethod]);
  const clusters_new_list = useSelector(ClustersSelectors.getAllClustersList);
  const matchedCluster = clusters_new_list.find(
    cluster => cluster.id === selectedClusterMethod?.value
  );
  const hasSanityCheckAccess = matchedCluster?.view_sanity_check;

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'singleNamespaceData')
  );

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
            fromSummaryDetails={true}
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
        return <ListControllerService />;

      case 'Audit Log':
        return <AuditLog />;
      case 'Sanity Verification Report':
        return <SanityVerifictionReport />;
      default:
        return null;
    }
  };
  const isParentEdit = useSelector(NamespacesSelectors.getParameterEditParent);
  return (
    <div>
      <FullPageLoader loading={loading} />
      {breadcrumbs.length === 1 && (
        <BreadcrumbContainer className="d-flex  mb-3">
          <BreadcrumbItem onClick={() => history.push(`/process-group`)}>
            {KDFM.NIFI_FLOW}
          </BreadcrumbItem>
          <Breadcrumb module="upgrade" path={breadcrumbData} />
        </BreadcrumbContainer>
      )}
      <BreadcrumbContainer className="mb-3 ps-1">
        <Breadcrumb module={'namespaces'} fromDetailPage={true} />
      </BreadcrumbContainer>
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <MainTitleHfour className="mb-0">
            {KDFM.PROCESS_GROUP_DETAILS} : &nbsp;
            {singleNamespaceData?.name || ''}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <GreyBoxNamespace className="w-100  mb-3">
        <TabWrapper className="nav">
          <Tab
            active={activeTab === 'Summary'}
            onClick={() => setActiveTab('Summary')}
            className="nav-item"
          >
            <IconContent className="nav-item">
              <SummaryIcon
                color={activeTab === 'Summary' ? '#FF7A00' : '#444445'}
              />
            </IconContent>
            {KDFM.SUMMARY}
          </Tab>
          <Tab
            active={activeTab === 'Flow Control'}
            onClick={() => setActiveTab('Flow Control')}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <FlowControlIcon
                color={activeTab === 'Flow Control' ? '#FF7A00' : '#444445'}
              />
            </IconContentV2>
            Flow Control
          </Tab>
          <Tab
            active={activeTab === KDFM.PARAMETER_CONTEXT}
            onClick={() => {
              setActiveTab(KDFM.PARAMETER_CONTEXT);
              if (isParentEdit?.parent) {
                dispatch(
                  NamespacesActions.setParameterEditParent({
                    parent: false,
                    id: '',
                  })
                );
              }
            }}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <ParameterContextIcon
                color={
                  activeTab === `${KDFM.PARAMETER_CONTEXT}`
                    ? '#FF7A00'
                    : '#444445'
                }
              />
            </IconContentV2>
            {KDFM.PARAMETER_CONTEXT}
          </Tab>
          <Tab
            active={activeTab === KDFM.VARIABLES}
            onClick={() => setActiveTab(KDFM.VARIABLES)}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <VariablesIcon
                color={
                  activeTab === `${KDFM.VARIABLES}` ? '#FF7A00' : '#444445'
                }
              />
            </IconContentV2>
            {KDFM.VARIABLES}
          </Tab>
          <Tab
            active={activeTab === KDFM.CONTROLLER_SERVICE}
            onClick={() => setActiveTab(KDFM.CONTROLLER_SERVICE)}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <ControllerServicesIcon
                color={
                  activeTab === `${KDFM.CONTROLLER_SERVICE}`
                    ? '#FF7A00'
                    : '#444445'
                }
              />
            </IconContentV2>
            {KDFM.CONTROLLER_SERVICE}{' '}
          </Tab>
          <Tab
            active={activeTab === 'Audit Log'}
            onClick={() => setActiveTab('Audit Log')}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <AuditLogIcon
                color={activeTab === 'Audit Log' ? '#FF7A00' : '#444445'}
              />
            </IconContentV2>
            Audit Log
          </Tab>

          {hasSanityCheckAccess === true && (
            <Tab
              active={activeTab === 'Sanity Verification Report'}
              onClick={() => setActiveTab('Sanity Verification Report')}
              className="nav-item"
            >
              <IconContentV2 className="nav-item">
                <SanityCheckIcon
                  height="20"
                  width="20"
                  color={
                    activeTab === 'Sanity Verification Report'
                      ? '#FF7A00'
                      : '#444445'
                  }
                />
              </IconContentV2>
              Sanity Verification Report
            </Tab>
          )}
        </TabWrapper>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
    </div>
  );
};

export default ConfigDetailsPage;
