import { isEmpty } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ClusterIcon,
  DownArrowIcon,
  LogoutIcon,
  SettingSmallIcon,
  UserIcon,
} from '../assets';
import {
  CLUSTERS_TOKEN,
  LICENSE_DATE_ISO_FORMAT,
  LICENSE_EXPIRE_PROMPT_DAYS,
  LICENSE_TYPE,
  SIDE_MENUS_DISPLAY,
} from '../constants';
import { history } from '../helpers/history';
import { AddUserModal } from '../pages/Users/AddUserModal';
import SessionExpiredLabel from '../shared/SessionExpiredLabel';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  GridActions,
  NamespacesActions,
  NamespacesSelectors,
  PoliciesActions,
  RolesActions,
  UsersActions,
} from '../store';
import { SchedularActions } from '../store/schedular';
import { SettingsSelectors } from '../store/settings';
import { useGlobalContext } from '../utils';
import { ClusterLoginModal } from './ClusterLoginModal';
import { ProfileRender } from './CustomGrid';

const Container = styled.header`
  height: ${props => props.theme.header};
  width: 100%;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  border-top-left-radius: 30px;
  @media (max-width: 992px) {
    padding-left: 50px;
    .title {
      margin-left: 17.5rem;
      font-size: 23px;
    }
  }
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
  margin-left: auto;
  margin-right: 16px;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 8rem;
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
  font-size: 26px;
  font-weight: 500;
  text-transform: capitalize;
  @media screen and (max-width: 1400px) {
    font-size: 20px !important;
  }

  @media (max-width: 890px) {
    display: ${props => (props.isOpenSidebar ? 'none' : 'block')};
  }

  @media (max-width: 992px) {
    font-size: 23px;
    transition: 0.3s;
  }
`;

const Name = styled.span`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  font-size: 18px;
  font-weight: 500;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
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
  background: #fff;
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

  & .profile-icon {
    flex-shrink: 0;
  }

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
const IconCusterButton = styled.button`
  min-width: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  gap: 10px;
  padding: 0 10px;
  margin-right: 10px;
  background-color: #f5f7fa;
  border: 1px solid #ccc;
`;
const NameDiv = styled.div`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  @media screen and (max-width: 1400px) {
    font-size: 12px !important;
  }
`;
const StatusDiv = styled.div`
  width: 4px;
  height: 4px;
  background-color: #0cbf59;
  border-radius: 50%;
  margin-right: 4px;
`;

const UserModal = styled(AddUserModal)`
  > button {
    display: none;
  }
