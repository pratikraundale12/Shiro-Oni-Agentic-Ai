import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SendMessageIcon } from '../../assets';
import { KDFM } from '../../constants';

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

const GenerateFLowButton = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${props =>
    props.isSendBtnDisabled ? 'rgba(68 67 67 / 28%)' : 'rgba(255, 122, 0, 1)'};
  opacity: ${props => (props.isSendBtnDisabled ? 0.5 : 1)};
  cursor: ${props => (props.isSendBtnDisabled ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
  padding: 12px 10px 10px 8px;
  right: 13px;
  svg {
    z-index: 9999999;
  }
`;

export const PromptInputBox = ({ queryText, setQueryText }) => {
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const handleGenerateFLowClick = () => {
    console.log('queryText', queryText);
  };
  return (
    <InputContainer>
      <InputBox
        type="search"
        value={queryText}
        placeholder={KDFM.PROMPT_INPUT_PLACEHOLDER}
        onChange={e => {
          const value = e.target.value;
          setQueryText(value);
          if (value?.length > 0) {
            setIsSendBtnDisabled(false);
          } else {
            setIsSendBtnDisabled(true);
          }
        }}
      />
      <GenerateFLowButton
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
};
