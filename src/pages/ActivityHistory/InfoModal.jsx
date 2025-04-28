/*eslint-disable*/
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';
import { OpenLinkIcon } from '../../assets';
import { IconButton, Table } from '../../components';
import { Modal } from '../../shared';
import {
  ActivityHistoryActions,
  ActivityHistorySelectors,
} from '../../store/activityHistory';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { DiffModalScheduleList } from '../ScheduleDeployment/DiffModalSchedule';

export const InfoModalActivityHistory = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(ActivityHistorySelectors.getIsInfoModalOpen);
  const selectedItem = useSelector(ActivityHistorySelectors.getSelectedItem);
  const onRequestClose = () => {
    dispatch(ActivityHistoryActions.setIsInfoModalOpen(false));
  };
  const { handleSubmit } = useForm();
  const renderItems = item => {
    if (item.url) {
      return (
        <span
          onClick={() => handleRegistryClick()}
          style={{
            cursor: 'pointer',
            color: '#FF7A00',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <IconButton>
            <OpenLinkIcon />
          </IconButton>
          {item?.value || 'N/A'}
        </span>
      );
    } else {
      return <span> {item?.value || 'N/A'}</span>;
    }
  };
  const COLUMNS = [
    {
      label: 'Property',
      renderCell: item => item?.title,
      resize: true,
    },
    {
      label: 'Value',
      renderCell: item => (
        <span id="activity-log-detail-value">{renderItems(item)}</span>
      ),
      resize: true,
    },
  ];

  const handleRegistryClick = () => {
    if (!selectedItem?.changes_on_action?.user_story_url) return;

    let url = selectedItem?.changes_on_action?.user_story_url.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    window.open(url, '_blank');
  };
  const modalOpen = useSelector(SchedularSelectors.getIsDiffModalOpen);
  const handleConfigrationDetails = () => {
    dispatch(SchedularActions.setIsDiffModalOpen(true));
    dispatch(SchedularActions.setSelectedSchedule(null));
    dispatch(SchedularActions.fetchDiffScheduleData(selectedItem?.schedule_id));
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleSubmit(onRequestClose)}
        onSubmit={handleSubmit(onRequestClose)}
        title={'Details'}
        primaryButtonText="Close"
        contentStyles={{ minWidth: '60%' }}
        footerAlign="center"
      >
        {selectedItem?.schedule_id && (
          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <a
              onClick={handleConfigrationDetails}
              style={{
                color: '#FF7A00',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.target.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.target.style.textDecoration = 'none')}
            >
              View Configuration Details
            </a>
          </div>
        )}
        {selectedItem && (
          <Table
            data={[
              {
                title: 'Message',
                value: selectedItem?.message,
                url: false,
              },
              ...(selectedItem?.changes_on_action?.change_request
                ? [
                    {
                      title: 'Change Request',
                      value: selectedItem?.changes_on_action?.change_request,
                      url: false,
                    },
                  ]
                : []),
              ...(selectedItem?.changes_on_action?.user_story_url
                ? [
                    {
                      title: 'User Story',
                      value: selectedItem?.changes_on_action?.user_story_url,
                      url: true,
                    },
                  ]
                : []),
            ]}
            columns={COLUMNS}
            className="variables-table"
          />
        )}
      </Modal>
      <DiffModalScheduleList />
    </>
  );
};

InfoModalActivityHistory.propTypes = {
  icon: PropTypes.elementType.isRequired,
  secondaryText: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
  loadingButton: PropTypes.bool,
};
