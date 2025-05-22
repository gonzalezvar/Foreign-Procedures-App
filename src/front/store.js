export const initialStore = () => {
  return {
    auth: {
      token: localStorage.getItem("jwt-token") || null,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type)  {
    case "LOGIN":
      return {
        ...store,
        auth: {
          ...store.auth,
          token: action.payload.token,
        }
      };
    case "LOGOUT":
      return {
        ...store,
        auth: {
          token: null,
        }
      };
    
    default:
      throw Error("Unknown action.");
  }
}
