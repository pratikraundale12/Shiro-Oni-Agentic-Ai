import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SendMessageIcon } from '../../assets';
import { KDFM } from '../../constants';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { AiFlowGeneratorActions } from '../../store';
import { validatePayload } from './utils';
import { v4 as uuidv4 } from 'uuid';

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const InputBox = styled.textarea`
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0%;
  border-radius: 30px;
  border-width: 1px;
  width: 100%;
  font-family: 'Red Hat Display', sans-serif;
  height: 90px;
  padding: 20px;
  outline: none;
  border: 1px solid rgba(221, 228, 240, 1);
  box-shadow: 0px 19px 29px 0px rgba(30, 31, 34, 0.05);
  font-size: 20px;
  color: rgba(68, 68, 67, 1);
  resize: none; /* Disable manual resizing */
  overflow-y: auto; /* Enable vertical scroll */
  word-break: break-word; /* Ensure long words break to avoid overflow */
  white-space: pre-wrap; /* Preserve line breaks and wrap text */

  &:disabled {
    cursor: not-allowed;
  }
  :focus {
    outline: none;
    border-color: rgba(160, 167, 187, 1);
  }

  &::placeholder {
    color: rgba(160, 167, 187, 1);
    font-family: 'Red Hat Display', sans-serif;
    font-weight: 400;
    font-size: 20px;
  }
`;

const GenerateFLowButton = styled.button`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${props =>
    props.isSendBtnDisabled ? 'rgba(68 67 67 / 28%)' : 'rgba(255, 122, 0, 1)'};
  opacity: ${props => (props.isSendBtnDisabled ? 0.5 : 1)};
  cursor: ${props => (props.isSendBtnDisabled ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
  padding: 10px 10px 10px 7px;
  right: 13px;
  svg {
    z-index: 9999999;
  }
`;

export const PromptInputBox = ({
  disabled,
  queryText,
  setQueryText,
  setOpenConversation,
  setIsPromptInputDisabled,
  queryLabel,
}) => {
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  console.log('disabled--', disabled);
  useEffect(() => {
    if (queryText?.length !== 0) {
      setIsSendBtnDisabled(false);
    } else {
      setIsSendBtnDisabled(true);
    }
  }, [queryText]);
  const dispatch = useDispatch();
  const handleGenerateFLowClick = () => {
    // add additional check
    if (disabled) {
      if (!toast.isActive('permission-error')) {
        toast.error(KDFM.NO_PERMISSION_TO_GENERATE_FLOW, {
          toastId: 'permission-error',
        });
      }
      setQueryText('');
      setIsSendBtnDisabled(true);
      return;
    } else if (isSendBtnDisabled) {
      if (!toast.isActive('empty-input')) {
        toast.error(KDFM.EMPTY_QUERY, {
          toastId: 'empty-input',
        });
      }
      return;
    } else {
      setIsPromptInputDisabled(true);
      setIsSendBtnDisabled(true);
      setOpenConversation(true);
      console.log('queryText', queryText);
      const payload = {
        session_id: uuidv4(), // Generate a unique session_id on each call
        is_audio: false,
        query: queryText,
        embedding_model: process.env.REACT_APP_EMBEDDING_MODEL,
        engine: process.env.REACT_APP_ENGINE,
        dept_id: process.env.REACT_APP_DEPT_ID,
        org_id: process.env.REACT_APP_ORG_ID,
        user_id: process.env.REACT_APP_USER_ID,
        type: process.env.REACT_APP_TYPE,
        short_name: queryLabel || '',
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
    <InputContainer>
      <InputBox
        id="prompt-input-box"
        name="prompt-input-box"
        disabled={disabled}
        type="search"
        value={disabled ? '' : queryText}
        placeholder={KDFM.PROMPT_INPUT_PLACEHOLDER}
        onChange={e => {
          let value = e.target.value;
          value = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
          value = _.trim(value).replace(/\s+/g, ' ');
          setQueryText(value);
          setIsSendBtnDisabled(value.length === 0);
        }}
      />
      <GenerateFLowButton
        disabled={isSendBtnDisabled}
        isSendBtnDisabled={isSendBtnDisabled}
        onClick={handleGenerateFLowClick}
      >
        <SendMessageIcon color={isSendBtnDisabled ? '#444443' : '#FFFFFF'} />
      </GenerateFLowButton>
    </InputContainer>
  );
};

PromptInputBox.propTypes = {
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setOpenConversation: PropTypes.func.isRequired,
  setIsPromptInputDisabled: PropTypes.func.isRequired,
  queryLabel: PropTypes.string,
};
