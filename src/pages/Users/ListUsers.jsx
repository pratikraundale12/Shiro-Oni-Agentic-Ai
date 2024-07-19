import styled from "styled-components";
import { useState } from "react";
import { Grid } from "../../components/Grid";
import { Model } from "../../shared";
import { DeleteDustbinIcon } from "../../assets";

const Container = styled.div`
  padding: 1.4rem;
`;

export const ListUsers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item.first_name,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Email',
      renderCell: item => item.email,
      sort: { sortKey: 'EMAIL' },
    },
    { label: 'Role', renderCell: item => item.type, sort: { sortKey: 'TYPE' } },
    {
      label: 'Status',
      renderCell: item => (item.is_active ? 'Active' : 'Inactive'),
      sort: { sortKey: 'STATUS' },
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
    AGE: array => array.sort((a, b) => a.name - b.name),
  };

  return (
    <>
      <Model
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        size="sm"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="">
            <div className="">
              <div className="delete-user-icon d-flex align-items-center justify-content-center">
                <DeleteDustbinIcon />
              </div>

              <h5 className="pt-4 mt-2 mb-0 text-center">
                Are you sure you want to delete this user?
              </h5>
              <p className="pt-3 mb-0 text-center">
                It will Temporary remove the user
              </p>
            </div>
          </div>
        </div>
      </Model>
      <Container>
        <Grid module="users" columns={COLUMNS} sortFns={SORT_FNS} />
        <button onClick={openModal}>hello</button>
      </Container>{" "}
    </>
  );
};
