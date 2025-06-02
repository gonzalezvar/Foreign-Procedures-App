export const initialStoreContent = () => {
  const localErrands = localStorage.getItem("errands");

  let initialData = [];
  let initialLoading = true;

  if (localErrands) {
    try {
      const parsed = JSON.parse(localErrands);
      const isExpired = Date.now() - parsed.timestamp > 1000 * 60 * 60; // 1 hora

      if (!isExpired) {
        initialData = parsed.data;
        initialLoading = false;
      }
    } catch (error) {
      console.error("Error parsing errands from localStorage:", error);
    }
  }

  return {
    errands: {
      data: initialData,
      loading: initialLoading,
    },
  };
};

export default function storeReducerContent(store, action = {}) {
  switch (action.type) {
    case "setLoading":
      return {
        ...store,
        [action.category]: {
          ...store[action.category],
          loading: true,
        },
      };
    case "setData":
      return {
        ...store,
        [action.category]: {
          data: action.data,
          loading: false,
        },
      };
    default:
      return store;
  }
}
