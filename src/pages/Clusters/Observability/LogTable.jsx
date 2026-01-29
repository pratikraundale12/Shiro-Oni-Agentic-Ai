import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table } from '../../../components';

const TableWrapper = styled.section`
  background: #ffffff;
  border-radius: 6px;
`;

const SeverityText = styled.span`
  font-weight: ${({ severity }) => (severity === 'ERROR' ? 600 : 400)};
`;

const MessageCell = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogTable = ({ data = [] }) => {
  const columns = useMemo(
    () => [
      {
        label: 'Level',
        renderCell: item => (
          <SeverityText severity={item?.severity}>
            {item?.severity || '—'}
          </SeverityText>
        ),
        resize: true,
        width: '12%',
      },
      {
        label: 'Time',
        renderCell: item => <>{item?.formattedTimestamp || '—'}</>,
        resize: true,
        width: '18%',
      },
      {
        label: 'Service',
        renderCell: item => <>{item?.service || '—'}</>,
        resize: true,
        width: '18%',
      },
      {
        label: 'Message',
        renderCell: item => (
          <MessageCell title={item?.message}>
            {item?.message || '—'}
          </MessageCell>
        ),
        resize: true,
        width: '40%',
      },
      {
        label: 'Action',
        renderCell: item => {
          console.log(item);
          return (
            <>
              {item?.level === 'ERROR' || item?.severity === 'ERROR'
                ? 'Solve with AI'
                : ''}
            </>
          );
        },
        resize: true,
        width: '12%',
      },
    ],
    []
  );

  return (
    <TableWrapper>
      <Table columns={columns} data={data} stickyHeader />
    </TableWrapper>
  );
};

LogTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(LogTable);
