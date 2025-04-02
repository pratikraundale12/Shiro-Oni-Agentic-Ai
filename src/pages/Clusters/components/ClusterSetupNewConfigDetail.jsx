/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CheckListIcon,
  LessArrowIcon,
  NotePadIcon,
  QRIcons,
} from '../../../assets';
import { Title } from './Title';
import { history } from '../../../helpers/history';
import {
  Button,
  InputField,
  RadioSelectField,
  SelectField,
} from '../../../shared';
import { theme } from '../../../styles';
import Collapsible from '../../Namespaces/Collapsible';
import { KDFM } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const OuterContainer = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
`;

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const DisplaySection = styled.div`
  height: calc(100% - 120px) !important;
  border-radius: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
`;
const LeftDisplaySection = styled.div`
  background-color: #fff;
`;
const SectionHeading = styled.div`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 1%;
  color: #ff7a00;
`;

export const List = styled.ul`
  max-height: calc(100vh - 250px);
  width: 100%;
  margin-top: 20px;
  padding-left: 0;
  overflow-y: auto;
`;
export const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;
  gap: 20px;

  ${props =>
    props.path === 'help-&-support' &&
    `
      position: absolute;
      bottom: 50px;
      width: 100%;
    `}

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const TitleTab = styled.h3`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;
const TitleTabWrapper = styled.div`
  border-bottom: 2px solid #dde4f0;
  padding-bottom: 12px;
`;
const ClusterSetupNewConfigDetailsPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('nifi_properties');
  const schema = yup.object().shape({
    config_name: yup.string().required('Config Name is required'),
    config_version: yup.string().required('Config version is required'),
    comment: yup.string().required('Comment is required'),
    // nifi_version: yup.string().required('Port is required'),
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      flow_election_max_wait_time: '5',
      zookeeper_connection_timeout: '10',
    },
  });

  const sidebarItems = [
    {
      name: 'NiFi Properties',
      path: 'nifi_properties',
      icon: CheckListIcon,
    },
    {
      name: 'Bootstrap.config',
      path: 'bootstrap_config',
      icon: CheckListIcon,
    },
    {
      name: 'Login-identity-providers.xml',
      path: 'login_identity_provider',
      icon: CheckListIcon,
    },
  ];
  const selectedTitle = sidebarItems.filter(
    element => element?.path === selectedProperty
  );
  const OPTIONS = [
    { id: 1, value: 'true', label: 'True' },
    { id: 2, value: 'false', label: 'False' },
  ];
  const ZOOOKEEPER_EMBEDED_OPTIONS = [
    { id: 1, value: true, label: 'True' },
    { id: 2, value: false, label: 'False' },
  ];
  const FLOW_ELECTION_MAX_WAIT_OPTIONS = [
    { label: '2 Min', value: '2' },
    { label: '5 Min', value: '5' },
    { label: '10 Min', value: '10' },
  ];
  const handleAddConfig = () => {
    alert('click');
  };
  return (
    <Wrapper>
      <Title
        title={'New Config Details'}
        handleBackClick={() => {
          history.push('/clusters/setup-cluster');
        }}
        displayBackButton={true}
      />
      <OuterContainer>
        <div className="row px-3">
          <div className="col-4">
            <LabelSelect className="mb-3">Config Name</LabelSelect>
            <InputField
              name="config_name"
              type="text"
              placeholder="Enter Config Name"
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Config Version</LabelSelect>
            <SelectField
              name="config_version"
              icon={<QRIcons />}
              register={register}
              errors={errors}
              control={control}
              options={[]}
              placeholder="Select Config Version"
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Comments</LabelSelect>

            <InputField
              name="comment"
              type="text"
              placeholder="Enter your Comments"
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
        </div>
        <DisplaySection className="px-3 row">
          <LeftDisplaySection className="col-3 h-100">
            <List className="sidebar-navigation">
              {' '}
              {sidebarItems.map(item => (
                <Item
                  key={item.name}
                  active={item?.path === selectedTitle?.[0]?.path}
                  onClick={() => {
                    setSelectedProperty(item.path);
                  }}
                  // path={item.path}
                >
                  <div>
                    <item.icon
                      color={
                        item?.path === selectedTitle?.[0]?.path
                          ? theme.colors.white
                          : 'black'
                      }
                    />
                    <span className="nav-text ms-3">{item.name}</span>
                  </div>

                  <LessArrowIcon
                    color={
                      item?.path === selectedTitle?.[0]?.path
                        ? theme.colors.white
                        : 'black'
                    }
                  />
                </Item>
              ))}
            </List>
          </LeftDisplaySection>
          <RightDisplaySection className="col-9 h-100">
            <SectionHeading>{selectedTitle?.[0]?.name}</SectionHeading>
            {selectedProperty === 'nifi_properties' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">Core Configuration</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-2">
                      <RadioSelectField
                        name="nifi_cluster_node"
                        options={OPTIONS}
                        label="NiFi Cluster Node"
                        register={register}
                        defaultValue={'false'}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        Protocol Max Threads
                      </LabelSelect>

                      <InputField
                        name="protocol_max_thread"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Protocol Max Threads"
                        required
                        register={register}
                        errors={errors}
                        defaultValue={50}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        Flow Election Max Wait Time
                      </LabelSelect>

                      <SelectField
                        name="flow_election_max_wait_time"
                        icon={<QRIcons />}
                        // register={register}
                        errors={errors}
                        control={control}
                        options={FLOW_ELECTION_MAX_WAIT_OPTIONS}
                        placeholder="Select Flow Election Max Wait Time"
                        sortAlphabetically={false}
                        defaultValue="5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Zookeeper Configuration
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-2">
                      <RadioSelectField
                        name="zookeeper_embedded_config"
                        options={ZOOOKEEPER_EMBEDED_OPTIONS}
                        label="Embedded  Node"
                        register={register}
                        defaultValue={true}
                      />
                    </div>
                    <div className="col-3">
                      <LabelSelect className="mb-3">
                        NiFi Cluster Address
                      </LabelSelect>

                      <InputField
                        name="nifi_cluster_address"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter NiFi Cluster Address"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-3">
                      <LabelSelect className="mb-3">Port</LabelSelect>

                      <InputField
                        name="port"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Port"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-4">
                      <LabelSelect className="mb-3">
                        Zookeeper Connection Timeout (In Seconds)
                      </LabelSelect>

                      <InputField
                        name="zookeeper_connection_timeout"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Zookeeper Connection Timeout"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Web Server Configuration
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">Web Http Host</LabelSelect>

                      <InputField
                        name="web_http_host"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Http Host"
                        required
                          register={register}
                          errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">Web Http Port</LabelSelect>

                      <InputField
                        name="web_http_port"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Http Port"
                        required
                          register={register}
                          errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedProperty === 'bootstrap_config' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">Java Memory Settings</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        -Xms1g (Initial Heap Size)
                      </LabelSelect>

                      <InputField
                        name="config_name"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Protocol Max Threads"
                        required
                        //   register={register}
                        //   errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        -Xms1g (Maximum Heap Size)
                      </LabelSelect>

                      <InputField
                        name="config_name"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Protocol Max Threads"
                        required
                        //   register={register}
                        //   errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedProperty === 'login_identity_provider' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Single User Login Identity Provider
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">Username</LabelSelect>

                      <InputField
                        name="config_name"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Protocol Max Threads"
                        required
                        //   register={register}
                        //   errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">Password</LabelSelect>

                      <InputField
                        name="config_name"
                        type="text"
                        //   label="Config Name"
                        placeholder="Enter Protocol Max Threads"
                        required
                        //   register={register}
                        //   errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </RightDisplaySection>
        </DisplaySection>
      </OuterContainer>
      {/*  */}
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.push('/clusters/setup-cluster');
            }}
          >
            {KDFM.BACK}
          </Button>

          {/* <Button type="submit" onClick={handleSubmit(handleContinue)}> */}
          <Button type="submit" onClick={handleSubmit(handleAddConfig)}>
            Add Config
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigDetailsPage;
