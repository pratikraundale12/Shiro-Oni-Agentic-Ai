/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, CheckboxField, InputField } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { KDFM } from '../../../constants';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, IconButton, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { useNavigate } from 'react-router-dom';
import { AddIcon, CurvedFolderIcon, PencilIcon } from '../../../assets';
import { theme } from '../../../styles';
import { AddSSHModal } from './AddSSHModal';

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
const NodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  color: ${theme.colors.primary};
`;

export const SSHDetailsTabSection = ({
  tags,
  hostToEdit,
  clusterData,
  clusterId,
  data,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize state
  const [method, setMethod] = useState(
    data?.service_account_type || 'username_password'
  );
  // const [changeRequestEnabled, setChangeRequestEnabled] = useState(
  //   data?.has_custom_service_account || false
  // );
  const [sshItem, setSshItem] = useState([]);
  const [selectedSSH, setSelectedSSH] = useState({});
  const [isSSHModalOpen, setIsSSHModalOpen] = useState(false);
  const [bulkSelectItems, setBulkSelectItems] = useState([]);

  const isChecking = useSelector(ClustersSelectors.isCheckingServiceAccount);
  const isAdding = useSelector(ClustersSelectors.isAddingServiceAccountHost);
  const isUpdating = useSelector(
    ClustersSelectors.isUpdatingServiceAccountHost
  );
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  //
  const loading = isChecking || isAdding || isUpdating;

  const schemaPassword = yup.object({
    service_username: yup.string().required('Username is required'),
    service_password: yup.string().required('Password is required'),
  });

  const schemaPEM = yup.object({
    service_account_certificate_password: yup
      .string()
      .required('Password is required'),
    service_account_certificate: yup.mixed().required('P12 file is required'),
  });

  const schema = method === 'username_password' ? schemaPassword : schemaPEM;

  const {
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      service_account_type: data?.service_account_type || 'username_password',
      service_username: data?.service_username || '',
      service_password: data?.service_password || '',
      service_account_certificate: data?.service_account_certificate || '',
      service_account_certificate_password:
        data?.service_account_certificate_password || '',
      change_request_enable: data?.change_request_enable || false,
    },
  });

  useEffect(() => {
    if (method === 'username_password') {
      setValue('service_username', data?.service_username || '');
      setValue('service_password', data?.service_password || '');
    } else if (method === 'p12') {
      setValue(
        'service_account_certificate',
        data?.service_account_certificate || ''
      );
      setValue(
        'service_account_certificate_password',
        data?.service_account_certificate_password || ''
      );
    }
  }, [method, data, setValue]);

  useEffect(() => {
    if (data?.id) {
      dispatch(
        ClustersActions.fetchHostNodesList({
          selected: false,
          clusterId: data?.id,
          update_node: false,
        })
      );
      dispatch(ClustersActions.setMultiNodesTestResults({}));
    }
  }, [data?.id]);

  // useEffect(() => {
  //   if (typeof data?.total_nodes === 'number') {
  //     const newItems = [];
  //     for (let i = 0; i < data.total_nodes; i++) {
  //       newItems.push({
  //         id: i,
  //         hostIp: '',
  //         file: '',
  //         clusterId: '',
  //         username: '',
  //         nifiLibPath: '',
  //       });
  //     }
  //     setSshItem(newItems);
  //   }
  // }, [data?.total_nodes]);

  useEffect(() => {
    if (!isEmpty(listHostIpData)) {
      const formattedData = listHostIpData?.map(item => ({
        id: item?.id,
        hostIp: item.host_ip || '',
        file: '',
        clusterId: '',
        username: item.username || '',
        nifiLibPath: '',
        port: item?.port,
        ssh_key_name: item?.ssh_key_name,
      }));
      setSshItem(formattedData);
    }
  }, [listHostIpData]);

  const handleCheckClick = (check, item) => {
    if (check) {
      setBulkSelectItems(prev => [...prev, item]);
    } else {
      setBulkSelectItems(prev => prev.filter(ele => ele.id !== item.id));
    }
  };

  const checkboxClicked = item => {
    return bulkSelectItems?.some(ele => ele?.id === item?.id);
  };

  const COLUMNS = [
    {
      label: '',
      renderCell: item => (
        <>
          <CheckboxField
            name={`check-${item?.id}`}
            // label="Do you want to add same data in all nodes?"
            checked={checkboxClicked(item)}
            onChange={e => handleCheckClick(e.target.checked, item)}
          />
        </>
      ),
      resize: true,
      width: '3%',
    },
    {
      label: 'Node',
      renderCell: item => <>{item?.hostIp || '-'}</>,
      resize: true,
      width: '35%',
    },
    {
      label: 'File',
      renderCell: item => <span>{item?.ssh_key_name || '-'}</span>,
      resize: true,
      width: '35%',
    },
    // {
    //   label: 'Lib Path',
    //   renderCell: item => <>{item?.nifiLibPath || 'N/A'}</>,
    //   resize: true,
    //   width: '20%',
    // },
    {
      label: 'Username',
      renderCell: item => <>{item?.username || '-'}</>,
      resize: true,
      width: '20%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span data-tooltip-id={`certificate-${item?.id}-detail`}>
              {' '}
              <IconButton
                onClick={() => {
                  setIsSSHModalOpen(true);
                  setSelectedSSH(item);
                  setBulkSelectItems([]);
                }}
                title="Settings"
              >
                <PencilIcon
                  color={theme.colors.primary}
                  width={18}
                  height={18}
                />
              </IconButton>
            </span>
          }{' '}
        </>
      ),
      resize: true,
      width: '7%',
    },
  ];
  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        {' '}
        <FlexWrapper>
          <div className="d-flex justify-content-end w-100">
            <div className="mt-2 ">
              <Button
                type="button"
                variant="primary"
                loading={loading}
                onClick={() => setIsSSHModalOpen(true)}
                isBtnDisable={isEmpty(bulkSelectItems)}
              >
                Common SSH Configuration
              </Button>
            </div>
          </div>
        </FlexWrapper>
        <div className="mt-2">
          <Table
            data={sshItem || []}
            columns={COLUMNS}
            // customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
            // tableWithFullHeight={true}
          />
        </div>
        <AddSSHModal
          isSSHModalOpen={isSSHModalOpen}
          setIsSSHModalOpen={setIsSSHModalOpen}
          selectedSSH={selectedSSH}
          setSshItem={setSshItem}
          bulkSelectItems={bulkSelectItems}
          setBulkSelectItems={setBulkSelectItems}
          data={data}
          setSelectedSSH={setSelectedSSH}
        />
      </Container>
    </>
  );
};

SSHDetailsTabSection.propTypes = {
  tags: PropTypes.string.isRequired,
  clusterData: PropTypes.shape({
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
  }).isRequired,
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
