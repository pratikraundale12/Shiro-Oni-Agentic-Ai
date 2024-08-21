import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';
import { KDFM, RegexConst } from '../../../constants';
import { Button, InputField, PasswordField } from '../../../shared';
import { AddCertificate } from './AddCertificate';

import {
  DeleteSmallIcon,
  FileIcon,
  LinkIcon,
  PencilIcon,
  PlusCircleIcon,
  QRIcons,
  SmallPerfileIcon,
  WhiteBoradIcon,
} from '../../../assets';
import { IconButton } from '../../../components';
import { history } from '../../../helpers/history';
import { testCluster } from '../../../store/index1';
import { FailedTestModal } from './FailedTestModal';
import { SuccessTestModal } from './SuccessTestModal';

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CertificateContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }
`;

const CertificateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CertificateDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const FilePath = styled.span`
  display: block;
  margin-top: 5px;
`;

const FileTypeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FileType = styled.div`
  font-weight: 500; /* Make the text bold */
  display: flex;
  align-items: center;
  gap: 8px; /* Add some space between the text and the icon */
`;

const FileSize = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const CertificateFooter = styled.div`
  display: flex;
  align-items: center;
`;

const ParaphraseLabel = styled.div`
  margin-right: 20px;
  font-weight: 500;
`;

const ParaphraseValue = styled.div`
  font-family: monospace;
`;

const UploadCertificateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const CertificateMessage = styled.div`
  display: flex;
  align-items: center;
`;

const EditDeleteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BottomButtonDivs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px; /* Add margin top for spacing */
`;

const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ParentDiv = styled.div`
  padding: 20px;
  background: #f5f7fa;
  padding-bottom: 60px; /* Add padding bottom to ensure buttons are not cut off */
`;
const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const NoDataText = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #666;
`;

const PasswordFieldParent = styled.div`
  margin-top: -16px;
  flex: 1;
`;

const InputFieldParent = styled.div`
  flex: 1;
  margin-right: 3px;
