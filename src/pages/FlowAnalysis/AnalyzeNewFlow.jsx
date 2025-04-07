import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { OpenLinkIcon } from '../../assets';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { InputField, Modal, PasswordField } from '../../shared';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';

const anaLysisSchema = yup.object().shape({
  cluster_url: yup.string().required('Cluster URL is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  namespaceId: yup.string().required('Namespace is required'),
});

const AnalyzeNewFlow = () => {
  const dispatch = useDispatch();

  const isAnalysisModalOpen = useSelector(
    FlowValidationSelectors.getAddNewAnalysisModalOpen
  );

  const onCloseModal = () => {
    dispatch(FlowValidationActions.addNewAnalysisModalOpen(false));
  };

  useEffect(() => {
    dispatch(FlowValidationActions.savePayload(null));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(anaLysisSchema),
  });

  const onSubmit = data => {
    const payload = {
      generate_var_list: true,
      cluster_url: data.cluster_url,
      username: data.username,
      password: data.password,
      namespaceId: data.namespaceId,
    };

    dispatch(FlowValidationActions.savePayload(payload));
    history.push('/flow-analysis/flow-validation');
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
          required
          errors={errors}
        />
        <InputField
          name="username"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.USERNAME}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_YOUR_USERNAME}
          icon={<OpenLinkIcon color="#444445" />}
          register={register}
          required
          errors={errors}
        />
        <PasswordField
          name="password"
          register={register}
          watch={watch}
          label={FLOWVALIDATION_CONSTANTS.PASSWORD}
          required
          errors={errors}
        />
        <InputField
          name="namespaceId"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.PROCESS_GROUP_ID}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_YOUR_PROCESS_GROUP_ID}
          icon={<OpenLinkIcon color="#444445" />}
          register={register}
          required
          errors={errors}
        />
      </Modal>
    </div>
  );
};

export default AnalyzeNewFlow;
