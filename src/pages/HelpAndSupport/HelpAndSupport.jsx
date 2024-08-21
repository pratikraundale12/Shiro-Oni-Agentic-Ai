import React from 'react';
import styled from 'styled-components';
import { HelpSupportIcon } from '../../assets';
import { Button } from '../../shared';

const HelpAndSupportContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 7rem; /* You can adjust the margin here if needed */
`;

const Text = styled.div`
  font-family: Noto Sans;
  font-size: 24px;
  font-weight: 600;
  line-height: 32.69px;
  text-align: center;
  margin-top: 2rem;
`;

const TextTwo = styled.div`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 400;
  line-height: 27.24px;
  text-align: center;
  margin-top: 1rem; /* Added margin-top for better spacing */
`;

const StyledButton = styled(Button)`
  width: auto;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%; /* Ensure ButtonDiv takes the full width */
  margin-top: 1rem; /* Added margin-top for spacing */
`;

export const HelpAndSupport = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:support@ksolves.com';
  };

  return (
    <>
      <HelpAndSupportContainer>
        <HelpSupportIcon />
      </HelpAndSupportContainer>
      <Text>
        If you have any questions or need assistance, our support team is here
        <br />
        to help! You can reach us via email at:
      </Text>
      <ButtonDiv>
        <StyledButton onClick={handleEmailClick}>
          support@ksolves.com
        </StyledButton>
      </ButtonDiv>
      <TextTwo>
        We aim to respond to all inquiries within 24 hours. Please provide as
        much detail <br />
        as possible in your email to help us assist you more efficiently.
      </TextTwo>
    </>
  );
};
