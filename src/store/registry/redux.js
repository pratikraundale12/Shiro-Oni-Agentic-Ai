import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-REGISTRY/';

/* ------------- ACTIONS ------------------ */
export const RegistryActions = {
  fetchRegistry: createAction(`${prefix}fetchRegistry`),
  fetchRegistryData: createAction(`${prefix}fetchRegistryData`),
  setIsAddRegistryModalOpen: createAction(`${prefix}setIsAddRegistryModalOpen`),
  testRegistry: createAction(`${prefix}testRegistry`),
  createRegistryAfterTest: createAction(`${prefix}createRegistryAfterTest`),
  setRegistryTestSuccess: createAction(`${prefix}setRegistryTestSuccess`),
  deleteRegistry: createAction(`${prefix}deleteRegistry`),
  setIsDeleteModalOpen: createAction(`${prefix}setIsDeleteModalOpen`),
  editRegistry: createAction(`${prefix}editRegistry`),
  setRegistrySelectedData: createAction(`${prefix}setRegistrySelectedData`),
};
/* ------------- INITIAL STATE ------------- */
export const REGISTRY_INITIAL_STATE = {
  count: null,
  data: [],
  prev: null,
  next: null,
  isUserModalOpen: false,
  isAddRegistryModalOpen: false,
  registryTestSuccess: false,
  isDeleteModalOpen: false,
  registrySelectedData: {},
};

/* ------------- SELECTORS ------------------ */
export const RegistrySelectors = {
  getIsAddRegistryModalOpen: state => state.registry.isAddRegistryModalOpen,
  getRegistryTestSuccess: state => state.registry.registryTestSuccess,
  getIsDeleteModalOpen: state => state.registry.isDeleteModalOpen,
  getRegistrySelectedData: state => state.registry.registrySelectedData,
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
const setRegistryTestSuccess = (state, { payload }) => {
  return {
    ...state,
    registryTestSuccess: payload,
  };
};
const setIsDeleteModalOpen = (state, { payload }) => {
  return {
    ...state,
    isDeleteModalOpen: payload,
  };
};

const setRegistrySelectedData = (state, { payload }) => {
  return {
    ...state,
    registrySelectedData: payload,
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
      )
      .addCase(RegistryActions.setRegistryTestSuccess, setRegistryTestSuccess)
      .addCase(RegistryActions.setIsDeleteModalOpen, setIsDeleteModalOpen)
      .addCase(
        RegistryActions.setRegistrySelectedData,
        setRegistrySelectedData
      );
  }
);
