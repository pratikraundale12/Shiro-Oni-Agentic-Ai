import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  CrossWithCircleIcon,
  DefaultUserIcon,
  TickIconWithCircle,
} from '../../assets';
import { SchedularActions } from '../../store/schedular/redux';
import { theme } from '../../styles';

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
const NameWrapper = styled.span`
  cursor: pointer;
`;

const HolderContainer = styled.div`
  margin-left: ${props => (props.makeleft ? '-10px' : '0')};
`;
export const TextWithPhotoRender = ({
  content,
  currentUser,
  item,
  setSelectedData,
}) => {
  const dispatch = useDispatch();
  const isApprover = content.some(
    approver => approver.approver_id === currentUser.id
  );

  const handleReject = () => {
    setSelectedData(item.scheduler_id);
    dispatch(SchedularActions.setRejectScheduleModal());
  };

  const handleApprove = () => {
    dispatch(SchedularActions.setScheduleConfirmModel());
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
                <>
                  <ImageHolder
                    src={`${item.approver_photo_url}`}
                    alt="img"
                    key={item.approver_photo_url}
                    makeleft={index != 0}
                    data-tooltip-id={item?.approver_id}
                  />
                  <Tooltip
                    id={item.approver_id}
                    styles={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                      zIndex: 10000,
                    }}
                  >
                    <div>{item.approver_name}</div>
                  </Tooltip>
                </>
              ) : (
                <HolderContainer key={index} makeleft={index != 0}>
                  <span data-tooltip-id={content[index].approver_id}>
                    <DefaultUserIcon />
                  </span>

                  <Tooltip
                    id={content[index].approver_id}
                    styles={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                      zIndex: theme.zIndex,
                    }}
                  >
                    <div data-tooltip-id>{content[index].approver_name}</div>
                  </Tooltip>
                </HolderContainer>
              )
            )}
          </div>
          {content?.length > 1 ? (
            <>
              {content?.length > 5 ? (
                <NameWrapper
                  data-tooltip-id={'demoId311'}
                >{`+ ${content?.length - 5} People`}</NameWrapper>
              ) : (
                `${content?.length} People`
              )}
            </>
          ) : (
            <>
              <TextColor>{content[0].approver_name || 'N/A'}</TextColor>
            </>
          )}
          <Tooltip
            id={'demoId311'}
            styles={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
              zIndex: 10000,
            }}
          >
            {content?.slice(5)?.map(element => (
              <div key={element?.approver_id}>{element?.approver_name}</div>
            ))}
          </Tooltip>
        </div>
      )}
    </>
  );
};
TextWithPhotoRender.propTypes = {
  content: PropTypes.object,
  currentUser: PropTypes.string,
  item: PropTypes.object,
  setSelectedData: PropTypes.func,
};
