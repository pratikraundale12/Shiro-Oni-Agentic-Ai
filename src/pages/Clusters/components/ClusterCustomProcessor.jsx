/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, InputField } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { KDFM } from '../../../constants';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { CurvedFolderIcon, DeleteSmallIcon } from '../../../assets';
import { theme } from '../../../styles';
import { LoadingSelectors } from '../../../store';

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
export const ClusterCustomProcessor = ({
  tags,
  hostToEdit,
  clusterId,
  data,
}) => {
  const dispatch = useDispatch();
  const narList = useSelector(ClustersSelectors.getnarList);
  const [fileInputKey, setFileInputKey] = useState(0);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'addNarFile')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'restartCluster')
  );
  const schema = yup.object().shape({
    nar_file: yup.mixed().required('File is required'),
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    resetField,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const COLUMNS = [
    {
      label: 'File Name',
      renderCell: item => <>{item?.name || 'N/A'}</>,
      resize: true,
      width: '40%',
    },
    {
      label: 'File',
      renderCell: item => <>{item?.narPath}</>,
      resize: true,
      width: '50%',
    },

    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span data-tooltip-id={`certificate-${item?.id}-detail`}>
              {/* <NotePadIcon
                height="21"
                width="21"
                color={
                  item?.has_certificate
                    ? theme.colors.primary
                    : theme.colors.darkGrey
                }
              /> */}
              <DeleteSmallIcon color="red" />
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
    payloadFile.append('narFile', formdata?.nar_file);
    let payload = { payload: payloadFile, id: data?.id };
    dispatch(ClustersActions.addNarFile(payload));
    setFileInputKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!isEmpty(data?.id)) {
      dispatch(ClustersActions.fetchNarList(data?.id));
    }
  }, [data?.id]);
  const handleRestart = () => {
    dispatch(
      ClustersActions.restartCluster({
        id: data?.id,
        payload: {},
      })
    );
  };
  return (
    <>
      <FullPageLoader loading={loading || loading2} />

      <Container>
        <div className="row mb-3">
          <>
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  name="nar_file"
                  label="Custom Nar file"
                  watch={watch}
                  control={control}
                  required
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={'Upload nar file'}
                  errors={errors}
                  fileLable="Custom Nar file"
                  validExtensionsArray={['.nar']}
                  acceptString={'.nar'}
                  errorText={'Nar'}
                  key={fileInputKey}
                />
              </ModalContainer>
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
            <Button type="button" variant="primary" onClick={handleRestart}>
              Restart
            </Button>
          </div>
        </FlexWrapper>
        <div className="mt-2">
          <Table data={narList || []} columns={COLUMNS} />
        </div>
      </Container>
    </>
  );
};

ClusterCustomProcessor.propTypes = {
  tags: PropTypes.string.isRequired,
  clusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  hostToEdit: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isPassword: PropTypes.bool,
    username: PropTypes.string,
    password: PropTypes.string,
    service_account_certificate_password: PropTypes.string,
  }),
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
