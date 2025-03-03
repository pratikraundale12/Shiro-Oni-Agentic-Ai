/*eslint-disable*/
import React from 'react';
import { InputField } from '../../../shared';
import { LinkIcon, QRIcons } from '../../../assets';
import { KDFM } from '../../../constants';

const RegistryFormInputs = ({ register, errors, testSuccess }) => {
  return (
    <>
      <InputField
        name="registryName"
        register={register}
        icon={<QRIcons />}
        label={KDFM.REGISTRY_NAME}
        placeholder={KDFM.ENTER_REGISTRY_NAME}
        errors={errors}
      />
      <InputField
        name="registryUrl"
        register={register}
        icon={<LinkIcon />}
        label={KDFM.REGISTRY_URL}
        disabled={testSuccess}
        placeholder={KDFM.ENTER_REGISTRY_URL}
        errors={errors}
      />
    </>
  );
};
export default RegistryFormInputs;
