import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";

import { theme } from "../styles";
import { useFetchData } from "../utils";
import styled from "styled-components";
import { Button, SelectField } from "../shared";
import { PlusIcon } from "../assets";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Container = styled.div`
  background-color: ${theme.colors.white};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled(SelectField)`
  margin-bottom: 0;
  margin-right: 1rem;
`;

export const Grid = ({ module, columns = [], sortFns = {}, options = [], buttonText = "add new user" }) => {
  const navigate = useNavigate();
  const { data, search, setSearch } = useFetchData(module);
  const DATA = { nodes: data };
  const { control } = useForm();
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        border-radius: 4px;
      `,
      HeaderRow: `
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      `,
      Row: `        
        &:nth-of-type(odd) {
          background-color: #F5F7FA;
        }
      `,
      BaseCell: `
        padding: 16px;
      `,
    },
  ]);

  const sort = useSort(
    data,
    {},
    {
      sortFns,
    }
  );

  return (
    <Container>
      <h3>User List</h3>
      <Flex>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Flex>
          <Select
            name="sort"
            control={control}
            placeholder="Sort by"
            options={options}
            size="sm"
          />
          {buttonText && (
            <Button
              size="sm"
              variant="secondary"
              icon={<PlusIcon width={14} height={14} />}
              onClick={() => navigate("add")}
            >
              {buttonText}
            </Button>
          )}
        </Flex>
      </Flex>

      <CompactTable
        data={DATA}
        sort={sort}
        columns={columns}
        theme={tableTheme}
      />
    </Container>
  );
};
