import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table } from '../../../components';
import { useDispatch } from 'react-redux';
import { AgenticAiActions } from '../../../store';
import { SolveWithAiIcon } from '../../../assets';

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

const SolveWithAiButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 6px;
  border: none;

  background-color: #ff7a00;
  color: #ffffff;

  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  transition: background-color 0.15s ease;

  &:hover {
    background-color: #e66d01;
  }

  &:active {
    background-color: #cc5f01;
  }

  &:focus {
    outline: none;
  }
`;

const LogTable = ({ data = [] }) => {
  const dispatch = useDispatch();
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
              <SolveWithAiButton
                onClick={() => {
                  dispatch(
                    AgenticAiActions.setQueryText(
                      `resolve the error: ${item.message}`
                    )
                  );
                  dispatch(AgenticAiActions.setAgenticAiModalOpen(true));
                }}
              >
                <span>
                  <SolveWithAiIcon height={15} width={15} />
                </span>
                <span>Solve with AI</span>
              </SolveWithAiButton>
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
