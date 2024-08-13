import React from 'react';
import styled from 'styled-components';
import {
  LinkIcon,
  QRIcons,
  TodoIcon,
  UpsideSquareIcon,
  CanvasXIcon,
  CanvasYIcon,
} from '../../assets';
import { Button, InputField, RadioField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { Table } from '../../components';
import RightIcon from '../../assets/Icons/RightIcon';
import LocalChangesIcon from '../../assets/Icons/LocalChangesIcon';
import { useGlobalContext } from '../../utils';
import { history } from '../../helpers/history';

const Container = styled.div`
  // height: calc(100vh - 78px);
  // width: calc(100vw - 250px);
  // overflow: hidden;
  // padding: 37px 50px 22px 20px;
  // --bs-bg-opacity: 1;
  // background-color: white !important;
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
  align-items: self-end;
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
const StyledInputField = styled(InputField)`
  input {
    &:disabled {
      background-color: #ebf0f7;
      border-color: #ccc;
    }
  }
`;
const VersionDiv = styled.div`
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;

const Upgrade = () => {
  const { state, setState } = useGlobalContext();
  const convertDate = dateString => {
    const date = new Date(dateString);

    const pad = num => String(num).padStart(2, '0');

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const COLUMNS = onVersionSelect => [
    {
      label: 'Version',
      renderCell: item => <div>{item.version}</div>,
    },
    {
      label: 'Created',
      renderCell: item => <div>{convertDate(item.createdAt)}</div>,
    },
    {
      label: 'Comment',
      renderCell: item => <div>{item.comments}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RadioField
            disabled={state.upgradeData?.version === item.version}
            name="select"
            onChange={() => onVersionSelect(item.version)}
          />
        </div>
      ),
      width: '10%',
    },
  ];

  const breadcrumbData = [
    { id: '1', name: 'Namespace List', path: '/namespaces' },
    { id: '2', name: 'Select Namespace', path: '/namespaces/deploy' },
    { id: '3', name: 'Configuration Details' },
  ];
  const handleBreadcrumbClick = breadcrumb => {
    history.push(breadcrumb.path);
  };
  const handleClick = () => {
    history.push('/namespaces/summary', {
      state: {
        // upgradeData,
        // selectedVersion,
        // selectedClusterName,
        // selectedClusterId,
        // deployData,
        // depolyNamespaceId,
      },
    });
  };

  const handleBackClick = () => {
    history.push('/namespaces/deploy');
  };

  const handleVersionSelect = version => {
    if (setState) {
      setState(prevState => ({
        ...prevState,
        selectedVersion: version,
      }));
    }
  };

  const getIconForState = state => {
    switch (state) {
      case 'LOCALLY_MODIFIED_AND_STALE':
        return <LocalChangesIcon />;
      case 'STALE':
        return <UpsideSquareIcon color="#BB564A" />;
      case 'LOCALLY_MODIFIED':
        return <LocalChangesIcon />;
      case 'UP_TO_DATE':
        return <RightIcon />;
      default:
        return null;
    }
  };

  const isStateStale =
    state.upgradeData?.state === 'STALE' ||
    state.upgradeData?.state === 'UP_TO_DATE';

  const handlePositionChange = (name, value) => {
    if (setState) {
      setState(prevState => ({
        ...prevState,
        deployData: {
          ...prevState.deployData,
          position: {
            ...prevState.deployData.position,
            [name]: value,
          },
        },
      }));
    }
  };
  // const isDeploy = state?.upgradeData ? false : true;
  return (
    <Container>
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">
            {state?.upgradeData?.mode !== 'upgrade' ? 'Deploy' : 'Upgrade'}{' '}
            Namespace
          </MainTitleHfour>
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
              <StyledInputField
                name="cluster"
                type="text"
                label="Selected Cluster"
                value={state.selectedClusterName}
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
                    value={state?.upgradeData?.name || state?.deployData?.name}
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
                    label="Canvas Position"
                    value={
                      state?.deployData?.position?.x ||
                      state?.upgradeData?.position?.x
                    }
                    icon={<CanvasXIcon />}
                    disabled={state?.upgradeData?.mode === 'upgrade'}
                    onChange={e => handlePositionChange('x', e.target.value)}
                  />
                  <InputField
                    name="y"
                    type="text"
                    label=""
                    value={
                      state?.deployData?.position?.y ||
                      state?.upgradeData?.position?.y
                    }
                    icon={<CanvasYIcon />}
                    disabled={state?.upgradeData?.mode === 'upgrade'}
                    onChange={e => handlePositionChange('y', e.target.value)}
                  />
                </ColXlFive>
                {state?.upgradeData?.mode && (
                  <ColXlTwo className="col-xl-2 col-6">
                    <InputField
                      name="currentVersion"
                      type="text"
                      label="Current Version"
                      placeholder="N/A"
                      value={state.upgradeData.version}
                      icon={<QRIcons />}
                      disabled
                    />
                  </ColXlTwo>
                )}
                {state?.upgradeData?.mode && (
                  <ColXlSix className="col-xl-5 col-6">
                    <InputField
                      name="currentState"
                      type="text"
                      label="Current State"
                      value={state.upgradeData.stateExplanation}
                      icon={getIconForState(state.upgradeData.state)}
                      disabled
                    />
                  </ColXlSix>
                )}
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
                    value={
                      state?.upgradeData?.nifiUrl || state?.deployData?.nifiUrl
                    }
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="registry_url"
                    type="text"
                    label="Registry URL"
                    placeholder="Nifi Namespace"
                    value={
                      state?.upgradeData?.registryUrl ||
                      state?.deployData?.registryUrl
                    }
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>
          <VersionDiv>Version Control</VersionDiv>
          <Table
            data={
              state?.upgradeData?.versionList?.sort(
                (a, b) => a.version - b.version
              ) ||
              state?.deployData?.versionList?.sort(
                (a, b) => a.version - b.version
              )
            }
            columns={COLUMNS(handleVersionSelect)}
          />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            onClick={handleClick}
            disabled={!state.selectedVersion && isStateStale}
          >
            {' '}
            {state?.upgradeData?.mode !== 'upgrade' ? 'Deploy' : 'Upgrade'}{' '}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Container>
  );
};

export default Upgrade;
