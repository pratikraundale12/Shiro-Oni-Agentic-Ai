import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import { theme } from '../../styles';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledButton = styled.button`
  height: 2rem;
  width: 2rem;
  border-radius: 4px;
  border: ${props =>
    props.active
      ? `2px solid ${theme.colors.primary}`
      : `2px solid ${theme.colors.border}`};
  background-color: transparent;
  color: ${props =>
    props.active ? theme.colors.primary : theme.colors.darker};
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.primary};

    & svg path {
      fill: ${theme.colors.white} !important;
    }
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${theme.colors.border};
    border: 2px solid ${theme.colors.border};
    & svg path {
      fill: ${theme.colors.white} !important;
    }
  }
  & svg path {
    fill: ${theme.colors.border} !important;
  }
`;

const Pagination = ({ page, count, setCurrentPage, itemsPerPage }) => {
  const totalPage = Math.ceil(count / itemsPerPage);
  const getPageRange = () => {
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(count, page * itemsPerPage);
    return `${start} - ${end}`;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (page > 1) {
      pageNumbers.push(1);
    }
    if (page > 4) {
      pageNumbers.push('...');
    }

    if (page > 3) {
      pageNumbers.push(page - 2);
    }

    if (page > 2) {
      pageNumbers.push(page - 1);
    }

    pageNumbers.push(page);

    if (page < totalPage - 1) {
      pageNumbers.push(page + 1);
    }

    if (page < totalPage - 2) {
      pageNumbers.push(page + 2);
    }
    if (page < totalPage - 3) {
      pageNumbers.push('...');
    }

    if (page < totalPage) {
      pageNumbers.push(totalPage);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const handlePrev = () => {
    if (page > 1) {
      setCurrentPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      setCurrentPage(page + 1);
    }
  };

  const handlePageChange = number => {
    if (number !== '...') {
      setCurrentPage(number);
    }
  };

  return (
    <Container>
      <span>{`${getPageRange()} of ${count} List`}</span>
      <Flex>
        <StyledButton onClick={handlePrev} disabled={page === 1}>
          <GreaterArrowIcon color={theme.colors.white} />
        </StyledButton>
        {pageNumbers.map((number, index) => (
          <StyledButton
            key={index}
            onClick={() => handlePageChange(number)}
            size="sm"
            variant="secondary"
            active={number === page}
          >
            {number}
          </StyledButton>
        ))}
        <StyledButton onClick={handleNext} disabled={page === totalPage}>
          <LessArrowIcon color={theme.colors.white} />
        </StyledButton>
      </Flex>
    </Container>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
};

export default Pagination;
