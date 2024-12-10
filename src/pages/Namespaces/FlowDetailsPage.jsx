import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import {
  CanvasXIcon,
  CanvasYIcon,
  LinkIcon,
  QRIcons,
  StateIcon,
  // UpsideSquareIcon,
  TodoIcon,
} from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import { VERSION_COLUMNS } from '../ColumnData/namespaceColumns';
import RectangleGraph from './birdEyeViewGraph';
import { isEmpty } from 'lodash';

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
  text-transform: capitalize;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;
const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
  }
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
const CustomTable = styled(Table)`
  max-height: 400px;
  overflow: auto;
  tr {
    padding: 0;
    height: 0;
  }
  overflow-y: auto;
  overflow-x: hidden;
`;
const VersionDiv = styled.div`
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
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

const FlowDetailsPage = () => {
  const dispatch = useDispatch();
  const registryAllDetails = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);
  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const storedXcord = useSelector(NamespacesSelectors.getregistryFlowXCord);
  const storedYcord = useSelector(NamespacesSelectors.getregistryFlowYCord);
  const versionListData = useSelector(NamespacesSelectors.getVersionListData);
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  const [selectedVersion, setSelectedVersion] = useState(
    versionSelected?.version
  );
  const [xStateCoordinate, setXStateCoordiate] = useState(null);
  const [yStateCoordinate, setYStateCoordiate] = useState(null);
  useEffect(() => {
    if (registryDetailsData?.positions?.[0]?.x !== undefined) {
      setXStateCoordiate(registryDetailsData.positions[0].x);
      setYStateCoordiate(registryDetailsData?.positions?.[0].y);
    }
  }, [registryDetailsData]);

  const gridDataDest = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );

  const sortedArray = gridDataDest.map(item => ({
    x: Number(item.position.x),
    y: Number(item.position.y),
    width: 384,
    height: 176,
    color: item?.isProcessor ? '#BFDFDF' : 'teal',
  }));

  const updatedDataForGraph = [
    ...sortedArray,
    ...[
      {
        x: xStateCoordinate || registryDetailsData?.position?.[0].x,
        y: yStateCoordinate || registryDetailsData?.position?.[0].y,
        width: 384,
        height: 176,
        color: theme.colors.primary,
      },
    ],
  ];

  const enhancedData = updatedDataForGraph.map((d, index) => ({
    ...d,
    id: index,
  }));

  const breadcrumbOnDeploy = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    { label: 'Registry & Flow Name', path: '/process-group/deployPage' },
    { label: 'Flow Details' },
  ];
  const breadcrumbOnUpgrade = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    { label: KDFM.FLOW_DETAILS },
  ];

  // const convertDate = dateString => {
  //   const date = new Date(dateString);

  //   const pad = num => String(num).padStart(2, '0');

  //   const month = pad(date.getMonth() + 1);
  //   const day = pad(date.getDate());
  //   const year = date.getFullYear();

  //   const hours = pad(date.getHours());
  //   const minutes = pad(date.getMinutes());
  //   const seconds = pad(date.getSeconds());

  //   return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  // };

  const handleClick = () => {
    if (isUpgrade) {
      history.push('/process-group/config-details');
    } else {
      if (selectedVersion === selectedNameSpace.version) {
        {
          toast.info('The selected version is already deployed.');
        }
      } else {
        history.push('/process-group/config-details');
      }
    }
  };
  useEffect(() => {
    if (selectedNameSpace && selectedVersion && isEmpty(registryDetailsData)) {
      dispatch(
        NamespacesActions.fetchRegistryFlowDetails({
          bucketId: selectedNameSpace.bucketId,
          flowId: selectedNameSpace.flowId,
          version: selectedVersion,
        })
      );
    }
  }, [dispatch, selectedNameSpace]);

  const handleRowClick = item => {
    setSelectedVersion(item.version);
    dispatch(NamespacesActions.setVersionSelect({ version: item.version }));
  };

  const handleBackClick = () => {
    !isUpgrade
      ? history.push('/process-group')
      : history.push('/process-group/deployPage');
  };

  const handleXCoordinateChangeInput = e => {
    if (e.target.value) {
      setXStateCoordiate(Number(e.target.value));
      dispatch(NamespacesActions.setRegistryFlowXCord(Number(e.target.value)));
    } else {
      setXStateCoordiate(null);
      dispatch(NamespacesActions.setRegistryFlowXCord(null));
    }
  };
  const handleRadioChange = item => {
    dispatch(NamespacesActions.setVersionSelect({ version: item.version }));
  };
  const sortedData = versionListData?.versionList
    ?.slice()
    .sort((a, b) => a.version - b.version);

  const handleYCoordinateChangeInput = e => {
    if (e.target.value) {
      setYStateCoordiate(Number(e.target.value));
      dispatch(NamespacesActions.setRegistryFlowYCord(Number(e.target.value)));
    } else {
      setYStateCoordiate(null);
      dispatch(NamespacesActions.setRegistryFlowYCord(null));
    }
  };

  const loadingregistry = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryFlowDetails')
  );
  //

  return (
    <div>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <FullPageLoader loading={loadingregistry} />

      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {!isUpgrade ? 'Upgrade Process Group' : 'Deploy Process Group'}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          module="upgrade"
          path={!isUpgrade ? breadcrumbOnUpgrade : breadcrumbOnDeploy}
        />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <InputField
                    name="namespace"
                    type="text"
                    label={'Selected Flow Name'}
                    value={
                      !isUpgrade
                        ? selectedNameSpace.label
                        : formDataRegistry?.selectedFlowName
                    }
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
                    disabled={!isUpgrade}
                    name="x"
                    type="text"
                    label={KDFM.CANVAS_POSITION}
                    value={
                      !isUpgrade
                        ? selectedNameSpace.position.x
                        : storedXcord || xStateCoordinate
                    }
                    icon={<CanvasXIcon />}
                    onChange={e => handleXCoordinateChangeInput(e)}
                  />
                  <InputField
                    disabled={!isUpgrade}
                    name="y"
                    type="text"
                    label=""
                    value={
                      !isUpgrade
                        ? selectedNameSpace.position.y
                        : storedYcord || yStateCoordinate
                    }
                    icon={<CanvasYIcon />}
                    onChange={e => handleYCoordinateChangeInput(e)}
                  />
                </ColXlFive>
                <>
                  <ColXlTwo
                    className={`${isUpgrade ? 'col-xl-6 col-6' : 'col-xl-3 col-3'}`}
                  >
                    <InputField
                      name="currentVersion"
                      type="text"
                      label={KDFM.CURRENT_VERSION}
                      placeholder="N/A"
                      value={
                        !isUpgrade
                          ? selectedNameSpace.version
                          : versionSelected?.version || 'N/A'
                      }
                      icon={<QRIcons />}
                      disabled
                    />
                  </ColXlTwo>
                  {!isUpgrade && (
                    <ColXlSix className="col-xl-4 col-4">
                      <InputField
                        name="currentState"
                        type="text"
                        label={KDFM.CURRENT_STATE}
                        value={selectedNameSpace.state || 'N/A'}
                        icon={<StateIcon />}
                        disabled
                      />
                    </ColXlSix>
                  )}
                </>
              </RowConfig>
            </div>
            {isUpgrade && (
              <div className="ms-4">
                {
                  <RectangleGraph
                    data={enhancedData}
                    setXStateCoordiate={setXStateCoordiate}
                    setYStateCoordiate={setYStateCoordiate}
                  />
                }
              </div>
            )}
            <div className="col-12 p-3">
              <RowConfig className="row">
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="nifiurl"
                    type="text"
                    label={KDFM.NIFI_URL}
                    placeholder={KDFM.ENTER_NIFI_URL}
                    value={registryAllDetails?.nifi_url}
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="registry_url"
                    type="text"
                    label={KDFM.REGISTRY_URL}
                    placeholder={KDFM.ENTER_REGISTRY_URL}
                    value={registryData?.url}
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>
          {!isUpgrade && (
            <>
              <VersionDiv>{KDFM.VERSION_CONTROL}</VersionDiv>
              <CustomTable
                data={sortedData || []}
                columns={VERSION_COLUMNS({
                  selectedVersion,
                  handleRadioChange,
                  handleRowClick,
                })}
              />
            </>
          )}
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button onClick={handleClick}>Continue</Button>
        </BottomButtonDiv>
      </BottomButton>
    </div>
  );
};

export default FlowDetailsPage;
