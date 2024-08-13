import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ClusterLoginModal } from '../../ClusterLoginModal';

const EnableClusterText = styled.div`
  display: ${props => (props.isVisible ? 'block' : 'none')};
  color: #0cbf59;
  position: absolute;
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
export const EnableClusterRender = ({ hoveredItemId, item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <EnableClusterText
        isVisible={hoveredItemId === item.id}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Login to Cluster
      </EnableClusterText>

      <ClusterLoginModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        clusterId={item.id}
      />
    </>
  );
};

EnableClusterRender.propTypes = {
  item: PropTypes.object.isRequired,
  hoveredItemId: PropTypes.string,
};
