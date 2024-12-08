import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  CanvasXIcon,
  CanvasYIcon,
  LinkIcon,
  QRIcons,
  TodoIcon,
  UpsideSquareIcon,
} from '../../assets';
import LocalChangesIcon from '../../assets/Icons/LocalChangesIcon';
import RightIcon from '../../assets/Icons/RightIcon';
import { Table } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, RadioField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  GridSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularSelectors } from '../../store/schedular/redux';
import { theme } from '../../styles';
import RectangleGraph from './birdEyeViewGraph';

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
  const dispatch = useDispatch();
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  const childLevelDeployProcessorData = useSelector(
    NamespacesSelectors.getChildLevelDeployProcessorData
  );

  const formData = useSelector(NamespacesSelectors.getFormData);
  const gridDataDest = useSelector(state =>
    GridSelectors.getGridData(state, 'destNamespaces')
  );

  const [xStateCoordinate, setXStateCoordiate] = useState(
    formData?.position?.x
  );
  const [yStateCoordinate, setYStateCoordiate] = useState(
    formData?.position?.y
  );

  const sortedArray = gridDataDest?.map(element => ({
    ...element?.position,
    width: 384,
    height: 176,
    color: element?.isProcessor ? '#BFDFDF' : 'teal',
  }));

  const childLevelSortedData = childLevelDeployProcessorData?.data?.map(
    element => ({
      ...element?.position,
      width: 384,
      height: 176,
      color: 'teal',
    })
  );
  useEffect(() => {
    if (selectedDestCluster) {
      dispatch(NamespacesActions.fetchDestNamespaces);
    }
  }, [dispatch]);

  const convertDate = dateString => {
    const date = new Date(dateString);

    const pad = num => String(num).padStart(2, '0');

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const COLUMNS = [
    {
      label: KDFM.VERSION,
      renderCell: item => <div>{item.version}</div>,
    },
    {
      label: KDFM.CREATED,
      renderCell: item => <div>{convertDate(item.createdAt)}</div>,
    },
    {
      label: KDFM.COMMENT,
      renderCell: item => <div>{item.comments}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RadioField
            name="upgrade"
            checked={item.version == formData.version}
            onChange={() => handleVersionSelect(item.version)}
          />
        </div>
      ),
      width: '10%',
    },
  ];
  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    ...(checkDestCluster.mode !== 'upgrade'
      ? [{ label: KDFM.SELECT_NAMESPACE, path: '/process-group/deploy' }]
      : []),
    { label: KDFM.CONFIGURATION_DETAILS },
  ];

  const handleClick = () => {
    if (
      formData?.version === checkDestCluster?.version &&
      checkDestCluster?.mode === 'upgrade'
    ) {
      toast.info('The selected version is already deployed.');
    } else {
      history.push('/process-group/summary');
    }
  };

  const handleBackClick = () => {
    if (checkDestCluster.mode === 'upgrade') {
      history.push('/process-group');
    } else {
      history.push('/process-group/deploy');
    }
  };

  const handleVersionSelect = version => {
    dispatch(NamespacesActions.setVersion(version));
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
    checkDestCluster.state === 'LOCALLY_MODIFIED_AND_STALE' ||
    checkDestCluster.state === 'LOCALLY_MODIFIED';

  const baseData = Array.isArray(
    formData?.namespaceId ? childLevelSortedData : sortedArray
  )
    ? formData?.namespaceId
      ? childLevelSortedData
      : sortedArray
    : [];

  const updatedDataForGraph = [
    ...baseData,
    ...[
      {
        x: xStateCoordinate || formData?.position?.x,
        y: yStateCoordinate || formData?.position?.y,
        width: 384,
        height: 176,
        color: theme.colors.primary,
      },
    ],
  ];

  const handleXCoordinateChangeInput = e => {
    setXStateCoordiate(Number(e.target.value));
    dispatch(NamespacesActions.setPosition({ x: e.target.value }));
  };

  const handleYCoordinateChangeInput = e => {
    setYStateCoordiate(Number(e.target.value));
    dispatch(NamespacesActions.setPosition({ y: e.target.value }));
  };

  return (
    <div>
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {`${
              checkDestCluster.mode === 'upgrade'
                ? checkDestCluster.version <= formData.version
                  ? KDFM.UPGRADE
                  : KDFM.DOWNGRADE
                : KDFM.DEPLOY
            } ${KDFM.NAMESPACE}`}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb module="upgrade" path={breadcrumbData} />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <StyledInputField
                name="cluster"
                type="text"
                label={KDFM.SELECTED_CLUSTER}
                value={selectedDestCluster?.label}
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
                    label={KDFM.SELECTED_NAMESPACE}
                    value={checkDestCluster.name}
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
                    label={KDFM.CANVAS_POSITION}
                    value={xStateCoordinate || formData.position.x}
                    icon={<CanvasXIcon />}
                    disabled={checkDestCluster.mode === 'upgrade'}
                    onChange={
                      e => handleXCoordinateChangeInput(e)
                      // dispatch(
                      //   NamespacesActions.setPosition({ x: e.target.value })
                      // )
                    }
                  />
                  <InputField
                    name="y"
                    type="text"
                    label=""
                    value={yStateCoordinate || formData.position.y}
                    icon={<CanvasYIcon />}
                    disabled={checkDestCluster.mode === 'upgrade'}
                    onChange={
                      e => handleYCoordinateChangeInput(e)
                      // dispatch(
                      //   NamespacesActions.setPosition({ y: e.target.value })
                      // )
                    }
                  />
                </ColXlFive>

                {checkDestCluster.mode === 'upgrade' && (
                  <>
                    <ColXlTwo className="col-xl-2 col-6">
                      <InputField
                        name="currentVersion"
                        type="text"
                        label={KDFM.CURRENT_VERSION}
                        placeholder="N/A"
                        value={checkDestCluster.version}
                        icon={<QRIcons />}
                        disabled
                      />
                    </ColXlTwo>
                    <ColXlSix className="col-xl-5 col-6">
                      <InputField
                        name="currentState"
                        type="text"
                        label={KDFM.CURRENT_STATE}
                        value={checkDestCluster.stateExplanation}
                        icon={getIconForState(checkDestCluster.state)}
                        disabled
                      />
                    </ColXlSix>
                  </>
                )}
              </RowConfig>
            </div>
            {checkDestCluster.mode !== 'upgrade' && (
              <div className="ms-4">
                <RectangleGraph
                  data={updatedDataForGraph}
                  setXStateCoordiate={setXStateCoordiate}
                  setYStateCoordiate={setYStateCoordiate}
                />
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
                    value={checkDestCluster.nifiUrl}
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
                    value={checkDestCluster.registryUrl}
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>
          <VersionDiv>{KDFM.VERSION_CONTROL}</VersionDiv>
          <Table
            data={[...(checkDestCluster?.versionList || [])].sort(
              (a, b) => a.version - b.version
            )}
            columns={COLUMNS}
          />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button
            onClick={handleClick}
            disabled={
              checkDestCluster.mode === 'upgrade' &&
              (!formData.version || isStateStale)
            }
          >
            {schedularFromList
              ? KDFM.CONTINUE
              : checkDestCluster.mode === 'upgrade'
                ? checkDestCluster.version <= formData.version
                  ? KDFM.UPGRADE
                  : KDFM.DOWNGRADE
                : KDFM.DEPLOY}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </div>
  );
};

export default Upgrade;
