import React, { useState, useEffect } from 'react';
import { Modal, SelectField, PasswordField, InputField } from '../../shared';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClusterIcon, UserIcon } from '../../assets';
import { toast } from 'react-toastify';
import { getClusterList, getClusterToken } from '../../store';

const clusterSchema = yup.object().shape({
  cluster: yup.string().required('Registry Name is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const ClusterEnableModal = ({ setIsOpen, isOpen, clusterId }) => {
  const [clusterList, setClusterList] = useState([]);
  const [selectedClusterName, setSelectedClusterName] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clusterSchema),
  });

  const getClusterDataList = async () => {
    try {
      const response = await getClusterList();
      if (response.status === 200) {
        const filteredArray = response.data.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setClusterList(filteredArray);

        const selectedCluster = response.data.find(
          item => item.id === clusterId
        );
        if (selectedCluster) {
          setSelectedClusterName(selectedCluster.name);
          setValue('cluster', selectedCluster.id);
        }
      } else {
        toast.error(response?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Error fetching cluster data');
    }
  };

  useEffect(() => {
    getClusterDataList();
  }, [clusterId]);

  const onSubmit = async data => {
    setLoading(true);
    const clusterData = JSON.parse(localStorage.getItem('clusters'));

    const payload = {
      cluster_id: clusterId,
      username: data.username,
      password: data.password,
    };

    try {
      const response = await getClusterToken(payload);

      if (response.cluster_id) {
        console.log(response);
        const newCluster = {
          id: response.cluster_id,
          token: response.token,
        };
        clusterData.push(newCluster);
        localStorage.setItem('clusters', JSON.stringify(clusterData));
        setLoading(false);
        setIsOpen(false);
      } else {
        toast.error('Error while getting data');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Modal
      title="Enable Cluster"
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      size="sm"
      loading={loading}
      secondaryButtonText="Back"
      primaryButtonText="Submit"
      onSubmit={handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{ minWidth: '30%' }}
    >
      <SelectField
        label="Select Cluster"
        name="cluster"
        control={control}
        icon={<ClusterIcon />}
        options={clusterList || []}
        error={errors}
        placeholder={selectedClusterName}
      />

      <InputField
        name="username"
        type="text"
        label="Username"
        placeholder="Enter your Username"
        register={register}
        errors={errors}
        icon={<UserIcon />}
        required
      />
      <PasswordField
        name="password"
        register={register}
        errors={errors}
        watch={watch}
        required
        label="Password"
      />
    </Modal>
  );
};

ClusterEnableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  clusterId: PropTypes.string,
};
