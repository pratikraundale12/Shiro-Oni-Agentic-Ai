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

export const AddRegistryModal = ({ hostToEdit }) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');
  const isModalOpen = useSelector(RegistrySelectors.getIsAddRegistryModalOpen);
  const testSuccess = useSelector(RegistrySelectors.getRegistryTestSuccess);
  const selectedRegistry = useSelector(
    RegistrySelectors.getRegistrySelectedData
  );

  const isPrimaryBtnDisable = !testSuccess;
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'testRegistry')
  );

  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];

  const schemaPasswrd = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .test(
        'no-leading-trailing-spaces',
        'Name must not start or end with a space',
        value => value === value?.trim()
      ),
    nifi_url: yup.string().required('URL is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const schemaPrivateKey = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .test(
        'no-leading-trailing-spaces',
        'Name must not start or end with a space',
        value => value === value?.trim()
      ),
    nifi_url: yup.string().required('URL is required'),
    password: yup.string().required('Password is required'),
    pfxFile: yup.mixed().required('File is required'),
  });
  const editSchema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .test(
        'no-leading-trailing-spaces',
        'Name must not start or end with a space',
        value => value === value?.trim()
      ),
  });

  const schema = !isEmpty(selectedRegistry)
    ? editSchema
    : method === 'password'
      ? schemaPasswrd
      : schemaPrivateKey;

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

  const onRequestClose = () => {
    dispatch(RegistryActions.setIsAddRegistryModalOpen(false));
    dispatch(RegistryActions.setRegistryTestSuccess(false));
    reset();
  };

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      dispatch(RegistryActions.setRegistrySelectedData({}));
    }
  }, [isModalOpen]);
  useEffect(() => {
    if (!isEmpty(selectedRegistry)) {
      setValue('name', selectedRegistry?.name);
      setValue('nifi_url', selectedRegistry?.registry_url);
    }
  }, [selectedRegistry]);
  const watchMethodCredentials = watch('methodForCredentials');
  const formData = watch();

  const handleTestSubmit = data => {
    const payload = new FormData();
    payload.append('name', data?.name);
    payload.append('nifi_url', data?.nifi_url);

    if (method === 'password') {
      payload.append('username', data?.username);
      payload.append('password', data?.password);
    } else {
      payload.append('file', data?.pfxFile);
      payload.append('passphrase', data?.password);
    }
    dispatch(RegistryActions.testRegistry(payload));
  };
  const addIndividualRegistry = () => {
    if (!isEmpty(selectedRegistry)) {
      dispatch(
        RegistryActions.editRegistry({
          name: formData?.name,
          registryId: selectedRegistry?.id,
        })
      );
    } else {
      const data = {
        name: formData?.name,
        registry_url: formData?.nifi_url,
      };
      dispatch(RegistryActions.createRegistryAfterTest(data));
    }
  };
  useEffect(() => {
    if (watchMethodCredentials) {
      setMethod(watchMethodCredentials);
    }
  }, [watchMethodCredentials]);

  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={() =>
          !isEmpty(selectedRegistry)
            ? handleSubmit(addIndividualRegistry)()
            : addIndividualRegistry()
        }
        title={`${isEmpty(selectedRegistry) ? 'Add' : 'Edit'} Registry`}
        primaryButtonText={`${isEmpty(selectedRegistry) ? 'Add' : 'Edit'} Registry`}
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable && isEmpty(selectedRegistry)}
        contentStyles={{ minWidth: '40%', height: '60%' }}
        footerAlign="start"
        tertiaryButton={true}
        tertiaryButtonConfig={{
          tertiaryButtonTest: 'Test Credentials',
          tertiaryButtonSubmit: handleSubmit(handleTestSubmit),
          tertiaryButtonDisable:
            !isPrimaryBtnDisable || !isEmpty(selectedRegistry),
        }}
      >
        <Container
          style={{
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
              disabled={!isPrimaryBtnDisable}
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
              disabled={!isPrimaryBtnDisable || !isEmpty(selectedRegistry)}
            />
          </div>
          <div
            style={{
              cursor: !isEmpty(selectedRegistry) ? 'not-allowed' : 'pointer',
              pointerEvents: !isEmpty(selectedRegistry) ? 'none' : 'auto',
            }}
          >
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
                disabled={!isPrimaryBtnDisable || !isEmpty(selectedRegistry)}
              />
            </div>

            {(isEmpty(watchMethodCredentials) ||
              watchMethodCredentials === 'password') && (
              <>
                {' '}
                <div className="row">
                  <InputField
                    name="username"
                    type="text"
                    label="User Name"
                    placeholder="Enter Your User Name"
                    required
                    register={register}
                    errors={errors}
                    icon={<CurvedProfileIcon />}
                    disabled={
                      !isPrimaryBtnDisable || !isEmpty(selectedRegistry)
                    }
                  />
                </div>
              </>
            )}

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
                disabled={!isPrimaryBtnDisable || !isEmpty(selectedRegistry)}
              />{' '}
            </div>

            {watchMethodCredentials === 'privatekey' && (
              <>
                <span
                  style={{
                    pointerEvents:
                      !isPrimaryBtnDisable || !isEmpty(selectedRegistry)
                        ? 'none'
                        : 'auto',
                    cursor:
                      !isPrimaryBtnDisable || !isEmpty(selectedRegistry)
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  <ModalContainer>
                    <PemUploadField
                      name="pfxFile"
                      watch={watch}
                      control={control}
                      required
                      rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                      placeholder={'Upload PFX file'}
                      errors={errors}
                      label="PFX file"
                    />
                  </ModalContainer>
                </span>
              </>
            )}
          </div>
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
