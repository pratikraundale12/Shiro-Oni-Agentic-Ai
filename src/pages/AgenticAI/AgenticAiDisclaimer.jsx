import React from 'react';
import styled from 'styled-components';
import { KDFM } from '../../constants';
// import { history } from '../../helpers/history';

const DisclaimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 14px;
  color: #999;
  margin-top: 10px;
  text-align: center;
  max-width: 90%;
`;

const DisclaimerLink = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  color: #ff7a00;
  text-decoration: underline;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`;

export const AgenticAiDisclaimer = () => {
  const handleRedirect = e => {
    e.preventDefault();
    return;
    // history.push('/policy/privacy-policy');
  };

  return (
    <DisclaimerWrapper>
      <span>{KDFM.AGENTIC_AI_MODAL_TITLE} can make mistakes. Check our</span>
      <DisclaimerLink type="button" onClick={handleRedirect}>
        Terms & Conditions.
      </DisclaimerLink>
    </DisclaimerWrapper>
  );
};
