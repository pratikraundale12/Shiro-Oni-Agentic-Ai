import React from 'react';
import styled from 'styled-components';
import {
  MaximizeModalIconNew,
  MinimizeModalIconNew,
  MinimizeScreenIcon,
  NewChatIcon,
} from '../../assets';
import { SvgButton } from '../../shared';
import { theme } from '../../styles';
import { AgenticAiActions, AgenticAiSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActionButton = styled(SvgButton)`
  width: 36px;
  height: 36px;
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`;

const NewChat = styled(NewChatIcon)`
  border-radius: 50%;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.primary};
`;

const MiniScreen = styled(MinimizeScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.primary};
`;

const MaximizeModal = styled(MaximizeModalIconNew)`
  border-radius: 50%;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.primary};
`;

const MinimizeModal = styled(MinimizeModalIconNew)`
  border-radius: 50%;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.primary};
`;

export const AgenticAiAdditionalActions = ({
  onMinimizeScreenClick = () => {},
}) => {
  const dispatch = useDispatch();

  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );
  const conversationalRes = useSelector(
    AgenticAiSelectors.getConversationHistory
  );
  const hasMessages = !isEmpty(conversationalRes);
  const toggleFullScreen = () => {
    dispatch(AgenticAiActions.setAgenticAiModalFullScreen(!isFullscreen));
  };

  const handleNewChat = () => {
    dispatch(AgenticAiActions.resetChat());
    dispatch(AgenticAiActions.fetchSessionId());
  };

  return (
    <ActionsContainer>
      <HeaderActionButton
        type="button"
        icon={<NewChat />}
        onClick={() => hasMessages && handleNewChat()}
        disabled={!hasMessages}
        data-tooltip-id={'tooltip-id-new-chat'}
      />
      <ReactTooltip
        id="tooltip-id-new-chat"
        place="bottom"
        content="New Chat"
        style={{
          zIndex: 9999,
        }}
      />
      <HeaderActionButton
        type="button"
        icon={isFullscreen ? <MinimizeModal /> : <MaximizeModal />}
        onClick={toggleFullScreen}
        data-tooltip-id={'tooltip-id-minimize-maximize-modal'}
      />
      <ReactTooltip
        id="tooltip-id-minimize-maximize-modal"
        place="bottom"
        content={isFullscreen ? 'Collapse' : 'Expand'}
        style={{
          zIndex: 9999,
        }}
      />
      <HeaderActionButton
        type="button"
        icon={<MiniScreen color="#fff" />}
        onClick={onMinimizeScreenClick}
        data-tooltip-id={'tooltip-id-minimize-screen'}
      />
      <ReactTooltip
        id="tooltip-id-minimize-screen"
        place="bottom"
        content="Minimize"
        style={{
          zIndex: 9999,
        }}
      />
    </ActionsContainer>
  );
};

AgenticAiAdditionalActions.propTypes = {
  onMinimizeScreenClick: PropTypes.func,
};
