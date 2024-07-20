import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DownArrowIcon } from '../assets';

const Container = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 1rem;
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  top: 104%;
  z-index: 2;
  display: ${props => (props.show ? 'block' : 'none')};
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 0px 5px 0px ${props => props.theme.colors.shadow};
`;

const Item = styled.div`
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: ${props => props.theme.size.md};
  color: ${props => props.theme.colors.darker};

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-family: ${props => props.theme.fontNato};
  background: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};

  span {
    min-width: max-content;
  }

  svg {
    margin-left: 10px;
  }
`;

export const Dropdown = ({ placeholder, options = [] }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const menuRef = useRef(null);

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const handleSelect = item => {
    setSelectedOption(item);
    setShowMenu(prev => !prev);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container ref={menuRef}>
      <Button type="button" onClick={() => setShowMenu(prev => !prev)}>
        <span>{selectedOption.label || placeholder}</span>
        <DownArrowIcon />
      </Button>
      <List show={showMenu}>
        {options.map(item => (
          <Item key={item.value} onClick={() => handleSelect(item)}>
            {item.label}
          </Item>
        ))}
      </List>
    </Container>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  placeholder: PropTypes.string.isRequired,
};
