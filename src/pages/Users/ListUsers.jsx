import styled from "styled-components";

import { Grid } from "../../components/Grid";

const Container = styled.div`
  padding: 1.4rem;
`;

export const ListUsers = () => {
  const COLUMNS = [
    { label: "ID", renderCell: (item) => item.id },
    { label: "Name", renderCell: (item) => item.name, sort: { sortKey: "NAME" } },
    { label: "Age", renderCell: (item) => item.age, sort: { sortKey: "AGE" } },
  ];

  const SORT_FNS = {
    NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
    AGE: (array) => array.sort((a, b) => a.name - b.name),
  };

  return (
    <Container>
      <Grid module="users" columns={COLUMNS} sortFns={SORT_FNS} />
    </Container>
  );
};
