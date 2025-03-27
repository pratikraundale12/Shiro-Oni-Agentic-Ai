import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AuthenticationSelectors } from '../../store';
import Image from '../../assets/images/license-bg.png';
import { KDFM } from '../../constants';

const Container = styled.div`
  height: 95%;
  border: 1px solid #dde4f0;
  background-color: #fbfcff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 7px;
`;

const Span1 = styled.span`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0%;
  text-align: center;
  color: #7a7a7a;
`;

const Span2 = styled.span`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0%;
  text-align: center;
  color: #444445;
`;

const BgImage = styled.img``;

const Heading = styled.span`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #444445;
`;

const License = () => {
  const licenseInfo = useSelector(AuthenticationSelectors.getLicenseInfo);
  const formatDate = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getLicenseText = () => {
    if (licenseInfo?.version.toLowerCase() === 'trial') {
      return 'Your Trial License will expire on';
    } else {
      return 'Your License will expire on';
    }
  };

  return (
    <div className="h-100">
      <Heading>{KDFM.LICENSE_DETAILS}</Heading>
      <Container>
        <BgImage src={Image} />
        <Span1>{getLicenseText()}</Span1>
        <Span2>{formatDate(licenseInfo?.exprDate)}</Span2>
      </Container>
    </div>
  );
};

export default License;
