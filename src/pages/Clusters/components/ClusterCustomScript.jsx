/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Button,
  CheckboxField,
  InputField,
  ModalWithIcon,
} from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  DocumentTextIcon,
  NotePadIcon,
} from '../../../assets';
import { LoadingSelectors } from '../../../store';
import { theme } from '../../../styles';

const Container = styled.div``;
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 0;
`;
const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ff7a00;
  margin-bottom: 12px;
  padding: 5px 12px;
  background: white;
  font-weight: bold;
  border: 1px solid #ff7a00;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #fdfaf5;
  }
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const ClusterCustomScript = ({ data }) => {
  const dispatch = useDispatch();
  const scriptList = useSelector(ClustersSelectors.getScriptList);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scriptSelected, setScriptSelected] = useState({});
  const [installDependency, setInstallDependency] = useState(false);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'addScript')
  );

  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchScriptList')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteClusterScript')
  );

  const schema = yup.object().shape({
    script_file: yup
      .mixed()
      .required('File is required')
      .test(
        'no-special-char',
        'Filename contains invalid characters',
        value => {
          if (!value) return true;
          const fileName = value.name;
          const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
          return fileNameRegex.test(fileName);
        }
      ),
  });

  const schemaWithCommad = yup.object().shape({
    script_file: yup
      .mixed()
      .required('File is required')
      .test(
        'no-special-char',
        'Filename contains invalid characters',
        value => {
          if (!value) return true;
          const fileName = value.name;
          const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
          return fileNameRegex.test(fileName);
        }
      ),
    installDepCmd: yup.string().required('Command is required'),
  });

  const formSchema = installDependency ? schemaWithCommad : schema;
  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      installDepCmd: 'pip install -r requirements.txt',
    },
  });
  const handleDeleteClick = item => {
    setScriptSelected(item);
    setIsDeleteModalOpen(true);
  };
  const handleNarDeleteConfirm = () => {
    dispatch(
      ClustersActions.deleteClusterScript({
        id: scriptSelected?.clusterId,
        narId: scriptSelected?.id,
      })
    );
    setScriptSelected({});
    setIsDeleteModalOpen(false);
  };

  const COLUMNS = [
    {
      label: 'File Name',
      renderCell: item => (
        <>
          {item?.addedViaDFM && (
            <NotePadIcon height="21" width="21" color={theme.colors.primary} />
          )}
          &nbsp;
          {item?.name || 'N/A'}
        </>
      ),
      resize: true,
      width: '40%',
    },
    {
      label: 'File',
      renderCell: item => <>{item?.scriptPath}</>,
      resize: true,
      width: '50%',
    },

    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span
              onClick={() => handleDeleteClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {item?.addedViaDFM && <DeleteSmallIcon color="red" />}
            </span>
          }{' '}
        </>
      ),
      resize: true,
      width: '10%',
    },
  ];

  const handleUpload = formdata => {
    const payloadFile = new FormData();
    payloadFile.append('scriptFile', formdata?.script_file);
    if (installDependency) {
      payloadFile.append('installDepCmd', formdata?.installDepCmd);
    }
    let payload = { payload: payloadFile, id: data?.id };
    dispatch(ClustersActions.addScript(payload));
    setFileInputKey(prev => prev + 1);
    reset();
  };

  useEffect(() => {
    if (!isEmpty(data?.id)) {
      dispatch(ClustersActions.fetchScriptList(data?.id));
    }
  }, [data?.id]);

  return (
    <>
      <FullPageLoader loading={loading || loading3 || loading4} />

      <Container>
        <div className="row mb-3">
          <>
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  name="script_file"
                  label="Custom Script"
                  watch={watch}
                  control={control}
                  required
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={'Upload Script'}
                  errors={errors}
                  fileLable="Custom Script"
                  validExtensionsArray={['.groovy', '.py', '.zip']}
                  acceptString={'.groovy,.py,.zip'}
                  errorText={'Script'}
                  key={fileInputKey}
                />
              </ModalContainer>{' '}
            </div>
            <div className="col-6 d-flex align-items-center">
              <CheckboxField
                name="check"
                label="Want to install python dependencies?"
                checked={installDependency}
                onChange={e => setInstallDependency(e.target.checked)}
              />
            </div>

            <div className="row d-flex mt-3">
              <div className="col-6">
                {installDependency && (
                  <InputField
                    name="installDepCmd"
                    type="text"
                    label="Installation Command"
                    placeholder="Enter command"
                    required
                    register={register}
                    errors={errors}
                    icon={<DocumentTextIcon />}
                  />
                )}
              </div>
            </div>
          </>
        </div>

        <FlexWrapper>
          <div className="" style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit(handleUpload)}
            >
              Upload
            </Button>
          </div>
        </FlexWrapper>
        <div className="ms-1 mt-2 d-flex justify-content-end">
          <div>
            <NotePadIcon height="21" width="21" color={theme.colors.primary} />{' '}
            : &nbsp;Uploaded by DFM &nbsp;&nbsp;
          </div>
        </div>
        <div className="mt-2">
          <Table data={scriptList || []} columns={COLUMNS} />
        </div>
        <ModalWithIcon
          title={`Delete Script`}
          primaryButtonText={'Delete'}
          secondaryButtonText="Cancel"
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          primaryText={`Are you sure you want to delete?`}
          onSubmit={handleNarDeleteConfirm}
        />
      </Container>
    </>
  );
};

ClusterCustomScript.propTypes = {
  data: PropTypes.shape({
    clusterName: PropTypes.string,
    nifiUrl: PropTypes.string,
    metrics_url: PropTypes.string,
    logs_url: PropTypes.string,
    registryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notification_enable: PropTypes.bool,
    approver_enable: PropTypes.bool,
    change_request_enable: PropTypes.bool,
    service_account_type: PropTypes.oneOf(['username_password', 'p12']),
    service_username: PropTypes.string,
    service_password: PropTypes.string,
    service_account_certificate: PropTypes.string,
    service_account_certificate_password: PropTypes.string,
    has_custom_service_account: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }),
};
