export const initialFavoritesState = () => {

  return {
    favorites: [], 
  };
};

export const favoritesReducer = (state = initialFavoritesState(), action) => {
  switch (action.type) {
    case "addFavorite":
      if (state.favorites.some((fav) => fav.id === action.payload.id)) {
        return state;
      }
      const newFavoritesState = {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
      // localStorage.setItem('favorites', JSON.stringify(newFavoritesState));
      return newFavoritesState;

    case "removeFavorite":
      const updatedFavorites = state.favorites.filter(
        (fav) => fav.id !== action.payload.id
      );
      const updatedState = {
        ...state,
        favorites: updatedFavorites,
      };
      // localStorage.setItem('favorites', JSON.stringify(updatedState));
      return updatedState;

    case "toggleFavorite":
      const exists = state.favorites.some(
        (fav) => fav.id === action.payload.id
      );
      let toggledState;

      if (exists) {
        toggledState = {
          ...state,
          favorites: state.favorites.filter(
            (fav) => fav.id !== action.payload.id
          ),
        };
      } else {
        const newToggleFavorite = {
          ...action.payload,
          uid: action.payload.id, // uid se iguala al id único
        };
        toggledState = {
          ...state,
          favorites: [...state.favorites, newToggleFavorite],
        };
      }

      // localStorage.setItem('favorites', JSON.stringify(toggledState));
      return toggledState;

   case "setFavorites":
      return {
        ...state,
        favorites: action.payload, 
      };


    default:
      return state;
  }
};
