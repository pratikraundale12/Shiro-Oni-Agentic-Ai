import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TextColor = styled.div`
  color: var(--col-2D343F);
`;

export const TextRender = ({ text }) => {
  return <TextColor>{text}</TextColor>;
};

TextRender.propTypes = {
  text: PropTypes.string,
};
