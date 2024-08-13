import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-TEMPLATE/';

/* ------------- ACTIONS ------------------ */
export const TemplateActions = {
  template: createAction(`${prefix}template`),
  templateSuccess: createAction(`${prefix}templateSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const TEMPLATE_INITIAL_STATE = {
  data: {},
};

/* ------------- SELECTORS ------------------ */
export const TemplateSelectors = {
  getTemplate: state => state.template.data,
};

/* ------------- REDUCERS ------------------- */
const templateSuccess = (state, { payload }) => {
  return {
    ...state,
    ...payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const templateReducer = createReducer(
  TEMPLATE_INITIAL_STATE,
  builder => {
    builder.addCase(TemplateActions.templateSuccess, templateSuccess);
  }
);
