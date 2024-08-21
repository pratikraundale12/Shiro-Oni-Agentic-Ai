import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CLUSTER_STATUS } from '../../../constants';
import { AuthenticationActions } from '../../../store';
import { ClusterLoginModal } from '../../ClusterLoginModal';

const EnableClusterText = styled.div`
  display: ${props => (props.isVisible ? 'block' : 'none')};
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

  if (item?.status === CLUSTER_STATUS.DISCONNECTED) {
    return (
      <>
        <EnableClusterText
          isVisible={item.status !== 'Connected'}
          onClick={() => {
            dispatch(
              AuthenticationActions.setClusterLogin({
                label: item.name,
                value: item.id,
              })
            );
          }}
        >
          Login to Cluster
        </EnableClusterText>
        <ClusterLoginModal cluster={item} />
      </>
    );
  }

  return null;
};

EnableClusterRender.propTypes = {
  item: PropTypes.object.isRequired,
};
