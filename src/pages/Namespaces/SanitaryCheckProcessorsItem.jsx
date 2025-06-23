import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { OpenLinkIcon, TagCrossIcon } from '../../assets';
import { Table } from '../../components';
import { theme } from '../../styles';
import Collapsible from './Collapsible';

const TableWrapper = styled.div`
  .td {
    height: auto !important;
  }
`;

const StyledLink = styled.div`
  min-width: 32px;
  min-height: 32px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 0;
  line-height: 1.5;
  min-height: 48px;
`;

const ErrorText = styled.span`
  flex: 1;
  word-break: break-word;
  white-space: normal;
  font-size: 14px;
  color: #374151;
  overflow-wrap: break-word;
  hyphens: auto;
`;

const ProcessorNameCell = styled.div`
  padding: 12px 0;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
  min-height: 48px;
  display: flex;
  align-items: center;
`;

const ProcessorIdCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  min-height: 48px;
`;

const SanityCheckProcessorItem = ({ item = [] }) => {
  const [isOpenTab, setIsOpenTab] = useState(true);

  const COLUMNS = [
    {
      label: 'Processor Name',
      renderCell: item => (
        <ProcessorNameCell>{item?.processorName}</ProcessorNameCell>
      ),
      width: '25%',
      resize: true,
    },
    {
      label: 'Processor Id',
      renderCell: item => (
        <ProcessorIdCell>
          <div
            role="button"
            tabIndex={0}
            style={{
              color: theme.colors.primary,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              wordBreak: 'break-all',
            }}
            onClick={() => window.open(item?.link, '_blank')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open(item?.link, '_blank');
              }
            }}
          >
            {item?.processorId?.length > 20
              ? `${item?.processorId?.substring(0, 20)}...`
              : item?.processorId}
          </div>
          <StyledLink
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => window.open(item?.link, '_blank')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.open(item?.link, '_blank');
              }
            }}
          >
            <OpenLinkIcon />
          </StyledLink>
        </ProcessorIdCell>
      ),
      width: '25%',
      resize: true,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <ErrorMessageContainer>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <TagCrossIcon width={16} height={16} color="#dc2626" />
          </div>
          <ErrorText>{item?.errorMessage}</ErrorText>
        </ErrorMessageContainer>
      ),
      width: '50%',
      resize: true,
    },
  ];

  return (
    <>
      <Collapsible
        title={'Processor'}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        <TableWrapper>
          <Table data={item || []} columns={COLUMNS} />
        </TableWrapper>
      </Collapsible>
    </>
  );
};

SanityCheckProcessorItem.propTypes = {
  item: PropTypes.array,
};

export default SanityCheckProcessorItem;
