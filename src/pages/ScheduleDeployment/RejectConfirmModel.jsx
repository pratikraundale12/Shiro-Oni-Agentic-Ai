import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputField, Modal } from '../../shared';
import { QRIcons } from '../../assets';

const IconWrapper = styled.div`
  text-align: center;
`;

const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;

const StyledInputField = styled(InputField)`
  margin-bottom: 0.4rem;
`;

export const RejectConfirmScheduleModel = ({
  icon,
  primaryText = '',
  errors,
  register,
  ...rest
}) => {
  return (
    <Modal size="sm" {...rest}>
      <IconWrapper>{icon}</IconWrapper>
      <PrimaryText>{primaryText}</PrimaryText>
      <div className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-6 form-ele">
        <StyledInputField
          name="note"
          type="text"
          label="Reason"
          placeholder="Enter the Reason for Rejection"
          required
          register={register}
          errors={errors}
          icon={<QRIcons />}
        />
      </div>
    </Modal>
  );
};

RejectConfirmScheduleModel.propTypes = {
  icon: PropTypes.elementType.isRequired,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
};
