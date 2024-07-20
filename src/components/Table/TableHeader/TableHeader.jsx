import React from 'react';
import { SmallSearchIcon, TodoIcon } from '../../../assets';
import PropTypes from 'prop-types';

export const TableHeader = ({ search, setSearch }) => {
  return (
    <>
      <div className="top-title-bar-h d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center main-title-div">
          <div>
            <TodoIcon />
          </div>
          <h4 className="mb-0">User List</h4>
        </div>
        <div className="d-flex align-items-center dropdown-div">
          {/* custom-dropdown-1 */}
          <div className="custom-dropdown-1">
            <div className="dropdown">
              <button
                className="dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="floating-label position-absolute">
                  Refresh
                </span>
                <div className="d-flex align-items-center text-span-set">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.55198 3.69369C6.0128 2.43057 7.91709 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984C18.3332 11.7799 17.775 13.4297 16.8242 14.7837L14.1665 9.99984H16.6665C16.6665 6.31794 13.6818 3.33317 9.99984 3.33317C8.20802 3.33317 6.58131 4.04006 5.38336 5.19019L4.55198 3.69369ZM15.4477 16.306C13.9868 17.5691 12.0826 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 8.21972 2.22466 6.56997 3.1755 5.21604L5.83317 9.99984H3.33317C3.33317 13.6818 6.31794 16.6665 9.99984 16.6665C11.7917 16.6665 13.4183 15.9596 14.6163 14.8095L15.4477 16.306Z"
                      fill="#444444"
                    />
                  </svg>
                  <span>Refresh</span>
                </div>
                <div className="arrow-div">
                  <svg
                    width={16}
                    height={17}
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6668 6.1665L8.00016 10.8332L3.3335 6.1665"
                      stroke="#58616F"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <ul
                className="dropdown-menu p-0 w-100 border-0"
                aria-labelledby="dropdownMenuButton1"
              >
                <li className="w-100">Off</li>
                <li className="w-100">Auto</li>
                <li className="w-100">5 Seconds</li>
                <li className="w-100">10 Seconds</li>
              </ul>
            </div>
          </div>
          {/* custom-dropdown-1 */}
          <div className="custom-dropdown-1">
            <div className="dropdown">
              <button
                className="dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="floating-label position-absolute">Status</span>
                <div className="d-flex align-items-center text-span-set">
                  <span>Status</span>
                </div>
                <div className="arrow-div">
                  <svg
                    width={16}
                    height={17}
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6668 6.1665L8.00016 10.8332L3.3335 6.1665"
                      stroke="#58616F"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <ul
                className="dropdown-menu p-0 w-100 border-0"
                aria-labelledby="dropdownMenuButton1"
              >
                <li className="w-100">ABC</li>
                <li className="w-100">XYZ</li>
              </ul>
            </div>
          </div>
          {/* red-btn */}
          <div
            className="btn-primary d-flex align-items-center justify-content-center"
            data-bs-target="#exampleModalone"
            data-bs-toggle="modal"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33337 7.33301V4.66634H8.66671V7.33301H11.3334V8.66634H8.66671V11.333H7.33337V8.66634H4.66671V7.33301H7.33337ZM8.00004 14.6663C4.31814 14.6663 1.33337 11.6815 1.33337 7.99967C1.33337 4.31777 4.31814 1.33301 8.00004 1.33301C11.6819 1.33301 14.6667 4.31777 14.6667 7.99967C14.6667 11.6815 11.6819 14.6663 8.00004 14.6663ZM8.00004 13.333C10.9456 13.333 13.3334 10.9452 13.3334 7.99967C13.3334 5.05415 10.9456 2.66634 8.00004 2.66634C5.05452 2.66634 2.66671 5.05415 2.66671 7.99967C2.66671 10.9452 5.05452 13.333 8.00004 13.333Z"
                fill="white"
              />
            </svg>
            Add New User
          </div>
        </div>
      </div>
      <div className="seacrh-box-container mb-3 w-100">
        <div className="w-100 seacrh-box d-flex align-items-center justify-content-start">
          <div className=" d-flex align-items-center justify-content-center">
            <SmallSearchIcon />
          </div>
          {/* <input
            type="text"
            className="search-box-bar border-0 w-100"
            placeholder="Search User Name, Email, Status"
          /> */}
          <input
            type="text"
            className="search-box-bar border-0 w-100"
            placeholder="Search User Name, Email, Status"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

TableHeader.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func,
};
