import React from 'react';
import styled from 'styled-components';
import { LinkIcons, QRIcons, TodoIcon } from '../../assets';
import { Button, InputField } from '../../shared';

const Container = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 37px 50px 22px 20px;
  --bs-bg-opacity: 1;
  background-color: white !important;
`;
const TopTitleBar = styled.div`
  height: 37px;
  align-items: center;
  justify-content: space-between !important;
`;
const MainTitleDiv = styled.div`
  gap: 10px;
  align-items: center;
`;
const MainTitleHfour = styled.h4`
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  color: #444445;
`;
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: calc(-0.5 * 1.5rem);
  margin-left: calc(-0.5 * 1.5rem);
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const ColLgSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }

  @media screen and (min-width: 992px) {
    &.col-lg-6 {
      flex: 0 0 auto;
      width: 50%;
    }
  }
`;
const ColXlFive = styled.div`
  flex: 0 0 auto;
  width: 41.66666667%;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 18px;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }

  @media screen and (min-width: 1200px) {
    &.col-xl-5 {
      flex: 0 0 auto;
      width: 41.66666667%;
    }
  }
`;
const ColXlTwo = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }

  @media screen and (min-width: 1200px) {
    &.col-xl-2 {
      flex: 0 0 auto;
      width: 16.66666667%;
    }
  }
`;
const ColXlSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }

  @media screen and (min-width: 1200px) {
    &.col-xl-5 {
      flex: 0 0 auto;
      width: 41.66666667%;
    }
  }
`;

const Upgrade = () => {
  return (
    <Container>
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">Deploy Namespace</MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <div className="d-flex align-items-center breadcrumb-container mb-3">
        <span className="cursor-pointer">Namespace List</span>
        <span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.78105 8.00047L5.4812 4.70062L6.42401 3.75781L10.6667 8.00047L6.42401 12.2431L5.4812 11.3003L8.78105 8.00047Z"
              fill="#444445"
            />
          </svg>
        </span>
        <span className="cursor-pointer">Select Namespace</span>
        <span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.78105 8.00047L5.4812 4.70062L6.42401 3.75781L10.6667 8.00047L6.42401 12.2431L5.4812 11.3003L8.78105 8.00047Z"
              fill="#444445"
            />
          </svg>
        </span>
        <span className="cursor-pointer active">Configuration Details</span>
      </div>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <InputField
                name="cluster"
                type="text"
                label="Selected Cluster"
                placeholder="Nifi Namespace"
                icon={<QRIcons />}
                disabled
              />
            </div>
            <div className="col-12 p-3">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <InputField
                    name="namespace"
                    type="text"
                    label="Selected Namespace"
                    placeholder="Nifi Namespace"
                    icon={<QRIcons />}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col-12 p-3">
              <RowConfig className="row">
                <ColXlFive className="col-xl-5 col-12">
                  <InputField
                    name="x"
                    type="text"
                    label="Canvas Position X"
                    placeholder="x123"
                    icon={'x:'}
                  />
                  <InputField
                    name="y"
                    type="text"
                    label="Canvas Position Y"
                    placeholder="y123"
                    icon={'y:'}
                  />
                </ColXlFive>
                <ColXlTwo className="col-xl-2 col-6">
                  <InputField
                    name="currentVersion"
                    type="text"
                    label="Current Version"
                    placeholder="N/A"
                    icon={<QRIcons />}
                    disabled
                  />
                </ColXlTwo>
                <ColXlSix className="col-xl-5 col-6">
                  <InputField
                    name="currentState"
                    type="text"
                    label="Current State"
                    placeholder="Local Changes"
                    icon={<QRIcons />}
                    disabled
                  />
                </ColXlSix>
              </RowConfig>
            </div>
            <div className="col-12 p-3">
              <RowConfig className="row">
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="nifiurl"
                    type="text"
                    label="Nifi URL"
                    placeholder="Nifi Namespace"
                    icon={<LinkIcons />}
                    disabled
                  />
                </ColLgSix>
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="registry_url"
                    type="text"
                    label="Registry URL"
                    placeholder="Nifi Namespace"
                    icon={<LinkIcons />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>
          {/* <div className="d-flex align-items-center breadcrumb-container mb-3">
            <span className="cursor-pointer version-title">
              Version Control
            </span>
          </div>
          <div className="table-area position-relative mb-3">
            <div className="main-table-div main-table-resposniveness-2">
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Created</th>
                    <th>Comments</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="position-relative">Version 5</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="darker-font">
                          06/26/2024 17:14: 32: 276
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="darker-font">5th Version Updated</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end">
                        <div className="custom-checkbox-red form-check d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue=""
                            id="flexCheckChecked"
                            defaultChecked=""
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary">Back</Button>
          <Button>Upgrade</Button>
        </BottomButtonDiv>
      </BottomButton>
    </Container>
  );
};

export default Upgrade;
