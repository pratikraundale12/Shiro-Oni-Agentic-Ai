import React, { useState } from 'react';
import { isEmpty } from 'lodash';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { KeyIcons, PlusCircleIcon, WhiteBoradIcon } from '../../assets';
import { Title } from './components/Title';
import {
  Button,
  InputField,
  Modal,
  PasswordField,
  SelectField,
} from '../../shared';
import { useForm } from 'react-hook-form';
import { LinkIcon, QRIcons, SmallPerfileIcon } from '../../assets';
// import { testCluster } from '../../store';
import { UploadFile } from './UploadFile';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 88%;
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 94%;
`;

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;

const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.error : props.theme.colors.darkGrey2};
  cursor: auto;
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active && `border-bottom: 1px solid ${props.theme.colors.error};`}
`;

const Flex = styled.div`
  display: flex;
  gap: 2rem;
`;

const FlexTwo = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const ORText = styled.div`
  color: #7a7a9d;
  font-weight: 500;
  font-size: 20px;
  margin-top: 20px;
  line-height: 26px;
  margin-top: 32px;
`;

const ButtonLabel = styled.h6`
  margin-bottom: 10px;
  color: #425466;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  margin-top: 15px;
`;

const UploadCertificateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-top: 150px;
  margin-left: 20px;
  margin-right: 20px;
  height: 95px;
`;

const CertificateMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const TextTest = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  color: #444445;
  line-height: 27.24px;
`;

const NifiText = styled.h6`
  font-weight: 500;
  font-size: 14px;
  line-height: 18.52px;
  color: #425466;
`;

const StyledButton = styled(Button)`
  height: 70px;
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.darkGrey2}; /* Optional: Remove this line if you want a fully transparent button */
  background-color: transparent;
  color: ${props =>
    props.theme.colors.primary}; /* Set this to the desired text color */
  font-size: 20px;

  &:hover {
    background-color: transparent;
    color: ${props => props.theme.colors.primaryActive};
  }
  span {
    font-size: 20px;
    font-weight: 500;
    line-height: 27.24px;
    font-family: ${props => props.theme.fontNato};
  }
`;

const RegistryDetailsDiv = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 8px;
  margin-top: 110px;
`;

const TitleRegistry = styled.h6`
  font-family: noto sans;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  letter-spacing: -0.005em;
  margin-bottom: 20px;
  color: #4b5564;
`;

const BoxContentArea = styled.div`
  margin-bottom: 20px;

  p {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    line-height: 15.73px;
    letter-spacing: -0.005em;
    color: #2d343f;
  }

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 14.52px;
    letter-spacing: -0.005em;
    color: #7a7a7a;
  }
`;

const RegistryDetailsDivTwo = styled.div`
  padding-left: -4px;
