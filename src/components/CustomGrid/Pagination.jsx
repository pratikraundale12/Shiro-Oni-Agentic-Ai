import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import { Button } from '../../shared';
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

  &:disabled {
    background-color: ${theme.colors.border};
  }
`;

const StyledButtonWithIcon = styled(Button)`
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  border: ${props =>
    props.active
      ? `2px solid ${theme.colors.primary}`
      : `2px solid ${theme.colors.border}`};
  background-color: transparent !important;
  color: ${props =>
    props.active ? theme.colors.primary : theme.colors.darker};
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: ${theme.colors.border} !important;

    & svg path {
      fill: ${theme.colors.white} !important;
    }
  }

  & svg path {
    fill: ${theme.colors.border} !important;
  }
`;

const Pagination = ({ page, count, setCurrentPage }) => {
  const itemsPerPage = 10;
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
        <StyledButtonWithIcon
          size="sm"
          onClick={handlePrev}
          icon={<GreaterArrowIcon color={theme.colors.white} />}
          disabled={page === 1}
        />
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
        <StyledButtonWithIcon
          size="sm"
          onClick={handleNext}
          icon={<LessArrowIcon color={theme.colors.white} />}
          disabled={page === totalPage}
        />
      </Flex>
    </Container>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default Pagination;
