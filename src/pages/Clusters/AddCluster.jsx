import { useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 1.4rem;
`;

export const AddCluster = () => {
  const { id } = useParams();

  return (
    <Container>
      <h2>{id ? "Edit Cluster" : "Add Cluster"}</h2>
    </Container>
  );
};
