import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import { Table } from '../../components';
import { TagCrossIcon } from '../../assets';
import { theme } from '../../styles';

const SanityCheckProcessorItem = ({ item = [] }) => {
  const [isOpenTab, setIsOpenTab] = useState(false);
  const COLUMNS = [
    {
      label: 'Processor Name',
      renderCell: item => <div>{item?.processorName}</div>,
      width: '30%',
      resize: true,
    },
    {
      label: 'Processor Id',
      renderCell: item => (
        <div
          style={{
            color: theme.colors.primary,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => window.open(item?.link, '_blank')}
        >
          {item?.processorId}
        </div>
      ),
      width: '30%',
      resize: true,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <div style={{ overflowX: 'auto' }}>
          <TagCrossIcon width={28} height={24} color="red" />
          {item?.errorMessage}
        </div>
      ),
      width: '40%',
      resize: true,
    },
  ];
  return (
    <>
      <Collapsible
        title={'Processor'}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        <Table data={item || []} columns={COLUMNS} />
      </Collapsible>
    </>
  );
};
SanityCheckProcessorItem.propTypes = {
  item: PropTypes.array,
};
export default SanityCheckProcessorItem;
