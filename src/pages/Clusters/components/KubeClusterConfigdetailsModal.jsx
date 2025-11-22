/* eslint-disable */
import React, { useState } from 'react';
import { CheckboxField, InputField, Modal } from '../../../shared';
import { QRIcons } from '../../../assets';
import styled from 'styled-components';
import PemUploadField from '../PEMUploadFile';
import { isEmpty } from 'lodash';
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
}) => {
  const onRequestClose = () => {
    setOpenAddConfigModal(false);
  };
  return (
    <>
      <Modal
        isOpen={openAddConfigModal}
        title={`${clusterType === 'ec2' ? 'Self-Managed Kubernetes' : clusterType === 'aks' ? 'Azure' : 'Amazon EKS'} Details`}
        secondaryButtonText="Close"
        primaryButtonText={
          !isEmpty(kubeClusterIDEdit)
            ? 'Initiate Cluster Edit'
            : 'Initiate Cluster Creation'
        }
        primaryButtonDisabled={false}
        onRequestClose={onRequestClose}
        onSubmit={handleSubmit(handleCreateCluster, onError)}
        onSecondarySubmit={onRequestClose}
        footerAlign="center"
        contentStyles={{ minWidth: '60%', maxHeight: '60%' }}
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
                    />
                  </div>
                  <CheckboxField
                    name="check"
                    label="Do you want to save AKS data?"
                    // checked={sshAdd}
                    // onChange={e => setShhAdd(e.target.checked)}
                  />
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
