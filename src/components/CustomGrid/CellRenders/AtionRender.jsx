/* eslint-disable */

import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { CircleExclamationMarkIcon, ThreedotsIcon } from '../../../assets';
import { Tooltip } from '../../../shared/Tooltip';
import { theme } from '../../../styles';
import { EnableClusterRender } from './EnableClusterRender';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
`;

export const IconButton = styled.button`
  min-width: 34px;
  min-height: 34px;
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

export const ActionRender = ({ handleMenuClick, item, children }) => {
  return (
    <ActionTd>
      <IconButton data-tooltip-id={item.id}>
        <CircleExclamationMarkIcon color={theme.colors.border} />
      </IconButton>
      <div className="position-relative">
        <IconButton onClick={event => handleMenuClick(event, item)}>
          <ThreedotsIcon />
        </IconButton>
        {children}
      </div>
      <EnableClusterRender item={item} />
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
          {item.is_active ? (
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
          ) : (
            'This NiFi URL is not active'
          )}
        </div>
      </Tooltip>
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
};
