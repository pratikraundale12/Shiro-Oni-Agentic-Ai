import React from 'react';
import { FullPageLoader, Table } from '../../components';
import styled from 'styled-components';
import { TagCrossIcon, TodoIcon } from '../../assets';
import Breadcrumb from '../../shared/Breadcrumb';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import {
  GridSelectors,
  LoadingSelectors,
  NamespacesSelectors,
} from '../../store';
import { useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useParams } from 'react-router-dom';
import { Button } from '../../shared';

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

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
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

const Container = styled.div`
  width: 100%;
  .customTable {
    height: auto;
  }
  table {
    position: static;
  }
`;
const TooltipList = styled.ul`
  padding-left: 8px;
  margin: 0;
`;

const ErrorMessageContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 400;
  font-size: 15px;
  display: block;
  width: 100%;
  text-align: left;

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const InvalidProcessorDetails = () => {
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, 'namespaces')
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchInvalidProcessorDetails')
  );
  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
  ];
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );
  const invalidProcessorsList = useSelector(
    NamespacesSelectors.getInvalidProcessorDetails
  );

  const COLUMNS = [
    {
      label: KDFM.NAMESPACE,
      renderCell: item => (
        <StyledButton
          key={item.processGroupName}
          tabIndex="0"
          onClick={() => {
            window.open(item?.processGroupLink, '_blank');
          }}
        >
          {item?.processGroupName || 'N/A'}
        </StyledButton>
      ),
      width: '22%',
      resize: true,
    },
    {
      label: KDFM.PROCESSOR_ID,
      renderCell: item => (
        <StyledButton
          key={item.processorId}
          tabIndex="0"
          onClick={() => {
            window.open(item?.processorLink, '_blank');
          }}
        >
          {item?.processorId}
        </StyledButton>
      ),
      width: '23%',
      resize: true,
    },
    {
      label: KDFM.PROCESSOR_NAME,
      renderCell: item => item.processorName || 'N/A',
      width: '23%',
      resize: true,
    },
    {
      label: KDFM.ERROR_MESSAGE,
      renderCell: item => {
        return (
          <ErrorMessageContainer
            data-tooltip-id={`tooltip-${item?.processorId}-errors`}
          >
            <TagCrossIcon color="#FF0000" height={20} width={20} />
            {'  '}
            {item.errorMessage?.length > 1
              ? item.errorMessage?.[0] + '...'
              : item.errorMessage?.[0] || 'N/A'}

            {item.errorMessage?.length > 0 && (
              <ReactTooltip
                id={`tooltip-${item?.processorId}-errors`}
                place="right"
                render={() => (
                  <TooltipList>
                    {item.errorMessage?.map(error => {
                      return <li key={error}>{error}</li>;
                    })}
                  </TooltipList>
                )}
                style={{
                  maxWidth: '500px',
                  whiteSpace: 'normal',
                  zIndex: 9999,
                }}
              />
            )}
          </ErrorMessageContainer>
        );
      },
      width: '32%',
      resize: true,
    },
  ];
  const { id } = useParams();
  const handleBackAction = () => {
    history.push(`/process-group/${id}`);
  };
  return (
    <div className="w-100 h-100 relative">
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
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {KDFM.PROCESS_GROUP_DETAILS} : &nbsp;
            {singleNamespaceData?.name || ''} : &nbsp;
            {KDFM.INVALID_PROCESSOR_DETAILS}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <Container className="col-6">
        <Table
          data={invalidProcessorsList || []}
          columns={COLUMNS}
          className={'customTable'}
          emptyMessage={KDFM.NO_INVALID_PROCESSORS}
        />
      </Container>
      <div style={{ width: '74px', position: 'absolute', bottom: '10px' }}>
        <Button variant="secondary" type="button" onClick={handleBackAction}>
          {KDFM.BACK}
        </Button>
      </div>
    </div>
  );
};

export default InvalidProcessorDetails;
