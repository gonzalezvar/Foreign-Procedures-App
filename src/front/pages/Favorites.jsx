import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { favoritesServices } from "../services/favoritesServices";
import { useFavorites } from "../hooks/favoriteReducer";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const { state: favoritesState, dispatch: favoriteDispatch } = useFavorites();
    const userId = store?.main?.user_data?.users_id;

    const favoriteErrands = store?.main?.user_data?.favorites || [];

    const handleFavorite = (e, item) => {
        e.stopPropagation();
        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);

        if (isFavorite) {
            favoritesServices.removeFavorite(favoriteDispatch, item.errand_id);
        } else {
            favoritesServices.addFavorite(favoriteDispatch, userId, {
                id: item.errand_id,
                name: item.name,
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="mb-4">Trámites Favoritos</h1>
            <div className="row">
                {favoriteErrands.length === 0 ? (
                    <p>No tienes trámites favoritos aún.</p>
                ) : (
                    favoriteErrands.map((favWrapper) => {
                        const item = favWrapper.errand;
                        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);

                        return (
                            <div className="col-md-4 mb-4" key={item.errand_id}>
                                <div className="card" style={{ width: '100%' }}>
                                    <img
                                        src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        className="card-img-top"
                                        alt="errand"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <Link to={`/errands/${item.errand_id}`} className="btn btn-primary">
                                            Ver más
                                        </Link>
                                        <button
                                            className="btn btn-warning ms-2"
                                            onClick={(e) => handleFavorite(e, item)}
                                        >
                                            {isFavorite ? "❤️" : "🤍"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};