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

const Pagination = ({ page, setState, count, prev, next }) => {
  const getPageRange = () => {
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(count, currentPage * 10);
    return `${start} - ${end}`;
  };
  const itemsPerPage = 10;
  const currentPage = page;
  const totalPage = Math.ceil(count / itemsPerPage);
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (currentPage > 1) {
      pageNumbers.push(1);
    }
    if (currentPage > 4) {
      pageNumbers.push('...');
    }

    if (currentPage > 3) {
      pageNumbers.push(currentPage - 2);
    }

    if (currentPage > 2) {
      pageNumbers.push(currentPage - 1);
    }

    pageNumbers.push(currentPage);

    if (currentPage < totalPage - 1) {
      pageNumbers.push(currentPage + 1);
    }

    if (currentPage < totalPage - 2) {
      pageNumbers.push(currentPage + 2);
    }
    if (currentPage < totalPage - 3) {
      pageNumbers.push('...');
    }

    if (currentPage < totalPage) {
      pageNumbers.push(totalPage);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Container>
      <span>{`${getPageRange()} of ${count} List`}</span>
      <Flex>
        <StyledButton
          size="sm"
          onClick={() => setState(prevState => ({ ...prevState, page: prev }))}
          icon={<GreaterArrowIcon color={theme.colors.white} />}
          disabled={currentPage === 1}
        />
        {pageNumbers.map((number, index) => (
          <StyledButton
            key={index}
            onClick={() =>
              number != '...'
                ? setState(prevState => ({ ...prevState, page: number }))
                : null
            }
            size="sm"
            variant="secondary"
            active={number === currentPage}
          >
            {number}
          </StyledButton>
        ))}
        <StyledButton
          size="sm"
          onClick={() => setState(prevState => ({ ...prevState, page: next }))}
          icon={<LessArrowIcon color={theme.colors.white} />}
          disabled={currentPage === Math.ceil(count / 10)}
        />
      </Flex>
    </Container>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setState: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  prev: PropTypes.number,
  next: PropTypes.number,
};

export default Pagination;
