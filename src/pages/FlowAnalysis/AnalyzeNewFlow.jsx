import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { OpenLinkIcon } from '../../assets';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { InputField, Modal } from '../../shared';
import { GridSelectors } from '../../store';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';

const anaLysisSchema = yup.object().shape({
  namespaceId: yup.string().required('Namespace is required'),
});

const AnalyzeNewFlow = () => {
  const dispatch = useDispatch();

  const isAnalysisModalOpen = useSelector(
    FlowValidationSelectors.getAddNewAnalysisModalOpen
  );
  const getNifiUrl = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(anaLysisSchema),
  });

  const onSubmit = data => {
    const payload = {
      generate_var_list: true,
      cluster_url: data.cluster_url,
      namespaceId: data.namespaceId,
    };

    dispatch(FlowValidationActions.savePayload(payload));
    history.push('/flow-analysis/flow-validation');
  };
  return (
    <div>
      <Modal
        title={FLOWVALIDATION_CONSTANTS.FLOW_VALIDATION_BY_ID}
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
          disabled={getNifiUrl?.nifiUrl}
          defaultValue={getNifiUrl?.nifiUrl}
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
