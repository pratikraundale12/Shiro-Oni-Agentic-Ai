import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Button } from "../../shared";
import { PlusIcon } from "../../assets";

const Container = styled.div`
  padding: 1.4rem;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ListClusters = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Heading>
        <h2>List Clusters</h2>
        <div>
          <Button
            size="sm"
            variant="secondary"
            icon={<PlusIcon />}
            onClick={() => navigate("add")}
          >
            add new cluster
          </Button>
        </div>
      </Heading>
    </Container>
  );
};