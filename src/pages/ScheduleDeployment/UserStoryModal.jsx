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
import { Table } from '../../components';

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

  const COLUMNS = [
    {
      label: 'Property',
      renderCell: item => item?.title,
      width: '50%',
      resize: true,
    },
    {
      label: 'Value',
      renderCell: item => <>{item?.value || 'N/A'}</>,
      width: '50%',
      resize: true,
    },
  ];
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleSubmit(onRequestClose)}
      onSubmit={handleSubmit(onRequestClose)}
      title={'Info'}
      primaryButtonText="Close"
      contentStyles={{ minWidth: '40%' }}
      footerAlign="center"
    >
      {(selectedSchedule?.change_request ||
        selectedSchedule?.user_story_url) && (
        <Table
          data={[
            {
              title: 'Change Request',
              value: selectedSchedule?.change_request,
            },
            { title: 'User Story', value: selectedSchedule?.user_story_url },
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
