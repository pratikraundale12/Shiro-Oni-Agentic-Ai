import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DeleteSmallIcon, PencilIcon } from '../../../assets';
import { useGlobalContext } from '../../../utils';

// Styled components based on the provided CSS
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ActionRender = ({ item }) => {
  const { state, setState } = useGlobalContext();

  return (
    <ActionTd>
      <IconWrapper
        onClick={() =>
          setState({
            ...state,
            userModal: true,
            selectedItem: item,
          })
        }
      >
        <PencilIcon />
      </IconWrapper>
      <IconWrapper>
        <DeleteSmallIcon color="red" />
      </IconWrapper>
    </ActionTd>
  );
};

ActionRender.propTypes = {
  item: PropTypes.object.isRequired,
};
