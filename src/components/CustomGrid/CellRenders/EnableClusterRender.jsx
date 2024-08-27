import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { LoginIcon } from '../../../assets';
import { CLUSTER_STATUS } from '../../../constants';
import { AuthenticationActions } from '../../../store';
import { ClusterLoginModal } from '../../ClusterLoginModal';
import { IconButton } from './AtionRender';

const EnableClusterText = styled.div`
  display: block;
  color: #0cbf59;
  left: 0;
  bottom: 0;
  padding: 4px;
  z-index: 1;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  cursor: pointer;
`;

export const EnableClusterRender = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <>
      <EnableClusterText
        onClick={() => {
          if (item?.status === CLUSTER_STATUS.DISCONNECTED) {
            dispatch(
              AuthenticationActions.setClusterLogin({
                label: item.name,
                value: item.id,
              })
            );
          }
        }}
      >
        <IconButton disabled={item.status !== CLUSTER_STATUS.DISCONNECTED}>
          {' '}
          <LoginIcon />
        </IconButton>
      </EnableClusterText>
      {item?.status === CLUSTER_STATUS.DISCONNECTED && (
        <ClusterLoginModal cluster={item} />
      )}
    </>
  );
};

EnableClusterRender.propTypes = {
  item: PropTypes.object.isRequired,
};
