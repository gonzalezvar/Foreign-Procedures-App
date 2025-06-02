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
      
      return newFavoritesState;

    case "removeFavorite":
      const updatedFavorites = state.favorites.filter(
        (fav) => fav.id !== action.payload.id
      );
      const updatedState = {
        ...state,
        favorites: updatedFavorites,
      };
      
      return updatedState;


   case "setFavorites":
      return {
        ...state,
        favorites: action.payload, 
      };


    default:
      return state;
  }
};
