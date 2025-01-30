import React from 'react';
import styled from 'styled-components';
import { RadioField } from '../../shared';
import { KDFM } from '../../constants';

const StyledTableCell = styled.div`
  cursor: pointer;
  padding: 6px 12px !important;
`;

export const VERSION_COLUMNS = ({
  selectedVersion,
  handleRowClick,
  handleRadioChange,
}) => [
  {
    label: '',
    renderCell: item => (
      <StyledTableCell
        role="button"
        tabIndex="0"
        onClick={() => handleRowClick(item)}
        onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <RadioField
          name="upgrade"
          checked={selectedVersion === item.version}
          onChange={() => {
            handleRadioChange(item);
          }}
        />
      </StyledTableCell>
    ),
    width: '10%',
  },
  {
    label: KDFM.VERSION,
    renderCell: item => (
      <StyledTableCell
        role="button"
        tabIndex="0"
        onClick={() => handleRowClick(item)}
        onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
      >
        {item.version}
      </StyledTableCell>
    ),
    width: '12%',
  },
  {
    label: KDFM.CREATED,
    renderCell: item => (
      <StyledTableCell
        role="button"
        tabIndex="0"
        onClick={() => handleRowClick(item)}
        onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
      >
        {convertDate(item.createdAt)}
      </StyledTableCell>
    ),
    width: '28%',
  },
  {
    label: KDFM.COMMENT,
    renderCell: item => (
      <StyledTableCell
        role="button"
        tabIndex="0"
        onClick={() => handleRowClick(item)}
        onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
      >
        {item.comments}
      </StyledTableCell>
    ),
    width: '50%',
  },
];

const convertDate = dateString => {
  const date = new Date(dateString);

  const pad = num => String(num).padStart(2, '0');

  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};
