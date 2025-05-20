/*eslint-disable*/
import React from 'react';
import { LinkIcon, QRIcons } from '../../../assets';
import { KDFM } from '../../../constants';
import { CheckboxField, InputField } from '../../../shared';

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
      <div className="mb-3">
        <CheckboxField
          name="is_registry_authenticated"
          label="Authenticated Registry"
          register={register}
          defaultChecked={true}
        />
      </div>
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
