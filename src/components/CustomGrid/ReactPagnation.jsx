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
  gap: 4px;
`;

const StyledButton = styled(Button)`
  height: 30px;
`;

const ReactPagination = ({ offset, onPageChange, count, LIMIT }) => {
  console.log({ offset, count, LIMIT });
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(count / LIMIT);

  const getPageRange = () => {
    const start = offset + 1;
    const end = Math.min(count, offset + LIMIT);
    return `${start} - ${end}`;
  };

  const goToPage = page => {
    const newOffset = (page - 1) * LIMIT;
    onPageChange(newOffset);
  };

  return (
    <Container>
      <span>{`${getPageRange()} of ${count} List`}</span>
      <Flex>
        <StyledButton
          size="sm"
          disabled={offset === 0}
          onClick={() => onPageChange(Math.max(0, offset - LIMIT))}
          icon={<LessArrowIcon color={theme.colors.white} />}
        />
        {[...Array(totalPages).keys()].map((_, index) => (
          <StyledButton
            key={index + 1}
            size="sm"
            variant={currentPage === index + 1 ? 'primary' : 'secondary'}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </StyledButton>
        ))}
        <StyledButton
          size="sm"
          disabled={offset + LIMIT >= count}
          onClick={() => onPageChange(Math.min(count, offset + LIMIT))}
          icon={<GreaterArrowIcon color={theme.colors.white} />}
        />
      </Flex>
    </Container>
  );
};

ReactPagination.propTypes = {
  offset: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  LIMIT: PropTypes.number.isRequired,
};

export default ReactPagination;
