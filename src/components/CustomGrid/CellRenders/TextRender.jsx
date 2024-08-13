import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TextColor = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const TextRender = ({ text, ...rest }) => {
  return <TextColor {...rest}>{text}</TextColor>;
};

TextRender.propTypes = {
  text: PropTypes.string,
};
