import { baseUrl } from "./contentServices";
import { authenticationServices } from "./authenticationServices";

export const favoritesServices = {
  // getFavorite: async (dispatch, userId) => {
  //   try {
  //     const request = await fetch(`${baseUrl}/api/user/${userId}`, {
  //       headers: {
  //         accept: "application/json",
  //       },
  //     });
  //     const favorites = await request.json();
  //     console.log("API response:", favorites);
  //     console.log(favorites);
  //     const allFavorites = favorites.map((fav) => ({
  //       id: fav.errand.errand_id,
  //       name: fav.errand.name,
  //     }));
  //     dispatch({ type: "setFavorites", payload: allFavorites });

  //     // localStorage.setItem("favorites", JSON.stringify(errands));

  //     return allFavorites;
  //   } catch (error) {}
  // },

  addFavorite: async (favoriteDispatch, globalDispatch, userId, errand) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite/errand/${errand.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users_id: userId }),
      });

      const data = await res.json(); // <-- Aquí defines 'data'

      if (res.ok) {
        favoriteDispatch({ type: "addFavorite", payload: errand });
        const updatedUserData =
          await authenticationServices.userDataActualization();
        if (updatedUserData) {
          globalDispatch({ type: "SET_USER_DATA", payload: updatedUserData });
        }
      } else {
        console.error("Error response from backend:", data);
      }
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  },

  removeFavorite: async (favoriteDispatch, globalDispatch, errandId) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite/errand/${errandId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        favoriteDispatch({ type: "removeFavorite", payload: { id: errandId } });
        const updatedUserData =
          await authenticationServices.userDataActualization();
        if (updatedUserData) {
          globalDispatch({ type: "SET_USER_DATA", payload: updatedUserData });
        }
      }
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  },

  addFavoriteWithoutActualization: async (
    favoriteDispatch,
    globalDispatch,
    userId,
    errand
  ) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite/errand/${errand.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users_id: userId }),
      });

      const data = await res.json(); // <-- Aquí defines 'data'

      if (res.ok) {
        favoriteDispatch({ type: "addFavorite", payload: errand });
        // globalDispatch({ type: "SET_USER_DATA", payload: updatedUserData });
      } else {
        console.error("Error response from backend:", data);
      }
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  },

  removeFavoriteWithoutActualization: async (
    favoriteDispatch,
    globalDispatch,
    errandId
  ) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite/errand/${errandId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        favoriteDispatch({ type: "removeFavorite", payload: { id: errandId } });
        // globalDispatch({ type: "SET_USER_DATA", payload: updatedUserData });
      }
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  },
};
