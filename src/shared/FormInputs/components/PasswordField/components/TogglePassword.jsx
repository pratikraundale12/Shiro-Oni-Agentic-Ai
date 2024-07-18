import { CloseEyeIcon, OpenEyeIcon } from '../../../../../assets';

const TogglePassword = ({ show, onToggle }) => (
  <div className="eye-icon">
    <span role="presentation" onClick={onToggle}>
      {show ? <OpenEyeIcon /> : <CloseEyeIcon />}
    </span>
  </div>
);

export default TogglePassword;
