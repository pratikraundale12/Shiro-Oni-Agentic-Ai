import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  BellIcon,
  DownArrowIcon,
  HeadphoneIcon,
  LockIcon,
  SettingSmallIcon,
  UserIcon,
} from '../assets';
import { INITIAL_STATE, useGlobalContext } from '../utils';
import { AddUserModal } from '../pages/Users/AddUserModal';
import { ProfileRender } from './CustomGrid';

const Container = styled.header`
  width: 100%;
  padding: 14px 50px 14px 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  height: 78px;
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

const Name = styled.span`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  font-size: 18px;
  font-weight: 500;
  text-transform: capitalize;
`;

const Role = styled.span`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  top: 104%;
  z-index: 2;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  display: ${props => (props.show ? 'block' : 'none')};
  background: ${props => props.theme.colors.lightGrey};
  box-shadow: 0px 0px 5px 0px ${props => props.theme.colors.shadow};
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 18px;
  font-size: ${props => props.theme.size.md};
  color: ${props => props.theme.colors.darker};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey1};
  }
`;

const Option = styled.span`
  margin-left: 16px;
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.md};
  font-weight: 600;
`;

const UserModal = styled(AddUserModal)`
  > button {
    display: none;
  }
`;

const ProfileDropdown = () => {
  const { state, setState } = useGlobalContext();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const currentUser = state.currentUser;
  const options = [
    {
      label: 'Profile',
      icon: <UserIcon width={14} height={14} />,
      onClick: () => {
        setState(prev => ({
          ...prev,
          userModal: true,
          selectedItem: prev.currentUser,
        }));
        setShowMenu(prev => !prev);
      },
    },
    {
      label: 'Logout',
      icon: <LockIcon width={14} height={14} />,
      onClick: () => {
        localStorage.removeItem('access_token');
        setState(INITIAL_STATE);
        setShowMenu(prev => !prev);
      },
    },
  ];

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ProfileContainer ref={menuRef}>
      {!window.location.pathname.includes('user-management') && <UserModal />}
      <ProfileButton type="button" onClick={() => setShowMenu(prev => !prev)}>
        <ProfileRender url={currentUser?.photo} />
        <ProfileInfo>
          <Name>{`${currentUser?.first_name} ${currentUser?.last_name}`}</Name>
          <Role>{currentUser?.type}</Role>
        </ProfileInfo>
        <DownArrowIcon />
      </ProfileButton>
      <List show={showMenu}>
        {options.map((item, idx) => (
          <Item key={idx} onClick={item.onClick}>
            {item.icon} <Option>{item.label}</Option>
          </Item>
        ))}
      </List>
    </ProfileContainer>
  );
};

export const Header = ({ route }) => {
  return (
    <Container>
      <Title>{route?.replace(/-/g, ' ')}</Title>
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
        <ProfileDropdown />
      </ButtonContainer>
    </Container>
  );
};

Header.propTypes = {
  route: PropTypes.string,
};
