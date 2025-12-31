import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { AuthenticationSelectors, NamespacesSelectors } from '../../store';
import { MiniScreenIcon, ProfileIcon } from '../../assets';
import { API_URL } from '../../constants';
import { theme } from '../../styles';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconCusterButton = styled.button`
  min-width: 50px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  gap: 10px;
  padding: 0 12px;
  background-color: #f5f7fa;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 220px;
  overflow: hidden;
  flex-shrink: 0;

  &:hover {
    background-color: #ebedf0;
  }
`;

const NameDiv = styled.div`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const ClusterLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusDiv = styled.div`
  width: 8px;
  height: 8px;
  background-color: #0cbf59;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
`;

const ProfileContainer = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border: 1px solid #ccc;
  overflow: hidden;
  flex-shrink: 0;
  cursor: default;
`;

const StyledProfileImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TooltipName = styled.span`
  font-family: ${props => props.theme.fontNato};
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  letter-spacing: 0.3px;
`;

const TooltipRole = styled.span`
  font-family: ${props => props.theme.fontNato};
  font-weight: 400;
  font-size: 12px;
  color: #eee;
  margin-top: 2px;
  text-transform: capitalize;
`;

const MiniScreen = styled(MiniScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`;

const checkImageExists = url => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const ShowLoggedInCluster = ({
  showCluster = false,
  showProfileIcon = false,
  showMinimizeScreenIcon = false,
  onClick = () => {},
}) => {
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [isValidImage, setIsValidImage] = useState(false);
  const canViewCluster =
    !isEmpty(currentUser?.permissions) &&
    currentUser?.permissions?.includes('view_cluster');
  const fullName =
    `${currentUser?.first_name || ''} ${currentUser?.middle_name || ''} ${currentUser?.last_name || ''}`.trim();
  const role = currentUser?.role;

  useEffect(() => {
    if (currentUser?.photo) {
      const fullUrl = `${API_URL}${currentUser.photo}`;
      checkImageExists(fullUrl).then(exists => setIsValidImage(exists));
    } else {
      setIsValidImage(false);
    }
  }, [currentUser?.photo]);

  return (
    <Container>
      {showCluster && canViewCluster && selectedCluster?.label && (
        <IconCusterButton id="modal-cluster-icon-btn" type="button">
          <NameDiv>
            <StatusDiv />
            <ClusterLabel>{selectedCluster.label}</ClusterLabel>
          </NameDiv>
        </IconCusterButton>
      )}
      {showProfileIcon && (
        <>
          <ProfileContainer data-tooltip-id="modal-profile-tooltip">
            {isValidImage ? (
              <StyledProfileImage
                src={`${API_URL}${currentUser?.photo}`}
                alt="profile"
              />
            ) : (
              <ProfileIcon width={40} height={40} />
            )}
          </ProfileContainer>

          <ReactTooltip
            id="modal-profile-tooltip"
            place="bottom"
            noArrow={false}
            style={{
              backgroundColor: '#ff7a00',
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              opacity: 1,
              zIndex: 9999,
            }}
          >
            <TooltipContent>
              <TooltipName>{fullName || 'User'}</TooltipName>
              {role && <TooltipRole>{role}</TooltipRole>}
            </TooltipContent>
          </ReactTooltip>
        </>
      )}

      {showMinimizeScreenIcon && (
        <button type="button" onClick={onClick} aria-label="Minimize Screen">
          <MiniScreen height={30} width={30} />
        </button>
      )}
    </Container>
  );
};

ShowLoggedInCluster.propTypes = {
  showCluster: PropTypes.bool,
  showProfileIcon: PropTypes.bool,
  showMinimizeScreenIcon: PropTypes.bool,
  onClick: PropTypes.func,
};
