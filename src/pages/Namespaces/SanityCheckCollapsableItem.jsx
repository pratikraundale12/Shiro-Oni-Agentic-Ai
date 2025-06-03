import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import SanityCheckProcessorItem from './SanitaryCheckProcessorsItem';
import SanityCheckControllerServiceItem from './SanitaryCheckControllerServiceItem';

const SanityCheckCollapsableItem = ({ item = {} }) => {
  const [isOpenTab, setIsOpenTab] = useState(false);

  return (
    <>
      <Collapsible
        title={item?.processGroupName}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        <SanityCheckProcessorItem item={item?.processors} />
        <SanityCheckControllerServiceItem item={item?.controllerServices} />
      </Collapsible>
    </>
  );
};
SanityCheckCollapsableItem.propTypes = {
  item: PropTypes.object,
};
export default SanityCheckCollapsableItem;
