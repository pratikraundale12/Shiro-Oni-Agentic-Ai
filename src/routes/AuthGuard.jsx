import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

// const Content = styled.main`
//   width: 100%;
// `;

const AuthGuard = () => {
  return (
    // <Container>
    <>
      {/* <Content> */}
      <Header />
      <Container>
        <Sidebar />

        <Outlet />
      </Container>
      {/* </Content> */}
      {/* </Container> */}
    </>
  );
};

export default AuthGuard;
