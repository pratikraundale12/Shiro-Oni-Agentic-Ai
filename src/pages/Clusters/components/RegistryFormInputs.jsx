/*eslint-disable*/
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { InfoIcon, LinkIcon, QRIcons } from '../../../assets';
import { KDFM } from '../../../constants';
import { CheckboxField, InputField } from '../../../shared';
import CertificateRadioSelect from './CertificateRadioSelect';

const CERTIFICATE_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const RegistryFormInputs = ({
  register,
  errors,
  testSuccess,
  registeryCertificateOption,
  setRegisteryCertificateOption,
}) => {
  
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
      <div className="mb-3 d-flex gap-2 align-items-center">
        <CheckboxField
          name="is_registry_authenticated"
          label="Authenticated"
          register={register}
          defaultChecked={true}
        />
        <div data-tooltip-id="registry-auth-tooltip">
          <InfoIcon />
        </div>
        <ReactTooltip
          id="registry-auth-tooltip"
          place="right"
          content="Enable this option if authentication is required for your Registry URL"
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            backgroundColor: '#333',
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            zIndex: 9999,
          }}
        />
      </div>
      <CertificateRadioSelect
        name="registeryCertificateOption"
        label="Do you want to use certificate for this registry?"
        options={CERTIFICATE_OPTIONS}
        value={registeryCertificateOption}
        defaultValue={registeryCertificateOption}
        onChange={val => setRegisteryCertificateOption(val)}
      />
    </>
  );
};
export default RegistryFormInputs;
