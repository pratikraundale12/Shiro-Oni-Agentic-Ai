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
} from '../../../shared';
import { KDFM } from '../../../constants';
import { CurvedLockIcon, CurvedProfileIcon, DocumentTextIcon } from '../../../assets';
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
  color: #FF7A00;
  margin-bottom: 12px;
  padding: 5px 12px;
  background-color: white;
  font-weight:bold;
  border: 1px solid #FF7A00;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color:rgb(253, 250, 245);
  }
`;

export const ClusterServiceAccountModal = ({ onOpen, onClose ,hostToEdit, setHostToEdit }) => {

  const dispatch = useDispatch();   
  const [method, setMethod] = useState('password');
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
    onClose(); 
  };
  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];

  const schemaPasswrd = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const schemaPrivateKey = yup.object().shape({
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
      setValue('username', hostToEdit?.username);
    }
  }, [hostToEdit]);
  const watchMethodCredentials = watch('methodForCredentials');

  const handleTestSubmit = data => {
    const payload = new FormData();
    payload.append('username', data?.username);
    payload.append('file', data?.pfxFile);
    payload.append('isPassword', false);

    const payloadData = { payload, data };
    dispatch(ClustersActions.checkCredentialsClusterSetup(payloadData));
  };

  const addIndividualHost = e => {
    const payload = new FormData();

    payload.append('username', getIndividualHostData?.username);
    payload.append('file', getIndividualHostData?.pfxFile);
    payload.append(
      'isPassword',
      getIndividualHostData?.methodForCredentials === 'password'
    );
    if (isEmpty(hostToEdit)) {
      dispatch(ClustersActions.addIndividualHost(payload));
    } else {
      const payloadData = {
        payload,
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
        isOpen={onOpen}
        onRequestClose={onClose}
        onSubmit={e => addIndividualHost(e)}
        title={`Service Account Details`}
        primaryButtonText="Add Host"
        secondaryButtonText="Back"
        primaryButtonDisabled={isPrimaryBtnDisable}
        contentStyles={{ minWidth: '30%' }}
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
