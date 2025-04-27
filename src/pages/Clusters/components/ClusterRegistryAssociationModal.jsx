import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import {
  InputField,
  ModalWithRightBtn,
  PasswordField,
  SelectField,
} from '../../../shared';
import { KDFM } from '../../../constants';
import {
  CurvedLockIcon,
  CurvedProfileIcon,
  DocumentTextIcon,
} from '../../../assets';
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

export const ClusterRegistryAssociationModal = () => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const isModalOpen = useSelector(
    ClustersSelectors.getIsRegitryAssociationModalOpen
  );
  const isPrimaryBtnDisable = useSelector(
    ClustersSelectors.getAddHostBtnDisable
  );

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );

  const onRequestClose = () => {
    dispatch(ClustersActions.setIsRegitryAssociationModalOpen(false));
  };

  const schemaPasswrd = yup.object().shape({
    host_ip: yup.string().required('Host IP is required'),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const schemaPrivateKey = yup.object().shape({
    host_ip: yup.string().required('Host IP is required'),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    pfxFile: yup.mixed().required('File is required'),
  });
  const schema = method === 'password' ? schemaPasswrd : schemaPrivateKey;
  const {
    register,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchMethodCredentials = watch('methodForCredentials');

  const addIndividualHost = () => {};

  useEffect(() => {
    if (watchMethodCredentials) {
      setMethod(watchMethodCredentials);
    }
  }, [watchMethodCredentials]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      if (dispatch) {
        dispatch(ClustersActions.setAddHostBtnDisable(true));
        dispatch(ClustersActions.setAddHostIndividualData({}));
      }
    }
  }, [isModalOpen]);
  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={e => addIndividualHost(e)}
        title={`Cluster Registry Details`}
        primaryButtonText="Save"
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '40%', height: '55%' }}
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
              name="registry-type"
              control={control}
              register={register}
              watch={watch}
              label="Registry Type"
              icon={<DocumentTextIcon />}
              placeholder="Enter Your type"
              disableToggle={false}
              errors={errors}
            />
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <InputField
                name="keystore-filename"
                type="text"
                label="Keystore Filename"
                placeholder="Enter FileName"
                register={register}
                errors={errors}
                icon={<CurvedProfileIcon />}
                disabled={!isPrimaryBtnDisable}
              />
            </div>{' '}
            <div className="col-6">
              <PasswordField
                name="keystore-password"
                register={register}
                watch={watch}
                label="Keystore Password"
                icon={<CurvedLockIcon />}
                placeholder="Enter Your Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <PasswordField
                name="key-password"
                register={register}
                watch={watch}
                label="Key Password"
                icon={<CurvedLockIcon />}
                placeholder="Enter Your Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
            <div className="col-6">
              <StyledSelectField
                label="Keystore Type"
                id="keystore-type"
                name="keystore-type"
                control={control}
                icon={<DocumentTextIcon />}
                errors={errors}
                placeholder="Select Option"
                showCircleIcon={true}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  label="Truststore Filename"
                  name="truststore-filename"
                  watch={watch}
                  control={control}
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={KDFM.UPLOAD_FILE}
                  errors={errors}
                  fileLable="Truststore Filename"
                />
              </ModalContainer>
            </div>
            <div className="col-6">
              <PasswordField
                name="truststore-password"
                register={register}
                watch={watch}
                label="Truststore Password"
                icon={<CurvedLockIcon />}
                placeholder="Enter Your Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
          </div>
          <div className="row mt-3">
            <StyledSelectField
              name="truststore-type"
              control={control}
              register={register}
              watch={watch}
              label="Truststore Type"
              icon={<DocumentTextIcon />}
              placeholder="Enter Your type"
              disableToggle={false}
              errors={errors}
            />
          </div>
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
