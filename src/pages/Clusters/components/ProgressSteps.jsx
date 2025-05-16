import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles';
import { CompletedLabelIcon, InprogressLabelIcon } from '../../../assets';
import { useSelector } from 'react-redux';
import { ClustersSelectors } from '../../../store';
import { Loader } from '../../../components';
import { isEmpty } from 'lodash';

const getInProgressSVG = () => {
  return `data:image/svg+xml,<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5.5" cy="5.5" r="4.75" fill="%23FF7A00" /></svg>`;
};

const checkTickSVG = () => {
  return `data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_1985_71366" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="%23D9D9D9"/></mask><g mask="url(%23mask0_1985_71366)"><path d="M10.5808 16.2538L17.3038 9.53075L16.25 8.47693L10.5808 14.1462L7.73075 11.2962L6.67693 12.35L10.5808 16.2538ZM12.0016 21.5C10.6877 21.5 9.45268 21.2506 8.29655 20.752C7.1404 20.2533 6.13472 19.5765 5.2795 18.7217C4.42427 17.8669 3.74721 16.8616 3.24833 15.706C2.74944 14.5504 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45268 3.248 8.29655C3.74667 7.1404 4.42342 6.13472 5.27825 5.2795C6.1331 4.42427 7.13834 3.74721 8.29398 3.24833C9.44959 2.74944 10.6844 2.5 11.9983 2.5C13.3122 2.5 14.5473 2.74933 15.7034 3.248C16.8596 3.74667 17.8652 4.42342 18.7205 5.27825C19.5757 6.1331 20.2527 7.13834 20.7516 8.29398C21.2505 9.44959 21.5 10.6844 21.5 11.9983C21.5 13.3122 21.2506 14.5473 20.752 15.7034C20.2533 16.8596 19.5765 17.8652 18.7217 18.7205C17.8669 19.5757 16.8616 20.2527 15.706 20.7516C14.5504 21.2505 13.3156 21.5 12.0016 21.5Z" fill="%23FF7A00"/></g></svg>`;
};

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
  position: relative;
  &:last-child {
    &::before {
      border-left: 2px solid white;
      content: '';
      position: absolute;
      display: block;
      height: 100%;
      left: -24px;
      top: 26px;
    }
  }
  &::after {
    content: '';
    position: absolute;
    left: -35px;
    top: 30px;
    transform: translateY(-50%);
    border: 1px solid rgba(217, 217, 217, 1);
    height: 24px;
    border-radius: 50%;
    width: 24px;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
  }
  &.processing::after {
    background-image: url('${getInProgressSVG()}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 12px;
  }
  &.done::after {
    background-image: url('${checkTickSVG()}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 29px;
    border: 1px solid #ff7a00;
  }
  &.done:not(:last-child)::before {
    content: '';
    position: absolute;
    display: block;
    border-left: 2px solid #ff7a00;
    height: 100%;
    left: -24px;
    top: 26px;
    transition: all 0.3s ease-in-out;
  }
`;
const StepHeaderText = styled.div`
  line-height: 40px;
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

const ProgressStage = styled.div`
  position: relative;
  padding-left: 2rem;
  &::before {
    content: '';
    border-left: 2px solid rgba(217, 217, 217, 1);
    left: -4px;
    top: 33px;
    height: calc(100% - 57px);
    position: absolute;
    bottom: 0;
  }
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
      <>
        <HeaderContainer className="row d-flex">
          <HeaderText className="col-10">Steps</HeaderText>
          <HeaderText className="col-2">Action</HeaderText>
        </HeaderContainer>
        {isEmpty(processData?.data?.steps) ? (
          <div className="mt-3">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {' '}
            <ProgressStage>
              {processData?.data?.steps?.map((ele, index) => (
                <StepConatiner
                  className={`row d-flex ${ele?.status === 'completed' ? 'done' : 'processing'}`}
                  key={ele?.step}
                >
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
            </ProgressStage>
          </>
        )}
      </>
    </Container>
  );
};

export default StepProgress;
