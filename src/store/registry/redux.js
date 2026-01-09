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
  getAllRegistiesList: createAction(`${prefix}getAllRegistiesList`),
  setRegistriesList: createAction(`${prefix}setRegistriesList`),
  setIsCreateRegistryModalOpen: createAction(
    `${prefix}setIsCreateRegistryModalOpen`
  ),
  setiskubeConfigModalOpen: createAction(`${prefix}setiskubeConfigModalOpen`),
  createRegistryKubeConfig: createAction(`${prefix}createRegistryKubeConfig`),
  fetchRegistryKubeConfigList: createAction(
    `${prefix}fetchRegistryKubeConfigList`
  ),
  setregistryKubeConfigList: createAction(`${prefix}setregistryKubeConfigList`),
  deleteRegistryKubeConfig: createAction(`${prefix}deleteRegistryKubeConfig`),
  createConfigRegistry: createAction(`${prefix}createConfigRegistry`),
  fetchRegistryConfigurationList: createAction(
    `${prefix}fetchRegistryConfigurationList`
  ),
  setRegistryConfigurationsList: createAction(
    `${prefix}setRegistryConfigurationsList`
  ),
  fetchRegistryConfigurationDefaultData: createAction(
    `${prefix}fetchRegistryConfigurationDefaultData`
  ),
  setRegistryConfigDefaultData: createAction(
    `${prefix}setRegistryConfigDefaultData`
  ),
  deleteRegistryConfiguration: createAction(
    `${prefix}deleteRegistryConfiguration`
  ),
  setRegistryConfigEditItem: createAction(`${prefix}setRegistryConfigEditItem`),
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
  registriesList: [],
  isCreateRegistryModalOpen: false,
  iskubeConfigModalOpen: false,
  registryKubeConfigList: [],
  registryConfigurationsList: [],
  registryConfigDefaultData: {},
  registryConfigEditItem: {},
};

/* ------------- SELECTORS ------------------ */
export const RegistrySelectors = {
  getIsAddRegistryModalOpen: state => state.registry.isAddRegistryModalOpen,
  getRegistryTestSuccess: state => state.registry.registryTestSuccess,
  getIsDeleteModalOpen: state => state.registry.isDeleteModalOpen,
  getRegistrySelectedData: state => state.registry.registrySelectedData,
  getRegistriesList: state => state.registry.registriesList,
  getisCreateRegistryModalOpen: state =>
    state.registry.isCreateRegistryModalOpen,
  getiskubeConfigModalOpen: state => state.registry.iskubeConfigModalOpen,
  getregistryKubeConfigList: state => state.registry.registryKubeConfigList,
  getRegistryConfigurationsList: state =>
    state.registry.registryConfigurationsList,
  getregistryConfigDefaultData: state =>
    state.registry.registryConfigDefaultData,
  getregistryConfigEditItem: state => state.registry.registryConfigEditItem,
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
const setRegistriesList = (state, { payload }) => {
  return {
    ...state,
    registriesList: payload,
  };
};

const setIsCreateRegistryModalOpen = (state, { payload }) => {
  return {
    ...state,
    isCreateRegistryModalOpen: payload,
  };
};
const setiskubeConfigModalOpen = (state, { payload }) => {
  return {
    ...state,
    iskubeConfigModalOpen: payload,
  };
};
const setregistryKubeConfigList = (state, { payload }) => {
  return {
    ...state,
    registryKubeConfigList: payload,
  };
};
const setRegistryConfigurationsList = (state, { payload }) => {
  return {
    ...state,
    registryConfigurationsList: payload,
  };
};
const setRegistryConfigDefaultData = (state, { payload }) => {
  return {
    ...state,
    registryConfigDefaultData: payload,
  };
};
const setRegistryConfigEditItem = (state, { payload }) => {
  return {
    ...state,
    registryConfigEditItem: payload,
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
      .addCase(RegistryActions.setRegistrySelectedData, setRegistrySelectedData)
      .addCase(RegistryActions.setRegistriesList, setRegistriesList)
      .addCase(
        RegistryActions.setIsCreateRegistryModalOpen,
        setIsCreateRegistryModalOpen
      )
      .addCase(
        RegistryActions.setiskubeConfigModalOpen,
        setiskubeConfigModalOpen
      )
      .addCase(
        RegistryActions.setregistryKubeConfigList,
        setregistryKubeConfigList
      )
      .addCase(
        RegistryActions.setRegistryConfigurationsList,
        setRegistryConfigurationsList
      )
      .addCase(
        RegistryActions.setRegistryConfigDefaultData,
        setRegistryConfigDefaultData
      )
      .addCase(
        RegistryActions.setRegistryConfigEditItem,
        setRegistryConfigEditItem
      );
  }
);
