import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { GridSelectors, NamespacesSelectors } from '../../store';

const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: -1rem;
  margin-left: -1rem;
`;

const UseColXl = styled.div`
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
  @media screen and (min-width: 1200px) {
    &.col-xl-4 {
      flex: 0 0 auto;
      width: 33.33333333%;
    }
  }

  padding-right: 1rem;
  padding-left: 1rem;
`;

const SummaryDetailsHFourTag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #2d343f;
`;
const SummaryDetailsPtag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #7a7a7a;

  & > div {
    display: flex;
    gap: 0.5rem;

    & .summary-clipboard {
      margin-top: -0.5rem;
    }
  }
`;
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
  height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const SummaryDetails = () => {
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );

  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  const localRegistryIdArr = registryData?.filter(
    item => item?.nifiRegistryId === singleNamespaceData?.registryId
  );
  const handleClick = () => {
    if (!singleNamespaceData?.nifiUrl) return;

    const updatedUrl = singleNamespaceData.nifiUrl.endsWith('/nifi')
      ? `${singleNamespaceData.nifiUrl}?processGroupId=${singleNamespaceData?.id}`
      : `${singleNamespaceData.nifiUrl}/nifi?processGroupId=${singleNamespaceData?.id}`;

    window.open(updatedUrl, '_blank');
  };

  const handleRegistryClick = () => {
    if (!registryData?.url) return;
    window.open(registryData.url, '_blank');
  };

  return (
    <DataWrapper className="w-100">
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <RowConfig className=" p-3">
          <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
            <div>
              <SummaryDetailsHFourTag className="mb-2">
                Process Group
              </SummaryDetailsHFourTag>
              <SummaryDetailsPtag className="mb-0">
                {singleNamespaceData?.name || 'N/A'}
              </SummaryDetailsPtag>
            </div>
          </UseColXl>
          <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
            <div>
              <SummaryDetailsHFourTag className="mb-2">
                Flow Name
              </SummaryDetailsHFourTag>
              <SummaryDetailsPtag className="mb-0">
                {singleNamespaceData?.flowName || 'N/A'}
              </SummaryDetailsPtag>
            </div>
          </UseColXl>
          <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
            <div>
              <SummaryDetailsHFourTag className="mb-2">
                Registry URL
              </SummaryDetailsHFourTag>
              <SummaryDetailsPtag
                className="mb-0"
                onClick={handleRegistryClick}
                style={{
                  cursor: 'pointer',
                  color: '#FF7A00',
                  textDecoration: 'underline',
                }}
              >
                <div>
                  <span>
                    {singleNamespaceData?.registryUrl ||
                      localRegistryIdArr?.[0]?.url ||
                      'N/A'}
                  </span>
                </div>
              </SummaryDetailsPtag>
            </div>
          </UseColXl>
          <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
            <div>
              <SummaryDetailsHFourTag className="mb-2">
                NiFi URL
              </SummaryDetailsHFourTag>
              <SummaryDetailsPtag
                className="mb-0"
                onClick={handleClick}
                style={{
                  cursor: 'pointer',
                  color: '#FF7A00',
                  textDecoration: 'underline',
                }}
              >
                {singleNamespaceData?.nifiUrl || 'N/A'}
              </SummaryDetailsPtag>
            </div>
          </UseColXl>
          <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
            <div className="summary-details">
              <SummaryDetailsHFourTag className="mb-2">
                version
              </SummaryDetailsHFourTag>
              <SummaryDetailsPtag className="mb-0">
                {singleNamespaceData?.version || 'N/A'}
              </SummaryDetailsPtag>
            </div>
          </UseColXl>
        </RowConfig>
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default SummaryDetails;
