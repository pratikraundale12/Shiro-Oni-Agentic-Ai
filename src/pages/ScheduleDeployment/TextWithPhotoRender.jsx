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
  margin-right: 10px;
`;

export const TextWithPhotoRender = ({ content, currentUser, item }) => {
  const isApprover = content.some(
    approver => approver.approver_id === currentUser.id
  );
  return (
    <>
      {isApprover && item.deployment_status != 'SCHEDULED' ? (
        <div className="d-flex">
          <div className="me-2">
            <CrossWithCircleIcon color="red" />
          </div>
          <div>
            <TickIconWithCircle />
          </div>
        </div>
      ) : (
        <div className="d-flex">
          {content.map((item, index) =>
            item.approver_photo_url ? (
              <ImageHolder
                src={`/media/users/${item.approver_photo_url}`}
                alt="img"
                key={item.approver_photo_url}
              />
            ) : (
              <div className="me-1" key={index}>
                <DefaultUserIcon />
              </div>
            )
          )}

          {content?.length > 1 ? (
            `+ ${content?.length} People`
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
};
