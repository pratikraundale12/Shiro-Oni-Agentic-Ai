import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DownArrowIcon } from '../assets/Icons/DownArrowIcon';

const Container = styled.div`
  position: relative;
  display: inline-block;
  align-self: self-start;
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
  font-size: ${props => props.theme.size.xs};
  color: ${props => props.theme.colors.darker};

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
`;

const Button = styled.button`
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${props => props.theme.colors.lightGrey};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SelectedItemcontainer = styled.div`
  display: flex;
`;
const SelectedTile = styled.div`
  margin-right: 8px;
  font-family: Noto Sans;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #4b5564;
`;
const Label = styled.div`
  font-family: Noto Sans;
  font-size: 10px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
`;

export const Dropdown = ({ options = [], title = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container ref={menuRef}>
      <Label>{title}</Label>
      <Button type="button" onClick={() => setShowMenu(prev => !prev)}>
        <SelectedItemcontainer>
          <SelectedTile>{title}</SelectedTile>
          <div>
            <DownArrowIcon />
          </div>
        </SelectedItemcontainer>
      </Button>
      <List show={showMenu}>
        {options.map(item => (
          <Item key={item.value}>{item.label}</Item>
        ))}
      </List>
    </Container>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
};