`;

const BottomButtonDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ClusterSchema = yup.object().shape({
  clusterName: yup.string().required('Cluster name is required'),
  nifiUrl: yup.string().required('NiFi Url is required'),
  clusterUsername: yup.string().when('nifiUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Username is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  clusterPassword: yup.string().when('nifiUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Password is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const RegistrySchema = yup.object().shape({
  registryName: yup.string().required('Registry name is required'),
  registryUrl: yup.string().required('Registry Url is required'),
  registryUsername: yup.string().when('registryUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Username is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  registryPassword: yup.string().when('registryUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Password is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const TABS = {
  CLUSTER: 'cluster',
  REGISTRY: 'registry',
};

export const Add = () => {
  const [activeTab, setActiveTab] = useState(TABS.REGISTRY);
  // const [loading, setLoading] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCredOpen, setIsCredOpen] = useState(false);
  // const [clusterTest, setClusterTest] = useState(false);
  const [newRegistry, setNewRegistry] = useState(false);
  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      activeTab === TABS.CLUSTER ? ClusterSchema : RegistrySchema
    ),
  });

  // const { pfxFile, passphrase } = watch();

  const handleBack = () => setActiveTab(TABS.CLUSTER);

  // const handleTest = async data => {
  //   const testData =
  //     activeTab === TABS.CLUSTER
  //       ? {
  //           nifi_url: data.nifiUrl,
  //           username: data.clusterUsername,
  //           password: data.clusterPassword,
  //         }
  //       : {
  //           registry_url: data.registryUrl,
  //           username: data.registryUsername,
  //           password: data.registryPassword,
  //         };
  //   setLoading(true);
  //   await testCluster(testData);
  //   setLoading(false);
  //   setClusterTest(true);
  // };

  const onSubmit = data => {
    if (activeTab === TABS.CLUSTER) {
      setActiveTab(TABS.REGISTRY);
      return;
    }
    console.log(data);
  };

  console.log(watch());
  return (
    <Wrapper>
      <Title title="Add New Cluster Details" />
      <Container>
        <NavTabs id="nav-tab" role="tablist">
          <NavButton active={activeTab === TABS.CLUSTER}>
            Cluster Details
          </NavButton>
          <NavButton active={activeTab === TABS.REGISTRY}>
            Registry Details
          </NavButton>
        </NavTabs>

        {activeTab === TABS.CLUSTER && (
          <FormContainer>
            <InputField
              name="clusterName"
              register={register}
              icon={<QRIcons />}
              label="Cluster Name"
              placeholder="Enter your Cluster Name"
              errors={errors}
            />
            <InputField
              name="nifiUrl"
              register={register}
              icon={<LinkIcon />}
              label="Nifi Url"
              placeholder="Enter your Nifi Url"
              errors={errors}
            />
            <Flex>
              <div>
                <ButtonLabel>Test Via Certificate</ButtonLabel>
                <Button
                  onClick={() => setIsCertificateOpen(true)}
                  // disabled={addCertificateSatus}
                >
                  Add Certificate
                </Button>
              </div>
              <ORText>OR</ORText>
              <div>
                <ButtonLabel>Test Via Creditionals</ButtonLabel>
                <Button
                  onClick={() => setIsCredOpen(true)}
                  // disabled={addCertificateSatus}
                >
                  Enter Creditionals
                </Button>
              </div>
            </Flex>
          </FormContainer>
        )}

        {activeTab === TABS.REGISTRY && !newRegistry && (
          <FormContainer>
            <SelectField
              control={control}
              name="registry"
              label="Registry Name"
              icon={<QRIcons />}
              // options={registries}
            />
            <ORText style={{ textAlign: 'center' }}>OR</ORText>
            <StyledButton
              variant="secondary"
              icon={<PlusCircleIcon color="red" />}
              onClick={() => {
                setNewRegistry(true);
              }}
            >
              Add New Registry
            </StyledButton>

            <RegistryDetailsDiv>
              <TitleRegistry>Registry Details</TitleRegistry>
              <Flex>
                <BoxContentArea>
                  <p>Registry Name</p>
                  <span>Registry</span>
                </BoxContentArea>

                <BoxContentArea>
                  <p>Registry Url</p>
                  <span>URL: https://172.31.47.210/9443</span>
                </BoxContentArea>
              </Flex>
              <RegistryDetailsDivTwo>
                <FlexTwo>
                  <Flex>
                    <div>
                      <ButtonLabel>Test Via Certificate</ButtonLabel>
                      <Button
                        onClick={() => setIsCertificateOpen(true)}
                        // disabled={addCertificateSatus}
                      >
                        Add Certificate
                      </Button>
                    </div>
                    <ORText>OR</ORText>
                    <div>
                      <ButtonLabel>Test Via Creditionals</ButtonLabel>
                      <Button
                        onClick={() => setIsCredOpen(true)}
                        // disabled={addCertificateSatus}
                      >
                        Enter Creditionals
                      </Button>
                    </div>
                  </Flex>

                  <BottomButtonDiv>
                    <ButtonDiv>
                      <Button
                        variant="secondary"
                        // onClick={() => setNewRegistry(true)}
                      >
                        Edit
                      </Button>
                      <Button>Delete</Button>
                    </ButtonDiv>
                  </BottomButtonDiv>
                </FlexTwo>
              </RegistryDetailsDivTwo>
            </RegistryDetailsDiv>
          </FormContainer>
        )}

        {activeTab === TABS.REGISTRY && newRegistry && (
          <FormContainer>
            <InputField
              name="registryName"
              register={register}
              icon={<QRIcons />}
              label="Registry Name"
              placeholder="Enter your Registry Name"
              errors={errors}
            />
            <InputField
              name="registryUrl"
              register={register}
              icon={<LinkIcon />}
              label="Registry Url"
              placeholder="Enter your Registry Url"
              errors={errors}
            />
            <Flex>
              <div>
                <ButtonLabel>Test Via Certificate</ButtonLabel>
                <Button
                  onClick={() => setIsCertificateOpen(true)}
                  // disabled={addCertificateSatus}
                >
                  Add Certificate
                </Button>
              </div>
              <ORText>OR</ORText>
              <div>
                <ButtonLabel>Test Via Creditionals</ButtonLabel>
                <Button
                  onClick={() => setIsCredOpen(true)}
                  // disabled={addCertificateSatus}
                >
                  Enter Creditionals
                </Button>
              </div>
            </Flex>
          </FormContainer>
        )}

        <UploadCertificateContainer>
          <CertificateMessage>
            <WhiteBoradIcon />
            <TextTest>Cluster Tested Successfully</TextTest>
          </CertificateMessage>
        </UploadCertificateContainer>
      </Container>

      <FlexWrapper>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            //  disabled={!clusterTest}
          >
            Continue
          </Button>
        </div>
      </FlexWrapper>

      <Modal
        title="Add Cluster Certificate"
        isOpen={isCertificateOpen}
        onRequestClose={() => setIsCertificateOpen(false)}
        size="sm"
        secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={() => setIsCertificateOpen(false)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <NifiText>NiFi Certificate</NifiText>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginTop: '38px',
            marginBottom: '35px',
          }}
        >
          <UploadFile
            name="pfxFile"
            watch={watch}
            control={control}
            label="PFX File"
            placeholder="Enter your PFX File"
            errors={errors}
          />
          <PasswordField
            name="password"
            watch={watch}
            errors={errors}
            register={register}
            label="Password"
            placeholder="Enter your Passphrase"
            icon={<KeyIcons />}
          />
        </div>
      </Modal>

      <Modal
        title="Add Creditionals"
        isOpen={isCredOpen}
        onRequestClose={() => setIsCredOpen(false)}
        size="sm"
        secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={() => setIsCredOpen(false)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '60px',
          }}
        >
          <InputField
            name="clusterUsername"
            setIsOpen
            register={register}
            icon={<SmallPerfileIcon />}
            label="Username"
            placeholder="Enter your Username"
            errors={errors}
          />
          <div>
            <PasswordField
              name="passphrase"
              watch={watch}
              errors={errors}
              register={register}
              label="PFX Passphrase"
              placeholder="Enter your Passphrase"
            />
          </div>
        </div>
      </Modal>
    </Wrapper>
  );
};
