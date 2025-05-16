/*eslint-disable*/
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../../store';
import { ModalWithRightBtn, PasswordField, SelectField } from '../../../shared';
import { KDFM } from '../../../constants';
import { CurvedLockIcon, DocumentTextIcon } from '../../../assets';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import PemUploadField from '../PEMUploadFile';

const Container = styled.div``;
const StyledSelectField = styled(SelectField)`
  & > div {
    margin-bottom: ${props => props.marginBottom || '1rem'};
  }

  & label {
    margin-bottom: ${props => props.labelMargin || '2px'} !important;
  }

  & .react-select__control {
    height: ${props => props.height || '55px'};
    border-radius: ${props => props.borderRadius || '4px'};
  }

  & .react-select__value-container {
    padding: ${props => props.innerPadding || props.padding || '0 8px'};
  }

  & .react-select__menu {
    border-radius: ${props => props.menuBorderRadius || '4px'};
  }

  & .react-select__option {
    padding: ${props => props.optionPadding || '8px 12px'};
    font-size: ${props => props.fontSize || '14px'};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

export const ClusterRegistryAssociationModal = ({
  selectedCluster,
  setSelectedCluster,
}) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    ClustersSelectors.getIsRegitryAssociationModalOpen
  );
  const isPrimaryBtnDisable = useSelector(
    ClustersSelectors.getAddHostBtnDisable
  );

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRegistiesList')
  );
  const associationAPILoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'associateClusterWithRegistry')
  );
  const registries = useSelector(RegistrySelectors.getRegistriesList);
  const registryOption = registries?.map(ele => ({
    label: ele?.name,
    value: ele?.id,
  }));

  const onRequestClose = () => {
    dispatch(ClustersActions.setIsRegitryAssociationModalOpen(false));
    setSelectedCluster({});
  };

  const schemaPasswrd = yup.object().shape({
    registryId: yup.string().required('Registry is required'),
    truststoreFile: yup.mixed().required('Truststore file is required'),
    keystorePassword: yup.string().required('Keystore password is required'),
    truststorePassword: yup
      .string()
      .required('Truststore password is required'),
    keystoreFile: yup.mixed().required('Keystore file is required'),
    keyPassword: yup.string().required('Key password file is required'),
  });

  const schema = schemaPasswrd;
  const {
    register,
    watch,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      truststoreType: 'JKS',
      keystoreType: 'JKS',
    },
  });

  const watchValues = watch();

  const addIndividualHost = data => {
    const payload = new FormData();
    payload.append('keyPassword', data?.keyPassword);
    payload.append('keystoreFile', data?.keystoreFile);
    payload.append('truststorePassword', data?.truststorePassword);
    payload.append('keystorePassword', data?.keystorePassword);
    payload.append('truststoreFile', data?.truststoreFile);
    payload.append('registryId', data?.registryId);
    payload.append('truststoreType', data?.truststoreType);
    payload.append('keystoreType', data?.keystoreType);

    dispatch(
      ClustersActions.associateClusterWithRegistry({
        payload,
        clusterId: selectedCluster?.id,
      })
    );
  };

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      setSelectedCluster({});
    } else {
      dispatch(RegistryActions.getAllRegistiesList());
    }
  }, [isModalOpen]);

  const typeOptions = [
    {
      label: 'JKS',
      value: 'JKS',
    },
    {
      label: 'PKCS12',
      value: 'PKCS12',
    },
  ];

  return (
    <>
      <FullPageLoader loading={loading || associationAPILoading} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={handleSubmit(addIndividualHost)}
        title={`Cluster's Registry Details`}
        primaryButtonText="Save"
        secondaryButtonText="Back"
        // primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '55%', height: '65%' }}
        footerAlign="start"
      >
        <Container
          style={{
            // pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
            cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
          }}
        >
          <div className="row">
            <StyledSelectField
              name="registryId"
              control={control}
              register={register}
              watch={watch}
              label="Registry"
              icon={<DocumentTextIcon />}
              placeholder="Select Option"
              disableToggle={false}
              errors={errors}
              options={registryOption || []}
            />
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <StyledSelectField
                name="truststoreType"
                control={control}
                register={register}
                watch={watch}
                label="Truststore Type"
                options={typeOptions}
                icon={<DocumentTextIcon />}
                placeholder="Select Option"
                disableToggle={false}
                errors={errors}
              />
            </div>{' '}
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  label="Truststore File"
                  name="truststoreFile"
                  watch={watch}
                  control={control}
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={KDFM.UPLOAD_FILE}
                  errors={errors}
                  fileLable="Truststore File"
                  validExtensionsArray={
                    watchValues?.truststoreType === 'JKS' ? ['.jks'] : ['.p12']
                  }
                  acceptString={
                    watchValues?.truststoreType === 'JKS' ? '.jks' : '.p12'
                  }
                  errorText={
                    watchValues?.truststoreType === 'JKS' ? 'JKS' : 'P12'
                  }
                />
              </ModalContainer>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-6">
              <PasswordField
                name="truststorePassword"
                register={register}
                watch={watch}
                label="Truststore Password"
                icon={<CurvedLockIcon />}
                placeholder="Enter Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
            <div className="col-6">
              <PasswordField
                name="keystorePassword"
                register={register}
                watch={watch}
                label="Keystore Password"
                icon={<CurvedLockIcon />}
                placeholder="Enter Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <StyledSelectField
                label="Keystore Type"
                id="keystore-type"
                name="keystoreType"
                control={control}
                icon={<DocumentTextIcon />}
                errors={errors}
                placeholder="Select Option"
                showCircleIcon={true}
                options={typeOptions}
              />
            </div>
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  label="Keystore File"
                  name="keystoreFile"
                  watch={watch}
                  control={control}
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={KDFM.UPLOAD_FILE}
                  errors={errors}
                  fileLable="Keystore File"
                  validExtensionsArray={
                    watchValues?.keystoreType === 'JKS' ? ['.jks'] : ['.p12']
                  }
                  acceptString={
                    watchValues?.keystoreType === 'JKS' ? '.jks' : '.p12'
                  }
                  errorText={
                    watchValues?.keystoreType === 'JKS' ? 'JKS' : 'P12'
                  }
                />
              </ModalContainer>
            </div>
          </div>
          <div className="row">
            <PasswordField
              name="keyPassword"
              register={register}
              watch={watch}
              label="Key Password"
              icon={<CurvedLockIcon />}
              placeholder="Enter Password"
              disableToggle={false}
              errors={errors}
            />
          </div>
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
