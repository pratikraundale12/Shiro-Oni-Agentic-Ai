import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NotePadIcon, QRIcons } from '../../assets';
// import { Title } from './Title';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import { KDFM } from '../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ClustersSelectors,
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
// import { Tooltip as ReactTooltip } from 'react-tooltip';
import * as yup from 'yup';
import { FullPageLoader } from '../../components';
import yaml from 'js-yaml';
import { Title } from '../Clusters/components/Title';
import RegistryEditorKubernetesConfig from './RegistryConfigEditor';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
  display: flex;
  flex-direction: column;
`;
const OuterContainer = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DisplaySection = styled.div`
  flex-grow: 1;
  min-height: 0;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
  left: 20%;

  .monaco-editor .find-widget.visible {
    position: absolute;
    top: 24px !important;
    right: 40px !important;
  }
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
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const RegistryConfigurationEditorPage = () => {
  const dispatch = useDispatch();
  const [errorsInEditor, setErrorsInEditor] = useState([]);
  const [yamlValue, setYamlValue] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const configDefaultValue = useSelector(
    RegistrySelectors.getregistryConfigDefaultData
  );
  const recentSelectedCluster = useSelector(
    ClustersSelectors.getrecentClusterSelected
  );

  const [editorModal, setEditorModal] = useState(false);
  setEditorModal;
  const [yamlEditorValue, setYamlEditorValue] = useState('');
  const configToEdit = useSelector(RegistrySelectors.getregistryConfigEditItem);

  const schema = yup.object().shape({
    configName: yup
      .string()
      .required('Config name is required')
      .test(
        'no-leading-trailing-spaces',
        'Config name must not start or end with a space',
        value => value === value?.trim()
      ),
    cluster_type: yup.string().required('Kubernetes cluster type is required'),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clusterType = watch('cluster_type');

  const handleAddConfig = async data => {
    if (!isEmpty(configToEdit)) {
      const payload = {
        configName: data?.configName,
        configVersion: configToEdit?.config_version + 1,
        valuesYaml: yamlEditorValue || '',
        type: clusterType,
      };
      dispatch(RegistryActions.createConfigRegistry(payload));
      dispatch(RegistryActions.setRegistryConfigEditItem({}));
      return;
    }
    const payload = {
      configName: data?.configName,
      configVersion: 1,
      valuesYaml: yamlEditorValue || '',
      type: clusterType,
    };

    dispatch(RegistryActions.createConfigRegistry(payload));
  };

  useEffect(() => {
    if (isEmpty(configToEdit) && !isEmpty(clusterType)) {
      //   dispatch(ClustersActions.fetchConfigFieldsForKubernetes(clusterType));
      dispatch(
        RegistryActions.fetchRegistryConfigurationDefaultData(clusterType)
      );
      // to call api on type change
    }
  }, [dispatch, clusterType]);
  useEffect(() => {
    if (!isEmpty(yamlValue)) {
      const value = yamlValue || configDefaultValue?.valuesYaml;
      if (!value) return;
      try {
        const docs = [];
        yaml.loadAll(value, doc => docs.push(doc));
        setParsedJson?.(docs.length === 1 ? docs[0] : docs);
        setErrorsInEditor([]);
      } catch (err) {
        setErrorsInEditor([err.message]);
        setParsedJson?.(null);
      }
    }
  }, [yamlValue, configDefaultValue?.valuesYaml]);

  useEffect(() => {
    if (!isEmpty(configToEdit)) {
      setYamlValue(configToEdit?.config_yaml);
      setYamlEditorValue(configToEdit?.config_yaml);
      setValue('configName', configToEdit?.config_name);
      setValue('cluster_type', configToEdit?.type);
    } else {
      setYamlValue(configDefaultValue?.valuesYaml || '');
    }
  }, [configToEdit, configDefaultValue, setValue]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchConfigFieldsForKubernetes')
  );
  // const updatedConfigKube = useSelector(ClustersSelectors.getUpdatedKubeConfig);
  const hasYamlChanged =
    yamlEditorValue &&
    configToEdit?.config_yaml &&
    yamlEditorValue.trim() !== configToEdit?.config_yaml.trim();

  useEffect(() => {
    if (isEmpty(configToEdit)) {
      if (!isEmpty(recentSelectedCluster) && isEmpty(configToEdit)) {
        setValue('cluster_type', recentSelectedCluster);
      } else {
        setValue('cluster_type', 'aks');
      }
    }
  }, [recentSelectedCluster]);

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
          history.push('/registry-management/configuration');
        }}
        displayBackButton={true}
      />
      <OuterContainer>
        <div className="row">
          {' '}
          {/* <div className=" d-flex align-items-end justify-content-end">
            <div className="pb-2 me-2">
              {!editorModal && (
                <span
                  style={{
                    color: `${theme.colors.primary}`,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenEditor}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenEditor();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  Edit YAML
                </span>
              )}
              {editorModal && (
                <span
                  style={{
                    color: `${theme.colors.primary}`,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setEditorModal(false);
                    handleBack();
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setEditorModal(false);
                      handleBack();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  Edit in Quick Editor
                </span>
              )}
            </div>
          </div> */}
        </div>
        <div className="row px-3">
          <div className="col-8">
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
          <div className="col-4">
            <LabelSelect className="mb-3">Kubernetes cluster type</LabelSelect>
            <SelectField
              name="cluster_type"
              icon={<QRIcons />}
              register={register}
              errors={errors}
              control={control}
              options={
                [
                  { label: 'Amazon EKS', value: 'eks' },
                  {
                    label: 'Self-Managed Kubernetes',
                    value: 'ec2',
                  },
                  {
                    label: 'Azure Kubernetes Service',
                    value: 'aks',
                  },
                ] || []
              }
              placeholder={'Select Kubernetes Cluster'}
              required={true}
              disabled={!isEmpty(configToEdit)}
            />
          </div>
        </div>

        <DisplaySection className="px-3 row">
          <RightDisplaySection className="col-12 h-100">
            <RegistryEditorKubernetesConfig
              errorsInEditor={errorsInEditor}
              setErrorsInEditor={setErrorsInEditor}
              setYamlValue={setYamlValue}
              yamlValue={yamlValue}
              parsedJson={parsedJson}
              setParsedJson={setParsedJson}
              yamlEditorValue={yamlEditorValue}
              setYamlEditorValue={setYamlEditorValue}
            />
          </RightDisplaySection>
        </DisplaySection>
      </OuterContainer>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.back();
              //   !isEmpty(configToEdit) &&
              //     dispatch(ClustersActions.updateConfigClusterSetup({}));
              //   history.push('/clusters/setup-cluster');
            }}
          >
            {KDFM.BACK}
          </Button>

          {!editorModal && (
            <Button
              type="submit"
              onClick={handleSubmit(handleAddConfig)}
              disabled={
                !isEmpty(errorsInEditor) ||
                (!isEmpty(configToEdit) && !hasYamlChanged)
              }
            >
              {!isEmpty(configToEdit)
                ? 'Update Configuration'
                : 'Add Configuration'}
            </Button>
          )}
          {editorModal && (
            <Button
              type="submit"
              onClick={handleSubmit(handleAddConfig)}
              disabled={
                !isEmpty(errorsInEditor) ||
                (!isEmpty(configToEdit) && !hasYamlChanged)
              }
            >
              {!isEmpty(configToEdit)
                ? 'Update Configuration'
                : 'Add Configuration'}
            </Button>
          )}
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default RegistryConfigurationEditorPage;
//
