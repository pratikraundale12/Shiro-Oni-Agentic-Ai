/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ClustersActions, ClustersSelectors } from '../../../store';
import {
  InputField,
  Modal,
  PasswordField,
  RadioSelectField,
} from '../../../shared';
import { KDFM } from '../../../constants';
import { KeyIcons, LinkIcon, QRIcons } from '../../../assets';
import { UploadFile } from '../UploadFile';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const Container = styled.div``;
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 38px;
  margin-bottom: 35px;
`;

export const AddHostIPModal = () => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const isModalOpen = useSelector(ClustersSelectors.getIsAddHostIPModalOpen);
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddHostIPModalOpen(false));
  };
  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];

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
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchMethodCredentials = watch('methodForCredentials');
  const handleContinueSubmit = data => {
    console.log(data, 'data');
    const payload = new FormData();
    payload.append('host', data?.host_ip);
    payload.append('username', data?.username);
    payload.append('file', data?.pfxFile);
    const payloadData = { payload, data };
    dispatch(ClustersActions.checkCredentialsClusterSetup(payloadData));
  };
  useEffect(() => {
    if (watchMethodCredentials) {
      setMethod(watchMethodCredentials);
    }
  }, [watchMethodCredentials]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen]);
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      onSubmit={handleSubmit(handleContinueSubmit)}
      title={'Add Host Details'}
      primaryButtonText="Continue"
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '40%', height: '55%' }}
      footerAlign="start"
    >
      <Container>
        <div className="row">
          <div className="col-8">
            <InputField
              name="host_ip"
              type="text"
              label="Host IP"
              placeholder="Enter Your Host IP"
              required
              register={register}
              errors={errors}
              icon={<LinkIcon />}
            />
          </div>{' '}
          <div className="col-4">
            <InputField
              name="port"
              type="text"
              label="Port"
              placeholder="Enter Port"
              required
              register={register}
              errors={errors}
              icon={<QRIcons />}
            />
          </div>
        </div>
        <div className=" d-flex justify-content-end ">
          <RadioSelectField
            name="methodForCredentials"
            options={OPTIONS}
            register={register}
            defaultValue={'password'}
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
              icon={<LinkIcon />}
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
                placeholder="Enter Your Password"
                disableToggle={false}
                errors={errors}
              />
            </div>
          </>
        )}
        {watchMethodCredentials === 'privatekey' && (
          <>
            <ModalContainer>
              <UploadFile
                name="pfxFile"
                watch={watch}
                control={control}
                label={KDFM.PFX_FILE}
                placeholder={KDFM.SELECT_PFX_FILE}
                errors={errors}
              />

              <PasswordField
                name="private_file"
                watch={watch}
                label={KDFM.PFX_PASSPHRASE}
                register={register}
                placeholder={KDFM.ENTER_PFX_PASSPHRASE}
                icon={<KeyIcons />}
                errors={errors}
              />
            </ModalContainer>
          </>
        )}
      </Container>
    </Modal>
  );
};
