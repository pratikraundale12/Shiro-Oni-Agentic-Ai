import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  BellIcon,
  DownArrowIcon,
  HeadphoneIcon,
  SettingSmallIcon,
} from '../assets';

const Container = styled.header`
  width: 100%;
  padding: 14px 50px 14px 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  header: 78px;
`;

const IconButton = styled.button`
  min-width: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  margin-right: 10px;
  background-color: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  padding: 6px;
  background-color: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 10px;
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  font-size: 24px;
  font-weight: 500;
  text-transform: capitalize;
`;

export const Header = ({ route }) => (
  <Container>
    <Title>{route}</Title>
    <ButtonContainer>
      <IconButton>
        <HeadphoneIcon />
      </IconButton>
      <IconButton>
        <BellIcon />
      </IconButton>
      <IconButton>
        <SettingSmallIcon />
      </IconButton>
      <ProfileButton>
        <img
          src="./img/profile-img.png"
          alt="img"
          width={40}
          height={40}
          className="img-fluid"
        />
        <ProfileInfo>
          <span style={{ fontSize: 18 }}>Adam Smith</span>
          <span style={{ fontSize: 10 }}>Admin</span>
        </ProfileInfo>
        <DownArrowIcon />
      </ProfileButton>
    </ButtonContainer>
  </Container>
);

Header.propTypes = {
  route: PropTypes.string,
};
