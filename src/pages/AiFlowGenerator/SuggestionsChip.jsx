import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { AiFlowSuggestionsIcon } from '../../assets/Icons/AiFlowSuggestionsIcon';
import { LessArrowIcon } from '../../assets';
import { v4 as uuidv4 } from 'uuid';
import { KDFM } from '../../constants';
import { toast } from 'react-toastify';
import { validatePayload } from './utils';
import { AiFlowGeneratorActions } from '../../store';
import { useDispatch } from 'react-redux';
import { GENAI_CONFIG } from '../../constants/aiFlowGenerator.constant';

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  overflow-x: auto;
  width: 100%;
  padding: 8px;
  width: 100%;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    max-width: 90vw;
  }
`;

const ChatWindowBg = styled.div`
  min-width: 205px;
  min-height: 140px;
  background: #f5f7fa;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #d8dee5;
  padding: 10px;
`;

const Message = styled.div`
  color: #727378;
  font-size: 16px;
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 400;
  line-height: 20px;
  word-wrap: break-word;
  padding: 10px;
`;

const Frame = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NotificationIcon = styled.div`
  position: relative;
`;

const Label = styled.div`
  width: 87%;
  color: #444445;
  font-size: 14px;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 10px;
`;

const GenerateButton = styled.div`
  color: #ff7a00;
  font-size: 16px;
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 700;
`;

const SuggetionsChip = ({
  SuggetionsArray,
  setOpenConversation,
  generateFlowPermission,
  setQueryLable,
  setQueryText,
  refresh,
  setisInputEmpty,
  setIsPromptInputDisabled,
}) => {
  const dispatch = useDispatch();
  const handleGenerateFLowClick = flow => {
    if (!generateFlowPermission) {
      if (!toast.isActive('permission-error')) {
        toast.error(KDFM.NO_PERMISSION_TO_GENERATE_FLOW, {
          toastId: 'permission-error',
        });
      }
      return;
    } else {
      setIsPromptInputDisabled(true);
      setisInputEmpty(true);
      setQueryText(flow?.query);
      setQueryLable(flow?.name);
      setOpenConversation(true);
      const payload = {
        session_id: uuidv4(),
        is_audio: false,
        query: flow?.query,
        embedding_model: GENAI_CONFIG.EMBEDDING_MODEL,
        engine: GENAI_CONFIG.APP_ENGINE,
        dept_id: GENAI_CONFIG.DEPT_ID,
        org_id: GENAI_CONFIG.ORG_ID,
        user_id: GENAI_CONFIG.USER_ID,
        type: GENAI_CONFIG.APP_TYPE,
        short_name: flow?.name || '',
        refresh: refresh,
      };
      const requiredFields = [
        'session_id',
        'query',
        'embedding_model',
        'engine',
        'dept_id',
        'org_id',
        'user_id',
        'type',
      ];
      if (validatePayload(payload, requiredFields)) {
        dispatch(AiFlowGeneratorActions.generateFlowAPI(payload));
      }
    }
  };
  return (
    <ChipWrapper>
      {SuggetionsArray?.slice(0, 4)?.map((item, index) => (
        <ChatWindowBg key={index}>
          <Header>
            <Frame>
              <NotificationIcon>
                <AiFlowSuggestionsIcon color="#444445" />
              </NotificationIcon>
              <Label data-tooltip-id={`${item?.id}-query-tooltip`}>
                {item?.name}
              </Label>
              <ReactTooltip
                id={`${item?.id}-query-tooltip`}
                place="top"
                content={item?.name}
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  zIndex: 9999,
                }}
              />
            </Frame>
          </Header>
          <Message>{item?.query}</Message>
          <Footer onClick={() => handleGenerateFLowClick(item)}>
            <GenerateButton>Generate</GenerateButton>
            <LessArrowIcon color="#FF7A00" />
          </Footer>
        </ChatWindowBg>
      ))}
    </ChipWrapper>
  );
};

export default SuggetionsChip;

SuggetionsChip.propTypes = {
  SuggetionsArray: PropTypes.array.isRequired,
  setQueryLable: PropTypes.func.isRequired,
  refresh: PropTypes.func,
  generateFlowPermission: PropTypes.bool,
  setOpenConversation: PropTypes.func,
  setQueryText: PropTypes.func,
  setisInputEmpty: PropTypes.func,
  setIsPromptInputDisabled: PropTypes.func,
};
