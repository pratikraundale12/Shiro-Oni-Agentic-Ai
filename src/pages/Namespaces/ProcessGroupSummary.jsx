import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TodoIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import DisbaleIconImage from '../../assets/images/disable.png';
import EnableIconImage from '../../assets/images/enable.png';
import StartIconImage from '../../assets/images/start.png';
import StopIconImage from '../../assets/images/stop.png';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, ModalWithIcon } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
// import { KDFM } from '../../constants';

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 315px);
  max-height: calc(100vh - 315px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: -1rem;
  margin-left: -1rem;
`;
const ConfigTitle = styled.div`
  border-bottom: 1px solid #dde4f0;
`;
const ConfigTitleHTwo = styled.div`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #ff7a00;
  position: relative;
  border-bottom: 1px solid #ff7a00;
  width: fit-content;
`;
const UseColLg = styled.div`
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
  @media (min-width: 992px) {
    &.col-lg-10 {
      flex: 0 0 auto;
      width: 83.33333333%;
    }
  }
`;
const UseColXl = styled.div`
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
  @media screen and (min-width: 1200px) {
    &.col-xl-4 {
      flex: 0 0 auto;
      width: 33.33333333%;
    }
  }

  padding-right: 1rem;
  padding-left: 1rem;
`;

const SummaryDetailsHFourTag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #2d343f;
`;
const SummaryDetailsPtag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #7a7a7a;

  & > div {
    display: flex;
    gap: 0.5rem;

    & .summary-clipboard {
      margin-top: -0.5rem;
    }
  }

  & span {
    max-width: 18rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-4 {
    flex: 0 0 auto;
    width: 33%;
    text-align: end;
  }
`;
const ActiveButtonContainer = styled.div`
  gap: 7px;
  justify-content: center;
  flex-direction: column;
`;
const TextDiv = styled.div`
  display: flex;
  align-items: center;
`;
const CountDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & span {
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
    margin-left: 8px;
    color: #b5bdc8;
  }

  svg path {
    fill: ${props => (props.count > 0 ? props.activeColor : '#b5bdc8')};
  }
`;
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;
const IconsvgDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
`;
const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }

  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
  }
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
  text-transform: capitalize;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;

const ProcessGroupSummary = () => {
  const COLUMNS = [
    {
      label: KDFM.EVENT,
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
    },
    {
      label: KDFM.NAMESPACE,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
    },
    {
      label: KDFM.CLUSTER,
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => <TextRender text={item.message || KDFM.NA} />,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
    },
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
    },
    {
      label: KDFM.CREATED_BY,
      renderCell: item => <TextRender text={item.created_by || KDFM.NA} />,
    },
  ];
  const { id } = useParams();
  const [activeButton, setActiveButton] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(NamespacesActions.setSourceNamespaceId(id));
    dispatch(NamespacesActions.singleNamespaceData(id));
  }, [id]);
  const namespaceAuditLog = useSelector(NamespacesSelectors.getNamespaceAudit);
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );
  const [countData, setCountData] = useState(singleNamespaceData);
  const [confirmDialogue, setConfirmDialogue] = useState({
    state: false,
    action: '',
    text: '',
    forPopup: false,
  });
  useEffect(() => {
    setCountData(singleNamespaceData);
  }, [singleNamespaceData]);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  useEffect(() => {
    if (deployOrUpgradeDetails) {
      setCountData(deployOrUpgradeDetails);
    }
  }, [deployOrUpgradeDetails]);

  useEffect(() => {
    dispatch(NamespacesActions.fetchNamespaceAudit());
  }, [dispatch]);

  const auditTableData =
    namespaceAuditLog?.data?.filter(auditInfo => auditInfo?.record_id === id) ||
    [];

  const handleUpdateStatus = status => {
    setActiveButton(status);
    const text =
      status === 'STOPPED'
        ? 'stop'
        : status === 'RUNNING'
          ? 'start'
          : status === 'ENABLED'
            ? 'enable'
            : status === 'DISABLED'
              ? 'disable'
              : '';
    setConfirmDialogue({
      state: true,
      action: status,
      text,
      forPopup: true,
    });
  };
  const handleBackClick = () => {
    history.push('/process-group');
  };
  console.log(confirmDialogue.action);

  const handleConfirmUpdateStatus = () => {
    dispatch(NamespacesActions.updateNamespaceStatus(confirmDialogue.action));
    setConfirmDialogue({
      state: false,
      action: '',
      text: '',
      forPopup: false,
    });
  };

  return (
    <>
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <div className="mb-2">
            <TodoIcon width={22} height={24} />
          </div>
          <MainTitleHfour className="mb-0">
            {singleNamespaceData?.name} Details
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className=" pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <ConfigTitle className="config-title">
                <ConfigTitleHTwo className="p-3 mb-0">
                  <span>Summary</span>
                </ConfigTitleHTwo>
              </ConfigTitle>
            </div>
            <UseColLg className="col-lg-10 col-12 ">
              <RowConfig className=" p-3">
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Process Group
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.name}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Process Group Id
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.id}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Flow Name
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      <div>
                        <span>{singleNamespaceData?.flowName || 'N/A'}</span>
                      </div>
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Flow ID
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      <div>
                        <span>{singleNamespaceData?.flowId || 'N/A'}</span>
                      </div>
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Bucket Name
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.bucketName || 'N/A'}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.version || 'N/A'}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      State
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.state || 'N/A'}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      State Explaination
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {singleNamespaceData?.stateExplanation || 'N/A'}
                      {/* {formData.version || checkDestCluster.version} */}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
            <div className="col-12 p-3">
              <ConfigTitle className="config-title">
                <ConfigTitleHTwo className="p-3 mb-0">
                  <span>Flow Control</span>
                </ConfigTitleHTwo>
              </ConfigTitle>
            </div>
          </RowConfig>

          <IconsvgDiv>
            <CustomNine className="col-4 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-1 mr-2"
                    count={countData?.runningCount}
                    activeColor="#58e715"
                  >
                    <TriangleIcons color="#B5BDC8" />
                    <span>{countData?.runningCount}</span>
                  </CountDiv>
                  <div>{KDFM.RUNNING_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-2 mr-2"
                    count={countData?.stoppedCount}
                    activeColor="#c52b2b"
                  >
                    <SquareBoxIcon color="#B5BDC8" />
                    <span>{countData?.stoppedCount}</span>
                  </CountDiv>
                  <div>{KDFM.STOPPED_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-3 mr-2"
                    count={countData?.invalidCount}
                    activeColor="#CF9F5D"
                  >
                    <TriangleExclamationMarkIcon color="#B5BDC8" />
                    <span>{countData?.invalidCount}</span>
                  </CountDiv>
                  <div>{KDFM.INVALID_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-4 mr-2"
                    count={countData?.disabledCount}
                    activeColor="#2c7cf3"
                  >
                    <SmallNotThunderIcon color="#B5BDC8" />
                    <span>{countData?.disabledCount}</span>
                  </CountDiv>
                  <div>{KDFM.DISABLED_PROCESSORS}</div>
                </TextDiv>
              </ActiveButtonContainer>
            </CustomNine>
            <ActiveButtonContainer className="d-flex ">
              <TextsvgDiv className="d-flex">
                <ActiveButtonDiv className="div-btn-1 mr-2">
                  <ActiveButtonDiv
                    className="div-btn-1 "
                    isActive={activeButton === 'RUNNING'}
                    activeColor="#58e715"
                    hoverColor="#58e715"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('RUNNING')}
                  >
                    <TriangleIcons color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
              </TextsvgDiv>
              <TextsvgDiv className="d-flex">
                <ActiveButtonDiv className="div-btn-2 mr-2">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'STOPPED'}
                    activeColor="#c52b2b"
                    hoverColor="#c52b2b"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('STOPPED')}
                  >
                    <SquareBoxIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <div>{KDFM.STOPPED_FLOW}</div>
              </TextsvgDiv>
              <TextsvgDiv className="d-flex">
                <ActiveButtonDiv className="div-btn-3 mr-2">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'ENABLED'}
                    activeColor="#cf9f5d"
                    hoverColor="#cf9f5d"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('ENABLED')}
                  >
                    <SmallThunderIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <div>{KDFM.ENABLED_FLOW}</div>
              </TextsvgDiv>
              <TextsvgDiv className="d-flex">
                <ActiveButtonDiv className="div-btn-4 mr-2">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'DISABLED'}
                    activeColor="#2c7cf3"
                    hoverColor="#2c7cf3"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('DISABLED')}
                  >
                    <SmallNotThunderIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <div>{KDFM.DISABLED_FLOW}</div>
              </TextsvgDiv>
            </ActiveButtonContainer>
          </IconsvgDiv>
          <div className="col-12 p-3">
            <ConfigTitle className="config-title">
              <ConfigTitleHTwo className="p-3 mb-0">
                <span>Audit Log</span>
              </ConfigTitleHTwo>
            </ConfigTitle>
          </div>
          <Table data={auditTableData.slice(0, 10)} columns={COLUMNS} />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <ModalWithIcon
        title={'Flow Confirmation'}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={
          <img
            src={
              confirmDialogue?.action === 'STOPPED'
                ? StopIconImage
                : confirmDialogue?.action === 'RUNNING'
                  ? StartIconImage
                  : confirmDialogue?.action === 'ENABLED'
                    ? EnableIconImage
                    : DisbaleIconImage
            }
            height="80px"
            width="80px"
            alt="img"
          />
        }
        isOpen={confirmDialogue?.state}
        onRequestClose={() => {
          setConfirmDialogue({
            state: false,
            action: '',
            text: '',
            forPopup: false,
          });
        }}
        primaryText={`Do you really want to ${confirmDialogue?.text}?`}
        onSubmit={handleConfirmUpdateStatus}
      />
    </>
  );
};

export default ProcessGroupSummary;
