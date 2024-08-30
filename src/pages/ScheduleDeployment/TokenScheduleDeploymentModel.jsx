import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import {
  ClustersActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import styled from 'styled-components';
import { CalendarIcon, DownArrowIcon } from '../../assets';
import DatePicker from 'react-datepicker';

const Container = styled.div`
  height: 350px;
`;
const DateContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  // height: 250px;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  & .date-picker-icon-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 4px;

    & path {
      fill: ${props => props.theme.colors.darker};
    }
  }

  & .date-picker-icon {
    position: absolute;
    top: 2px;
    left: 2px;
    bottom: 2px;
    z-index: 1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.lightGrey};

    &.arrow-down {
      right: 2px;
      left: auto;
      background-color: ${props => props.theme.colors.white};
    }
  }

  & .date-picker-wrapper {
    display: flex;
    flex: 1;

    & input {
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px;

      &:focus-visible {
        outline: none;
      }

      &:hover {
        border: 1px solid ${props => props.theme.colors.darker};
      }

      &:focus {
        border: 1px solid ${props => props.theme.colors.darker};
      }
    }
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 54px;
  padding-left: 3.5rem;

  &::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
`;
export const TokenScheduleDeploymentConfirmationModel = ({
  scheduleInitialOpen,
  handleContinue = () => {},
  loadingButton,
  handleDecline = () => {},
  handleCloseModel = () => {},
  dateToken,
  setDateToken,
}) => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const closeModal = () => {
    handleCloseModel();
  };
  const handleDateChange = date => {
    setDateToken(date);
  };

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(NamespacesActions.fetchNamespaces());
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(SchedularActions.fetchNamespaces(selectedCluster?.value));
    }
  }, [selectedCluster, dispatch]);

  return (
    <div>
      <Modal
        size="md"
        title={'Schedule Deployment'}
        isOpen={scheduleInitialOpen}
        onRequestClose={closeModal}
        secondaryButtonText="Decline"
        primaryButtonText="Approve"
        // primaryButtonDisabled={disableButton}
        onSubmit={handleContinue}
        footerAlign="start"
        contentStyles={{ minWidth: '45%' }}
        loading={loadingButton}
        onSecondarySubmit={handleDecline}
      >
        <Container>
          <div className="row">
            <div className="col-12">
              <DateContainer>
                {
                  <label className="mb-2">
                    Deploy Time
                    {<span className="required">&nbsp;*</span>}
                  </label>
                }
                <div className="date-picker-icon-wrapper">
                  <div className="date-picker-icon">
                    <CalendarIcon />
                  </div>
                  <StyledDatePicker
                    selected={dateToken}
                    onChange={date => handleDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    wrapperClassName="date-picker-wrapper"
                    popperPlacement="bottom-start"
                  />
                  <div className="date-picker-icon arrow-down">
                    <DownArrowIcon />
                  </div>
                </div>
              </DateContainer>
            </div>
          </div>
        </Container>
      </Modal>
    </div>
  );
};
TokenScheduleDeploymentConfirmationModel.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  scheduleInitialOpen: PropTypes.bool,
  setScheduleInitialOpen: PropTypes.func,
  handleContinue: PropTypes.func,
  dateToken: PropTypes.string.isRequired,
  setDateToken: PropTypes.func.isRequired,
  showButton: PropTypes.bool,
  loadingButton: PropTypes.bool,
  handleDecline: PropTypes.func,
  handleCloseModel: PropTypes.func,
};
