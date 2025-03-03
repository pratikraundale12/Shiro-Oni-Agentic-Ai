/*eslint-disable*/
import React from 'react';
import { InputField } from '../../../shared';
import { LinkIcon, QRIcons } from '../../../assets';
import { KDFM } from '../../../constants';
const ClusterFieldsForm = ({ register, errors,testSuccess }) => {
  return (
    <>
      <InputField
        name="clusterName"
        register={register}
        icon={<QRIcons />}
        label={KDFM.CLUSTER_NAME}
        placeholder={KDFM.ENTER_CLUSTER_NAME}
        errors={errors}
      />
      <InputField
        name="nifiUrl"
        register={register}
        icon={<LinkIcon />}
        label={KDFM.NIFI_URL}
        disabled={testSuccess}
        placeholder={KDFM.ENTER_NIFI_URL}
        errors={errors}
      />
      <InputField
        name="metrics_url"
        register={register}
        icon={<LinkIcon />}
        label={KDFM.METRICS_URL}
        placeholder={KDFM.ENTER_METRICS_URL}
        errors={errors}
      />
      <InputField
        name="logs_url"
        register={register}
        icon={<LinkIcon />}
        label={KDFM.LOGS_URL}
        placeholder={KDFM.ENTER_LOGS_URL}
        errors={errors}
      />
    </>
  );
};
export default ClusterFieldsForm;
