type SpotUpdateCallback = () => void;

let spotUpdateCallbacks: SpotUpdateCallback[] = [];

export const subscribeToSpotUpdates = (callback: SpotUpdateCallback) => {
  spotUpdateCallbacks.push(callback);
  return () => {
    spotUpdateCallbacks = spotUpdateCallbacks.filter((cb) => cb !== callback);
  };
};

export const notifySpotUpdated = () => {
  spotUpdateCallbacks.forEach((callback) => callback());
};
