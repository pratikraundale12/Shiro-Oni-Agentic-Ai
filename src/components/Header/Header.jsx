// import styled from "styled-components";

// const Container = styled.header`
//   width: 100%;
//   padding: 2.6rem;
//   background: ${(props) => props.theme.colors.primary};
// `;

// const Title = styled.h1`
//   font-weight: 600;
//   color: ${(props) => props.theme.colors.white};
// `;

// export const Header = () => {
//   return (
//     <Container>
//       <Title>Header</Title>
//     </Container>
//   );
// };
import React from 'react';
import './index.css';
import {
  BellIcon,
  HeadphoneIcon,
  KsolvesIcon,
  SettingSmallIcon,
} from '../../assets';

export const Header = () => {
  return (
    <header className="main-header d-flex align-items-center">
      <div className="logo-div h-100 d-flex align-items-center justify-content-center">
        <KsolvesIcon />
      </div>
      <div className="header-menu bg-white w-100 h-100 d-flex align-items-center justify-content-between">
        <div className="header-title">Header</div>
        <div className="right-btns-div d-flex align-items-center justify-content-end">
          <button className="header-small-btn d-flex align-items-center justify-content-center">
            <HeadphoneIcon />
          </button>
          <button className="header-small-btn d-flex align-items-center justify-content-center">
            <BellIcon />
          </button>
          <button className="header-small-btn d-flex align-items-center justify-content-center">
            <SettingSmallIcon />
          </button>
          <div className="dropdown header-profile">
            <button
              className="dropdown-toggle d-flex align-items-center"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center info-div">
                <div className="img-area">
                  <img
                    src="./img/profile-img.png"
                    alt="img"
                    width={40}
                    height={40}
                    className="img-fluid"
                  />
                </div>
                <div className="user-info flex-column d-flex align-items-start">
                  <h6 className="mb-0">Adam Smith</h6>
                  <p className="mb-0">Admin</p>
                </div>
              </div>
              <div className="drodpwon-arrow">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.99991 10.9763L14.1247 6.85156L15.3032 8.03007L9.99991 13.3334L4.69666 8.03007L5.87516 6.85156L9.99991 10.9763Z"
                    fill="#444445"
                  />
                </svg>
              </div>
            </button>
            <ul
              className="dropdown-menu p-0 w-100"
              aria-labelledby="dropdownMenuButton1"
            >
              <li className="d-flex align-items-center">
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11C2 8.79085 3.79086 7 6 7C8.20915 7 10 8.79085 10 11H9C9 9.34315 7.65685 8 6 8C4.34314 8 3 9.34315 3 11H2ZM6 6.5C4.3425 6.5 3 5.1575 3 3.5C3 1.8425 4.3425 0.5 6 0.5C7.6575 0.5 9 1.8425 9 3.5C9 5.1575 7.6575 6.5 6 6.5ZM6 5.5C7.105 5.5 8 4.605 8 3.5C8 2.395 7.105 1.5 6 1.5C4.895 1.5 4 2.395 4 3.5C4 4.605 4.895 5.5 6 5.5Z"
                    fill="#444445"
                  />
                </svg>
                Action
              </li>
              <li className="d-flex align-items-center">
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 11C3.23857 11 1 8.7614 1 6C1 3.23857 3.23857 1 6 1C7.63565 1 9.08785 1.78539 10.0001 2.99961L8.64545 2.99966C7.94035 2.3775 7.01425 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20915 3.79086 10 6 10C7.0145 10 7.9408 9.6223 8.64595 8.9999H10.0005C9.08825 10.2144 7.63585 11 6 11ZM9.5 8V6.5H5.5V5.5H9.5V4L12 6L9.5 8Z"
                    fill="#444445"
                  />
                </svg>
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
