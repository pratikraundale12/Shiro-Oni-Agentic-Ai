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

const InfoWrapper = styled.div`
  width: 100%;
  max-width: 500px; /* wrapper width */
  margin-top: 25px; /* space between expiry date and info block */
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const InfoRow = styled.div`
  display: flex;
  &:not(:last-child) {
    border-bottom: 1px solid #ffe5cc;
  }
`;

const TitleCell = styled.div`
  flex: 0 0 50%;
  background: #f7f7f5;
  padding: 14px 16px;
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: #444445;
`;

const ValueCell = styled.div`
  flex: 0 0 50%;
  background: #fff2e5;
  padding: 14px 16px;
  font-family: Red Hat Display;
  font-weight: 500;
  font-size: 16px;
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

  const infoItems = [
    { name: 'License Owner', value: licenseInfo?.customerName },
    { name: 'License Id', value: licenseInfo?.customerId },
    { name: 'Number of Nodes', value: licenseInfo?.numberOfNodes },
  ].filter(
    item => item.value !== undefined && item.value !== null && item.value !== ''
  );

  return (
    <div className="h-100">
      <Heading>{KDFM.LICENSE_DETAILS}</Heading>
      <Container>
        <BgImage src={Image} />
        <Span1>{getLicenseText()}</Span1>
        <Span2>{formatDate(licenseInfo?.exprDate)}</Span2>

        {infoItems.length > 0 && (
          <InfoWrapper>
            {infoItems.map((item, idx) => (
              <InfoRow key={idx}>
                <TitleCell>{item.name}</TitleCell>
                <ValueCell>{item.value}</ValueCell>
              </InfoRow>
            ))}
          </InfoWrapper>
        )}
      </Container>
    </div>
  );
};

export default License;
