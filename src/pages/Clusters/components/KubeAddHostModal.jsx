/*eslint-disable*/
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { InputField, ModalWithRightBtn, SelectField } from '../../../shared';
import { DocumentTextIcon, QRIcons } from '../../../assets';
import { isEmpty, set } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { KDFM } from '../../../constants';

const Container = styled.div``;
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2px;
  margin-bottom: 0px;
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
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
export const KubernetesAddHostModal = ({ hostToEdit, setHostToEdit }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(ClustersSelectors.getkubeHostModalOpen);
  const recentSelectedCluster = useSelector(
    ClustersSelectors.getrecentClusterSelected
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'createKubernetesMasterNodeCluster')
  );
  const onRequestClose = () => {
    dispatch(ClustersActions.setkubeHostModalOpen(false));
    setHostToEdit({});
  };

  const schemaPasswrdwithCertificate = yup.object().shape({
    kubeClusterName: yup
      .string()
      .required('Kubernetes Cluster Configuration is required')
      .test(
        'no-leading-trailing-spaces',
        'Kubernetes Cluster Configuration must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    kubeConfigFile: yup.mixed().required('File is required'),
    cluster_type: yup.string().required('Cluster type is required'),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaPasswrdwithCertificate),
  });

  useEffect(() => {
    if (!isEmpty(hostToEdit)) {
      setValue('host_ip', hostToEdit?.host_ip);
      setValue('port', hostToEdit?.port);
      setValue('username', hostToEdit?.username);
      setValue('hostName', hostToEdit?.host_name);
    }
  }, [hostToEdit]);

  const addIndividualHost = data => {
    const payload = new FormData();
    payload.append('kubeClusterName', data?.kubeClusterName);
    payload.append('kubeConfigFile', data?.kubeConfigFile);
    payload.append('type', data?.cluster_type);
    dispatch(ClustersActions.createKubernetesMasterNodeCluster(payload));
    dispatch(ClustersActions.setRecentClusterSelected(data?.cluster_type));
  };

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      if (dispatch) {
        dispatch(ClustersActions.setAddHostBtnDisable(true));
        dispatch(ClustersActions.setAddHostIndividualData({}));
      }
    }
  }, [isModalOpen]);
  useEffect(() => {
    if (!isEmpty(recentSelectedCluster)) {
      setValue('cluster_type', recentSelectedCluster);
    } else {
      setValue('cluster_type', 'aks');
    }
  }, [recentSelectedCluster]);
  return (
    <>
      <FullPageLoader loading={loading || loading2} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={handleSubmit(addIndividualHost)}
        title={`${isEmpty(hostToEdit) ? 'Add' : 'Edit'} Kubernetes Details`}
        primaryButtonText="Add Configuration"
        secondaryButtonText="Back"
        contentStyles={{ minWidth: '50%', maxHeight: '65%' }}
        footerAlign="start"
      >
        <Container>
          <div className="row">
            <div className="col-6">
              <InputField
                name="kubeClusterName"
                type="text"
                label="Kubernetes Cluster Configuration"
                placeholder="Enter Kubernetes Cluster Configuration"
                required
                register={register}
                errors={errors}
                icon={<DocumentTextIcon />}
              />
            </div>{' '}
            <div className="col-6 mb-4">
              <LabelSelect className="mb-3">
                Kubernetes cluster type
              </LabelSelect>
              <SelectField
                name="cluster_type"
                icon={<DocumentTextIcon />}
                register={register}
                errors={errors}
                control={control}
                options={
                  [
                    { label: 'Amazon EKS', value: 'eks' },
                    {
                      label: 'Self-Managed Kubernetes',
                      value: 'ec2',
                    },
                    {
                      label: 'Azure Kubernetes Service',
                      value: 'aks',
                    },
                  ] || []
                }
                placeholder={'Select Kubernetes Cluster'}
                required={true}
              />
            </div>
          </div>

          <div>
            <div className="col-12">
              <span>
                <ModalContainer>
                  <PemUploadField
                    name="kubeConfigFile"
                    watch={watch}
                    control={control}
                    required
                    rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                    placeholder="Upload kubernetes Configuration file"
                    errors={errors}
                    fileLable="File"
                    validExtensionsArray={['.txt', '.yaml', '.yml']}
                    acceptString={'.txt,.yaml,.yml'}
                    errorText={'YAML, YML or TXT'}
                    label="Kubernetes Configuration file"
                  />
                </ModalContainer>
              </span>
            </div>
          </div>
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
