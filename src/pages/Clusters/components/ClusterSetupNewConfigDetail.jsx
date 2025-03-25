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
import { InputField, RadioSelectField, SelectField } from '../../../shared';
import { theme } from '../../../styles';
import Collapsible from '../../Namespaces/Collapsible';

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
const RightDisplaySection = styled.div``;
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
const ClusterSetupNewConfigDetailsPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('nifi_properties');

  const sidebarItems = [
    {
      name: 'NiFi Properties',
      path: 'nifi_properties',
      icon: CheckListIcon,
    },
    {
      name: 'Authorizers.xml',
      path: 'authorizers',
      icon: CheckListIcon,
    },
    {
      name: 'Bootstrap.config',
      path: 'bootstrap_config',
      icon: CheckListIcon,
    },
    {
      name: 'Logback.xml',
      path: 'logback',
      icon: CheckListIcon,
    },
    {
      name: 'Login-identity-providers.xml',
      path: 'login_identity_provider',
      icon: CheckListIcon,
    },
    {
      name: 'State-Management.xml',
      path: 'state_management',
      icon: CheckListIcon,
    },
  ];
  const selectedTitle = sidebarItems.filter(
    element => element?.path === selectedProperty
  );
  const OPTIONS = [
    { id: 1, value: 'password', label: 'True' },
    { id: 2, value: 'privatekey', label: 'False' },
  ];
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
              //   label="Config Name"
              placeholder="Enter Config Name"
              required
              //   register={register}
              //   errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Config Version</LabelSelect>
            <SelectField
              name="nifi_version"
              icon={<QRIcons />}
              //   register={register}
              //   errors={errors}
              //   control={control}
              options={[]}
              placeholder="Select Config Version"
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Comments</LabelSelect>

            <InputField
              name="config_name"
              type="text"
              //   label="Config Name"
              placeholder="Enter your Comments"
              required
              //   register={register}
              //   errors={errors}
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
            <Collapsible
              title="Core Configurations"
              isTableOpen={true}
              toggleCollapsible={() => {}}
              isAddBtnVisible={false}
              isOpenBackgroundWhite={true}
            >
              <div className="row">
                <div className="col-2">
                  <RadioSelectField
                    name="methodForCredentials"
                    options={OPTIONS}
                    label="NiFi Cluster Node"
                    // register={register}
                    // defaultValue={'password'}
                  />
                </div>
                <div className="col-5">
                  <LabelSelect className="mb-3">
                    NiFi Cluster Address
                  </LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Hostname or IP Address"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
                <div className="col-5">
                  <LabelSelect className="mb-3">Port</LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Port"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Protocol Max Threads
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
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Flow Election Max Wait Time
                  </LabelSelect>

                  <SelectField
                    name="nifi_version"
                    icon={<QRIcons />}
                    //   register={register}
                    //   errors={errors}
                    //   control={control}
                    options={[]}
                    placeholder="Select Flow Election Max Wait Time"
                  />
                </div>
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Flow Election Max Candidate
                  </LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Flow Election Max Candidate"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
              </div>
            </Collapsible>
            <Collapsible
              title="Zookeeper Configuration"
              isTableOpen={true}
              toggleCollapsible={() => {}}
              isAddBtnVisible={false}
              isOpenBackgroundWhite={true}
            >
              <div className="row">
                <div className="col-2">
                  <RadioSelectField
                    name="methodForCredentials"
                    options={OPTIONS}
                    label="NiFi Cluster Node"
                    // register={register}
                    // defaultValue={'password'}
                  />
                </div>
                <div className="col-5">
                  <LabelSelect className="mb-3">
                    NiFi Cluster Address
                  </LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Hostname or IP Address"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
                <div className="col-5">
                  <LabelSelect className="mb-3">Port</LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Port"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Protocol Max Threads
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
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Flow Election Max Wait Time
                  </LabelSelect>

                  <SelectField
                    name="nifi_version"
                    icon={<QRIcons />}
                    //   register={register}
                    //   errors={errors}
                    //   control={control}
                    options={[]}
                    placeholder="Select Flow Election Max Wait Time"
                  />
                </div>
                <div className="col-4">
                  <LabelSelect className="mb-3">
                    Flow Election Max Candidate
                  </LabelSelect>

                  <InputField
                    name="config_name"
                    type="text"
                    //   label="Config Name"
                    placeholder="Enter Flow Election Max Candidate"
                    required
                    //   register={register}
                    //   errors={errors}
                    icon={<NotePadIcon />}
                  />
                </div>
              </div>
            </Collapsible>
          </RightDisplaySection>
        </DisplaySection>
      </OuterContainer>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigDetailsPage;
