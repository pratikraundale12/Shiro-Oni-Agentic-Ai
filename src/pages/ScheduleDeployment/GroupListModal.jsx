/*eslint-disable*/
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { LoadingSelectors } from '../../store';
import { Loader, Table } from '../../components';

export const GroupListModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(SchedularSelectors.getisGroupListModalOpen);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const listMembers = useSelector(SchedularSelectors.getListGroupMembers);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchGroupUserData')
  );
  const onRequestClose = () => {
    dispatch(SchedularActions.setIsGroupListModalOpen(false));
    dispatch(SchedularActions.setSelectedSchedule({}));
    dispatch(SchedularActions.setListGroupMembers([]));
  };
  const { handleSubmit } = useForm();
  const capitalizeFirstLetter = text => {
    if (!text) return '';
    text = text.toLowerCase();
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.username,
      width: '50%',
      resize: true,
    },
    {
      label: 'Email',
      renderCell: item => <>{item?.email || 'N/A'}</>,
      width: '50%',
      resize: true,
    },
  ];
  useEffect(() => {
    if (isModalOpen && !isEmpty(selectedSchedule)) {
      dispatch(
        SchedularActions.fetchGroupUserData(selectedSchedule?.approver_group_id)
      );
    }
  }, [isModalOpen, selectedSchedule]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleSubmit(onRequestClose)}
        onSubmit={handleSubmit(onRequestClose)}
        title={`${capitalizeFirstLetter(selectedSchedule?.approver_group)} group members`}
        primaryButtonText="Close"
        contentStyles={{ minWidth: '40%', maxHeight: '50%' }}
        footerAlign="center"
      >
        {loading && <Loader size="lg" />}
        {!isEmpty(listMembers) && (
          <Table
            data={listMembers || []}
            columns={COLUMNS}
            className="variables-table"
          />
        )}
      </Modal>
    </>
  );
};

GroupListModal.propTypes = {
  icon: PropTypes.elementType.isRequired,
  secondaryText: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
  loadingButton: PropTypes.bool,
};
