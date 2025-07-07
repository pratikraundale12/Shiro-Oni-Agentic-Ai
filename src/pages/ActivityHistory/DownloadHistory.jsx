import React, { useState, useEffect } from 'react';
import { DownloadIcon, TodoIcon } from '../../assets';
import styled from 'styled-components';
import { Table, TextRender } from '../../components';
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
  KDFM,
  MODULE_LIST_MAP,
} from '../../constants';

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

  const COLUMNS_ONE = [
    {
      label: 'Event',
      renderCell: item => <TextRender text={item?.event || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Entity',
      renderCell: item => <TextRender text={item?.entity || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => <TextRender text={item?.status || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Created By',
      renderCell: item => <TextRender text={item.user_name || KDFM.NA} />,
      width: '10%',
      resize: true,
    },
    {
      label: 'Created At',
      renderCell: item => convertDateTime(item?.created_at || 'N/A'),
      width: '20%',
      resize: true,
    },
    {
      label: 'Action',
      renderCell: item => (
        <button onClick={() => console.log('Action clicked for:', item)}>
          <DownloadIcon color="black" />
        </button>
      ),
      width: '10%',
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
      <div className="mt-3">
        <Table
          data={downLoadReport}
          columns={COLUMNS_ONE}
          className={'customTable'}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default DownloadHistory;
