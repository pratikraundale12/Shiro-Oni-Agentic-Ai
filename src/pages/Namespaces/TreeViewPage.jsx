import React from 'react';
import TreeViewWrapper from './TreeViewWrapper';
import styled from 'styled-components';
import { KDFM } from '../../constants';
import { useSelector } from 'react-redux';
import { GridSelectors, NamespacesSelectors } from '../../store';
import Breadcrumb from '../../shared/Breadcrumb';

const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
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

const TreeViewPage = () => {
  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
  ];
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, 'namespaces')
  );
  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  return (
    <div>
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
            {selectedNamespace?.name || ''}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <TreeViewWrapper
        hideRootNode={false}
        enableHoverApi={true}
        enableSearch={true}
        showPathInSuggestions={true}
      />
    </div>
  );
};
export default TreeViewPage;
