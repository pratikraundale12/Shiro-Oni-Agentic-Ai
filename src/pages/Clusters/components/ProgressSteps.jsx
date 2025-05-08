import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles';
import { CompletedLabelIcon, InprogressLabelIcon } from '../../../assets';
import { useSelector } from 'react-redux';
import { ClustersSelectors } from '../../../store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const HeaderText = styled.div`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 1%;
  vertical-align: middle;
  color: #444445;
`;
const HeaderContainer = styled.div`
  border-bottom: 2px solid ${theme.colors.darkGrey};
  padding-bottom: 10px;
`;
const StepConatiner = styled.div`
  border-bottom: 2px solid ${theme.colors.darkGrey};
  padding: 10px 10px 10px 0px;
`;
const StepHeaderText = styled.div`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  cursor: pointer;
`;
const StepContentContainer = styled.div`
  padding: 5px 20px 5px 20px;
`;
const StepContentItem = styled.li`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
`;

const StepProgress = () => {
  const [openTabIndex, setOpenTabIndex] = useState(null);
  const processData = useSelector(
    ClustersSelectors.getAnsibleClusterProgressData
  );
  const handleOpenTab = index => {
    if (openTabIndex === index) {
      setOpenTabIndex(null);
    } else {
      setOpenTabIndex(index);
    }
  };
  return (
    <Container>
      <HeaderContainer className="row d-flex">
        <HeaderText className="col-10">Steps</HeaderText>
        <HeaderText className="col-2">Action</HeaderText>
      </HeaderContainer>

      {processData?.data?.steps?.map((ele, index) => (
        <StepConatiner className="row d-flex" key={ele?.step}>
          <StepHeaderText
            className="col-10"
            onClick={() => handleOpenTab(index)}
          >
            {ele?.step}
          </StepHeaderText>
          <StepHeaderText
            className="col-2"
            onClick={() => handleOpenTab(index)}
          >
            {ele?.status === 'completed' ? (
              <CompletedLabelIcon width={110} height={40} />
            ) : (
              <InprogressLabelIcon width={110} height={40} />
            )}
          </StepHeaderText>
          {openTabIndex === index && (
            <StepContentContainer>
              {ele?.log?.map(item => (
                <StepContentItem key={item}>{item}</StepContentItem>
              ))}
            </StepContentContainer>
          )}
        </StepConatiner>
      ))}
    </Container>
  );
};

export default StepProgress;
