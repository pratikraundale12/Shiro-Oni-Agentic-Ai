import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table } from '../../../components';
import { useDispatch } from 'react-redux';
import { AgenticAiActions } from '../../../store';
import { CardLogo } from '../../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const TableWrapper = styled.section`
  background: #ffffff;
  border-radius: 6px;
`;

const SeverityText = styled.span`
  font-weight: 600;
  color: ${({ severity }) => SEVERITY_COLORS[severity] || '#000000'};
`;

const MessageCell = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SolveWithAiButton2 = styled.button``;

const SEVERITY_COLORS = {
  INFO: '#42C173',
  WARN: '#F8B827',
  ERROR: '#F21710',
};

const LogTable = ({ data = [] }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        label: 'Time',
        renderCell: item => <>{item?.formattedTimestamp || '—'}</>,
        resize: true,
        width: '18%',
      },
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
          if (item.severity !== 'ERROR') return null;

          return (
            <>
              <SolveWithAiButton2
                onClick={() => {
                  dispatch(
                    AgenticAiActions.setQueryText(
                      `resolve the error: ${item.message}`
                    )
                  );
                  dispatch(AgenticAiActions.setAgenticAiModalOpen(true));
                }}
                data-tooltip-id={'tooltip-id-ask-knowe'}
              >
                <span>
                  <CardLogo
                    width={26}
                    height={26}
                    enableHoverRotation={false}
                  />
                </span>
              </SolveWithAiButton2>
              <ReactTooltip
                id="tooltip-id-ask-knowe"
                place="bottom"
                content="Ask KNOWE"
                style={{
                  zIndex: 9999,
                }}
              />
            </>
          );
        },
        resize: true,
        width: '10%',
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
