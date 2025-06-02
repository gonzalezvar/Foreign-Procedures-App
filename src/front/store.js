
export const initialStore = () => {

  return {
    auth: {
      token: localStorage.getItem("jwt-token") || null,
      isAuthenticated: !!localStorage.getItem("jwt-token"),
    },
    user_data: null, 
    offices: [],
    appLoading: false,
    appError: null,
    
    selected_errand: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("jwt-token", action.payload.token);
      return {
        ...store,
        auth: {
          token: action.payload.token,
          isAuthenticated: true,
        },
        user_data: action.payload.user_data,
      };

    case "LOGOUT":
      localStorage.removeItem("jwt-token");
      return {
        ...store,
        auth: {
          token: null,
          isAuthenticated: false,
        },
        user_data: null,
        selected_errand: null,
      };

    case "SET_USER_DATA": 
      return {
        ...store,
        user_data: {
          ...store.user_data,
          ...action.payload,
        },
      };

    default:
      return store;
  }
}
