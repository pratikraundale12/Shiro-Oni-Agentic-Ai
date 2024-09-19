import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ExclamationIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { Modal } from '../../shared';
import { NamespacesSelectors } from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const RowModal = styled.div`
  margin-top: 1.5rem !important;
  display: flex;
  flex-wrap: wrap;
`;
const ColumnThree = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-4 {
    flex: 0 0 auto;
    width: 35%;
  }
`;
const RowModalDiv = styled.div`
  align-items: flex-start !important;
  justify-content: space-around !important;
  flex-direction: column !important;
`;
const ActionTitleSet = styled.h6`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  color: #2d343f;
`;
const SubTitleSet = styled.p`
  color: #7a7a7a !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 18.52px !important;
  letter-spacing: -0.005em !important;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-8 {
    flex: 0 0 auto;
    width: 65%;
  }
`;

const CountDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  /* border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa; */
  cursor: pointer;
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
const ActiveButtonContainer = styled.div`
  align-items: center;
  justify-content: flex-start !important;
  gap: 7px;
`;

const WarningContainer = styled.div`
  height: 85px;
  border-radius: 20px;
  border: 1px solid #dde4f0;
  margin: 5px;
  display: flex;
`;

const WarningHeading = styled.div`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  color: #444445;
`;

const WarningText = styled.div`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #444445;
`;

const ScheduleNamespaceDeploy = ({
  getScheduleParamerterContext,
  handleScheduleTertiaryButton,
  flowControlState = '',
}) => {
  const dispatch = useDispatch();
  const selectedVersion = useSelector(NamespacesSelectors.getFormData);
  const formData = useSelector(SchedularSelectors.getFormData);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const scheduleDeployModal = useSelector(
    SchedularSelectors.getScheduleDeployModal
  );
  const newlyAddParameters = useSelector(
    NamespacesSelectors.getNewlyAddedParameterContext
  );
  const newlyAddVariables = useSelector(
    NamespacesSelectors.getNewlyAddVariables
  );
  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  // const handleUpdateStatus = status => {
  //   dispatch(NamespacesActions.updateNamespaceStatus(status));
  // };

  const onRequestClose = () => {
    dispatch(SchedularActions.setScheduleDeployModal());
    dispatch(SchedularActions.setScheduleModal());
  };

  const onSubmit = () => {
    const payload = {
      ...(checkDestCluster?.mode === 'upgrade' && {
        namespaceId: checkDestCluster?.id,
      }),
      ...(selectedVersion?.namespaceId && {
        namespaceId: selectedVersion?.namespaceId,
      }),
      namespace_name: checkDestCluster?.name,
      scheduled_time: formData?.scheduled_time,
      flow_id: checkDestCluster?.flowId,
      source_cluster_id: selectedCluster?.value,
      destination_cluster_id: selectedDestCluster.value,
      deployment_status: 'PENDING',
      bucket_id: checkDestCluster?.bucketId,
      registry_id: checkDestCluster?.registryId,
      mode: checkDestCluster?.mode,
      version: selectedVersion.version,
      position: checkDestCluster?.position,
      approver_ids: formData?.approver_ids,
      variables: newlyAddVariables.map(item => ({
        name: item.name,
        value: item.value,
      })),
      params: newlyAddParameters.map(item => ({
        name: item.name,
        value: item.value,
        description: item.description,
        sensitive: item.sensitive,
      })),
      state: flowControlState,
      source_namespace_id: selectedNamespace?.value,
    };
    dispatch(SchedularActions.createScheduleDeployment(payload));
  };

  return (
    <>
      <Modal
        title={`Schedule Process Group`}
        isOpen={scheduleDeployModal}
        onRequestClose={onRequestClose}
        onSecondarySubmit={getScheduleParamerterContext}
        secondaryButtonText="Parameter Context"
        primaryButtonText="Schedule"
        contentStyles={{ maxWidth: '45%', maxHeight: '65%' }}
        onSubmit={onSubmit}
        footerAlign="start"
        tertiaryButton={true}
        tertiaryButtonConfig={{
          tertiaryButtonTest: 'Variables',
          tertiaryButtonSubmit: handleScheduleTertiaryButton,
          tertiaryButtonDisable: false,
        }}
        // loading={loadingButton}
      >
        <ModalBody className="modal-body">
          <RowModal>
            <ColumnThree className="col-4 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">Process Group</ActionTitleSet>
                <SubTitleSet className="mb-0 ">
                  {checkDestCluster?.name}
                </SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <ColumnThree className="col-4 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">
                  Current Version
                </ActionTitleSet>
                <SubTitleSet className="mb-0 ">
                  {selectedVersion?.version}
                </SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <CustomNine className="col-8 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-1"
                      count={checkDestCluster?.runningCount}
                      activeColor="#58e715"
                    >
                      <TriangleIcons color="#B5BDC8" />
                      <span>{checkDestCluster?.runningCount}</span>
                    </CountDiv>
                    <div>Running Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-2"
                      count={checkDestCluster?.stoppedCount}
                      activeColor="#c52b2b"
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.stoppedCount}</span>
                    </CountDiv>
                    <div>Stopped Processors</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-3"
                      count={checkDestCluster?.invalidCount}
                      activeColor="#CF9F5D"
                    >
                      <TriangleExclamationMarkIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.invalidCount}</span>
                    </CountDiv>
                    <div>Invalid Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-4"
                      count={checkDestCluster?.disabledCount}
                      activeColor="#2c7cf3"
                    >
                      <SmallNotThunderIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.disabledCount}</span>
                    </CountDiv>
                    <div>Disabled Processors</div>
                  </div>
                </div>
              </ActiveButtonContainer>
            </CustomNine>
          </RowModal>
          <WarningContainer>
            <div className="col-2 d-flex justify-content-center align-items-center">
              <ExclamationIcon />
            </div>
            <div className="col-8 d-flex align-items-center">
              <div>
                <WarningHeading>Warning !!!</WarningHeading>
                <WarningText>
                  Add Parameter Context and Variables before Scheduling this
                  Deployment
                </WarningText>
              </div>
            </div>
          </WarningContainer>
        </ModalBody>
      </Modal>
    </>
  );
};

ScheduleNamespaceDeploy.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  getScheduleParamerterContext: PropTypes.func,
  countDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
  upgradeData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  deployData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  handleScheduleTertiaryButton: PropTypes.func,
  selectedVersion: PropTypes.string,
  selectedClusterName: PropTypes.string,
  selectedClusterId: PropTypes.string,
  deployCountDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loadingButton: PropTypes.bool,
  flowControlState: PropTypes.string,
};

export default ScheduleNamespaceDeploy;
