import React, { useState } from 'react';
import styled from 'styled-components';
import { LinkIcons, QRIcons, TodoIcon } from '../../assets';
import { Button, InputField, RadioField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table } from '../../components';

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
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;

const Upgrade = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { upgradeData, selectedClusterName, selectedClusterId, deployData } =
    location.state || {};
  const [selectedVersion, setSelectedVersion] = useState(null);
  const COLUMNS = onVersionSelect => [
    {
      label: 'Version',
      renderCell: item => <div>{item.version}</div>,
    },
    {
      label: 'Created',
      renderCell: item => <div>{item.createdAt}</div>,
    },
    {
      label: 'Comment',
      renderCell: item => <div>{item.comments}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <RadioField
          disabled={upgradeData?.version === item.version}
          name="select"
          onChange={() => onVersionSelect(item.version)}
        />
      ),
      width: '10%',
    },
  ];

  console.log({ upgradeData });
  const breadcrumbData = [
    { id: '1', name: 'Namespace List' },
    { id: '2', name: 'Select Namespace' },
    { id: '3', name: 'Configuration Details' },
  ];
  const handleBreadcrumbClick = breadcrumb => {
    console.log('Breadcrumb clicked:', breadcrumb);
    // Perform your navigation or other actions here
  };
  const handleClick = () => {
    navigate('/namespaces/summary', {
      state: {
        upgradeData,
        selectedVersion,
        selectedClusterName,
        selectedClusterId,
        deployData,
      },
    });
  };
  console.log({ deployData });

  const handleBackClick = () => {
    navigate('/namespaces/deploy');
  };

  const handleVersionSelect = version => {
    setSelectedVersion(version);
  };
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
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          breadcrumbs={breadcrumbData}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <InputField
                name="cluster"
                type="text"
                label="Selected Cluster"
                // placeholder="Nifi Namespace"
                value={selectedClusterName}
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
                    value={upgradeData?.name || deployData?.name}
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
                    value={upgradeData?.position?.x || deployData?.position?.x}
                    icon={'x:'}
                    disabled
                  />
                  <InputField
                    name="y"
                    type="text"
                    label="Canvas Position Y"
                    placeholder="y123"
                    value={upgradeData?.position?.y || deployData?.position?.y}
                    icon={'y:'}
                    disabled
                  />
                </ColXlFive>
                <ColXlTwo className="col-xl-2 col-6">
                  <InputField
                    name="currentVersion"
                    type="text"
                    label="Current Version"
                    placeholder="N/A"
                    value={upgradeData?.version || 'N/A'}
                    icon={<QRIcons />}
                    disabled
                  />
                </ColXlTwo>
                <ColXlSix className="col-xl-5 col-6">
                  <InputField
                    name="currentState"
                    type="text"
                    label="Current State"
                    // placeholder="Local Changes"
                    value={upgradeData?.stateExplanation || 'N/A'}
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
                    value={upgradeData?.nifiUrl || deployData?.nifiUrl}
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
                    value={upgradeData?.registryUrl || deployData?.registryUrl}
                    icon={<LinkIcons />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>

          <Table
            data={upgradeData?.versionList || deployData?.versionList}
            columns={COLUMNS(handleVersionSelect)}
          />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            Back
          </Button>
          <Button onClick={handleClick} disabled={!selectedVersion}>
            Upgrade
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Container>
  );
};

export default Upgrade;
