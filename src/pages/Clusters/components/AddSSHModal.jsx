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
import {
  CrossIcons,
  CrossWithCircleIcon,
  CurvedLockIcon,
  DocumentTextIcon,
  TickIconWithCircle,
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
  isSSHModalOpen,
  setIsSSHModalOpen,
  selectedSSH,
  setSshItem,
  bulkSelectItems,
  setBulkSelectItems,
  data,
  setSelectedSSH,
}) => {
  const dispatch = useDispatch();
  // const [method, setMethod] = useState('password');
  const [addCertificate, setAddCertificate] = useState(false);
  const [formData, setFormData] = useState({});
  const isModalOpen = useSelector(ClustersSelectors.getIsAddHostIPModalOpen);
  const isPrimaryBtnDisable = useSelector(
    ClustersSelectors.getAddHostBtnDisable
  );
  const testResponseListforMultiNodes = useSelector(
    ClustersSelectors.getmultiNodesTestResults
  );

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );
  const loading1 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'testMultipleNodes')
  );

  const schemaFile = yup.object().shape({
    hostIp: yup
      .string()
      .required('Host IP is required')
      .test(
        'no-leading-trailing-spaces',
        'Host IP must not have leading or trailing spaces',
        value => value === value?.trim()
      ),
    port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    file: yup.mixed().required('File is required'),
  });
  const schemaMultipleNodes = yup.object().shape({
    username: yup.string().required('Username is required'),
    file: yup.mixed().required('File is required'),
  });

  const formSchema = isEmpty(bulkSelectItems)
    ? schemaFile
    : schemaMultipleNodes;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (!isEmpty(selectedSSH) && data?.created_by_ansible) {
      setValue('hostIp', selectedSSH?.hostIp);
      setValue('port', selectedSSH?.port);
    }
  }, [selectedSSH]);

  const onRequestClose = () => {
    // setValue('username', '');
    setIsSSHModalOpen(false);
    setBulkSelectItems([]);
    setSelectedSSH({});
    dispatch(ClustersActions.setAddHostBtnDisable(true));
    dispatch(ClustersActions.setMultiNodesTestResults({}));
    reset();
  };

  const watchMethodCredentials = watch('methodForCredentials');
  // const watchCertificateSelection = watch('isKeystoreCertificateAdd');

  const handleTestSubmit = data => {
    setFormData(data);
    if (isEmpty(bulkSelectItems)) {
      const payload = new FormData();
      payload.append('hostIp', data?.hostIp);
      payload.append('username', data?.username);
      payload.append('file', data?.file);
      payload.append('isPassword', false);

      const payloadData = { payload, data };

      dispatch(ClustersActions.checkCredentialsClusterSetup(payloadData));
    } else {
      const payload = new FormData();
      const hosts = bulkSelectItems?.map(ele => ({
        hostIp: ele?.hostIp,
        port: ele?.port,
        id: ele?.id,
      }));

      payload.append('hosts', JSON.stringify(hosts));
      payload.append('username', data?.username);
      payload.append('file', data?.file);
      payload.append('isPassword', false);

      const payloadData = { payload, data };
      dispatch(ClustersActions.testMultipleNodes(payloadData));
    }
  };

  const addIndividualHost = e => {
    onRequestClose();
    reset();
    dispatch(ClustersActions.setAddHostBtnDisable(true));
    if (isEmpty(bulkSelectItems)) {
      const payload = new FormData();
      payload.append('hostIp', formData?.hostIp);
      payload.append('port', formData?.port);
      payload.append('username', formData?.username);
      payload.append('pemFile', formData?.file);
      payload.append('isPassword', false);

      const payloadData = {
        payload,
        hostId: selectedSSH?.id,
        clusterId: data?.id,
        callForSSH: true,
      };
      dispatch(ClustersActions.updateIndividualHost(payloadData));
    } else {
      const nodesArr = testResponseListforMultiNodes?.response
        ?.filter(ele => ele?.status === 'success')
        .map(ele => ele.id);

      const payload = new FormData();
      payload.append('nodes', JSON.stringify(nodesArr));
      payload.append('username', formData?.username);
      payload.append('pemFile', formData?.file);
      const payloadData = {
        payload,
        id: data?.id,
      };
      dispatch(ClustersActions.updateMultipleNodeswithSSH(payloadData));
    }
  };

  // useEffect(() => {
  //   if (watchMethodCredentials) {
  //     setMethod(watchMethodCredentials);
  //   }
  // }, [watchMethodCredentials]);
  // useEffect(() => {
  //   if (watchCertificateSelection) {
  //     setAddCertificate(watchCertificateSelection);
  //   }
  // }, [watchCertificateSelection]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
      if (dispatch) {
        dispatch(ClustersActions.setAddHostBtnDisable(true));
        // dispatch(ClustersActions.setAddHostIndividualData({}));
      }
    }
  }, [isModalOpen]);

  const OPTIONS = [
    { id: 1, value: 'password', label: 'Password' },
    { id: 2, value: 'privatekey', label: 'Private Key' },
  ];

  const inputsDisabled = () => {
    if (
      (!isPrimaryBtnDisable || !isEmpty(selectedSSH)) &&
      data?.created_by_ansible
    ) {
      return true;
    } else if (data?.created_by_ansible) {
      return false;
    }
  };

  return (
    <>
      <FullPageLoader loading={loading || loading1} />
      <ModalWithRightBtn
        isOpen={isSSHModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={e => addIndividualHost(e)}
        title={`Add SSH Details`}
        primaryButtonText={
          // !testResponseListforMultiNodes?.allPassed && !isEmpty(bulkSelectItems)
          //   ? 'Add Details for Passed Nodes'
          //   : 'Add Node Details'

          isEmpty(bulkSelectItems)
            ? 'Add Node Details'
            : !isEmpty(bulkSelectItems) &&
                testResponseListforMultiNodes?.allPassed
              ? 'Add Node Details'
              : 'Add Details for Passed Nodes'
        }
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
          {isEmpty(bulkSelectItems) && (
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
                  // disabled={!isPrimaryBtnDisable || !isEmpty(selectedSSH)}
                  disabled={inputsDisabled()}
                />
              </div>{' '}
              <div className="col-6">
                <InputField
                  name="port"
                  type="text"
                  label="Port"
                  placeholder="Enter Port"
                  required
                  register={register}
                  errors={errors}
                  icon={<DocumentTextIcon />}
                  // disabled={!isPrimaryBtnDisable || !isEmpty(selectedSSH)}
                  disabled={inputsDisabled()}
                />
              </div>
            </div>
          )}

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
            {' '}
            <div className="col-6">
              <InputField
                name="username"
                type="text"
                label="Username"
                placeholder="Enter Your User Name"
                required
                register={register}
                errors={errors}
                icon={<DocumentTextIcon />}
                disabled={!isPrimaryBtnDisable}
              />
            </div>
            {(isEmpty(watchMethodCredentials) ||
              watchMethodCredentials === 'password') && (
              <>
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
          </div>
          {!isEmpty(testResponseListforMultiNodes) &&
            !testResponseListforMultiNodes?.allPassed && (
              <>
                {testResponseListforMultiNodes?.response?.map(ele => (
                  <div
                    key={ele?.hostIp}
                    className="mb-2"
                    style={{
                      color: ele?.status !== 'success' ? 'red' : 'black',
                      fontSize: '15px',
                      fontWeight: '400',
                    }}
                  >
                    {' '}
                    {ele?.status !== 'success' ? (
                      <CrossWithCircleIcon width={25} height={25} color="red" />
                    ) : (
                      <TickIconWithCircle width={25} height={25} />
                    )}{' '}
                    {ele?.hostIp}
                  </div>
                ))}
              </>
            )}
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
