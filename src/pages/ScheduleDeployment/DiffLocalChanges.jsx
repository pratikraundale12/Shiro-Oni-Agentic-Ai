import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SmallSearchIcon, StarInfoIcon } from '../../assets';
import { Table, TextRender } from '../../components';
import { theme } from '../../styles';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { ActivityHistorySelectors } from '../../store/activityHistory';

const TableContainer = styled.div`
  width: 100%;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const NotificationContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(245, 247, 250);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dde4f0;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff7ed;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e4842b;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const MessageText = styled.span`
  color: #374151;
  font-size: 14px;
  white-space: nowrap;
  margin-right: 16px;
`;

const RevertText = styled.span`
  color: #374151;
  font-size: 16px;
  white-space: nowrap;
  margin-right: 16px;
  font-weight: 700;
  font-family: Red Hat Display;
`;
const LinkColor = styled.div`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
`;

const DiffLocalChanges = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const details = useSelector(SchedularSelectors.getScheduleDeploymentDetails);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const schedularId = selectedSchedule?.id;
  const selectedData = useSelector(ActivityHistorySelectors.getSelectedItem);

  useEffect(() => {
    dispatch(
      SchedularActions.fetchScheduleDeploymentDetails(
        schedularId || selectedData?.schedule_id
      )
    );
  }, [dispatch]);

  const handleIdClick = componentLink => {
    window.open(componentLink, '_blank');
  };

  const COLUMNS = [
    {
      label: 'Component Name',
      renderCell: item => <TextRender text={item?.componentName} />,
      width: '25%',
      resize: true,
    },
    {
      label: 'Component ID',
      renderCell: item => (
        <div>
          <>
            <button
              className="border-0 bg-white"
              onClick={() => handleIdClick(item?.componentLink)}
              type="button"
            >
              <LinkColor>{item.componentId}</LinkColor>
            </button>
          </>
        </div>
      ),
      width: '30%',
      resize: true,
    },
    {
      label: 'Change Type',
      renderCell: item => <TextRender text={item?.componentType} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Difference',
      renderCell: item => <TextRender text={item?.difference} />,
      width: '25%',
      resize: true,
    },
  ];

  const filteredData =
    details?.local_changes?.changes?.filter(item =>
      [item.componentName, item.componentType, item.difference].some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];
  const message = details?.revert_local_changes === true ? 'Revert' : 'N/A';

  return (
    <div>
      <div className="d-flex gap-2">
        <NotificationContainer>
          <WarningIcon>
            <StarInfoIcon />
          </WarningIcon>
          <MessageText>Local change detected!</MessageText>
        </NotificationContainer>
        <ActionContainer>
          <RevertText>{message}</RevertText>
        </ActionContainer>
      </div>
      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      <TableContainer>
        <Table
          data={filteredData}
          columns={COLUMNS}
          className="local-changes-table"
        />
      </TableContainer>
    </div>
  );
};

export default DiffLocalChanges;
