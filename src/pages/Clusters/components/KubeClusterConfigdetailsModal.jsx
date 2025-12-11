/* eslint-disable */
import React, { useState } from 'react';
import { Button, CheckboxField, InputField, Modal } from '../../../shared';
import { QRIcons } from '../../../assets';
import styled from 'styled-components';
import PemUploadField from '../PEMUploadFile';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { dispatch } from 'd3';
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ff7a00;
  margin-bottom: 12px;
  padding: 5px 12px;
  background-color: white;
  font-weight: bold;
  border: 1px solid #ff7a00;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: rgb(253, 250, 245);
  }
`;
const KubeClusterConfigDetailsModal = ({
  clusterType,
  register,
  errors,
  openAddConfigModal,
  setOpenAddConfigModal,
  control,
  watch,
  handleCreateCluster,
  handleSubmit,
  kubeClusterIDEdit,
  reset,
  onError,
  aksSaveDb,
  setAksSaveDb,
}) => {
  const dispatch = useDispatch();
  const azureCluster = useSelector(ClustersSelectors.getAzureCluster);
  const azureTestPassed = useSelector(ClustersSelectors.getazureTestPassed);

  const onRequestClose = () => {
    setOpenAddConfigModal(false);
  };

  const handleTestCredAzure = data => {
    const payload = {
      tenantId: data?.tenantId,
      clientId: data?.clientId,
      clientSecret: data?.clientSecret,
      subscriptionId: data?.subscriptionId,
      resourceGroup: data?.resourceGroup,
    };

    dispatch(ClustersActions.testAzureConfig(payload));
  };
  return (
    <>
      <Modal
        isOpen={openAddConfigModal}
        title={`${clusterType === 'ec2' ? 'Self-Managed Kubernetes' : clusterType === 'aks' ? 'Azure' : 'Amazon EKS'} Details`}
        secondaryButtonText="Back"
        primaryButtonText={
          !isEmpty(kubeClusterIDEdit)
            ? 'Initiate Cluster Update'
            : 'Initiate Cluster Creation'
        }
        primaryButtonDisabled={clusterType === 'aks' ? !azureTestPassed : false}
        onRequestClose={onRequestClose}
        onSubmit={handleSubmit(handleCreateCluster, onError)}
        onSecondarySubmit={onRequestClose}
        footerAlign="start"
        contentStyles={{ minWidth: '60%', maxHeight: '60%' }}
        tertiaryButton={clusterType === 'aks'}
        tertiaryButtonConfig={{
          tertiaryButtonTest: 'Test Credentials',
          tertiaryButtonSubmit: () => {
            handleSubmit(handleTestCredAzure, onError)();
          },
          tertiaryButtonDisable: azureTestPassed,
        }}
      >
        <div className=" row d-flex justify-content-center">
          <div className="">
            {clusterType === 'eks' && (
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
                      AWS Access Key Id <span style={{ color: 'red' }}>*</span>
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
                      AWS Session Token <span style={{ color: 'red' }}>*</span>
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
            {clusterType === 'ec2' && (
              <>
                <>
                  <div className="row mt-3">
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        Bastion Host (Public IP / DNS){' '}
                        <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="ec2_bastion_host"
                        type="text"
                        placeholder={'Enter Bastion Host'}
                        required={true}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                      />
                    </div>
                    <div className="col-6">
                      <LabelSelect className="mb-3">
                        SSH User <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="ec2_ssh_username"
                        type="text"
                        placeholder="Enter SSH User"
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
                        Local Forward Port{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </LabelSelect>
                      <InputField
                        name="ec2_local_forward_port"
                        type="text"
                        placeholder="Enter Local Forward Port"
                        required={true}
                        register={register}
                        errors={errors}
                        icon={<QRIcons />}
                      />
                    </div>
                    <div className="col-6">
                      <PemUploadField
                        name="ec2_ssh_pem_file"
                        watch={watch}
                        control={control}
                        rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                        placeholder="Upload SSH Key File"
                        errors={errors}
                        fileLable="File"
                        validExtensionsArray={['.pem', '.txt', '.yaml', '.yml']}
                        acceptString={'.txt,.yaml,.yml,.pem'}
                        errorText={'YAML,PEM or PFX'}
                        label="SSH Key File"
                      />
                    </div>
                  </div>
                </>
              </>
            )}
            {clusterType === 'aks' && (
              <>
                {' '}
                <div className="row mt-3">
                  <div className="col-6">
                    <LabelSelect className="mb-3">
                      Tenant ID <span style={{ color: 'red' }}>*</span>
                    </LabelSelect>
                    <InputField
                      name="tenantId"
                      type="text"
                      placeholder={'Enter Tenant ID'}
                      required={true}
                      register={register}
                      errors={errors}
                      icon={<QRIcons />}
                      disabled={azureTestPassed}
                    />
                  </div>
                  <div className="col-6">
                    <LabelSelect className="mb-3">
                      Client ID <span style={{ color: 'red' }}>*</span>
                    </LabelSelect>
                    <InputField
                      name="clientId"
                      type="text"
                      placeholder="Enter Client ID"
                      required={true}
                      register={register}
                      errors={errors}
                      icon={<QRIcons />}
                      disabled={azureTestPassed}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <LabelSelect className="mb-3">
                      Client Secret <span style={{ color: 'red' }}>*</span>
                    </LabelSelect>
                    <InputField
                      name="clientSecret"
                      type="text"
                      placeholder="Enter Client Secret"
                      required={true}
                      register={register}
                      errors={errors}
                      icon={<QRIcons />}
                      disabled={azureTestPassed}
                    />
                  </div>
                  <div className="col-6">
                    <LabelSelect className="mb-3">
                      Subscription ID <span style={{ color: 'red' }}>*</span>
                    </LabelSelect>
                    <InputField
                      name="subscriptionId"
                      type="text"
                      placeholder={'Enter Subscription ID'}
                      register={register}
                      errors={errors}
                      icon={<QRIcons />}
                      required={true}
                      disabled={azureTestPassed}
                    />
                  </div>
                  <div className="col-6">
                    <LabelSelect className="mb-3">
                      Resource Group <span style={{ color: 'red' }}>*</span>
                    </LabelSelect>
                    <InputField
                      name="resourceGroup"
                      type="text"
                      placeholder={'Enter Resource Group'}
                      register={register}
                      errors={errors}
                      icon={<QRIcons />}
                      required={true}
                      disabled={azureTestPassed}
                    />
                  </div>{' '}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default KubeClusterConfigDetailsModal;
