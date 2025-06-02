import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { favoritesServices } from "../services/favoritesServices";
import { useFavorites } from "../hooks/favoriteReducer";

export const Favorites = () => {
    const { store, dispatch: globalDispatch } = useGlobalReducer();
    const { state: favoritesState, dispatch: favoriteDispatch } = useFavorites();

    const userId = store?.main?.user_data?.users_id;
    const isLoggedIn = !!store?.main?.auth?.token;
    const globalUserFavorites = store?.main?.user_data?.favorites;

    const [notification, setNotification] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            const adaptedFavorites = globalUserFavorites.map(fav => ({
                id: fav.errand.errand_id,
                name: fav.errand.name
            }));
            favoriteDispatch({ type: "setFavorites", payload: adaptedFavorites });
        }
    }, [isLoggedIn, globalUserFavorites, favoriteDispatch]);



    const handleFavorite = (item) => {
        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
        const actionType = isFavorite ? "remove" : "add";


        if (pendingAction?.errandId === item.errand_id) {
            favoriteDispatch({
                type: pendingAction.type === "add" ? "removeFavorite" : "addFavorite",
                payload: { id: item.errand_id, name: item.name }
            });
            setPendingAction(null);
            setNotification("");
            setShowPopup(false);
            return;
        }

        favoriteDispatch({
            type: actionType === "remove" ? "removeFavorite" : "addFavorite",
            payload: { id: item.errand_id, name: item.name }
        });

        setPendingAction({ errandId: item.errand_id, type: actionType });
        setNotification(`"${item.name}" se ${actionType === "remove" ? "eliminará" : "añadirá"} en 3s. Haz clic otra vez para deshacer.`);
        setShowPopup(true);

        setTimeout(async () => {
            if (actionType === "remove") {
                await favoritesServices.removeFavorite(favoriteDispatch, globalDispatch, item.errand_id);
            } else {
                await favoritesServices.addFavorite(favoriteDispatch, globalDispatch, userId, {
                    id: item.errand_id,
                    name: item.name
                });
            }
            setPendingAction(null);
            setNotification("");
            setShowPopup(false);
        }, 3000);
    };


    return (
        <div className="p-4">
            <h1 className="mb-4">Trámites Favoritos</h1>
            <div className="row">
                {globalUserFavorites.length === 0 ? (
                    <p>No tienes trámites favoritos aún.</p>
                ) : (
                    globalUserFavorites.map(({ errand }) => {
                        const isFavorite = favoritesState.favorites.some(fav => fav.id === errand.errand_id);
                        return (
                            <div className="col-md-4 mb-4" key={errand.errand_id}>
                                <div className="card">
                                    <img
                                        src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop"
                                        className="card-img-top"
                                        alt={errand.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{errand.name}</h5>
                                        <Link to={`/errands/${errand.errand_id}`} className="btn btn-primary">
                                            Ver más
                                        </Link>
                                        <button className="btn btn-warning ms-2" onClick={() => handleFavorite(errand)}>
                                            {isFavorite ? "❤️" : "🤍"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showPopup && notification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        zIndex: 1000,
                        fontSize: "1em",
                        textAlign: "center"
                    }}
                >
                    {notification}
                </div>
            )}
        </div>
    );
};