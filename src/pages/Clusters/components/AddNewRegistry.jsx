/*eslint-disable*/

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputField, Button, PasswordField } from '../../../shared';
import { RegexConst } from '../../../utils';
import { Modal } from '../../../shared';
import { AddCertificate } from './AddCertificate';
import { SummaryModal } from './SummaryModal';
import {
  SmallPerfileIcon,
  QRIcons,
  CircleExclamationMarkIcon,
  PlusCircleIcon,
  FileIcon,
  WhiteBoradIcon,
  PencilIcon,
  DeleteSmallIcon,
  RightCircleIcon,
  ExclamationFailedTestingIcon,
  LinkIcon,
} from '../../../assets';
import { testRegistry } from '../../../utils/services';

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const StyledInputField = styled(InputField)`
  flex: 1;
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

const registrySchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      RegexConst.REGESTRY_NAME,
      'Registry Name must be at least 3 characters long'
    )
    .required('Registry Name is required'),
  registry_url: yup
    .string()
    .matches(RegexConst.NIFI_URL, 'Enter a valid URL')
    .required('registry URL is required'),
});

export const AddNewRegistry = ({
  setRegistryData,
  registryData,
  clusterData,
  setActiveTab,
  clusterId,
  isEdit,
  registry_id,
  setNewRegistry,
}) => {
  const [successTest, setSuccessTest] = useState(false);
  const [failedTest, setFailedTest] = useState(false);
  const [testLoader, setTestLoader] = useState(false);
  const [continueStatus, setContinueStatus] = useState(false);
  const [addCertificate, setAddCertificate] = useState(false);
  const [registryCertificate, setRegistryCertificate] = useState({
    file: registryData?.file || '',
    passphrase: registryData?.passphrase || '',
  });
  const [openSummary, setOpenSummary] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [hideCertificate, setHideCertificate] = useState(true);
  const [addCertificateSatus, setAddCertificateStatus] = useState(false);
  const [testStatus, setTestStatus] = useState(false);
  const [registryFormData, setRegistryFormData] = useState({
    name: registryData?.name || '',
    registry_url: registryData?.registry_url || '',
    username: registryData?.username || '',
    password: registryData?.password || '',
  });

  console.log(registryCertificate, 'clsutercertificate');
  console.log(registryCertificate, 'registryCertificateeeeeeeee');
  console.log(registryFormData, 'registryFormData');
  console.log('registryData........', registryData);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrySchema),
    defaultValues: registryData,
  });

  const testRegistryData = async data => {
    setTestLoader(true);
    setRegistryData({
      name: data.name,
      registry_url: data.registry_url,
      username: data?.username,
      password: data?.password,
      file: registryCertificate?.file,
      passphrase: registryCertificate?.passphrase,
    });
    console.log('datasssssss', data);
    const payload = new FormData();
    !registryCertificate?.file.name &&
      registryData?.id &&
      payload.append('id', registryData?.id);
    payload.append('name', data?.name);
    payload.append('nifi_url', data?.registry_url);
    data?.password && payload.append('password', data?.password);
    data?.username &&
      payload.append('username', data?.username) &&
      payload.append('username', data?.username);
    registryCertificate?.file &&
      payload.append('file', registryCertificate?.file);
    registryCertificate?.passphrase &&
      payload.append('passphrase', registryCertificate?.passphrase);
    const response = await testRegistry(payload);
    console.log('RESPONSE', response);
    if (response.status === 204) {
      setTestLoader(false);
      setSuccessTest(true);
      setContinueStatus(true);

      // setClusterData(clusterFormData);
      console.log('tested');
    } else {
      setTestLoader(false);
      setContinueStatus(false);
      setTestMessage(response.message);
      setFailedTest(true);
      console.log('errorr');
    }
  };

  const onSubmit = data => {
    console.log('cl', data);
    setRegistryFormData({
      name: data.name,
      registry_url: data.registry_url,
      username: data.username,
      password: data.password,
    });
    testRegistryData(data);
  };

  const handleInputChange = e => {
    console.log('hhhhhhhhh');
    const { name, value } = e.target;
    setRegistryFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const watchedFields = watch(['name', 'registry_url', 'username', 'password']);

  useEffect(() => {
    // Update state based on watched fields
    const [name, registry_url, username, password] = watchedFields;

    // Example condition to set `continueStatus`
    if (registry_url?.startsWith('https')) {
      setTestStatus(false);
      setAddCertificateStatus(false);
      setHideCertificate(true);
      if (registryCertificate?.file || (username != '' && password != '')) {
        if (registryCertificate.file) {
          setTestStatus(true);
          setHideCertificate(false);
        } else if (username != '' && password != '') {
          setTestStatus(true);
          setAddCertificateStatus(true);
        }
      }
    } else if (registry_url?.startsWith('http')) {
      setHideCertificate(false);
      setTestStatus(true);
    }
  }, [watchedFields]);

  const handleBack = () => {
    setActiveTab('registry');
    setNewRegistry(false);
  };
  return (
    <>
      <ParentDiv>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type="text"
            placeholder="Enter your Registry Name"
            name="name"
            icon={<QRIcons />}
            label="Registry Name"
            register={register}
            errors={errors}
            onChange={handleInputChange}
          />
          {errors.name && <p>{errors.name.message}</p>}
          <InputField
            type="text"
            placeholder="Enter your registry URL"
            name="registry_url"
            icon={<LinkIcon />}
            label="registryUrl"
            register={register}
            errors={errors}
            onChange={handleInputChange}
          />
          {errors.registry_url && <p>{errors.registry_url.message}</p>}
          {hideCertificate && (
            <InputContainer>
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

              <PasswordField
                name="password"
                register={register}
                errors={errors}
                watch={watch}
                label="Password"
              />

              <FlexContainer>
                <p>OR</p>
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
          {registryCertificate?.file ? (
            <>
              <CertificateContainer>
                <CertificateHeader>
                  <div>
                    NiFi Certificate
                    <CircleExclamationMarkIcon color="#DDE4F0" />
                  </div>
                </CertificateHeader>
                <CertificateDetails>
                  <FileIcon width={25} height={35} />
                  <FileInfo>
                    <FileDetails>
                      <FileTypeContainer>
                        <FileType>
                          PFX file
                          <CircleExclamationMarkIcon color="#DDE4F0" />
                        </FileType>
                        <FileSize>20MB</FileSize>
                      </FileTypeContainer>
                      <FilePath>
                        {registryCertificate?.file.name ||
                          registryCertificate?.file}
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
                  registry Certificate Added!!
                </CertificateMessage>
                <EditDeleteContainer>
                  <IconButton
                    onClick={() => {
                      setAddCertificate(true);
                    }}
                  >
                    <PencilIcon color="white" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setRegistryCertificate('');
                    }}
                  >
                    <DeleteSmallIcon color="white" />
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
                // onClick={() => {setActiveTab('cluster')}}\
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  setOpenSummary(true);
                }}
                disabled={!continueStatus}
              >
                Continue
              </Button>
              {/* <Button type="submit" onClick={()=>setOpenSummary(true)}>Continue</Button> */}
            </BtnDiv>
            <BtnDiv>
              <Button
                isLoading={testLoader}
                disabled={!testStatus}
                onClick={handleSubmit(onSubmit)}
              >
                Test registry
              </Button>
            </BtnDiv>
          </BottomButtonDivs>
        </form>
      </ParentDiv>
      {/* //testing Modal */}
      <Modal
        title="Testing Successfull"
        isOpen={successTest}
        onRequestClose={() => setSuccessTest(false)}
        size="sm"
        // secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={() => setSuccessTest(false)}
      >
        <>
          <div className="text-center">
            <RightCircleIcon color="#0CBF59" />
          </div>
          <h5 className="pt-4 mt-2 mb-0 text-center">
            registry Test Successful
          </h5>
          <p className="pt-3 mb-0 text-center">
            Your registry Test was successful. You <br /> can now proceed to the
            next steps.
          </p>
        </>
      </Modal>

      <Modal
        title="Testing Successfull"
        isOpen={failedTest}
        onRequestClose={() => setFailedTest(false)}
        size="sm"
        primaryButtonText="Continue"
        onSubmit={() => setFailedTest(false)}
      >
        <>
          <div className="text-center">
            <ExclamationFailedTestingIcon width={90} height={65} />
          </div>
          <h5 className="pt-4 mt-2 mb-0 text-center">Cluster Test Failed</h5>
          {testMessage != '' ? (
            <p className="pt-3 mb-0 text-center">{testMessage}</p>
          ) : (
            <p className="pt-3 mb-0 text-center">
              We encountered an issue while testing your cluster. Please check
              if your File is Correct
            </p>
          )}
        </>
      </Modal>

      <AddCertificate
        addCertificate={addCertificate}
        setAddCertificate={setAddCertificate}
        setCertificate={setRegistryCertificate}
        certificates={registryCertificate}
      />
      <SummaryModal
        clusterData={clusterData}
        registryData={registryData}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        clusterId={clusterId}
        isEdit={isEdit}
        registry_id={registry_id}
      />
    </>
  );
};
