/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '../../shared';
import { useForm } from 'react-hook-form';
import { IconButton, Table } from '../../components';
import { OpenLinkIcon } from '../../assets';
import {
  ActivityHistoryActions,
  ActivityHistorySelectors,
} from '../../store/activityHistory';

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
      renderCell: item => <span id='activity-log-detail-value'>{renderItems(item)}</span>,
      resize: true,
    },
  ];

  const handleRegistryClick = () => {
    if (!selectedItem?.changes_on_action?.user_story_url) return;
    window.open(selectedItem?.changes_on_action?.user_story_url, '_blank');
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleSubmit(onRequestClose)}
      onSubmit={handleSubmit(onRequestClose)}
      title={'Details'}
      primaryButtonText="Close"
      contentStyles={{ minWidth: '60%' }}
      footerAlign="center"
    >
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
