import React, { useState } from 'react';
import procedures_categorized from "../assets/img/procedures_categorized.json";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useFavorites } from "../hooks/favoriteReducer";

export const ErrandTypes = ({ errands }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [searchTerm, setSearchTerm] = useState("");
    const { state: favoritesState, dispatch: favoriteDispatch } = useFavorites();
    const { store, dispatch: globalDispatch } = useGlobalReducer();
    const userId = store?.main?.user_data?.users_id;
    const isLoggedIn = !!store?.main?.auth?.token;
    const globalUserFavorites = store?.main?.user_data?.favorites;


    useEffect(() => {
        contentServices.getErrands(globalDispatch)
        const storedErrands = localStorage.getItem("errands");
        if (storedErrands) {
            globalDispatch({
                type: "setData",
                category: "errands",
                data: JSON.parse(storedErrands),
            });
        }
    }, []);

    // useEffect(() => {
    //     const isUserActive = store.main.auth.token;
    //     if (isUserActive && userId) {
    //         favoritesServices.getFavorite(globalDispatch, userId);
    //     }
    // }, [store.user]);

    // --- EL CAMBIO CLAVE ESTÁ AQUÍ ---
    // useEffect para sincronizar los favoritos del usuario logueado con el estado local de favoritos
    useEffect(() => {
        if (isLoggedIn && globalUserFavorites && globalUserFavorites.length > 0) {
            // Mapea los favoritos del store global al formato que espera tu favoriteReducer
            const adaptedGlobalFavorites = globalUserFavorites.map(fav => ({
                id: fav.errand.errand_id,
                name: fav.errand.name
            }));
            // Despacha la acción SET_FAVORITES (o la que uses para establecer la lista completa)
            // Asegúrate de que tu favoriteReducer tenga un case 'SET_FAVORITES' o 'setFavorites'
            // que reemplace la lista actual por el payload.
            favoriteDispatch({ type: "setFavorites", payload: adaptedGlobalFavorites });

        } else if (!isLoggedIn) {
            // Si el usuario cierra sesión, limpia los favoritos del estado local
            favoriteDispatch({ type: "setFavorites", payload: [] });
        }
    }, [isLoggedIn, globalUserFavorites, favoriteDispatch]); // Depende de isLoggedIn y globalUserFavorites


    const errandsFromStore = store.content.errands.data || [];
    const adaptedErrands = errandsFromStore.map(item => ({
        errand_id: item.errand_id,
        category_name: item.errand_type?.name || "Sin categoría", // Added optional chaining
        category_description: item.errand_type?.description, // Added optional chaining
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
            // Quitar favorito
            favoritesServices.removeFavorite(favoriteDispatch, globalDispatch, item.errand_id);
        } else {
            // Agregar favorito

            favoritesServices.addFavorite(favoriteDispatch, globalDispatch, userId, {
                id: item.errand_id,
                name: item.errand_name,
            });
        }
    };
    const isFavorite = state.favorites.some(fav => fav.id === uid);






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

            {/* Main Content Area */}
            <div className="mb-4"> {/* Added margin-bottom for spacing */}
                <h1 className="display-5 fw-bold text-dark mb-2" // Changed text-primary to text-dark for closer match, adjusted margin-bottom
                    style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // Slightly reduced scale for subtle effect
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <span className="me-2">🛂</span> Trámites de Extranjería
                </h1>

                <p className="lead text-secondary"> {/* Changed text-muted to text-secondary for a slightly different shade */}
                    Selecciona una categoría o busca un trámite por nombre.
                </p>
            </div>

            {/* Filter by Category */}
            <div className="mb-4"> {/* Added margin-bottom for spacing */}
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
            </div>

            {/* Procedures Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4"> {/* Adjusted column layout for better responsiveness */}
                {filteredProcedures.map((item) => {
                    const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
                    return (
                        <motion.div key={item.errand_id}
                            className="col"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 10 }}
                            whileHover={{ scale: 1.03 }} // Slightly reduced scale for subtle effect
                        >
                            <div className="card h-100 shadow-sm rounded-3"> {/* Added shadow and more rounded corners */}
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="card-img-top rounded-top-3" // Rounded top corners for image
                                    alt="errand"
                                    style={{ height: '180px', objectFit: 'cover' }} // Fixed height for images
                                />
                                <div className="card-body d-flex flex-column"> {/* Use flex-column for better vertical alignment */}
                                    <h5 className="card-title fw-bold text-dark">{item.errand_name}</h5> {/* Bold title */}
                                    <p className="card-text text-muted flex-grow-1">{item.category_name}</p> {/* Flex-grow to push actions to bottom */}
                                    <CardActions className="mt-auto"> {/* mt-auto to push actions to the bottom of the card body */}
                                        <Button variant="contained" size="large" className="bg-primary text-white me-2"> {/* Bootstrap primary color */}
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to={`/errands/${item.errand_id}`}>
                                                Ver más
                                            </Link>
                                        </Button>
                                        {userId && (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                style={{ backgroundColor: 'orange' }}
                                                onClick={(e) => handleFavorite(e, item)}
                                            >
                                                {isFavorite ? "❤️" : "🤍"}
                                            </Button>
                                        )}
                                    </CardActions>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};


/*<Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          );
        }*/