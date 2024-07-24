import React from 'react';
import styled from 'styled-components';
import { QRIcons, TodoIcon } from '../../assets/Icons';
import { InputField } from '../../shared';
const Container = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 37px 50px 22px 20px;
`;
const MainHeadingdiv = styled.div`
  height: 37px;
  margin-bottom: 1rem !important;
  align-items: center !important;
  justify-content: space-between !important;
  display: flex !important;
`;
const MainHeadingInnerDIv = styled.div`
  align-items: center !important;
  display: flex !important;
  gap: 10px;
`;
const HfourTag = styled.h4`
  margin-bottom: 0 !important;
`;
const SmallContainer = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
  margin-bottom: 1rem !important;
  width: 100% !important;
`;
const SmallContainerDiv = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 0.25rem !important;
`;
const ConfigBox = styled.div`
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
`;
const ConfigBoxDiv = styled.div`
  flex: 0 0 auto;
  width: 100%;
`;
const ConfigBoxDivInput = styled.div`
  margin-bottom: 30px;
`;
const ConfigBoxInnerDiv = styled.div`
  @media (min-width: 1200px) {
    flex: 0 0 auto;
    width: 41.66666667%;
  }
  flex: 0 0 auto;
  width: 100%;
`;
const ConfigBoxInputInnerDiv = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;
const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
`;

const Upgrade = () => {
  return (
    <Container>
      <MainHeadingdiv>
        <MainHeadingInnerDIv>
          <div>
            <TodoIcon />
          </div>
          <HfourTag>Deploy Namespace</HfourTag>
        </MainHeadingInnerDIv>
      </MainHeadingdiv>
      <SmallContainer>
        <SmallContainerDiv>
          <ConfigBox>
            <ConfigBoxDiv>
              <ConfigBoxDivInput>
                <InputField
                  name="username"
                  type="text"
                  label="Selected Cluster"
                  placeholder="Production CLuster"
                  icon={<QRIcons />}
                  disabled
                />
              </ConfigBoxDivInput>
            </ConfigBoxDiv>
            <ConfigBoxDiv>
              <ConfigBoxDivInput>
                <InputField
                  name="username"
                  type="text"
                  label="Selected Namespcae"
                  placeholder="Production NameSpace"
                  icon={<QRIcons />}
                  disabled
                />
              </ConfigBoxDivInput>
            </ConfigBoxDiv>
            <ConfigBoxDiv>
              <ConfigBoxInnerDiv>
                <ConfigBoxDivInput>
                  <ConfigBoxInputInnerDiv>
                    <InputGroup>
                      <InputField
                        name="username"
                        type="text"
                        label="Canvas Position"
                        placeholder="X-Axis"
                        icon={<QRIcons />}
                      />
                    </InputGroup>

                    <InputField
                      name="username"
                      type="text"
                      placeholder="Y-Axis"
                      icon={<QRIcons />}
                    />
                  </ConfigBoxInputInnerDiv>
                </ConfigBoxDivInput>
              </ConfigBoxInnerDiv>
              <div></div>
              <div></div>
            </ConfigBoxDiv>
            <ConfigBoxDiv></ConfigBoxDiv>
          </ConfigBox>
        </SmallContainerDiv>
      </SmallContainer>
    </Container>
  );
};

export default Upgrade;
