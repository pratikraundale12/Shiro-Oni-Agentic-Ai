import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { UserIcon, AIMiniIcon } from '../../assets';
import { API_URL } from '../../constants';

const AvatarContainer = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => (props.isUser ? '#ff7a00' : '#444445')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MessageIdentityAvatar = ({
  isUser,
  userPhoto,
  isValidProfilePic,
}) => {
  if (!isUser) {
    return (
      <AvatarContainer isUser={false}>
        <AIMiniIcon width={16} height={16} color="white" />
      </AvatarContainer>
    );
  }

  return (
    <AvatarContainer isUser={true}>
      {isValidProfilePic && userPhoto ? (
        <ProfileImage src={`${API_URL}${userPhoto}`} alt="user-identity" />
      ) : (
        <UserIcon width={16} height={16} color="white" />
      )}
    </AvatarContainer>
  );
};

MessageIdentityAvatar.propTypes = {
  isUser: PropTypes.bool.isRequired,
  userPhoto: PropTypes.string,
  isValidProfilePic: PropTypes.bool,
};