`;

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [showMenu, setShowMenu] = useState(false);
  const { setState } = useGlobalContext();
  const menuRef = useRef(null);
  const options = [
    {
      label: 'Profile',
      icon: <UserIcon width={18} height={18} />,
      onClick: () => {
        setState(prev => {
          return {
            ...prev,
            userModal: true,
            selectedItem: currentUser,
            label: 'Profile',
          };
        });
        setShowMenu(prev => !prev);
        dispatch(UsersActions.setUserModalOpen(true));
      },
    },
    {
      label: 'Logout',
      icon: <LogoutIcon />,
      onClick: () => {
        localStorage.clear();
        const loginUrl =
          currentUser?.role === 'superadmin' ? '/admin/login' : '/login';
        dispatch(AuthenticationActions.logout({ url: loginUrl }));
        dispatch(AuthenticationActions.fetchSettingLogo());
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
      <UserModal />
      <ProfileButton
        type="button"
        onClick={() => setShowMenu(prev => !prev)}
        title="Profile"
      >
        <ProfileRender url={currentUser?.photo} />
        <ProfileInfo>
          <Name className="text-truncate">{`${currentUser?.first_name || ''} ${currentUser?.middle_name || ''} ${currentUser?.last_name || ''}`}</Name>
        </ProfileInfo>
        <DownArrowIcon />
      </ProfileButton>
      <List show={showMenu}>
        {options.map((item, idx) => (
          <Item key={idx} onClick={item.onClick}>
            <span className="profile-icon">{item.icon}</span>
            <Option>{item.label}</Option>
          </Item>
        ))}
      </List>
    </ProfileContainer>
  );
};

export const Header = ({ isOpenSidebar, currentRoute }) => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const clusterLogin = useSelector(AuthenticationSelectors.getClusterLogin);
  const route = useSelector(AuthenticationSelectors.getRoute);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [displaySessionTab, setDisplaySessionTab] = useState(false);
  const isLoggedIn = useSelector(AuthenticationSelectors.getIsLoggedIn);
  const { licenseExpireDate, licenseType } = useSelector(
    AuthenticationSelectors.getLicense
  );
  const clusters_new_list = useSelector(ClustersSelectors.getAllClustersList);
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const closeTab = () => {
    setDisplaySessionTab(false);
  };
  useEffect(() => {
    if (!window.location.pathname.includes('/process-group')) {
      dispatch(
        GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
      );
      dispatch(NamespacesActions.setSelectedNamespace({}));
    }
    if (window.location.pathname !== '/clusters') {
      dispatch(GridActions.fetchGridSuccess({ module: 'clusters', data: {} }));
    }
    if (window.location.pathname !== '/schedule-deployment') {
      dispatch(
        GridActions.fetchGridSuccess({
          module: 'scheduler',
          data: {},
        })
      );
      dispatch(SchedularActions.setSelectedClusterState(null));
    }
    if (window.location.pathname !== '/user-management') {
      dispatch(
        GridActions.fetchGridSuccess({
          module: 'users',
          data: {},
        })
      );
    }
    if (location.pathname !== '/role-&-permission') {
      dispatch(RolesActions.setSelectedRole({}));
      dispatch(PoliciesActions.fetchPoliciesRolesSuccess({}));
    }
  }, [dispatch, GridActions, window?.location?.pathname]);

  useEffect(() => {
    const cluster = localStorage.getItem('selected_cluster');
    const enableCluster = JSON.parse(cluster) ?? {};
    if (Object.keys(enableCluster)?.length > 0) {
      dispatch(NamespacesActions.setSelectedCluster(enableCluster));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(currentUser) && !isEmpty(settingsData)) {
      dispatch(ClustersActions.fetchClusters());
      dispatch(RolesActions.fetchRoles());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!clusters_new_list?.length) return;
    const storedClusters = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    if (storedClusters?.length > 0) {
      const updatedClusters = storedClusters?.map(item => {
        const matchedCluster = clusters_new_list?.find(
          temp => item?.id === temp?.id
        );
        return matchedCluster
          ? {
              id: matchedCluster?.id,
              name: matchedCluster?.name,
              token: item?.token,
            }
          : item;
      });

      const isStorageUpdated =
        JSON.stringify(storedClusters) !== JSON.stringify(updatedClusters);
      if (isStorageUpdated) {
        localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(updatedClusters));
      }

      const selectedClusterString = localStorage.getItem('selected_cluster');
      if (selectedClusterString) {
        const parsedSelectedCluster = JSON.parse(selectedClusterString);
        const matchingCluster = updatedClusters.find(
          cluster => cluster?.id === parsedSelectedCluster?.value
        );

        if (matchingCluster) {
          const newSelectedCluster = {
            label: matchingCluster?.name,
            value: matchingCluster?.id,
          };

          if (
            newSelectedCluster?.label !== parsedSelectedCluster?.label ||
            newSelectedCluster?.value !== parsedSelectedCluster?.value
          ) {
            localStorage.setItem(
              'selected_cluster',
              JSON.stringify(newSelectedCluster)
            );
            dispatch(NamespacesActions.setSelectedCluster(newSelectedCluster));
          }
        }
      }
    }
  }, [clusters_new_list, dispatch]);

  // Function to calculate remaining days before expiration using moment.js
  const calculateRemainingDays = expirationDateString => {
    if (!expirationDateString) return NaN;
    const expirationDate = moment(
      expirationDateString,
      LICENSE_DATE_ISO_FORMAT
    ); // Use moment to parse the date
    if (!expirationDate.isValid()) {
      console.error('Invalid date format:', expirationDateString);
      return NaN;
    }
    const currentDate = moment();
    const remainingDays = expirationDate.diff(currentDate, 'days'); // Calculate difference in days
    return remainingDays;
  };

  useEffect(() => {
    let timer;
    if (licenseType === LICENSE_TYPE.TRIAL) {
      timer = setTimeout(() => {
        setDisplaySessionTab(true);
      }, 2000);
    } else if (licenseType !== LICENSE_TYPE.PURCHASED) {
      const remainingDays = calculateRemainingDays(licenseExpireDate);
      if (remainingDays <= LICENSE_EXPIRE_PROMPT_DAYS && remainingDays > 0) {
        timer = setTimeout(() => {
          setDisplaySessionTab(true);
        }, 2000);
      }
    } else {
      setDisplaySessionTab(false);
    }
    return () => clearTimeout(timer);
  }, [licenseType, licenseExpireDate]);

  const handleRoute = path => {
    dispatch(AuthenticationActions.setRoute(path));
    history.push(`/${path}`);
  };

  const displayTitle = routeVal => {
    let resultant = SIDE_MENUS_DISPLAY.find(ele => ele.path === routeVal);
    return resultant?.label;
    // route?.replace(/-/g, ' ')
  };

  return (
    <>
      <Container>
        <Title isOpenSidebar={isOpenSidebar}>
          {isLoggedIn
            ? displayTitle(route)
            : currentRoute?.split('/')?.[2].replace(/-/g, ' ')}
        </Title>

        {isLoggedIn ? (
          <ButtonContainer>
            <div className="d-none d-md-inline">
              <div className="d-flex">
                {currentUser.role === 'superadmin' && (
                  <>
                    <IconButton
                      onClick={() => handleRoute('setting')}
                      title="Settings"
                    >
                      <SettingSmallIcon />
                    </IconButton>
                  </>
                )}
                <IconCusterButton
                  onClick={() =>
                    dispatch(AuthenticationActions.setClusterLogin(true))
                  }
                  title="Cluster"
                >
                  <ClusterIcon />
                  {selectedCluster?.label && (
                    <NameDiv>
                      <StatusDiv /> {selectedCluster.label}
                    </NameDiv>
                  )}
                  {selectedCluster?.label && <DownArrowIcon />}
                </IconCusterButton>
                {/* <IconButton>
                <HeadphoneIcon />
              </IconButton>
              <IconButton>
                <BellIcon />
              </IconButton> */}
              </div>
            </div>
            <ProfileDropdown />
          </ButtonContainer>
        ) : null}
      </Container>
      {clusterLogin && <ClusterLoginModal />}
      {displaySessionTab && <SessionExpiredLabel closeTab={closeTab} />}
    </>
  );
};

Header.propTypes = {
  route: PropTypes.string,
  isOpenSidebar: PropTypes.bool,
  currentRoute: PropTypes.string,
};
