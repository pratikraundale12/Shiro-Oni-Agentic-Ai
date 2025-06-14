import React from 'react';
import {
  InputField,
  PasswordField,
  RadioSelectField,
  SelectField,
} from '../../../shared';
import {
  FLOW_ELECTION_MAX_WAIT_OPTIONS,
  KDFM,
  TRUE_FALSE_OPTIONS,
} from '../../../constants';
import { NotePadIcon, QRIcons } from '../../../assets';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSelectField = styled(SelectField)`
  /* Container styling */
  & > div {
    margin-bottom: ${props => props.marginBottom || '1rem'};
  }

  & label {
    margin-bottom: ${props => props.labelMargin || '2px'} !important;
  }

  /* Control styling (the main input area) */
  & .react-select__control {
    height: ${props => props.height || 'auto'};
    min-height: ${props => props.height || '54px'};
    border-radius: ${props => props.borderRadius || '4px'};
    margin-top: ${props => props.marginTop || '10px'};
    margin-left: ${props => props.marginLeft || '0'};
    margin-right: ${props => props.marginRight || '0'};
  }

  /* Value container styling */
  & .react-select__value-container {
    padding: ${props => props.innerPadding || props.padding || '0 8px'};
  }

  /* Menu styling */
  & .react-select__menu {
    border-radius: ${props => props.menuBorderRadius || '4px'};
  }

  /* Option styling */
  & .react-select__option {
    padding: ${props => props.optionPadding || '8px 12px'};
    font-size: ${props => props.fontSize || '14px'};
  }
`;
const NifiConfigTabFieldsContainer = ({ register, errors, control, watch }) => {
  return (
    <>
      {/*  */}
      <div className="row mt-3">
        <div className="col-4">
          <InputField
            label="Web Http Port"
            name="nifi_web_https_port"
            type="text"
            placeholder="Enter Http Port"
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.web.https.host'}
            name="host"
            type="text"
            placeholder={'Enter nifi.web.https.host'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.web.proxy.host'}
            name="nifi_web_proxy_host"
            type="text"
            placeholder={'Enter nifi.web.proxy.host'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-4">
          <InputField
            label="nifi.security.keystore"
            name="nifi_security_keystore"
            type="text"
            placeholder="Enter nifi.security.keystore"
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.security.keystoreType'}
            name="nifi_security_keystoreType"
            type="text"
            placeholder={'Enter nifi.security.keystoreType'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
        <div className="col-4">
          <PasswordField
            name="nifi_security_keystorePasswd"
            label="nifi.security.keystorePasswd"
            placeholder="Enter nifi.security.keystorePasswd"
            required
            watch={watch}
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-4">
          <PasswordField
            name="nifi_security_keyPasswd"
            label="nifi.security.keyPasswd"
            placeholder="nifi.security.keyPasswd"
            required
            watch={watch}
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.security.truststore'}
            name="nifi_security_truststore"
            type="text"
            placeholder={'Enter nifi.security.truststore'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.security.truststoreType'}
            name="nifi_security_truststoreType"
            type="text"
            placeholder={'Enter nifi.security.truststoreType'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
      </div>
      {/*  */}
      <div className="row mt-3">
        <div className="col-4">
          <PasswordField
            name="nifi_security_truststorePasswd"
            label="nifi.security.truststorePasswd"
            placeholder="Enter nifi.security.truststorePasswd"
            required
            watch={watch}
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
        <div className="col-4">
          <InputField
            label={'nifi.security.user.authorizer'}
            name="nifi_security_user_authorizer"
            type="text"
            placeholder={'Enter nifi.security.user.authorizer'}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
            // disabled={!isEmpty(configToEdit)}
          />
        </div>
      </div>
      {/*  */}
      <div className="row mt-3">
        <div className="col-5">
          <InputField
            label="Protocol Max Threads"
            name="nifi_cluster_node_protocol_max_threads"
            type="text"
            placeholder="Enter Protocol Max Threads"
            required
            register={register}
            errors={errors}
            defaultValue={50}
            icon={<NotePadIcon />}
          />
        </div>
        <div className="col-5">
          <StyledSelectField
            label="Flow Election Max Wait Time"
            name="nifi_cluster_flow_election_max_wait_time"
            icon={<QRIcons />}
            size="lg"
            errors={errors}
            control={control}
            options={FLOW_ELECTION_MAX_WAIT_OPTIONS}
            placeholder="Select Flow Election Max Wait Time"
            sortAlphabetically={false}
            defaultValue="5"
            height="54px"
            labelMargin="0px"
          />
        </div>
        <div className="col-2">
          <RadioSelectField
            name="nifi_cluster_is_node"
            options={TRUE_FALSE_OPTIONS}
            label="NiFi Cluster Node"
            register={register}
            defaultValue={'false'}
          />
        </div>
      </div>
      <div className="row ">
        <div className="col-4">
          <StyledSelectField
            label={KDFM.NIFI_VERSION}
            name="nifiVersion"
            icon={<QRIcons />}
            register={register}
            required
            errors={errors}
            control={control}
            options={[]}
            placeholder={KDFM.SELECT_NIFI_VERSION}
            height="54px"
            labelMargin="0px"
          />
        </div>
        <div className="col-4">
          <InputField
            label={KDFM.COMMENTS}
            name="comments"
            type="text"
            placeholder={KDFM.ENTER_YOUR_COMMENTS}
            required
            register={register}
            errors={errors}
            icon={<NotePadIcon />}
          />
        </div>
      </div>
    </>
  );
};
NifiConfigTabFieldsContainer.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  control: PropTypes.object,
  watch: PropTypes.func,
};
export default NifiConfigTabFieldsContainer;
