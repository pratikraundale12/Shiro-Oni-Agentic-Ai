import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SendMessageIcon } from '../../assets';
import { KDFM } from '../../constants';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { AiFlowGeneratorActions, AuthenticationSelectors } from '../../store';
import { validateInput, validatePayload } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { GENAI_CONFIG } from '../../constants/aiFlowGenerator.constant';
import { FieldErrorMessage } from '../../shared';

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
  refresh,
  isInputEmpty,
  inputError,
  setInputError,
}) => {
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);

  useEffect(() => {
    const { isValid } = validateInput(queryText);
    if (queryText?.length && !isInputEmpty && isValid) {
      setIsSendBtnDisabled(false);
      setInputError({});
    } else {
      setIsSendBtnDisabled(true);
    }
  }, [queryText, isInputEmpty]);

  const dispatch = useDispatch();
  const handleGenerateFLowClick = () => {
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
      const payload = {
        session_id: uuidv4(),
        is_audio: false,
        query: queryText,
        embedding_model: GENAI_CONFIG.EMBEDDING_MODEL,
        engine: GENAI_CONFIG.APP_ENGINE,
        dept_id: GENAI_CONFIG.DEPT_ID,
        org_id: GENAI_CONFIG.ORG_ID,
        user_id: GENAI_CONFIG.USER_ID,
        type: GENAI_CONFIG.APP_TYPE,
        short_name: queryLabel || '',
        refresh: refresh,
        logged_in_user: currentUser?.id,
        user_role: currentUser?.role,
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
        'logged_in_user',
        'user_role',
      ];
      if (validatePayload(payload, requiredFields)) {
        dispatch(AiFlowGeneratorActions.generateFlowAPI(payload));
      }
    }
  };
  return (
    <>
      <InputContainer>
        <InputBox
          id="prompt-input-box"
          name="promptInputBox"
          disabled={disabled}
          type="textarea"
          value={disabled || isInputEmpty ? '' : queryText}
          placeholder={KDFM.PROMPT_INPUT_PLACEHOLDER}
          onChange={e => {
            let value = e.target.value;
            value = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
            let liveValue = value.replace(/\s{2,}/g, ' ').trimStart();
            setQueryText(liveValue);
            const { isValid } = validateInput(value);
            setIsSendBtnDisabled(!isValid && !isInputEmpty);
            if (!isValid) {
              setInputError({
                promptInputBox: {
                  message: 'Invalid Input',
                },
              });
            } else {
              setInputError({});
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !isSendBtnDisabled) {
              e.preventDefault();
              handleGenerateFLowClick();
            }
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
      <FieldErrorMessage errors={inputError} name={'promptInputBox'} />
    </>
  );
};

PromptInputBox.propTypes = {
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setOpenConversation: PropTypes.func.isRequired,
  setIsPromptInputDisabled: PropTypes.func.isRequired,
  queryLabel: PropTypes.string,
  refresh: PropTypes.func,
  isInputEmpty: PropTypes.bool,
  inputError: PropTypes.object,
  setInputError: PropTypes.func,
};
