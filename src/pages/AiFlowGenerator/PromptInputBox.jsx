import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SendMessageIcon } from '../../assets';
import { KDFM } from '../../constants';

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputBox = styled.input`
  border-radius: 30px;
  border-width: 1px;
  width: 100%;
  height: 90px;
  padding: 20px;
  outline: none;
  border: 1px solid rgba(221, 228, 240, 1);

  :focus {
    outline: none;
    border-color: rgba(160, 167, 187, 1); /* Add a visible change for focus */
  }

  &::placeholder {
    color: rgba(160, 167, 187, 1);
    font-family:
      'Red Hat Display', sans-serif; /* Ensure correct font loading */
    font-weight: 400;
    font-size: 20px;
    line-height: 16px;
    letter-spacing: 0%;
  }

  /* Add cross-browser compatibility */
  ::-webkit-input-placeholder {
    color: rgba(160, 167, 187, 1);
    font-family: 'Red Hat Display', sans-serif;
  }
  :-moz-placeholder {
    color: rgba(160, 167, 187, 1);
    font-family: 'Red Hat Display', sans-serif;
  }
  ::-moz-placeholder {
    color: rgba(160, 167, 187, 1);
    font-family: 'Red Hat Display', sans-serif;
  }
  :-ms-input-placeholder {
    color: rgba(160, 167, 187, 1);
    font-family: 'Red Hat Display', sans-serif;
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

const PromptInputBox = () => {
  const [queryText, setQueryText] = useState('');
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

export default PromptInputBox;
