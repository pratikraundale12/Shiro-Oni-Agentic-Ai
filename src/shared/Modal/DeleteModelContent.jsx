import React from 'react';
import { DeleteDustbinIcon } from '../../assets';
const DeleteModalContent = () => {
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="">
        <div className="">
          <div className="delete-user-icon d-flex align-items-center justify-content-center">
            <DeleteDustbinIcon />
          </div>

          <h5 className="pt-4 mt-2 mb-0 text-center">
            Are you sure you want to delete this user?
          </h5>
          <p className="pt-3 mb-0 text-center">
            It will Temporary remove the user
          </p>
        </div>
      </div>
    </div>
  );
};
export default DeleteModalContent;
