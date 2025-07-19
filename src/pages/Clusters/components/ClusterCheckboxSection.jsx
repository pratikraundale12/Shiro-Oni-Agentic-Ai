/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { CheckboxField, RadioSelectField } from '../../../shared';

const CheckBoxFlex = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const CERTIFICATE_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
];

const ClusterCheckBoxSection = ({
  approverEnable,
  setApproverEnable,
  setChangeRequestApproverEnable,
  setApproverEnableForStartAndStop,
  setNotificationEnable,
  changeRequestEnable,
  notificationEnable,
  approverEnableForStartAndStop,
  certificateOption,
  setCertificateOption,
}) => {
  
  return (
    <>
     <RadioSelectField
            name="certificateOption"
            label="Do you want to use certificate for this cluster?"
            options={CERTIFICATE_OPTIONS}
            value={certificateOption}
            onChange={value => setCertificateOption(value.target.checked)}
            defaultValue={false}
          />
      <CheckBoxFlex>
        <CheckboxField
          name="check"
          label="Need approval for the deployment schedule?"
          checked={approverEnable}
          onChange={e => setApproverEnable(e.target.checked)}
        />
        <CheckboxField
          name="check"
          label="Need approval for start/stop schedule?"
          checked={approverEnableForStartAndStop}
          onChange={e => setApproverEnableForStartAndStop(e.target.checked)}
        />
        {approverEnable && (
          <CheckboxField
            name="check"
            label="Change request for deployment schedule?"
            checked={changeRequestEnable}
            onChange={e => setChangeRequestApproverEnable(e.target.checked)}
          />
        )}
        <CheckboxField
          name="check"
          label="Do you want any notification for this cluster?"
          checked={notificationEnable}
          onChange={e => setNotificationEnable(e.target.checked)}
        />
      </CheckBoxFlex>
    </>
  );
};
export default ClusterCheckBoxSection;