`;
const clusterSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Cluster Name must be at least 3 characters long')
    .required('Cluster Name is required'),
  nifi_url: yup
    .string()
    .url('Enter a valid URL')
    .required('NiFi URL is required'),
});

export const AddNewCluster = ({
  setActiveTab,
  setClusterData,
  clusterData,
  clusterId,
}) => {
  const [successTest, setSuccessTest] = useState(false);
  const [testLoader, setTestLoader] = useState(false);
  const [failedTest, setFailedTest] = useState(false);
  const [continueStatus, setContinueStatus] = useState(false);
  const [addCertificate, setAddCertificate] = useState(false);
  const [hideCertificate, setHideCertificate] = useState(true);
  const [addCertificateSatus, setAddCertificateStatus] = useState(false);
  const [clusterCertificate, setClusterCertificate] = useState({
    file: clusterData?.file || '',
    passphrase: clusterData?.passphrase || '',
  });
  const [testMessage, setTestMessage] = useState('');
  const [testStatus, setTestStatus] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clusterSchema),
    defaultValues: clusterData,
  });

  const testClusterData = async data => {
    setTestLoader(true);
    setClusterData({
      name: data?.name,
      nifi_url: data?.nifi_url,
      username: data?.username,
      password: data?.password,
      file: clusterCertificate?.file,
      passphrase: clusterCertificate?.passphrase,
    });
    const payload = new FormData();
    !clusterCertificate?.file?.name &&
      clusterId &&
      payload.append('id', clusterId);
    payload.append('name', data?.name);
    payload.append('nifi_url', data?.nifi_url);
    data?.password && payload.append('password', data?.password);
    data?.username && payload.append('username', data?.username);
    clusterCertificate?.file?.name &&
      payload.append('file', clusterCertificate?.file);
    clusterCertificate?.passphrase &&
      payload.append('passphrase', clusterCertificate?.passphrase);
    const response = await testCluster(payload);
    if (response.status === 204) {
      setSuccessTest(true);
      setContinueStatus(true);
      setTestLoader(false);
    } else {
      setTestMessage(response.message);
      setContinueStatus(false);
      setFailedTest(true);
      setTestLoader(false);
    }
  };

  const onSubmit = data => {
    testClusterData(data);
  };

  const watchedFields = watch(['name', 'nifi_url', 'username', 'password']);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const [name, nifi_url, username, password] = watchedFields;

    if (nifi_url?.startsWith('https')) {
      setTestStatus(false);
      setAddCertificateStatus(false);
      setHideCertificate(true);
      if (clusterCertificate.file || (username != '' && password != '')) {
        if (clusterCertificate.file) {
          setTestStatus(true);
          setHideCertificate(false);
        } else if (username != '' && password != '') {
          setTestStatus(true);
          setAddCertificateStatus(true);
        }
      }
    } else if (nifi_url?.startsWith('http')) {
      setHideCertificate(false);
      setTestStatus(true);
    }
  }, [watchedFields]);

  return (
    <>
      <ParentDiv>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type="text"
            placeholder={KDFM.ENTER_CLUSTER_NAME}
            name="name"
            icon={<QRIcons />}
            label={KDFM.CLUSTER_NAME}
            register={register}
            errors={errors}
          />
          {errors.name && <p>{errors.name.message}</p>}
          <InputField
            type="text"
            placeholder={KDFM.ENTER_NIFI_URL}
            name="nifi_url"
            icon={<LinkIcon />}
            label={KDFM.NIFI_URL}
            register={register}
            errors={errors}
          />
          {errors.nifi_url && <p>{errors.nifi_url.message}</p>}
          {hideCertificate && (
            <InputContainer>
              <InputFieldParent>
                <InputField
                  type="text"
                  placeholder={KDFM.ENTER_USERNAME}
                  name="username"
                  icon={<SmallPerfileIcon />}
                  label={KDFM.USERNAME}
                  register={register}
                  errors={errors}
                />
              </InputFieldParent>
              <PasswordFieldParent>
                <PasswordField
                  name="password"
                  register={register}
                  errors={errors}
                  watch={watch}
                  label={KDFM.PASSWORD}
                  placeholder={KDFM.ENTER_PASSWORD}
                />
              </PasswordFieldParent>
              <FlexContainer>
                <p style={{ 'margin-right': '4px' }}>{KDFM.SEPARATOR}</p>
                <Button
                  onClick={e => {
                    setAddCertificate(true);
                    e.preventDefault();
                  }}
                  icon={<PlusCircleIcon width={20} height={20} color="white" />}
                  disabled={addCertificateSatus}
                  size="sm"
                >
                  {KDFM.ADD_CERTIFICATE}
                </Button>
              </FlexContainer>
            </InputContainer>
          )}
          {clusterCertificate.file ? (
            <>
              <CertificateContainer>
                <CertificateHeader>
                  <div>{KDFM.NIFI_CERTIFICATE}</div>
                </CertificateHeader>
                <CertificateDetails>
                  <FileIcon width={25} height={35} />
                  <FileInfo>
                    <FileDetails>
                      <FileTypeContainer>
                        <FileType>{KDFM.PFX_FILE}</FileType>
                        <FileSize>{KDFM.PFX_FILE_SIZE}</FileSize>
                      </FileTypeContainer>
                      <FilePath>
                        {clusterCertificate?.file.name ||
                          clusterCertificate?.file}
                      </FilePath>
                    </FileDetails>
                  </FileInfo>
                </CertificateDetails>
                <CertificateFooter>
                  <ParaphraseLabel>{KDFM.PFX_PASSPHRASE}:</ParaphraseLabel>
                  <ParaphraseValue>************</ParaphraseValue>
                </CertificateFooter>
              </CertificateContainer>

              <UploadCertificateContainer>
                <CertificateMessage>
                  <WhiteBoradIcon />
                  Cluster Certificate Added!!
                </CertificateMessage>
                <EditDeleteContainer>
                  <IconButton
                    onClick={e => {
                      e.preventDefault();
                      setAddCertificate(true);
                    }}
                  >
                    <PencilIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setClusterCertificate('');
                      setClusterData({
                        file: '',
                        passphrase: '',
                      });
                      setClusterCertificate({ file: '', passphrase: '' });
                    }}
                  >
                    <DeleteSmallIcon color="red" />
                  </IconButton>
                </EditDeleteContainer>
              </UploadCertificateContainer>
            </>
          ) : (
            hideCertificate && (
              <NoDataContainer>
                <WhiteBoradIcon />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </NoDataContainer>
            )
          )}

          <BottomButtonDivs>
            <BtnDiv>
              <Button
                variant="secondary"
                onClick={() => {
                  history.push('/clusters');
                }}
              >
                {KDFM.BACK}
              </Button>
              <Button
                type="submit"
                disabled={!continueStatus}
                onClick={() => setActiveTab('registry')}
              >
                {KDFM.CONTINUE}
              </Button>
            </BtnDiv>
            <BtnDiv>
              <Button
                isLoading={testLoader}
                disabled={!testStatus}
                onClick={handleSubmit(onSubmit)}
              >
                {KDFM.TEST_CLUSTER}
              </Button>
            </BtnDiv>
          </BottomButtonDivs>
        </form>
      </ParentDiv>

      <SuccessTestModal
        successTest={successTest}
        setSuccessTest={setSuccessTest}
        name="Cluster"
      />

      <FailedTestModal
        failedTest={failedTest}
        setFailedTest={setFailedTest}
        testMessage={testMessage}
      />

      <AddCertificate
        addCertificate={addCertificate}
        setAddCertificate={setAddCertificate}
        setCertificate={setClusterCertificate}
        certificates={clusterCertificate}
      />
    </>
  );
};

AddNewCluster.propTypes = {
  setActiveTab: PropTypes.func,
  setClusterData: PropTypes.func,
  clusterData: PropTypes.object,
  clusterId: PropTypes.string,
};
