export const initialStore = () => {
  return {
    auth: {
      token: localStorage.getItem("jwt-token") || null,
      isAuthenticated: !!localStorage.getItem("jwt-token"),
    },
    user_data: null, // { users_id: ..., email: ..., favorites: [], follow_up: [] }
    offices: [],
    appLoading: false,
    appError: null,
    // { follow_up_id: ..., users_id: ..., errand_name: ..., status_type: ..., form_data: {} }
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
          follow_up: Array.isArray(store.user_data.follow_up)
            ? [...store.user_data.follow_up, action.payload]
            : [action.payload],
        },
      };

    case "UPDATE_USER_FOLLOW_UP": // Update follow_up on user
      // Add follow_up_id on payload
      if (!store.user_data || !Array.isArray(store.user_data.follow_up))
        return store;
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
          favorites: Array.isArray(store.user_data.favorites)
            ? [...store.user_data.favorites, action.payload]
            : [action.payload],
        },
      };

    case "UPDATE_USER_FAVORITES": // Update favorites on user
      if (!store.user_data || !Array.isArray(store.user_data.favorites))
        return store;
      return {
        ...store,
        user_data: {
          ...store.user_data,
          favorites: store.user_data.favorites.map((fav) =>
            fav.id === action.payload.id ? { ...fav, ...action.payload } : fav
          ),
        },
      };

    case "REMOVE_USER_FAVORITE":
      // Add favorite_id on payload
      if (!store.user_data || !Array.isArray(store.user_data.favorites))
        return store;
      return {
        ...store,
        user_data: {
          ...store.user_data,
          favorites: store.user_data.favorites.filter(
            (fav) => fav.id !== action.payload.id
          ),
        },
      };

    case "SET_SELECTED_USER_FOLLOW_UP":
      return {
        ...store,
        selected_user_follow_up: action.payload,
      };

    case "UPDATE_SELECTED_USER_FOLLOW_UP":
      if (!store.selected_user_follow_up) return store;
      return {
        ...store,
        selected_user_follow_up: {
          ...store.selected_user_follow_up,
          form_data: {
            ...store.selected_user_follow_up.form_data,
            ...action.payload,
          },
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
