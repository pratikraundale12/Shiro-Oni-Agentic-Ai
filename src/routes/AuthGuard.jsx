import React from 'react';
import { Outlet } from 'react-router-dom';
// import styled from 'styled-components';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
// const Container = styled.div`
//   width: 100vw;
//   height: 100vh;
//   display: flex;
// `;

// const Content = styled.main`
//   width: 100%;
// `;

const AuthGuard = () => {
  return (
    // <Container>
    <>
      {/* <Content> */}

      {/* <Header />
      <Container>
        <Sidebar />

        <Outlet />
      </Container> */}

      <Header />

      <div className="main-view-area d-flex align-items-start justify-content-start position-relative">
        <button
          className="slider-btn position-absolute d-flex align-items-center justify-content-center d-lg-none d-block bg-white p-1"
          type="button"
          id="toggleButton"
        >
          asdfsadf
          <img
            src="/img/profile-img.png"
            alt="arrow-icon"
            width={14}
            height={14}
          />
        </button>
        <Sidebar />
        <Outlet />
      </div>

      {/* </Container>   */}
    </>
  );
};

export default AuthGuard;
