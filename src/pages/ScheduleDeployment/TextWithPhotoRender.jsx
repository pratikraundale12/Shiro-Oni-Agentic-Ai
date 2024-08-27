import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  CrossWithCircleIcon,
  DefaultUserIcon,
  TickIconWithCircle,
} from '../../assets';

const TextColor = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ImageHolder = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-left: ${props => (props.makeleft ? '-10px' : '0')};
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
`;

const HolderContainer = styled.div`
  margin-left: ${props => (props.makeleft ? '-10px' : '0')};
`;
export const TextWithPhotoRender = ({
  content,
  currentUser,
  item,
  setConfirmScheduleModelOpen,
  setConfirmRejectModelOpen,
  setSelectedData,
}) => {
  const isApprover = content.some(
    approver => approver.approver_id === currentUser.id
  );

  const handleReject = () => {
    setConfirmRejectModelOpen(true);
    setSelectedData(item.scheduler_id);
  };

  const handleApprove = () => {
    setConfirmScheduleModelOpen(true);
    setSelectedData(item.scheduler_id);
  };
  return (
    <>
      {isApprover && item.deployment_status == 'PENDING' ? (
        <div className="d-flex">
          <StyledButton className="me-2" onClick={() => handleReject()}>
            <CrossWithCircleIcon color="red" />
          </StyledButton>
          <StyledButton onClick={() => handleApprove()}>
            <TickIconWithCircle />
          </StyledButton>
        </div>
      ) : (
        <div className="d-flex ">
          <div className="d-flex me-1">
            {content.slice(0, 5).map((item, index) =>
              item.approver_photo_url ? (
                <ImageHolder
                  src={`${item.approver_photo_url}`}
                  alt="img"
                  key={item.approver_photo_url}
                  makeleft={index != 0}
                />
              ) : (
                <HolderContainer key={index} makeleft={index != 0}>
                  <DefaultUserIcon />
                </HolderContainer>
              )
            )}
          </div>
          {content?.length > 1 ? (
            <>
              {content?.length > 5
                ? `+ ${content?.length - 5} People`
                : `${content?.length} People`}
            </>
          ) : (
            <TextColor>{content[0].approver_name || 'N/A'}</TextColor>
          )}
        </div>
      )}
    </>
  );
};
TextWithPhotoRender.propTypes = {
  content: PropTypes.object,
  currentUser: PropTypes.string,
  item: PropTypes.object,
  setConfirmScheduleModelOpen: PropTypes.func,
  setConfirmRejectModelOpen: PropTypes.func,
  setSelectedData: PropTypes.func,
};
