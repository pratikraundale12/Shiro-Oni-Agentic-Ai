/* eslint-disable */
import React, { useState } from 'react';
import { CheckboxField, InputField, Modal } from '../../../shared';
import { DeleteDustbinIcon, QRIcons } from '../../../assets';
import { KDFM } from '../../../constants';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../../store';
const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const EKSClusterDeleteModal = ({ deleteKubeClusterData }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(ClustersSelectors.getisOpenDeleteKubeClusterModal);
  const [unInstallNiFi, setUninstallNiFi] = useState(false);
  const loggedInCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const schemaEKS = yup.object().shape({
    aws_region: yup.string().required('AWS Region is required'),
    aws_access_key_id: yup.string().required('AWS Access Key Id is required'),
    aws_secret_access_key: yup
      .string()
      .required('AWS Secret Access Key is required'),
    aws_session_token: yup.string().required('AWS Session Token is required'),
  });
  const schemaEC2 = yup.object().shape({});
  const noSpaces = /^(\S.*\S|\S)$/;

  const schemaAZURE = yup.object().shape({});

  const schema =
    deleteKubeClusterData?.cluster_type === 'ec2'
      ? schemaEC2
      : deleteKubeClusterData?.cluster_type === 'aks'
        ? schemaAZURE
        : schemaEKS;
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const deleteCluster = data => {
    const selectedCluster = JSON.parse(
      localStorage.getItem('selected_cluster')
    );
    if (
      loggedInCluster?.value == deleteKubeClusterData?.id &&
      deleteKubeClusterData?.id == selectedCluster?.value
    ) {
      dispatch(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
      localStorage.removeItem('selected_cluster');
    }
    if (deleteKubeClusterData?.cluster_type === 'ec2') {
      const payload = {
        clusterIdToDelete: deleteKubeClusterData?.id,
        deleteType: unInstallNiFi ? 'nifi_uninstall' : 'db_only',
        payloadData: {},
      };

      dispatch(ClustersActions.deleteClusterKube(payload));
    } else if (deleteKubeClusterData?.cluster_type === 'aks') {
      const payload = {
        clusterIdToDelete: deleteKubeClusterData?.id,
        deleteType: unInstallNiFi ? 'nifi_uninstall' : 'db_only',
        payloadData: {},
      };

      dispatch(ClustersActions.deleteClusterKube(payload));
    } else {
      const payload = {
        clusterIdToDelete: deleteKubeClusterData?.id,
        deleteType: 'nifi_uninstall',
        payloadData: {
          aws_region: data?.aws_region,
          aws_access_key_id: data?.aws_access_key_id,
          aws_secret_access_key: data?.aws_secret_access_key,
          aws_session_token: data?.aws_session_token,
        },
      };

      dispatch(ClustersActions.deleteClusterKube(payload));
    }

    reset();
  };
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsOpenDeleteKubeClusterModal(false));
    reset();
    setUninstallNiFi(false);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        title={'Delete Cluster'}
        secondaryButtonText="Back"
        primaryButtonText="Delete"
        primaryButtonDisabled={false}
        onRequestClose={onRequestClose}
        onSubmit={handleSubmit(deleteCluster)}
        onSecondarySubmit={onRequestClose}
        footerAlign="center"
        contentStyles={{ minWidth: '60%', maxHeight: '60%' }}
      >
        <div className=" row d-flex justify-content-center">
          <div style={{ textAlign: 'center' }}>
            <DeleteDustbinIcon />
          </div>
          <PrimaryText>{KDFM.HARD_DELETE_CLUSTER_WARNING}</PrimaryText>
          <div className="">
            {deleteKubeClusterData?.cluster_type !== 'ec2' &&
              deleteKubeClusterData?.cluster_type !== 'aks' && (
                <>
                  {' '}
                  <div className="row mt-3">
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        AWS Region <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="aws_region"
                        type="text"
                        placeholder={'Enter AWS Region'}
                        required={true}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                      />
                    </div>
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        AWS Access Key Id{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="aws_access_key_id"
                        type="text"
                        placeholder="Enter AWS Access Key Id"
                        required={true}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        AWS Secret Access Key{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="aws_secret_access_key"
                        type="text"
                        placeholder="Enter AWS Secret Access Key"
                        required={true}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                      />
                    </div>
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        AWS Session Token{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="aws_session_token"
                        type="text"
                        placeholder={'Enter AWS Session Token'}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                        required={true}
                      />
                    </div>
                  </div>
                </>
              )}
            {deleteKubeClusterData?.cluster_type === 'ec2' && (
              <>
                {' '}
                <div className="d-flex justify-content-center">
                  <CheckboxField
                    name="check"
                    label="Do you also want to uninstall NiFi and reuse hosts?"
                    checked={unInstallNiFi}
                    onChange={e => setUninstallNiFi(e.target.checked)}
                  />
                </div>
              </>
            )}

            {deleteKubeClusterData?.cluster_type === 'aks' && (
              <>
                {' '}
                <div className="row mt-3"></div>
                <div className="row">
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <CheckboxField
                      name="check"
                      label="Do you also want to uninstall NiFi?"
                      checked={unInstallNiFi}
                      onChange={e => setUninstallNiFi(e.target.checked)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default EKSClusterDeleteModal;
