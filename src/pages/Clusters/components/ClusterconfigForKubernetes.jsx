/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NotePadIcon } from '../../../assets';
import { Title } from './Title';
import { history } from '../../../helpers/history';
import { Button, InputField } from '../../../shared';
import { KDFM } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import EditorKubernetesConfig from './KubernetesConfigEditor';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
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

const DisplaySection = styled.div`
  height: calc(100% - 120px) !important;
  border-radius: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
  left: 20%;
`;

export const List = styled.ul`
  max-height: calc(100vh - 250px);
  width: 100%;
  padding-left: 0;
  overflow-y: auto;
`;
export const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;

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

const ClusterSetupNewConfigKubernetes = () => {
  const dispatch = useDispatch();
  const [errorsInEditor, setErrorsInEditor] = useState([]);
  const [yamlValue, setYamlValue] = useState('');
  //   const configToEdit = useSelector(
  //     ClustersSelectors.getUpdateConfigClusterSetupData
  //   );
  const configDefaultValue = useSelector(
    ClustersSelectors.getKubernetesConfigFields
  );
  const configToEdit = useSelector(ClustersSelectors.getkubeCofigToEdit);
  const schema = yup.object().shape({
    configName: yup
      .string()
      .required('Config name is required')
      .test(
        'no-leading-trailing-spaces',
        'Config name must not start or end with a space',
        value => value === value?.trim()
      ),
  });
  const {
    register,
    handleSubmit,
    // watch,
    setValue,
    // reset,
    // control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleAddConfig = async data => {
    if (!isEmpty(configToEdit)) {
      const payload = {
        configName: data?.configName,
        configVersion: configToEdit?.config_version + 1,
        valuesYaml: isEmpty(yamlValue) ? configToEdit?.config_json : yamlValue,
      };
      dispatch(ClustersActions.createConfigForKubernetesCluster(payload));
      return;
    }
    const payload = {
      configName: data?.configName,
      configVersion: 1,
      valuesYaml: isEmpty(yamlValue)
        ? configDefaultValue?.valuesYaml
        : yamlValue,
    };
    dispatch(ClustersActions.createConfigForKubernetesCluster(payload));
  };

  useEffect(() => {
    if (isEmpty(configToEdit)) {
      dispatch(ClustersActions.fetchConfigFieldsForKubernetes());
    }
  }, [dispatch]);
  useEffect(() => {
    if (!isEmpty(configToEdit)) {
      setYamlValue(configToEdit?.config_json);
      setValue('configName', configToEdit?.config_name);
    }
  }, [configToEdit]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchConfigFieldsForKubernetes')
  );

  return (
    <Wrapper>
      <FullPageLoader loading={loading} />
      <Title
        title={
          !isEmpty(configToEdit)
            ? KDFM.EDIT_CONFIG_DETAILS
            : KDFM.NEW_CONFIG_DETAILS
        }
        handleBackClick={() => {
          !isEmpty(configToEdit) &&
            dispatch(ClustersActions.updateConfigClusterSetup({}));
          history.push('/clusters/setup-cluster');
        }}
        displayBackButton={true}
      />
      <OuterContainer>
        <div className="row px-3">
          <div className="col-4">
            <InputField
              label={KDFM.CONFIG_NAME}
              name="configName"
              type="text"
              placeholder={KDFM.ENTER_CONFIG_NAME}
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
              disabled={!isEmpty(configToEdit)}
            />
          </div>
        </div>
        <DisplaySection className="px-3 row">
          <RightDisplaySection className="col-12 h-100">
            <EditorKubernetesConfig
              errorsInEditor={errorsInEditor}
              setErrorsInEditor={setErrorsInEditor}
              setYamlValue={setYamlValue}
              yamlValue={yamlValue}
            />
          </RightDisplaySection>
        </DisplaySection>
      </OuterContainer>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            data-tooltip-id={`tooltip-manage-config-from-add-new-config`}
            variant="secondary"
            type="button"
            onClick={() => {
              !isEmpty(configToEdit) &&
                dispatch(ClustersActions.updateConfigClusterSetup({}));
              history.push('/clusters/setup-cluster');
            }}
          >
            {KDFM.BACK}
          </Button>
          <ReactTooltip
            id={`tooltip-manage-config-from-add-new-config`}
            place="top"
            content={'Back to Manage Config'}
            style={{
              width: '170px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />

          <Button
            type="submit"
            onClick={handleSubmit(handleAddConfig)}
            disabled={!isEmpty(errorsInEditor)}
          >
            {!isEmpty(configToEdit) ? 'Update Config' : 'Add Config'}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigKubernetes;
