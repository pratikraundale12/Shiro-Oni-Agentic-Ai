/* eslint-disable */
import React, { useEffect } from 'react';
import { Button, InputField, SelectField } from '../../../shared';
import { PlusIcon, QRIcons } from '../../../assets';
import styled from 'styled-components';
import { FullPageLoader, Table } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { AddHostIPModal } from './AddHostIPModal';
import { isEmpty } from 'lodash';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #444445;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }

  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
  }
`;

const ClusterDetailTab = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getNiFiVersions')
  );
  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const nifiVerionsOptions =
    !isEmpty(nifiVersionsData) &&
    nifiVersionsData?.map(ele => ({ label: ele, value: ele }));
  console.log(nifiVerionsOptions, 'nifiVerionsOptions');

  console.log(nifiVersionsData, 'nifiVersionsData');

  useEffect(() => {
    dispatch(ClustersActions.getNiFiVersions());
  }, [dispatch]);

  const COLUMNS = [
    {
      label: 'Host IP',
      renderCell: item => <>hello</>,
      resize: true,
    },
    {
      label: 'Port No.',
      renderCell: item => <>hello</>,
      resize: true,
    },
    {
      label: 'Username',
      renderCell: item => <>hello</>,
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => <>hello</>,
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => <>hello</>,
      resize: true,
    },
  ];

  return (
    <>
      <FullPageLoader loading={loading} />
      <div className="row mt-2 ms-2 me-2">
        {' '}
        <div className="col-8">
          <LabelSelect className="mb-3">Cluster Name</LabelSelect>

          <InputField
            name="clusterName"
            type="text"
            // label="Cluster Name"
            placeholder="Enter your Cluster Name"
            required
            // register={register}
            // errors={errors}
            icon={<QRIcons />}
            // rightIcon={getRightIcon(watch, errors, setValue)}
          />
        </div>
        <div className="col-4">
          <LabelSelect className="mb-3">NiFi Version</LabelSelect>
          <SelectField
            name="refresh"
            label="NiFi Version"
            icon={<QRIcons />}
            options={nifiVerionsOptions || []}
            placeholder="Select NiFi Version"
          />
        </div>
      </div>
      {/* <div className="row mt-2 ms-2 ">
        {' '}
        <div className="col-11 row">
          <div className="col-4">
            <LabelSelect className="mb-3">Host IP 1</LabelSelect>

            <InputField
              name="clusterName"
              type="text"
              // label="Cluster Name"
              placeholder="Enter your Host IP"
              required
              // register={register}
              // errors={errors}
              icon={<QRIcons />}
              // rightIcon={getRightIcon(watch, errors, setValue)}
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Username</LabelSelect>

            <InputField
              name="clusterName"
              type="text"
              // label="Cluster Name"
              placeholder="Enter your Username"
              required
              // register={register}
              // errors={errors}
              icon={<QRIcons />}
              // rightIcon={getRightIcon(watch, errors, setValue)}
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Password</LabelSelect>

            <InputField
              name="clusterName"
              type="text"
              // label="Cluster Name"
              placeholder="Enter your Password"
              required
              // register={register}
              // errors={errors}
              icon={<QRIcons />}
              // rightIcon={getRightIcon(watch, errors, setValue)}
            />
          </div>
        </div>
        <div className="col-1 pt-4">
          <div className="d-flex justify-content-center">
            <ActiveButtonDiv className="div-btn-1 mr-2 mt-2">
              {' '}
              <PlusIcon color="#444445" />{' '}
            </ActiveButtonDiv>
          </div>
        </div>
      </div> */}
      <div className="col-auto ms-3">
        <Button
          size="md"
          onClick={() =>
            dispatch(ClustersActions.setIsAddHostIPModalOpen(true))
          }
          className="w-auto px-3"
          style={{ minWidth: 'auto' }}
        >
          <div
            className="d-flex "
            style={{ fontSize: '14px', fontWeight: '750' }}
          >
            <PlusIcon height={19} width={19} color={'#fff'} />
            Add New Host IP
          </div>
        </Button>
      </div>
      <div className="mt-4">
        <Table data={[{}]} columns={COLUMNS} />
      </div>
      <AddHostIPModal />
    </>
  );
};
export default ClusterDetailTab;
