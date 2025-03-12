/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { Modal } from '../../../shared';
import { KDFM } from '../../../constants';

const Container = styled.div``;

export const AddHostIPModal = () => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector(ClustersSelectors.getIsAddHostIPModalOpen);
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddHostIPModalOpen(false));
  };
  const { handleSubmit } = useForm();
  const handleContinueSubmit = () => {};

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      onSubmit={handleSubmit(handleContinueSubmit)}
      title={KDFM.NEW_CLUSTER}
      primaryButtonText="Continue"
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '32%' }}
      footerAlign="start"
    >
      <Container></Container>
    </Modal>
  );
};
