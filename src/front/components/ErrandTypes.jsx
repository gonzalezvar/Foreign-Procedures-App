import React, { useState, useEffect } from 'react';
import procedures_categorized from "../assets/img/procedures_categorized.json";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useFavorites } from "../hooks/favoriteReducer";
import { contentServices } from "../services/contentServices";
import { favoritesServices } from "../services/favoritesServices";
import { Link } from 'react-router-dom';

export const ErrandTypes = ({ errands }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const { state: favoritesState, dispatch: favoriteReducer } = useFavorites();
    const { store, dispatch } = useGlobalReducer();
    const userId = store?.main?.user_data?.users_id;

    useEffect(() => {
        contentServices.getErrands(dispatch)
        const storedErrands = localStorage.getItem("errands");
        if (storedErrands) {
            dispatch({
                type: "setData",
                category: "errands",
                data: JSON.parse(storedErrands),
            });
        }
    }, []);

    useEffect(() => {
        const isUserActive = store.main.auth.token;


        if (isUserActive && userId) {
            favoritesServices.getFavorite(dispatch, userId);
        }
    }, [store.user]);

    const errandsFromStore = store.content.errands.data || [];
    const adaptedErrands = errandsFromStore.map(item => ({
        errand_id: item.errand_id,
        category_name: item.errand_type.name || "Sin categoría",
        category_description: item.errand_type.description,
        errand_name: item.name
    }));

    const filteredProcedures = selectedCategory === "Todas"
        ? adaptedErrands
        : adaptedErrands.filter(item => item.category_name === selectedCategory);

    const uniqueCategories = ["Todas", ...new Set(adaptedErrands.map(item => item.category_name))];

    // const userId = userId ? store.main.auth.user_data.users_id : null
    // console.log({userId});



    const handleFavorite = (e, item) => {
        e.stopPropagation();

        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);

        if (isFavorite) {
            // Quitar favorito
            favoritesServices.removeFavorite(favoriteReducer, item.errand_id);
        } else {
            // Agregar favorito

            favoritesServices.addFavorite(favoriteReducer, userId, {
                id: item.errand_id,
                name: item.errand_name,
            });
        }
    };


    return (
        <div className="p-4">
            <h1>Lista de Trámites</h1>
            <div className="mb-3">
                <label htmlFor="category-select" className="form-label">Filtrar por Categoría:</label>
                <select
                    id="category-select"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="row">
                {filteredProcedures.map((item) => {
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
                                    <h5 className="card-title">{item.errand_name}</h5>
                                    <p className="card-text">{item.category_name}</p>
                                    <Link to={`/errands/${item.errand_id}`} className="btn btn-primary">
                                        Ver más
                                    </Link>
                                    {store?.main?.user_data?.users_id && (
                                        <button
                                            className="btn btn-warning"
                                            onClick={(e) => handleFavorite(e, item)}
                                        >
                                            {isFavorite ? "❤️" : "🤍"}
                                        </button>)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
