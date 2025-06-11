import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import { Table } from '../../components';
import { TagCrossIcon } from '../../assets';

const SanityCheckControllerServiceItem = ({ item = [] }) => {
  const [isOpenTab, setIsOpenTab] = useState(false);
  const COLUMNS = [
    {
      label: 'Controller Service Name',
      renderCell: item => <div>{item?.controllerServiceName}</div>,
      width: '20%',
      resize: true,
    },
    {
      label: 'Controller Service Type',
      renderCell: item => <div>{item?.controllerServiceType}</div>,
      width: '20%',
      resize: true,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <>
          <div style={{ overflowX: 'auto' }}>
            {' '}
            <TagCrossIcon width={28} height={24} color="red" />
            {item?.errorMessage}
          </div>
        </>
      ),
      width: '60%',
      resize: true,
    },
  ];
  return (
    <>
      <Collapsible
        title={'Controller Service'}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        <Table data={item || []} columns={COLUMNS} />
      </Collapsible>
    </>
  );
};
SanityCheckControllerServiceItem.propTypes = {
  item: PropTypes.array,
};
export default SanityCheckControllerServiceItem;
