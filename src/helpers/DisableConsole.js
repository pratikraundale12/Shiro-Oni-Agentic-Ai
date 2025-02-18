export const disableConsole = () => {
  console.warn = () => {};
  console.error = () => {};
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
};
