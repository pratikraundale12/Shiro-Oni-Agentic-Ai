import { get, isEmpty } from "lodash";

export const hasError = (errors, name) => {
  const error = get(errors, name);
  return !isEmpty(error?.message);
}