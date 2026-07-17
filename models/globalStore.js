const globalStore = {};

const getGlobalStore = () => globalStore;

const setGlobalStore = (key, value) => {
  globalStore[key] = value;
  return globalStore[key];
};

const clearGlobalStore = () => {
  Object.keys(globalStore).forEach((key) => delete globalStore[key]);
};

module.exports = {
  getGlobalStore,
  setGlobalStore,
  clearGlobalStore,
};
