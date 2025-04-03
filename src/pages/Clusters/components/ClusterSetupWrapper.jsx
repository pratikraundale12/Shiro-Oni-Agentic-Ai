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
import { ClustersActions } from '../../../store';
import { useDispatch } from 'react-redux';
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
  const schema = yup.object().shape({
    clusterName: yup.string().required('Cluster Name is required'),
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
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleCreateCluster = data => {
    const hosts = hostList
      .filter(item => item.is_selected)
      .map(item => item?.id);

    const payload = { ...data, ...{ hosts: hosts } };
    if (isEmpty(hosts)) {
      toast.error('Select Host IP');
    } else {
      dispatch(ClustersActions.createCluster(payload));
    }
  };

  return (
    <Wrapper>
      <Title title={'Add New Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <ClusterDetailTab
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          hostList={hostList}
          setHostList={setHostList}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('getting_started')
              );
            }}
          >
            {KDFM.BACK}
          </Button>

          {/* <Button type="submit" onClick={handleSubmit(handleContinue)}> */}
          <Button type="submit" onClick={handleSubmit(handleCreateCluster)}>
            Create Cluster
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <ModalWithIcon
        title={'Cluster Created Successfully'}
        primaryButtonText={'Navigate'}
        // secondaryButtonText={KDFM.CANCEL}
        icon={<GreenRightCircleIcon />}
        isOpen={isSuccessModalOpen}
        onSubmit={() => {
          setIsSuccessModalOpen(false);
          history.push(`/clusters`);
        }}
        // onRequestClose={() => {
        //   setIsSuccessModalOpen(false);
        // }}
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
