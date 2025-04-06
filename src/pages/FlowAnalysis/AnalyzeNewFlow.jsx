import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { OpenLinkIcon } from '../../assets';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { InputField, Modal, PasswordField } from '../../shared';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';

const AnalyzeNewFlow = () => {
  const dispatch = useDispatch();

  const isAnalysisModalOpen = useSelector(
    FlowValidationSelectors.getAddNewAnalysisModalOpen
  );

  const onCloseModal = () => {
    dispatch(FlowValidationActions.addNewAnalysisModalOpen(false));
  };

  const { register, handleSubmit, watch } = useForm();

  const onSubmit = data => {
    const payload = {
      generate_var_list: true,
      cluster_url: data.cluster_url,
      username: data.username,
      password: data.password,
      namespaceId: data.namespaceId,
    };
    dispatch(FlowValidationActions.validateRandomFlow(payload));
  };

  return (
    <div>
      <Modal
        title={FLOWVALIDATION_CONSTANTS.ANALYZE_NEW_FLOW}
        isOpen={isAnalysisModalOpen}
        onRequestClose={onCloseModal}
        size="md"
        primaryButtonText={FLOWVALIDATION_CONSTANTS.SAVE}
        secondaryButtonText={FLOWVALIDATION_CONSTANTS.CANCEL}
        onSubmit={handleSubmit(onSubmit)}
        contentStyles={{ minWidth: '30%' }}
      >
        <InputField
          name="cluster_url"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.NIFI_CLUSTER_URL}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_YOUR_CLUSTER_URL}
          icon={<OpenLinkIcon color="#444445" />}
          register={register}
        />
        <InputField
          name="username"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.USERNAME}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_YOUR_USERNAME}
          icon={<OpenLinkIcon color="#444445" />}
          register={register}
        />
        <PasswordField
          name="password"
          register={register}
          watch={watch}
          label={FLOWVALIDATION_CONSTANTS.PASSWORD}
        />
        <InputField
          name="namespaceId"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.PROCESS_GROUP_ID}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_YOUR_PROCESS_GROUP_ID}
          icon={<OpenLinkIcon color="#444445" />}
          register={register}
        />
      </Modal>
    </div>
  );
};

export default AnalyzeNewFlow;
