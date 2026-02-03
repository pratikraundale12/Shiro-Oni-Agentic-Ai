import React, { useState } from 'react';
import styled from 'styled-components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { TermsOfUse } from '../PolicyAndTermsOfUse/TermsOfUse';

const DisclaimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 14px;
  color: #999;
  margin-top: 8px;
  text-align: center;
  max-width: 95%;
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
  const [isTermsAndConditionsOpen, setIsTermsAndConditionsOpen] =
    useState(false);
  const handleRedirect = e => {
    e.preventDefault();
    setIsTermsAndConditionsOpen(p => !p);
  };

  return (
    <>
      <DisclaimerWrapper>
        <span>
          {KDFM.AGENTIC_AI_MODAL_TITLE} is an AI agent, and results generated
          may vary. Check our
        </span>
        <DisclaimerLink type="button" onClick={handleRedirect}>
          Terms & Conditions.
        </DisclaimerLink>
      </DisclaimerWrapper>
      <Modal
        size="lg"
        title="Terms of Use"
        isOpen={isTermsAndConditionsOpen}
        contentStyles={{ minWidth: '65%' }}
        primaryButtonText={'Continue'}
        primaryBtnSize="md"
        onSubmit={() => setIsTermsAndConditionsOpen(false)}
        closeIcon={true}
        onRequestClose={() => setIsTermsAndConditionsOpen(false)}
        footerAlign="end"
      >
        <>
          <TermsOfUse />
        </>
      </Modal>
    </>
  );
};
