import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles';
import { useDispatch } from 'react-redux';
import { SchedularActions } from '../../store/schedular';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const TextColor = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const GroupSpan = styled.span`
  color: ${theme.colors.primary};
  cursor: pointer;
`;

export const ApproverGroupDisplay = ({
  item,
  capitalizeText = true,
  // toolTip = true,
  ...rest
}) => {
  const dispatch = useDispatch();
  const textToRender =
    typeof text === 'number'
      ? String(item?.approver_group)
      : item?.approver_group;

  return (
    <TextColor {...rest} capitalizeText={capitalizeText}>
      {item?.action_by ? (
        <span>{item?.action_by}</span>
      ) : (
        <GroupSpan
          data-tooltip-id={`group-name-list`}
          onClick={() => {
            dispatch(SchedularActions.setIsGroupListModalOpen(true));
            dispatch(SchedularActions.setSelectedSchedule(item));
          }}
        >
          {textToRender}
        </GroupSpan>
      )}
      <ReactTooltip
        id={`group-name-list`}
        place="right"
        content={'Click to view group members'}
        style={{
          width: 'max-content',
          maxWidth: '400px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 9999,
        }}
      />
    </TextColor>
  );
};

ApproverGroupDisplay.propTypes = {
  item: PropTypes.object,
  capitalizeText: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  toolTip: PropTypes.bool,
  children: PropTypes.any,
  content: PropTypes.any,
  placement: PropTypes.string,
};
