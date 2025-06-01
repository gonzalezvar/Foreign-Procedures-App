import React, { useState, useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useFavorites } from "../hooks/favoriteReducer";
import { favoritesServices } from "../services/favoritesServices";
import { Link } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

export const ErrandTypes = ({ errands }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [searchTerm, setSearchTerm] = useState("");

    const { state: favoritesState, dispatch: favoriteDispatch } = useFavorites();
    const { store, dispatch: globalDispatch } = useGlobalReducer();

    const userId = store?.main?.user_data?.users_id;
    const isLoggedIn = !!store?.main?.auth?.token;
    const globalUserFavorites = store?.main?.user_data?.favorites;

    const isLoading = store?.content?.errands?.loading;


   
    useEffect(() => {
        if (isLoggedIn && globalUserFavorites && globalUserFavorites.length > 0) {
           
            const adaptedGlobalFavorites = globalUserFavorites.map(fav => ({
                id: fav.errand.errand_id,
                name: fav.errand.name
            }));
           
            favoriteDispatch({ type: "setFavorites", payload: adaptedGlobalFavorites });

        } else if (!isLoggedIn) {
          
            favoriteDispatch({ type: "setFavorites", payload: [] });
        }
    }, [isLoggedIn, globalUserFavorites, favoriteDispatch]); 


    const errandsFromStore = store.content.errands.data || [];
    const adaptedErrands = errandsFromStore.map(item => ({
        errand_id: item.errand_id,
        category_name: item.errand_type?.name || "Sin categoría", 
        category_description: item.errand_type?.description, 
        errand_name: item.name
    }));

    const filteredProcedures = adaptedErrands.filter(item =>
        (selectedCategory === "Todas" || item.category_name === selectedCategory) &&
        item.errand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uniqueCategories = ["Todas", ...new Set(adaptedErrands.map(item => item.category_name))];

    const handleFavorite = (e, item) => {
        e.stopPropagation();

        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);

        if (isFavorite) {
          
            favoritesServices.removeFavorite(favoriteDispatch, globalDispatch, item.errand_id);
        } else {
           

            favoritesServices.addFavorite(favoriteDispatch, globalDispatch, userId, {
                id: item.errand_id,
                name: item.errand_name,
            });
        }
    };

    return (
        <div className="p-4">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4"> 
                        <div className="input-group rounded-pill border border-2" style={{ borderColor: '#dee2e6' }}> 
                            <span className="input-group-text bg-white border-0 ps-3 rounded-start-pill"> 
                                <i className="bi bi-search text-muted"></i> 
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 pe-3 rounded-end-pill" 
                                placeholder="Buscar trámite..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                        </div>
                    </div>
                    <h1 className="display-5 fw-bold text-primary mb-2"
                        style={{
                            transition: 'transform 0.3s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🛂 Trámites de Extranjería
                    </h1>
                    <p className="lead text-muted">
                        Selecciona una categoría para ver los procedimientos disponibles.
                    </p>
                    <div className="mb-3">
                        <label htmlFor="category-select" className="form-label" >Filtrar por Categoría:</label>
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
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        {filteredProcedures.map((item) => {
                            const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
                            return (
                                <motion.div key={item.errand_id}
                                    className="col-md-4 mb-4"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="card" style={{ width: '100%' }}>
                                        <img
                                            src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            className="card-img-top"
                                            alt="errand"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.errand_name}</h5>
                                            <p className="card-text">{item.category_name}</p>
                                            <CardActions>
                                                <Button variant="contained" size="large">
                                                    <Link style={{ color: 'white', textDecoration: 'none' }} to={`/errands/${item.errand_id}`}>
                                                        Ver más
                                                    </Link>
                                                </Button>
                                                {store?.main?.user_data?.users_id && (
                                                    <Button variant="contained" size="large" style={{ textDecoration: 'none', backgroundColor: 'orange', }} onClick={(e) => handleFavorite(e, item)}>
                                                        {isFavorite ? "❤️" : "🤍"}
                                                    </Button>
                                                )}
                                            </CardActions>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
};


