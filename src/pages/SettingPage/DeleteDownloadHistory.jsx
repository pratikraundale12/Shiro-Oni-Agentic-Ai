import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, DateRangePickerInput, ModalWithIcon } from '../../shared';
import { DeleteDustbinIcon, InfoIcon } from '../../assets';
import { toast } from 'react-toastify';
import { subHours, isAfter } from 'date-fns';
import { useDispatch } from 'react-redux';
import { ActivityHistoryActions } from '../../store/activityHistory';

const Wrapper = styled.div`
  height: 95%;
  padding-bottom: 120px;
`;

const InputFields = styled.div`
  display: flex;
`;

const ButtonText = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 1%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSaveButton = styled(Button)`
  padding-top: 10px;
  margin-top: 30px;
  padding-bottom: 10px;
  width: 150px;
  gap: 10px;
  left: 140px;
`;
const DateRangeWrapper = styled.div`
  font-size: 14px;
  font-weight: 600;
  height: 16px;
  line-height: 16px;
  margin-bottom: 6px;
  padding-top: 2px;
  cursor: default;
`;
const MessageDiv = styled.div`
  font-size: 16px;
  font-weight: 700;
  font-family: 'RED HAT DISPLAY';
`;
const DeleteDownloadHistory = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const dispatch = useDispatch();

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

  const now = new Date();

  const customRanges = [
    {
      label: 'Last 1 hour',
      value: [subHours(now, 1), now],
      placement: 'left',
    },
    {
      label: 'Last 7 Days',
      value: [subHours(now, 24 * 7), now],
      placement: 'left',
    },
    {
      label: 'Last Month',
      value: [subHours(now, 24 * 30), now],
      placement: 'left',
    },
    {
      label: 'Last 6 Months',
      value: [subHours(now, 24 * 30 * 6), now],
      placement: 'left',
    },
  ];

  const handleDateRangeChange = dateRange => {
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      const now = new Date();

      if (isAfter(startDate, now) || isAfter(endDate, now)) {
        toast.error(
          'Future dates are not allowed. Please select a date range up to now.'
        );
        return;
      }

      setSelectedRange(dateRange);
    } else {
      setSelectedRange(null);
    }
  };

  const handleDeleteDateRangeChange = () => {
    setIsDeleteModalOpen(false);
    dispatch(
      ActivityHistoryActions.deleteDownloadReport({
        start_date: selectedRange?.[0]?.toISOString(),
        end_date: selectedRange?.[1]?.toISOString(),
      })
    );
  };

  return (
    <div>
      {' '}
      <Wrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className="-flex justify-content-end me-4">
            <InputFields className="row">
              <MessageDiv className="mb-3">
                Do you want to delete Download History records ?
              </MessageDiv>
              <div className="mb-3 d-flex align-items-center gap-2">
                <InfoIcon color="orange" />
                <span className="ms-2">
                  All{' '}
                  <span style={{ color: 'orange' }}>
                    download history records
                  </span>{' '}
                  within the selected date range will be{' '}
                  <span style={{ color: 'orange' }}>deleted</span> when you
                  proceed with the delete action.
                </span>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                <div className="d-flex align-items-end gap-3">
                  <div className="d-flex align-items-start justify-content-start flex-column">
                    <DateRangeWrapper className="mb-3">
                      {' '}
                      Date Range{' '}
                    </DateRangeWrapper>
                    <DateRangePickerInput
                      value={selectedRange}
                      handleChange={handleDateRangeChange}
                      customRanges={customRanges}
                      showTime={{ format: 'hh:mm A' }}
                      format="YYYY-MM-DD hh:mm A"
                      placeholder={['Start Time', 'End Time']}
                    />
                  </div>
                  <StyledSaveButton
                    type="button"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={!selectedRange}
                  >
                    <ButtonText>Delete</ButtonText>
                  </StyledSaveButton>
                </div>
              </div>
            </InputFields>
          </div>
        </div>

        <ModalWithIcon
          title="Delete Download Activity History"
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          icon={<DeleteDustbinIcon height={125} width={125} color="#444445" />}
          primaryText={`Are you sure you want to delete your download activity history for the period from ${convertDateTime(selectedRange?.[0])} to ${convertDateTime(selectedRange?.[1])}?`}
          secondaryText="This action cannot be undone. Click Confirm to proceed or Cancel to go back."
          isOpen={isDeleteModalOpen}
          onSubmit={handleDeleteDateRangeChange}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          contentStyles={{ maxWidth: '45%', maxHeight: '80%' }}
        />
      </Wrapper>
    </div>
  );
};

export default DeleteDownloadHistory;
