import React, { useState } from 'react';
import Collapsible from './Collapsible';
import PropTypes from 'prop-types';
import SanityCheckProcessorItem from './SanitaryCheckProcessorsItem';
import SanityCheckControllerServiceItem from './SanitaryCheckControllerServiceItem';
import { isEmpty } from 'lodash';

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
