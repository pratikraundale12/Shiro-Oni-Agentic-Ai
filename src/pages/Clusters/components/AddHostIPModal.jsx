/*eslint-disable*/
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
  RadioSelectField,
  SelectField,
} from '../../../shared';
import { KDFM } from '../../../constants';
import {
  CurvedLockIcon,
  CurvedProfileIcon,
  DocumentTextIcon,
  InfoIcon,
} from '../../../assets';
import { isEmpty, set } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { theme } from '../../../styles';

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
export const AddHostIPModal = ({ hostToEdit, setHostToEdit }) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const [addCertificate, setAddCertificate] = useState(false);
  const [formData, setFormData] = useState({});
  const isModalOpen = useSelector(ClustersSelectors.getIsAddHostIPModalOpen);
  const isPrimaryBtnDisable = useSelector(
    ClustersSelectors.getAddHostBtnDisable
  );
  const getIndividualHostData = useSelector(
    ClustersSelectors.getAddHostIndividualData
  );

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );

  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddHostIPModalOpen(false));
    setHostToEdit({});
  };
  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];
  const KEYSTORE_SELECTION_OPTIONS = [
    { id: 1, value: 'true', label: 'True' },
    { id: 2, value: 'false', label: 'False' },
  ];

  const schemaPasswrd = yup.object().shape({
    host_ip: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const schemaPasswrdwithCertificate = yup.object().shape({
    host_ip: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    certificateType: yup.string().required('Certificate type is required'),
    keystorePassword: yup.string().required('Keystore password is required'),
    keystoreCertificate: yup.mixed().required('File is required'),
    truststorePassword: yup
      .string()
      .required('Truststore password is required'),
    truststoreCertificate: yup.mixed().required('File is required'),
    keyPassword: yup.string().required('Password is required'),
  });

  const schemaPrivateKey = yup.object().shape({
    host_ip: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    pfxFile: yup.mixed().required('File is required'),
  });
  const schemaPrivateKeywithCertificate = yup.object().shape({
    host_ip: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    pfxFile: yup.mixed().required('File is required'),
    certificateType: yup.string().required('Certificate type is required'),
    keystorePassword: yup.string().required('Keystore password is required'),
    keystoreCertificate: yup.mixed().required('File is required'),
    truststorePassword: yup
      .string()
      .required('Truststore password is required'),
    truststoreCertificate: yup.mixed().required('File is required'),
    keyPassword: yup.string().required('Password is required'),
  });
  const getSchema = () => {
    if (method === 'password') {
      if (addCertificate === 'true') {
        return schemaPasswrdwithCertificate;
      } else {
        return schemaPasswrd;
      }
    } else {
      if (addCertificate === 'true') {
        return schemaPrivateKeywithCertificate;
      } else {
        return schemaPrivateKey;
      }
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema()),
  });

  useEffect(() => {
    if (!isEmpty(hostToEdit)) {
      setValue('host_ip', hostToEdit?.host_ip);
      setValue('port', hostToEdit?.port);
      setValue('username', hostToEdit?.username);
      setValue('hostName', hostToEdit?.host_name);
      setValue(
        'isKeystoreCertificateAdd',
        hostToEdit?.has_certificate.toString()
      );
    }
  }, [hostToEdit]);
  const watchMethodCredentials = watch('methodForCredentials');
  const watchCertificateSelection = watch('isKeystoreCertificateAdd');

  const handleTestSubmit = data => {
    setFormData(data);
    const payload = new FormData();
    payload.append('hostIp', data?.host_ip);
    payload.append('port', data?.port);
    payload.append('username', data?.username);
    payload.append('file', data?.pfxFile);
    payload.append('isPassword', false);

    const payloadData = { payload, data };
    dispatch(ClustersActions.checkCredentialsClusterSetup(payloadData));
  };

  const addIndividualHost = e => {
    const payload = new FormData();
    payload.append('hostName', formData?.hostName);
    payload.append('port', getIndividualHostData?.port);
    payload.append('username', getIndividualHostData?.username);
    payload.append('pemFile', getIndividualHostData?.pfxFile);
    payload.append(
      'isPassword',
      getIndividualHostData?.methodForCredentials === 'password'
    );
    if (formData?.isKeystoreCertificateAdd === 'true') {
      payload.append('keystoreFile', formData?.keystoreCertificate);
      payload.append('truststoreFile', formData?.truststoreCertificate);
      payload.append('certificateType', formData?.certificateType);
      payload.append('keystorePassword', formData?.keystorePassword);
      payload.append('truststorePassword', formData?.truststorePassword);
      payload.append('hasCertificate', formData?.isKeystoreCertificateAdd);
      payload.append('keyPassword', formData?.keyPassword);
    }
    if (isEmpty(hostToEdit)) {
      payload.append('hostIp', getIndividualHostData?.host_ip);
      dispatch(ClustersActions.addIndividualHost(payload));
    } else {
      const payloadData = {
        payload,
        hostId: hostToEdit?.id,
      };
      dispatch(ClustersActions.updateIndividualHost(payloadData));
    }
  };

  useEffect(() => {
    if (watchMethodCredentials) {
      setMethod(watchMethodCredentials);
    }
  }, [watchMethodCredentials]);
  useEffect(() => {
    if (watchCertificateSelection) {
      setAddCertificate(watchCertificateSelection);
    }
  }, [watchCertificateSelection]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      if (dispatch) {
        dispatch(ClustersActions.setAddHostBtnDisable(true));
        dispatch(ClustersActions.setAddHostIndividualData({}));
      }
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
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={e => addIndividualHost(e)}
        title={`${isEmpty(hostToEdit) ? 'Add' : 'Edit'} Host Details`}
        primaryButtonText="Add Host"
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '68%', maxHeight: '65%' }}
        footerAlign="start"
        tertiaryButton={true}
        tertiaryButtonConfig={{
          tertiaryButtonTest: 'Test Credentials',
          tertiaryButtonSubmit: handleSubmit(handleTestSubmit),
          tertiaryButtonDisable: !isPrimaryBtnDisable,
        }}
      >
        <Container
          style={{
            // pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
            cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
          }}
        >
          <div className="row">
            <div className="col-6">
              <InputField
                name="host_ip"
                type="text"
                label="Host IP"
                placeholder="Enter Your Host IP"
                required
                register={register}
                errors={errors}
                icon={<DocumentTextIcon />}
                disabled={!isPrimaryBtnDisable || !isEmpty(hostToEdit)}
              />
            </div>{' '}
            <div className="col-3">
              <InputField
                name="port"
                type="text"
                label="Port"
                placeholder="Enter Port"
                required
                register={register}
                errors={errors}
                icon={<DocumentTextIcon />}
                disabled={!isPrimaryBtnDisable}
              />
            </div>
            <div className="col-3">
              <InputField
                name="hostName"
                type="text"
                label="Host Name"
                placeholder="Enter Your Host Name"
                register={register}
                errors={errors}
                icon={<CurvedProfileIcon />}
                disabled={!isPrimaryBtnDisable}
              />
            </div>
          </div>
          <div
            className=" d-flex justify-content-end "
            style={{
              pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
              cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
            }}
          >
            <RadioSelectField
              name="methodForCredentials"
              options={OPTIONS}
              register={register}
              defaultValue={'password'}
              disabled={!isPrimaryBtnDisable}
            />
          </div>
          <div className="row">
            <div className="col-6">
              <InputField
                name="username"
                type="text"
                label="User Name"
                placeholder="Enter Your User Name"
                required
                register={register}
                errors={errors}
                icon={<CurvedProfileIcon />}
                disabled={!isPrimaryBtnDisable}
              />
            </div>{' '}
            {(isEmpty(watchMethodCredentials) ||
              watchMethodCredentials === 'password') && (
              <>
                {' '}
                <div className="col-6">
                  <PasswordField
                    name="password"
                    register={register}
                    watch={watch}
                    label="Password"
                    required
                    icon={<CurvedLockIcon />}
                    placeholder="Enter Your Password"
                    disableToggle={false}
                    errors={errors}
                  />
                </div>
              </>
            )}
            {watchMethodCredentials === 'privatekey' && (
              <div className="col-6">
                <span
                  style={{
                    pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
                    cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ModalContainer>
                    <PemUploadField
                      name="pfxFile"
                      watch={watch}
                      control={control}
                      required
                      rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                      placeholder={KDFM.UPLOAD_PEM_FILE}
                      errors={errors}
                      fileLable="PEM file"
                      disabled={!isPrimaryBtnDisable}
                    />
                  </ModalContainer>
                </span>
              </div>
            )}
          </div>
          <div className=" d-flex justify-content-between ">
            <div className="mt-3">
              <InfoIcon color={theme.colors.primary} height={25} weight={25} />{' '}
              &nbsp;
              <span style={{ color: theme.colors.primary, fontWeight: '600' }}>
                You can optionally upload your keystore and truststore
                (.p12/.jks) files with passwords to enable secure SSL/TLS
                communication.
              </span>
            </div>
            <div>
              <RadioSelectField
                name="isKeystoreCertificateAdd"
                options={KEYSTORE_SELECTION_OPTIONS}
                register={register}
                defaultValue={'false'}
                disabled={!isPrimaryBtnDisable}
                label={'Add Certificates'}
              />
            </div>
          </div>{' '}
          {watchCertificateSelection === 'true' && (
            <>
              <div className="row mt-2">
                <div className="col-4">
                  <span
                    style={{
                      pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
                      cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <PemUploadField
                      name="keystoreCertificate"
                      watch={watch}
                      control={control}
                      label={'Keystore Certificate'}
                      // required
                      rightIcon={<UploadWrapper>Browse File</UploadWrapper>}
                      placeholder={'Keystore Certificate'}
                      errors={errors}
                      fileLable="Keystore Certificate"
                    />
                  </span>
                </div>
                <div className="col-4">
                  <PasswordField
                    name="keystorePassword"
                    register={register}
                    watch={watch}
                    label="Keystore Password"
                    icon={<CurvedLockIcon />}
                    placeholder="Enter Password"
                    disableToggle={false}
                    errors={errors}
                    disabled={!isPrimaryBtnDisable}
                  />
                </div>
                <div className="col-4">
                  <StyledSelectField
                    label="Certificates Type"
                    id="keystore-type"
                    name="certificateType"
                    control={control}
                    icon={<DocumentTextIcon />}
                    errors={errors}
                    placeholder="Select Option"
                    showCircleIcon={true}
                    options={typeOptions}
                    disabled={!isPrimaryBtnDisable}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-4">
                  <span
                    style={{
                      pointerEvents: !isPrimaryBtnDisable ? 'none' : 'auto',
                      cursor: !isPrimaryBtnDisable ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <PemUploadField
                      name="truststoreCertificate"
                      watch={watch}
                      control={control}
                      label={'Truststore Certificate'}
                      rightIcon={<UploadWrapper>Browse File</UploadWrapper>}
                      placeholder={'Truststore Certificate'}
                      errors={errors}
                      fileLable="Truststore Certificate"
                    />
                  </span>
                </div>
                <div className="col-4">
                  <PasswordField
                    name="truststorePassword"
                    register={register}
                    watch={watch}
                    label="Truststore Password"
                    icon={<CurvedLockIcon />}
                    placeholder="Enter Password"
                    disableToggle={false}
                    errors={errors}
                    disabled={!isPrimaryBtnDisable}
                  />
                </div>
                <div className="col-4">
                  <PasswordField
                    name="keyPassword"
                    register={register}
                    watch={watch}
                    label="Key Password"
                    icon={<CurvedLockIcon />}
                    placeholder="Enter Password"
                    disableToggle={false}
                    errors={errors}
                    disabled={!isPrimaryBtnDisable}
                  />
                </div>
              </div>
            </>
          )}
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
