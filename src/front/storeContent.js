export const initialStoreContent = () => ({
  errands: {
    name: [],
    description: [],
    types: [
      {
        name: "",
        descriptionErrandType: "",
      },
    ],
    loading: true,
  },
});

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
          ...store[action.category],
          ...action.errands,
          loading: false,
        },
      };
    default:
      throw new Error("Unknown action.");
  }
}
