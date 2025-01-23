/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SortDownIcon, SortUpIcon } from '../../assets';
import { GridActions, GridSelectors } from '../../store';

const ProcessGroupSorting = ({ sortProperty, module = 'namespaces' }) => {
  const [isAscending, setIsAscending] = useState(true);
  const dispatch = useDispatch();

  // Get data from Redux store
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, module)
  );
  const gridDataAll = useSelector(state =>
    GridSelectors.getModuleAllData(state, module)
  );

  const sortByProperty = (data, property, ascending = true) => {
    const clonedArray = [...data];
    return clonedArray.sort((a, b) => {
      const valueA = a[property] ? a[property].toLowerCase() : '';
      const valueB = b[property] ? b[property].toLowerCase() : '';

      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };
  // Handle toggle sort
  const handleToggleSort = () => {
    const sortedData = sortByProperty(gridData, sortProperty, isAscending);

    dispatch(
      GridActions.fetchGridSuccess({
        module,
        data: {
          data: sortedData,
          breadcrumb: gridDataAll?.breadcrumb,
          count: gridDataAll?.count,
          nifiUrl: gridDataAll?.nifiUrl,
          permissions: gridDataAll?.permissions,
          registry: gridDataAll?.registry,
        },
      })
    );

    setIsAscending(!isAscending);
  };

  return (
    <button onClick={handleToggleSort} style={{ background: 'none' }}>
      {isAscending ? <SortDownIcon /> : <SortUpIcon />}
    </button>
  );
};

export default ProcessGroupSorting;
