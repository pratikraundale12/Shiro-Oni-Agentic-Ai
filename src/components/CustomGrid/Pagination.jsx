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

const Pagination = ({ page, setState, count, prev, next }) => {
  const getPageRange = () => {
    const start = (page - 1) * 10 + 1;
    const end = Math.min(count, page * 10);
    return `${start} - ${end}`;
  };

  return (
    <Container>
      <span>{`${getPageRange()} of ${count} List`}</span>
      <Flex>
        <Button
          size="sm"
          onClick={() => setState(prevState => ({ ...prevState, page: prev }))}
          icon={<GreaterArrowIcon color={theme.colors.white} />}
        />
        <Button size="sm" variant="secondary">
          1
        </Button>
        <Button size="sm" variant="secondary">
          2
        </Button>
        <Button size="sm" variant="secondary">
          ...
        </Button>
        <Button size="sm" variant="secondary">
          9
        </Button>
        <Button size="sm" variant="secondary">
          10
        </Button>
        <Button
          size="sm"
          onClick={() => setState(prevState => ({ ...prevState, page: next }))}
          icon={<LessArrowIcon color={theme.colors.white} />}
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
