import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-REGISTRY/';

/* ------------- ACTIONS ------------------ */
export const RegistryActions = {
  fetchRegistry: createAction(`${prefix}fetchRegistry`),
  fetchRegistryData: createAction(`${prefix}fetchRegistryData`),
  setIsAddRegistryModalOpen: createAction(`${prefix}setIsAddRegistryModalOpen`),
  testRegistry: createAction(`${prefix}testRegistry`),
  createRegistryAfterTest: createAction(`${prefix}createRegistryAfterTest`),
};
/* ------------- INITIAL STATE ------------- */
export const REGISTRY_INITIAL_STATE = {
  count: null,
  data: [],
  prev: null,
  next: null,
  isUserModalOpen: false,
  isAddRegistryModalOpen: false,
};

/* ------------- SELECTORS ------------------ */
export const RegistrySelectors = {
  getIsAddRegistryModalOpen: state => state.registry.isAddRegistryModalOpen,
};

/* ------------- REDUCERS ------------------- */
const fetchRegistryData = (state, { payload }) => {
  return {
    ...state,
    data: payload,
  };
};
const setIsAddRegistryModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAddRegistryModalOpen: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const registryReducer = createReducer(
  REGISTRY_INITIAL_STATE,
  builder => {
    builder
      .addCase(RegistryActions.fetchRegistryData, fetchRegistryData)
      .addCase(
        RegistryActions.setIsAddRegistryModalOpen,
        setIsAddRegistryModalOpen
      );
  }
);
