import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { CircleArrowIcon, SmallSearchIcon, StarInfoIcon } from '../../assets';
import { Table, TextRender } from '../../components';
import { theme } from '../../styles';
// import { NamespacesActions, NamespacesSelectors } from '../../store';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { GridSelectors } from '../../store';

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
  border: 1px solid #ea580c;
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

const DiffLocalChanges = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const details = useSelector(SchedularSelectors.getScheduleDeploymentDetails);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const schedularId = selectedSchedule?.id;
  const getNifiUrl = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  useEffect(() => {
    dispatch(SchedularActions.fetchScheduleDeploymentDetails(schedularId));
  }, [dispatch]);

  const handleIdClick = componentLink => {
    const updatedUrl = getNifiUrl?.nifiUrl?.endsWith('/nifi')
      ? `${getNifiUrl?.nifiUrl}${componentLink}`
      : `${getNifiUrl?.nifiUrl}/nifi/${componentLink}`;
    window.open(updatedUrl, '_blank');
    if (updatedUrl) {
      window.open(updatedUrl, '_blank');
    }
  };

  const COLUMNS = [
    {
      label: 'Component Name',
      renderCell: item => <TextRender text={item.componentName} />,
      width: '30%',
      resize: true,
    },
    {
      label: 'Change Type',
      renderCell: item => <TextRender text={item.componentType} />,
      width: '30%',
      resize: true,
    },
    {
      label: 'Difference',
      renderCell: item => <TextRender text={item.difference} />,
      width: '30%',
      resize: true,
    },
    {
      label: '',
      renderCell: item => (
        <div className="text-center">
          <>
            <button
              className="border-0 bg-white"
              onClick={() => handleIdClick(item?.componentLink)}
            >
              <CircleArrowIcon />
            </button>
          </>
        </div>
      ),
    },
  ];

  const filteredData =
    details?.local_changes?.changes?.filter(item =>
      [item.componentName, item.componentType, item.difference].some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];
  const message =
    'Action Selected : ' +
    (details?.revert_local_changes === true ? 'Revert' : 'N/A');

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
          <MessageText> {message}</MessageText>
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
