/*eslint-disable*/

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputField, Button, PasswordField } from '../../../shared';
import { RegexConst } from '../../../utils';
import { AddCertificate } from './AddCertificate';
import { useNavigate } from 'react-router-dom';

import {
  SmallPerfileIcon,
  QRIcons,
  PlusCircleIcon,
  FileIcon,
  WhiteBoradIcon,
  PencilIcon,
  DeleteSmallIcon,
  LinkIcon,
} from '../../../assets';
import { testCluster } from '../../../utils/services';
import { SuccessTestModal } from './SuccessTestModal';
import { FailedTestModal } from './FailedTestModal';

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
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
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
    .matches(
      RegexConst.CLUSTER_NAME,
      'Cluster Name must be at least 3 characters long'
    )
    .required('Cluster Name is required'),
  nifi_url: yup
    .string()
    .matches(RegexConst.NIFI_URL, 'Enter a valid URL')
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

  console.log(clusterCertificate, 'clsutercertificate');
  console.log('clusterData........', clusterData);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clusterSchema),
    defaultValues: clusterData,
  });

  const navigate = useNavigate();

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
    console.log('datasssssss', data);
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
    console.log('cl', data);
    testClusterData(data);
  };

  const watchedFields = watch(['name', 'nifi_url', 'username', 'password']);

  useEffect(() => {
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
            placeholder="Enter your Cluster Name"
            name="name"
            icon={<QRIcons />}
            label="Cluster Name"
            register={register}
            errors={errors}
            // onChange={handleInputChange}
          />
          {errors.name && <p>{errors.name.message}</p>}
          <InputField
            type="text"
            placeholder="Enter your NiFi URL"
            name="nifi_url"
            icon={<LinkIcon />}
            label="NifiUrl"
            register={register}
            errors={errors}
            // onChange={handleInputChange}
          />
          {errors.nifi_url && <p>{errors.nifi_url.message}</p>}
          {hideCertificate && (
            <InputContainer>
              <InputFieldParent>
                <InputField
                  type="text"
                  placeholder="Enter Your UserName"
                  name="username"
                  icon={<SmallPerfileIcon />}
                  label="Username"
                  register={register}
                  errors={errors}
                  // onChange={handleInputChange}
                />
              </InputFieldParent>
              <PasswordFieldParent>
                <PasswordField
                  name="password"
                  register={register}
                  errors={errors}
                  watch={watch}
                  label="Password"
                />
              </PasswordFieldParent>
              <FlexContainer>
                <p style={{ 'margin-right': '4px' }}>OR</p>
                <Button
                  onClick={() => setAddCertificate(true)}
                  icon={<PlusCircleIcon width={20} height={20} color="white" />}
                  disabled={addCertificateSatus}
                >
                  Add Certificate
                </Button>
              </FlexContainer>
            </InputContainer>
          )}
          {clusterCertificate.file ? (
            <>
              <CertificateContainer>
                <CertificateHeader>
                  <div>
                    NiFi Certificate
                    {/* <CircleExclamationMarkIcon color="#DDE4F0" /> */}
                  </div>
                </CertificateHeader>
                <CertificateDetails>
                  <FileIcon width={25} height={35} />
                  <FileInfo>
                    <FileDetails>
                      <FileTypeContainer>
                        <FileType>
                          PFX file
                          {/* <CircleExclamationMarkIcon color="#DDE4F0" /> */}
                        </FileType>
                        <FileSize>3.7KB</FileSize>
                      </FileTypeContainer>
                      <FilePath>
                        {clusterCertificate?.file.name ||
                          clusterCertificate?.file}
                      </FilePath>
                    </FileDetails>
                  </FileInfo>
                </CertificateDetails>
                <CertificateFooter>
                  <ParaphraseLabel>PFX Paraphrase:</ParaphraseLabel>
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
                    onClick={() => {
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
                    <DeleteSmallIcon />
                  </IconButton>
                </EditDeleteContainer>
              </UploadCertificateContainer>
            </>
          ) : (
            hideCertificate && (
              <NoDataContainer>
                <WhiteBoradIcon />
                <NoDataText>No data found</NoDataText>
              </NoDataContainer>
            )
          )}

          <BottomButtonDivs>
            <BtnDiv>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/cluster');
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!continueStatus}
                onClick={() => setActiveTab('registry')}
              >
                Continue
              </Button>
            </BtnDiv>
            <BtnDiv>
              <Button
                isLoading={testLoader}
                disabled={!testStatus}
                onClick={handleSubmit(onSubmit)}
              >
                Test Cluster
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
