import React, { useState, useMemo, useEffect } from 'react';
import { SmallSearchIcon, TodoIcon } from '../../assets';
import { theme } from '../../styles';
import styled from 'styled-components';
import { Table } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityHistoryActions,
  ActivityHistorySelectors,
} from '../../store/activityHistory';
import { useForm } from 'react-hook-form';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  ACTIVITY_EVENTS,
  ACTIVITY_STATUS_OPTIONS,
  MODULE_LIST_MAP,
} from '../../constants';

const SearchContainer = styled.div`
  position: relative;

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
const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const DownloadHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectStatus, setSelectStatus] = useState([]);
  const [selectEvent, setSelectEvent] = useState([]);
  const [selectEntity, setSelectEntity] = useState([]);

  console.log(selectStatus, selectEvent, selectEntity);

  const { control } = useForm();

  const downLoadReport = useSelector(
    ActivityHistorySelectors.getDownloadReportData
  );

  // Handle filter changes
  const handleStatusChange = selectedOptions => {
    setSelectStatus(selectedOptions);
  };

  const handleEventChange = selectedOptions => {
    setSelectEvent(selectedOptions);
  };

  const handleEntityChange = selectedOptions => {
    setSelectEntity(selectedOptions);
  };

  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Filter data based on search term and selected filters
  const filteredData = useMemo(() => {
    if (!downLoadReport) return [];

    let filtered = downLoadReport;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const event = (item?.filters?.event || '').toLowerCase();
        const entity = (item?.filters?.entity || '').toLowerCase();
        const status = (item?.filters?.status || '').toLowerCase();

        return (
          event.includes(searchLower) ||
          entity.includes(searchLower) ||
          status.includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (selectStatus.length > 0) {
      const statusValues = selectStatus.map(s => s.value);
      filtered = filtered.filter(item =>
        statusValues.includes(item?.filters?.status)
      );
    }

    // Apply event filter
    if (selectEvent.length > 0) {
      const eventValues = selectEvent.map(e => e.value);
      filtered = filtered.filter(item =>
        eventValues.includes(item?.filters?.event)
      );
    }

    // Apply entity filter
    if (selectEntity.length > 0) {
      const entityValues = selectEntity.map(e => e.value);
      filtered = filtered.filter(item =>
        entityValues.includes(item?.filters?.entity)
      );
    }

    return filtered;
  }, [downLoadReport, searchTerm, selectStatus, selectEvent, selectEntity]);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const COLUMNS_ONE = [
    {
      label: 'Event',
      renderCell: item => item?.event || 'N/A',
      width: '20%',
      resize: true,
    },
    {
      label: 'Entity',
      renderCell: item => item?.entity || 'N/A',
      width: '20%',
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => item?.status || 'N/A',
      width: '20%',
      resize: true,
    },
    {
      label: 'Created By',
      renderCell: item => item?.user_name || 'N/A',
      width: '20%',
      resize: true,
    },
    {
      label: 'Created At',
      renderCell: item => convertDateTime(item?.created_at || 'N/A'),
      width: '20%',
      resize: true,
    },
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Selected filters:', selectStatus, selectEvent, selectEntity);
    dispatch(
      ActivityHistoryActions.fetchDownloadReport({
        queryParams: {
          status: selectStatus,
          event: selectEvent,
          entity: selectEntity,
        },
      })
    );
  }, [dispatch, selectStatus, selectEvent, selectEntity]);
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <TodoIcon width={22} height={24} />
            <HeadingStyle>Download History</HeadingStyle>
          </div>
        </div>
        {/* Filter Section */}
        <div className="mb-2 d-flex align-items-center">
          <div className="ml-2">
            <MultiSelectField
              name="activityStatus"
              control={control}
              label="Select Status"
              placeholder="Select Status"
              options={ACTIVITY_STATUS_OPTIONS}
              customValue={selectStatus}
              customOnChange={(onChange, selectedOptions) => {
                handleStatusChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
            />
          </div>
          <div className="ml-2">
            <MultiSelectField
              name="activityEvent"
              control={control}
              label="Select Event"
              placeholder="Select Event"
              options={ACTIVITY_EVENTS}
              customValue={selectEvent}
              customOnChange={(onChange, selectedOptions) => {
                handleEventChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
            />
          </div>
          <div className="ml-2">
            <MultiSelectField
              name="entityName"
              control={control}
              label="Select Entity"
              placeholder="Select Entity"
              options={MODULE_LIST_MAP}
              customValue={selectEntity}
              customOnChange={(onChange, selectedOptions) => {
                handleEntityChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
            />
          </div>
        </div>
      </div>

      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          placeholder="Search by Event, Entity, or Status"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      <Table
        data={filteredData}
        columns={COLUMNS_ONE}
        className={'customTable'}
        showPagination={true}
      />
    </div>
  );
};

export default DownloadHistory;
