import React from 'react';
import styled from 'styled-components';
import { Button, InputField, PasswordField } from '../../shared';
import { AppIcon, CircleExclamationMarkIcon, UserIcon } from '../../assets';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsActions } from '../../store/settings';
import { theme } from '../../styles';
import { FullPageLoader } from '../../components';
import { LoadingSelectors } from '../../store';
import KeycloakUsersModal from './KeycloakUsersModal';
import AddNewRoleModal from '../../shared/AddNewRoleModal';

const InputFields = styled.div`
  display: flex;
`;
const GreyBoxNamespace = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  flex-wrap: nowrap; /* Prevents tabs from wrapping */
  align-items: center;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  min-width: max-content; /* Ensures it doesn't shrink below content width */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  &:hover {
    color: rgba(255, 122, 0, 1);

    svg {
      stroke: rgba(255, 122, 0, 1);
    }
  }
`;

const TabsContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Enables horizontal scrolling */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const IconContent = styled.div`
  display: inline;
  margin-right: 6px;

  svg path {
    transition: stroke 0.3s;
  }

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
`;
const KeycloakCredentialSection = () => {
  const dispatch = useDispatch();
  const keycloakCredSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchKeycloakUsers')
  );
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(keycloakCredSchema) });
  const handleFetchUser = data => {
    const payload = {
      keycloak_user: data?.username,
      keycloak_password: data?.password,
    };
    dispatch(SettingsActions.fetchKeycloakUsers(payload));
  };
  return (
    <>
      <FullPageLoader loading={loading} />
      <div>
        <GreyBoxNamespace className="w-100  mb-3">
          <TabsContainer>
            <TabWrapper className="nav">
              <Tab active={true} className="nav-item">
                <IconContent className="nav-item">
                  <AppIcon color={'#FF7A00'} />
                </IconContent>
                Keycloak User Mapping
              </Tab>
            </TabWrapper>
          </TabsContainer>
        </GreyBoxNamespace>
      </div>
      <div className=" justify-content-end me-4 mb-4">
        <CircleExclamationMarkIcon color={theme.colors.primary} />
        <span className="ml-2" style={{ fontSize: '1rem' }}>
          Filling out the details below and clicking Fetch Users will fetch all
          user details from Keycloak.
        </span>
      </div>

      <div className="-flex justify-content-end me-4">
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="username"
              type="text"
              label="Keycloak Admin Username"
              placeholder="Enter your Username"
              register={register}
              errors={errors}
              icon={<UserIcon />}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <PasswordField
              name="password"
              register={register}
              errors={errors}
              watch={watch}
              label="Keycloak Admin Password"
              disableToggle={false}
              placeholder="Enter your Password"
            />
          </div>
          <div className="col-xl-2 d-flex align-items-center">
            <Button onClick={handleSubmit(handleFetchUser)}>Fetch Users</Button>
          </div>
        </InputFields>
      </div>
      <KeycloakUsersModal />
      <AddNewRoleModal />
    </>
  );
};
export default KeycloakCredentialSection;
