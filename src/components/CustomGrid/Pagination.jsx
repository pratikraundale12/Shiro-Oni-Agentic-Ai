import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '../../shared';
import { theme } from '../../styles';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledButton = styled(Button)`
  height: 30px;
  background-color: ${props => (props.active ? theme.colors.primary : 'none')};
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
        <StyledButton
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
        <StyledButton
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
