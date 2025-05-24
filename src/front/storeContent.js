export const initialStoreContent = () => ({
  errands: [{
    id: null,
    name: "",
    description: "",
    type: {
      type_id: null,
      name: "",
      descriptionErrandType: "",
    },
  }],
  loading: null
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
      return store;
  }
}
