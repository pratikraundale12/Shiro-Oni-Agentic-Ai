import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import Breadcrumb from '../../shared/Breadcrumb';
import { LoadingSelectors, NamespacesSelectors } from '../../store';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';
import { isEmpty } from 'lodash';

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

const TabContent = styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
`;
const DataWrapper = styled.div`
  width: 100%;
  height: 620px;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
  overflow-y: auto;
`;
const BackButtonContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  color: ${props => props.theme.colors.darker};
  padding-bottom: 0.8rem;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const SummarySanityCheck = () => {
  const selectedNamespaceForDetail = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const sanityCheckData = useSelector(
    NamespacesSelectors.getSanityCheckDetailSectionData
  );

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchSanityCheckSummaryData')
  );

  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    {
      label: 'Process Group Details',
      path: `/process-group/${selectedNamespaceForDetail?.id}`,
    },
    { label: 'Sanity Check Details' },
  ];

  return (
    <div>
      <FullPageLoader loading={loading} />

      <BackButtonContainer>
        <BackButton>
          <TodoIcon />
          <span>Sanity Check Details</span>
        </BackButton>{' '}
      </BackButtonContainer>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb module="upgrade" path={breadcrumbData} />
      </BreadcrumbContainer>

      <GreyBoxNamespace className="w-100  mb-3">
        <TabContent>
          <DataWrapper className="w-100">
            {sanityCheckData &&
              !isEmpty(sanityCheckData) &&
              sanityCheckData?.map(item => (
                <span key={item?.processGroupId}>
                  <SanityCheckCollapsableItem item={item} />
                </span>
              ))}
            {isEmpty(sanityCheckData) && (
              <div className="d-flex flex-column align-items-center mt-5">
                <NoDataText>
                  Sanity check has been performed successfully, with no issues
                  detected
                </NoDataText>
              </div>
            )}
          </DataWrapper>
        </TabContent>
      </GreyBoxNamespace>
    </div>
  );
};

export default SummarySanityCheck;
