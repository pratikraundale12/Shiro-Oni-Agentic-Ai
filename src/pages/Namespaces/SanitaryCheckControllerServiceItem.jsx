import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import { Table } from '../../components';
import { TagCrossIcon } from '../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
          <div
            style={{ overflowX: 'auto' }}
            data-tooltip-id={`sanity-check-cs-info-${item?.controllerServiceName}`}
          >
            {' '}
            <TagCrossIcon width={28} height={24} color="red" />
            {item?.errorMessage}
          </div>

          <ReactTooltip
            id={`sanity-check-cs-info-${item?.controllerServiceName}`}
            place="bottom"
            effect="solid"
            content={item?.errorMessage}
            style={{
              width: '400px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 1000000,
            }}
          />
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
