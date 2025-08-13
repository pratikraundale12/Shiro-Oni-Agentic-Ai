import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import { Button, ModalWithIcon } from '../../../shared';
import { KDFM } from '../../../constants';
import ClusterDetailTab from './ClusterDetailTab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { GreenRightCircleIcon } from '../../../assets';
import { history } from '../../../helpers/history';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const SetupClusterWrapper = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [loadingFullPage, setLoadingFullPage] = useState(false);
  const clusterIdForAnsible = useSelector(
    ClustersSelectors.getansibleClucterToEdit
  );
  const nodesUpdateAnsbibleClusterId = useSelector(
    ClustersSelectors.getAnsibleClusterNodeUpdate
  );
  const ansibleClusterDataForEdit = useSelector(
    ClustersSelectors.getAnsibleClusterData
  );
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const schema = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    nifiVersion: yup.string().required('NiFi is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchState = watch();
  const deselectedNodes = listHostIpData.filter(staticItem => {
    const updatedItem = hostList.find(updated => updated.id === staticItem.id);
    return (
      staticItem.is_selected === true && updatedItem?.is_selected === false
    );
  });
  const deselectedNodesIds = deselectedNodes.map(ele => ele?.id);

  const newlySelectedNodes = listHostIpData.filter(staticItem => {
    const updatedItem = hostList.find(updated => updated.id === staticItem.id);
    return (
      staticItem.is_selected === false && updatedItem?.is_selected === true
    );
  });
  const newlySelectedNodesIds = newlySelectedNodes.map(ele => ele?.id);

  const handleCreateCluster = data => {
    setLoadingFullPage(true);
    if (!isEmpty(nodesUpdateAnsbibleClusterId)) {
      if (isEmpty(deselectedNodesIds) && isEmpty(newlySelectedNodesIds)) {
        toast.error('Please update any nodes first');
      } else {
        dispatch(
          ClustersActions.updateNodesAnsibleCluster({
            clusterId: nodesUpdateAnsbibleClusterId,
            payload: {
              nodeIdsToRemove: deselectedNodesIds,
              nodeIdsToAdd: newlySelectedNodesIds,
            },
          })
        );
      }
    } else if (!isEmpty(clusterIdForAnsible)) {
      const { clusterName, ...rest } = data;
      clusterName;
      dispatch(
        ClustersActions.upgradeAnsibleCluster({
          clusterId: clusterIdForAnsible,
          payload: rest,
        })
      );
    } else {
      const hosts = hostList
        .filter(item => item.is_selected)
        .map(item => item?.id);

      const payload = {
        ...data,
        ...{
          hosts: hosts,
        },
      };
      if (isEmpty(hosts)) {
        toast.error('Select Host IP');
      } else {
        dispatch(ClustersActions.createCluster(payload));
      }
    }
  };
  const disableSubmitOnUpgrade = () => {
    return (
      watchState?.nifiVersion !== ansibleClusterDataForEdit?.nifi_version ||
      watchState?.configName !== ansibleClusterDataForEdit?.config_name ||
      watchState?.configVersion != ansibleClusterDataForEdit?.config_version
    );
  };

  return (
    <Wrapper>
      <Title
        title={
          !isEmpty(nodesUpdateAnsbibleClusterId)
            ? 'Add Nodes'
            : !isEmpty(clusterIdForAnsible)
              ? 'Upgrade Cluster'
              : 'Add New Cluster'
        }
      />

      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <ClusterDetailTab
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          hostList={hostList}
          setHostList={setHostList}
          setValue={setValue}
          reset={reset}
          loadingFullPage={loadingFullPage}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              if (lastVisit === 'cluster') {
                history.push(`/clusters`);
              } else {
                dispatch(ClustersActions.setActiveTabClusterSetup(lastVisit));
              }
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={handleSubmit(handleCreateCluster)}
            disabled={
              !isEmpty(clusterIdForAnsible) ? !disableSubmitOnUpgrade() : false
            }
          >
            {!isEmpty(nodesUpdateAnsbibleClusterId)
              ? 'Add Nodes'
              : !isEmpty(clusterIdForAnsible)
                ? 'Upgrade Cluster'
                : 'Create Cluster'}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <ModalWithIcon
        title={'Cluster Created Successfully'}
        primaryButtonText={'Navigate'}
        icon={<GreenRightCircleIcon />}
        isOpen={isSuccessModalOpen}
        onSubmit={() => {
          setIsSuccessModalOpen(false);
          history.push(`/clusters`);
        }}
        primaryText={'Cluster Created Successfully'}
        secondaryText={
          'Your Cluster was Added Successfully.You can now proceed to the next steps'
        }
      />
    </Wrapper>
  );
};
SetupClusterWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterWrapper;
