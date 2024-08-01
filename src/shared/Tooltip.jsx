/* eslint-disable */

import { Tooltip as ReactTooltip } from 'react-tooltip';

export const Tooltip = ({ id, children, styles }) => {
  return (
    <ReactTooltip id={id} place="left" content={children} style={styles} />
  );
};
