/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { CheckboxField } from '../../../shared';

const CheckBoxFlex = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;
const ClusterCheckBoxSection = ({
  approverEnable,
  setApproverEnable,
  setChangeRequestApproverEnable,
  setNotificationEnable,
  changeRequestEnable,
  notificationEnable,
}) => {
  return (
    <>
      <CheckBoxFlex>
        <CheckboxField
          name="check"
          label="Need approval for the deployment schedule?"
          checked={approverEnable}
          onChange={e => setApproverEnable(e.target.checked)}
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
