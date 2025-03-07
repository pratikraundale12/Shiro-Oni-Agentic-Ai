/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '../../shared';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { useForm } from 'react-hook-form';
import { IconButton, Table } from '../../components';
import { OpenLinkIcon } from '../../assets';

const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;

export const UserStoryModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(SchedularSelectors.getIsUserStoryModalOpen);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const onRequestClose = () => {
    dispatch(SchedularActions.setIsUserStoryModalOpen(false));
  };
  const { handleSubmit } = useForm();
  const renderItems = item => {
    if (item.url) {
      return item?.value ? (
        <div
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
        </div>
      ) : (
        'N/A'
      );
    } else {
      return item?.value || 'N/A';
    }
  };

  const COLUMNS = [
    {
      label: 'Property',
      renderCell: item => item?.title,
      width: '50%',
      resize: true,
    },
    {
      label: 'Value',
      renderCell: item => <>{renderItems(item)}</>,
      width: '50%',
      resize: true,
    },
  ];

  const handleRegistryClick = () => {
    if (!selectedSchedule?.user_story_url) return;
    let url = selectedSchedule?.user_story_url;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
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
      {(selectedSchedule?.change_request ||
        selectedSchedule?.user_story_url) && (
        <Table
          data={[
            {
              title: 'Change Request',
              value: selectedSchedule?.change_request,
              url: false,
            },
            {
              title: 'User Story',
              value: selectedSchedule?.user_story_url,
              url: true,
            },
          ]}
          columns={COLUMNS}
          className="variables-table"
        />
      )}
      {!(
        selectedSchedule?.change_request || selectedSchedule?.user_story_url
      ) && <PrimaryText>No Previous History Available</PrimaryText>}
    </Modal>
  );
};

UserStoryModal.propTypes = {
  icon: PropTypes.elementType.isRequired,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
  loadingButton: PropTypes.bool,
};
