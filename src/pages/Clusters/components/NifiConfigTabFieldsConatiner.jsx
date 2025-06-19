import React from 'react';
import {
  InputField,
  PasswordField,
  // RadioSelectField,
  SelectField,
} from '../../../shared';
import {
  FLOW_ELECTION_MAX_WAIT_OPTIONS,
  KDFM,
  // TRUE_FALSE_OPTIONS,
} from '../../../constants';
import { NotePadIcon, QRIcons } from '../../../assets';
// import { isEmpty } from 'lodash';
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
  const inputObject = [
    {
      label: 'Web Http Port',
      name: 'nifi_web_https_port',
      placeholder: 'Enter Http Port',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.https.host',
      name: 'host',
      placeholder: 'Enter nifi.web.https.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.proxy.host',
      name: 'nifi_web_proxy_host',
      placeholder: 'Enter nifi.web.proxy.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.keystore',
      name: 'nifi_security_keystore',
      placeholder: 'Enter nifi.security.keystore',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.keystoreType',
      name: 'nifi_security_keystoreType',
      placeholder: 'Enter nifi.security.keystoreType',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.truststore',
      name: 'nifi_security_truststore',
      placeholder: 'Enter nifi.security.truststore',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.truststoreType',
      name: 'nifi_security_truststoreType',
      placeholder: 'Enter nifi.security.truststoreType',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.authorizer',
      name: 'nifi_security_user_authorizer',
      placeholder: 'Enter nifi.security.user.authorizer',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'Protocol Max Threads',
      name: 'nifi_cluster_node_protocol_max_threads',
      placeholder: 'Enter Protocol Max Threads',
      required: true,
      defaultValue: 50,
      icon: <NotePadIcon />,
    },
    {
      label: KDFM.COMMENTS,
      name: 'comments',
      placeholder: KDFM.ENTER_YOUR_COMMENTS,
      required: true,
      icon: <NotePadIcon />,
    },
  ];

  const selectObject = [
    {
      label: 'Flow Election Max Wait Time',
      name: 'nifi_cluster_flow_election_max_wait_time',
      icon: <QRIcons />,
      size: 'lg',
      options: FLOW_ELECTION_MAX_WAIT_OPTIONS,
      placeholder: 'Select Flow Election Max Wait Time',
      sortAlphabetically: false,
      defaultValue: '5',
      height: '54px',
      labelMargin: '0px',
    },
    {
      label: KDFM.NIFI_VERSION,
      name: 'nifiVersion',
      icon: <QRIcons />,
      required: true,
      options: [],
      placeholder: KDFM.SELECT_NIFI_VERSION,
      height: '54px',
      labelMargin: '0px',
    },
  ];

  const passwordObject = [
    {
      name: 'nifi_security_truststorePasswd',
      label: 'nifi.security.truststorePasswd',
      placeholder: 'Enter nifi.security.truststorePasswd',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      name: 'nifi_security_keyPasswd',
      label: 'nifi.security.keyPasswd',
      placeholder: 'Enter nifi.security.keyPasswd',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      name: 'nifi_security_truststorePasswd',
      label: 'nifi.security.truststorePasswd',
      placeholder: 'Enter nifi.security.truststorePasswd',
      required: true,
      icon: <NotePadIcon />,
    },
  ];
  return (
    <>
      {/*  */}
      <div className="row mt-3">
        {inputObject.map((input, index) => (
          <div className="col-4" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required}
              register={register}
              errors={errors}
              icon={input.icon}
            />
          </div>
        ))}
        {selectObject.map((select, index) => (
          <div className="col-4" key={index}>
            <StyledSelectField
              label={select.label}
              name={select.name}
              control={control}
              options={select.options}
              placeholder={select.placeholder}
              required={select.required}
              icon={select.icon}
              size={select.size}
              height={select.height}
              labelMargin={select.labelMargin}
              defaultValue={select.defaultValue}
              sortAlphabetically={select.sortAlphabetically}
              register={register}
              errors={errors}
            />
          </div>
        ))}
        {passwordObject.map((password, index) => (
          <div className="col-4" key={index}>
            <PasswordField
              label={password.label}
              name={password.name}
              placeholder={password.placeholder}
              required={password.required}
              register={register}
              errors={errors}
              icon={password.icon}
              watch={watch}
            />
          </div>
        ))}
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
