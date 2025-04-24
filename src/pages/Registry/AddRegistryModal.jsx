/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PemUploadField from '../Clusters/PEMUploadFile';
import {
  InputField,
  ModalWithRightBtn,
  PasswordField,
  RadioSelectField,
} from '../../shared';
import { FullPageLoader } from '../../components';
import {
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import {
  CurvedLockIcon,
  CurvedProfileIcon,
  DocumentTextIcon,
} from '../../assets';
import { KDFM } from '../../constants';

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

export const AddRegistryModal = ({ hostToEdit, setHostToEdit }) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const isModalOpen = useSelector(RegistrySelectors.getIsAddRegistryModalOpen);
  const isPrimaryBtnDisable = true;
  //    useSelector(
  //     ClustersSelectors.getAddHostBtnDisable
  //   );
  //   const getIndividualHostData = useSelector(
  //     ClustersSelectors.getAddHostIndividualData
  //   );

  //   const loading = useSelector(state =>
  //     LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  //   );
  const loading = false;
  const onRequestClose = () => {
    dispatch(RegistryActions.setIsAddRegistryModalOpen(false));
    setHostToEdit({});
  };
  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];

  const schemaPasswrd = yup.object().shape({
    name: yup.string().required('Host IP is required'),
    nifi_url: yup.string().required('Port is required'),
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
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isEmpty(hostToEdit)) {
      setValue('host_ip', hostToEdit?.host_ip);
      setValue('port', hostToEdit?.port);
      setValue('username', hostToEdit?.username);
    }
  }, [hostToEdit]);
  const watchMethodCredentials = watch('methodForCredentials');

  const handleTestSubmit = data => {

    const payload = new FormData();
    payload.append('name', data?.name);
    payload.append('nifi_url', data?.nifi_url);
    payload.append('username', data?.username);
    // payload.append('password', data?.pfxFile);
    payload.append('password', data?.password);

    dispatch(RegistryActions.testRegistry(payload));
    //
  };

  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={e => addIndividualHost(e)}
        title={`${isEmpty(hostToEdit) ? 'Add' : 'Edit'} Registry`}
        primaryButtonText="Add Registry"
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '40%', height: '60%' }}
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
            <InputField
              name="name"
              type="text"
              label="Registry Name"
              placeholder="Enter Registry Name"
              required
              register={register}
              errors={errors}
              icon={<DocumentTextIcon />}
              disabled={!isPrimaryBtnDisable || !isEmpty(hostToEdit)}
            />
          </div>
          <div className="row">
            <InputField
              name="nifi_url"
              type="text"
              label="Registry URL"
              placeholder="Enter Registry URL"
              required
              register={register}
              errors={errors}
              icon={<DocumentTextIcon />}
              disabled={!isPrimaryBtnDisable}
            />
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
            <div className="">
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
          </div>
          {(isEmpty(watchMethodCredentials) ||
            watchMethodCredentials === 'password') && (
            <>
              {' '}
              <div className="row">
                <PasswordField
                  name="password"
                  register={register}
                  watch={watch}
                  label="Password"
                  icon={<CurvedLockIcon />}
                  placeholder="Enter Your Password"
                  disableToggle={false}
                  errors={errors}
                />
              </div>
            </>
          )}
          {watchMethodCredentials === 'privatekey' && (
            <>
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
                  />
                </ModalContainer>
              </span>
            </>
          )}
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
