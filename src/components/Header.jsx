import styled from "styled-components";

const Container = styled.header`
  width: 100%;
  padding: 2.6rem;
  background: ${(props) => props.theme.colors.primary};
`;

const Title = styled.h1`
  font-weight: 600;
  color: ${(props) => props.theme.colors.white};
`;

export const Header = () => {
  return (
    <Container>
      <Title>Header</Title>
    </Container>
  );
};
