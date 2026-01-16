import React from 'react';
import styled from 'styled-components';
import {
  MaximizeModalIcon,
  MinimizeModalIcon,
  MinimizeScreenIcon,
  NewChatIcon,
} from '../../assets';
import { SvgButton } from '../../shared';
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
`;

const MiniScreen = styled(MinimizeScreenIcon)`
  border-radius: 50%;
`;

const MaximizeModal = styled(MaximizeModalIcon)`
  border-radius: 50%;
`;

const MinimizeModal = styled(MinimizeModalIcon)`
  border-radius: 50%;
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
        icon={<MiniScreen />}
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
