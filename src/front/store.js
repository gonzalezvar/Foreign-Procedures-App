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
      // action.payload = { token: "...", user_data: { id: 1, email: "...", favorites: [], follow_up: [...] } }
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

    case "SET_USER_DATA": // To set or update
      return {
        ...store,
        user_data: {
          ...store.user_data,
          ...action.payload,
        },
      };

    case "ADD_USER_FOLLOW_UP": // Add new follow_up to user
      if (!store.user_data) return store;
      return {
        ...store,
        user_data: {
          ...store.user_data,
          follow_up: [...store.user_data.follow_up, action.payload],
        },
      };

    case "UPDATE_USER_FOLLOW_UP": // Update follow_up on user
      if (!store.user_data.follow_up) return store;
      return {
        ...store,
        user_data: {
          ...store.user_data,
          follow_up: store.user_data.follow_up.map((fu) =>
            fu.id === action.payload.id ? { ...fu, ...action.payload } : fu
          ),
        },
      };

    case "ADD_USER_FAVORITE": // Add new favorite to user
      if (!store.user_data) return store;
      return {
        ...store,
        user_data: {
          ...store.user_data,
          favorites: [...store.user_data.favorites, action.payload],
        },
      };

    case "SET_OFFICES":
      return { ...store, offices: action.payload };

    case "SET_APP_LOADING":
      return { ...store, appLoading: action.payload };

    case "SET_APP_ERROR":
      return { ...store, appError: action.payload, appLoading: false };

    case "CLEAR_APP_ERROR":
      return { ...store, appError: null };

    default:
      return store;
  }
}
