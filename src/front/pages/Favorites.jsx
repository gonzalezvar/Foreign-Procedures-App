import React, { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { favoritesServices } from "../services/favoritesServices";
import { useFavorites } from "../hooks/favoriteReducer";

export const Favorites = () => {
    const { store, dispatch: globalDispatch } = useGlobalReducer();
    const { state: favoritesState, dispatch: favoriteDispatch } = useFavorites();
    const userId = store?.main?.user_data?.users_id;
    const isLoggedIn = !!store?.main?.auth?.token;
    const globalUserFavorites = store?.main?.user_data?.favorites || [];
    const [pendingAction, setPendingAction] = useState(null); // { errandId: id, type: 'add' | 'remove' }
    const DELAY_TIME = 3000; // 3 segundos de retardo
    const [notification, setNotification] = useState(null);
    const timeoutRef = useRef(null); // Usar useRef para almacenar el ID del timeout


    // --- ¡NUEVO useEffect AQUÍ! ---
    useEffect(() => {
        // Solo si el usuario está logueado y hay favoritos en el store global
        if (isLoggedIn && globalUserFavorites.length > 0) {
            // Mapeamos los favoritos a la estructura que espera tu favoriteReducer: { id: errand_id, name: errand_name }
            const adaptedFavorites = globalUserFavorites.map(favWrapper => ({
                id: favWrapper.errand.errand_id,
                name: favWrapper.errand.name,
            }));
            // Despachamos la acción para establecer los favoritos en el estado local del hook
            favoriteDispatch({ type: "setFavorites", payload: adaptedFavorites });
        } else if (!isLoggedIn) {
            // Si el usuario no está logueado, limpiamos los favoritos en el estado local
            favoriteDispatch({ type: "setFavorites", payload: [] });
        }
    }, [isLoggedIn, globalUserFavorites, favoriteDispatch]); // Dependencias del useEffect
    // ----------------------------


    const favoriteErrands = store?.main?.user_data?.favorites || [];

    const handleFavorite = (e, item) => {
        // ... (validaciones) ...

        // Determinar si el favorito está actualmente en la lista local y el tipo de acción
        const isCurrentlyFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
        const actionType = isCurrentlyFavorite ? 'remove' : 'add';

        // 1. Actualizar el estado local (favoriteDispatch) de inmediato para feedback visual
        //    Esto hace que el corazón cambie y el item aparezca/desaparezca de la lista
        if (actionType === 'remove') {
            favoriteDispatch({ type: "removeFavorite", payload: { id: item.errand_id } });
        } else {
            favoriteDispatch({ type: "addFavorite", payload: { id: item.errand_id, name: item.name } });
        }

        // 2. Establecer la acción como pendiente para poder cancelarla y mostrar mensaje
        setPendingAction({ errandId: item.errand_id, type: actionType, previousState: isCurrentlyFavorite });

        // 3. Mostrar mensaje de notificación sobre la acción pendiente
        const pendingMessage = actionType === 'remove'
            ? `"${item.name}" se eliminará en ${DELAY_TIME / 1000}s. Clic de nuevo para deshacer.`
            : `"${item.name}" se añadirá en ${DELAY_TIME / 1000}s. Clic de nuevo para deshacer.`;
        setNotification({ message: pendingMessage, type: "info", dismissable: false });
        // ^^^ Este es el mensaje "Has quitado/añadido" que indica la acción pendiente

        // 4. Guardar el ID del timeout y programar la ejecución real
        timeoutRef.current = setTimeout(() => {
            executeFavoriteAction(actionType, { id: item.errand_id, name: item.name });
            setNotification(null); // Limpiar mensaje de "pendiente" una vez ejecutado
        }, DELAY_TIME);
    };

    // ...

    // En executeFavoriteAction (se llama después del delay)
    const executeFavoriteAction = async (actionType, itemData) => {
        let result;
        if (actionType === 'remove') {
            result = await favoritesServices.removeFavorite(favoriteDispatch, globalDispatch, itemData.id);
        } else if (actionType === 'add') {
            result = await favoritesServices.addFavorite(favoriteDispatch, globalDispatch, userId, itemData);
        }

        // ... (manejo de resultados y setNotification final de confirmación o error) ...
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