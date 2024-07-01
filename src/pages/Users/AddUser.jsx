import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 1.4rem;
`;

export const AddUser = () => {
  const { id } = useParams();
  return (
    <Container>
      <h2>{id ? "Edit User" : "Add User"}</h2>
    </Container>
  );
};
