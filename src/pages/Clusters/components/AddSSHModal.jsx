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
  CheckboxField,
  InputField,
  ModalWithRightBtn,
  PasswordField,
  RadioSelectField,
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

export const AddSSHModal = ({
  hostToEdit,
  setHostToEdit,
  isSSHModalOpen,
  setIsSSHModalOpen,
  selectedSSH,
  setSshItem,
}) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const [addCertificate, setAddCertificate] = useState(false);
  const [formData, setFormData] = useState({});
  const [duplicateCheck, setDuplicateCheck] = useState(false);
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
    setIsSSHModalOpen(false);
  };

  const schemaPasswrd = yup.object().shape({
    hostIp: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    nifiLibPath: yup.string().required('Path is required'),
    username: yup.string().required('Username is required'),
    file: yup.mixed().required('File is required'),
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
    resolver: yupResolver(schemaPasswrd),
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
    payload.append('hostIp', data?.hostIp);
    payload.append('username', data?.username);
    payload.append('file', data?.file);
    payload.append('isPassword', false);

    const payloadData = { payload, data };

    console.log(payloadData, 'payloadData');

    dispatch(ClustersActions.checkCredentialsClusterSetup(payloadData));
  };

  const addIndividualHost = e => {
    console.log(formData, 'formData');
    setSshItem(prevData =>
      prevData.map(item =>
        item.id === selectedSSH?.id
          ? {
              id: item?.id,
              hostIp: formData?.hostIp,
              file: formData?.file?.name,
              clusterId: formData?.hostIp,
              username: formData?.username,
              nifiLibPath: formData?.nifiLibPath,
            }
          : item
      )
    );
    onRequestClose();
    reset();
    dispatch(ClustersActions.setAddHostBtnDisable(true));
    setDuplicateCheck(false);
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

  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];
  console.log(duplicateCheck, 'duplicateCheck');

  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isSSHModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={e => addIndividualHost(e)}
        title={`${isEmpty(hostToEdit) ? 'Add' : 'Edit'} SSH Details`}
        primaryButtonText="Add Details"
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '60%', maxHeight: '65%' }}
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
                name="hostIp"
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
            <div className="col-6">
              <InputField
                name="nifiLibPath"
                type="text"
                label="File Path"
                placeholder="Enter file path"
                required
                register={register}
                errors={errors}
                icon={<DocumentTextIcon />}
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
                      name="file"
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
            <CheckboxField
              name="check"
              label="Do you want to add same data in all nodes?"
              checked={duplicateCheck}
              onChange={e => setDuplicateCheck(e.target.checked)}
            />
          </div>
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
