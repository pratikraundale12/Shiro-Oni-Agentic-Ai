import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Collapsible from './Collapsible';
import SanityCheckControllerServiceItem from './SanitaryCheckControllerServiceItem';
import SanityCheckProcessorItem from './SanitaryCheckProcessorsItem';

const SanityCheckCollapsableItem = ({ item = {} }) => {
  const [isOpenTab, setIsOpenTab] = useState(true);

  return (
    <>
      <Collapsible
        title={item?.processGroupName}
        isTableOpen={isOpenTab}
        toggleCollapsible={() => setIsOpenTab(!isOpenTab)}
        isAddBtnVisible={false}
      >
        {!isEmpty(item?.processors) && (
          <SanityCheckProcessorItem item={item?.processors} />
        )}
        {!isEmpty(item?.controllerServices) && (
          <SanityCheckControllerServiceItem item={item?.controllerServices} />
        )}
      </Collapsible>
    </>
  );
};
SanityCheckCollapsableItem.propTypes = {
  item: PropTypes.object,
};
export default SanityCheckCollapsableItem;
