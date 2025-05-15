/* eslint-disable */

import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  CircleExclamationMarkIcon,
  DeleteSmallIcon,
  ThreedotsIcon,
} from '../../../assets';
import { CLUSTER_STATUS } from '../../../constants';
import { Tooltip } from '../../../shared/Tooltip';
import { AuthenticationSelectors } from '../../../store';
import { theme } from '../../../styles';
import { EnableClusterRender } from './EnableClusterRender';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 3px;
`;

export const IconButton = styled.button`
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  @media (max-width: 1025px) {
    min-width: 24px;
    min-height: 24px;
    border-width: 0.5px;
    & svg {
      width: 12px;
      height: 12px;
    }
  }
  &.pencil-icon-schedule-list {
    @media (max-width: 1025px) {
      min-width: 24px;
      min-height: 24px;
      border-width: 0.5px;
      & svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const ClusterDeatils = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: #000000;
`;

const TooltipParent = styled.div`
  background-color: white;
`;

const Connected = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

const Span = styled.span`
  width: 12px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  background-color: ${props => props.color || '#86C7DD'};
`;

const Strong = styled.strong`
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const Number = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
`;

const TooltipSecond = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ActionRender = ({
  handleMenuClick,
  item,
  children,
  handleHardDeleteFailedAnsibleCluster = () => {},
  handleOpenProgressModal = () => {},
}) => {
  const clusterLogin = useSelector(AuthenticationSelectors.getClusterLogin);
  return (
    <ActionTd>
      {!item?.process_intiated &&
      item?.state == 'FAILED' &&
      item?.created_by_ansible ? (
        <>
          <span className="me-1">
            <IconButton
              data-tooltip-id={'ansible-failed-log-option'}
              onClick={event => {
                event.currentTarget.blur();
                handleOpenProgressModal(item);
              }}
            >
              <CircleExclamationMarkIcon color={theme.colors.primary} />
            </IconButton>
          </span>
          <IconButton
            onClick={() => handleHardDeleteFailedAnsibleCluster(item)}
            data-tooltip-id={'ansible-failed-delete-option'}
          >
            <DeleteSmallIcon color="red" />
          </IconButton>
          <ReactTooltip
            id={`ansible-failed-delete-option`}
            place="bottom"
            effect="solid"
            content={'Delete Cluster'}
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
          <ReactTooltip
            id={`ansible-failed-log-option`}
            place="bottom"
            effect="solid"
            content={'Check Failed Cluster'}
            style={{
              width: '170px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </>
      ) : (
        <>
          <IconButton
            data-tooltip-id={item.id}
            disabled={
              item.status === CLUSTER_STATUS.DISCONNECTED || !item.is_active
            }
          >
            <CircleExclamationMarkIcon color={theme.colors.border} />
          </IconButton>

          {!clusterLogin && <EnableClusterRender item={item} />}

          <div className="position-relative">
            <IconButton onClick={event => handleMenuClick(event, item)}>
              <ThreedotsIcon />
            </IconButton>
            {children}
          </div>
          {item.status !== CLUSTER_STATUS.DISCONNECTED && item.is_active && (
            <Tooltip
              id={item.id}
              styles={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                zIndex: 10000,
              }}
            >
              <div>
                <TooltipParent>
                  <ClusterDeatils>Cluster Details</ClusterDeatils>
                  <TooltipSecond>
                    <Connected>
                      <Span />
                      <Strong>Connected Nodes:</Strong>
                    </Connected>
                    <Number>
                      {item.total_nodes === item.connected_nodes
                        ? item.connected_nodes
                        : `${item.connected_nodes}`}
                    </Number>
                  </TooltipSecond>
                  <TooltipSecond>
                    <Connected>
                      <Span color="#A5D6A7" />
                      <Strong>Total Nodes:</Strong>
                    </Connected>
                    <Number>{item.total_nodes}</Number>
                  </TooltipSecond>
                </TooltipParent>
              </div>
            </Tooltip>
          )}
        </>
      )}
    </ActionTd>
  );
};

ActionRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  cluster: PropTypes.shape({
    total_nodes: PropTypes.number.isRequired,
    connected_nodes: PropTypes.number.isRequired,
  }).isRequired,
  ref: PropTypes.func,
  children: PropTypes.any,
  handleHardDeleteFailedAnsibleCluster: PropTypes.func,
  handleOpenProgressModal: PropTypes.func,
};
