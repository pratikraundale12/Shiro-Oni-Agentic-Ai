import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import { Table } from '../../components';
import { TagCrossIcon } from '../../assets';
import styled from 'styled-components';

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

const TableWrapper = styled.div`
  .td {
    height: auto !important;
  }
`;

const SanityCheckControllerServiceItem = ({ item = [] }) => {
  const [isOpenTab, setIsOpenTab] = useState(true);
  const COLUMNS = [
    {
      label: 'Controller Service Name',
      renderCell: item => <div>{item?.controllerServiceName}</div>,
      width: '25%',
      resize: true,
    },
    {
      label: 'Controller Service Type',
      renderCell: item => <div>{item?.controllerServiceType}</div>,
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
        title={'Controller Service'}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        <TableWrapper>
          <Table columns={COLUMNS} data={item} />
        </TableWrapper>
      </Collapsible>
    </>
  );
};
SanityCheckControllerServiceItem.propTypes = {
  item: PropTypes.array,
};
export default SanityCheckControllerServiceItem;
