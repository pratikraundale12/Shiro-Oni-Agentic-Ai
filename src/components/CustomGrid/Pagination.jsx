/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import { theme } from '../../styles';
import { PAGINATION_ITEM_OPTIONS } from '../../constants';
import { Button } from '../../shared';
import { ActivityHistoryActions } from '../../store/activityHistory';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageLoader } from '../FullPageLoader';
import { LoadingSelectors } from '../../store';

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
  min-width: 2rem;
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
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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

const Select = styled.select`
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontRedHat};
  background-color: ${props => props.theme.colors.white};
  text-transform: capitalize;

  &:focus-visible {
    outline: none;
  }

  option {
    text-transform: capitalize;
  }
`;

const Pagination = ({
  page,
  count,
  setCurrentPage,
  itemsPerPage,
  onItemsPerPageChange,
  setPageLoading,
  selectEntity,
  selectStatus,
  selectEvent,
}) => {
  const totalPage = Math.ceil(count / itemsPerPage);

  // console.log(selectEntity, selectStatus, selectEvent);

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
    setPageLoading && setPageLoading(true);
    if (page > 1) {
      setCurrentPage(page - 1);
    }
  };

  const handleNext = () => {
    setPageLoading && setPageLoading(true);
    if (page < totalPage) {
      setCurrentPage(page + 1);
    }
  };

  const handlePageChange = number => {
    setPageLoading && setPageLoading(true);
    if (number !== '...') {
      setCurrentPage(number);
    }
  };

  useEffect(() => {
    setPageLoading && setPageLoading(false);
  }, [page]);

  const dispatch = useDispatch();

  const handleExportReport = () => {
    dispatch(
      ActivityHistoryActions.fetchEmailReport({
        queryParams: {
          status: selectStatus.map(status => status.value).join(','),
          event: selectEvent.map(event => event.value).join(','),
          entity: selectEntity.map(entity => entity.value).join(','),
        },
      })
    );
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchEmailReport')
  );

  return (
    <Container>
      <FullPageLoader loading={loading} />
      <div className="d-flex align-items-center gap-3">
        <span>{`${getPageRange()} of ${count} List`}</span>
        <Select
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(Number(e.target.value))}
        >
          {PAGINATION_ITEM_OPTIONS.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <span>Items per page</span>
      </div>
      <Flex>
        {window.location.pathname === '/activity-history' && (
          <div className="d-flex align-items-center gap-2">
            <div>
              <Button>Download</Button>
            </div>
            <div>
              <Button
                onClick={() => {
                  handleExportReport();
                }}
              >
                Export Report
              </Button>
            </div>
          </div>
        )}
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
  onItemsPerPageChange: PropTypes.func.isRequired,
  setPageLoading: PropTypes.func,
};

export default Pagination;
