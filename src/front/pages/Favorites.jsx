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
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const popupTimeoutRef = useRef(null); // Nuevo ref para el timeout del popup
    const [popupErrandId, setPopupErrandId] = useState(null);




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
        // ... (validaciones - asegúrate de que existen y funcionan aquí) ...

        // Limpiar cualquier timeout de popup anterior si se hace clic muy rápido
        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current);
        }
        // Limpiar cualquier timeout de acción pendiente anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            setNotification(null); // Limpiar la notificación anterior
            // Opcional: Revertir la acción local si el usuario clica para deshacer antes del delay
            // Aquí deberías añadir lógica para revertir pendingAction si el item clickeado es el mismo
            // que estaba pendiente y se está clicando para deshacer.
            if (pendingAction && pendingAction.errandId === item.errand_id) {
                // Si la acción pendiente era añadir, ahora se está quitando (localmente)
                // Si la acción pendiente era quitar, ahora se está añadiendo (localmente)
                // Revertimos la acción local para que el corazón refleje el estado real
                if (pendingAction.type === 'add') {
                    favoriteDispatch({ type: "removeFavorite", payload: { id: item.errand_id } });
                } else {
                    favoriteDispatch({ type: "addFavorite", payload: { id: item.errand_id, name: item.name } });
                }
                setPendingAction(null); // La acción se ha deshecho
                return; // Salir, no programar nueva acción para este click
            }
        }


        const isCurrentlyFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
        const actionType = isCurrentlyFavorite ? 'remove' : 'add';

        // 1. Actualizar el estado local (favoriteDispatch) de inmediato para feedback visual
        if (actionType === 'remove') {
            favoriteDispatch({ type: "removeFavorite", payload: { id: item.errand_id } });
        } else {
            favoriteDispatch({ type: "addFavorite", payload: { id: item.errand_id, name: item.name } });
        }

        // 2. Establecer la acción como pendiente para poder cancelarla y mostrar mensaje
        setPendingAction({ errandId: item.errand_id, type: actionType, previousState: isCurrentlyFavorite });

        // 3. Mostrar mensaje de notificación sobre la acción pendiente (la que se puede deshacer)
        const pendingMessage = actionType === 'remove'
            ? `"${item.name}" se eliminará en ${DELAY_TIME / 1000}s. Clic de nuevo para deshacer.`
            : `"${item.name}" se añadirá en ${DELAY_TIME / 1000}s. Clic de nuevo para deshacer.`;
        setNotification({ message: pendingMessage, type: "info", dismissable: false });


        // 4. PROGRAMAR LA ACCIÓN REAL DESPUÉS DEL RETRASO (DELAY_TIME)
        timeoutRef.current = setTimeout(() => {
            executeFavoriteAction(actionType, { id: item.errand_id, name: item.name });
            setNotification(null); // Limpiar mensaje de "pendiente" una vez ejecutado
            setPendingAction(null); // Limpiar la acción pendiente
        }, DELAY_TIME);


        // === LÓGICA DEL POPUP DE "DECISIÓN PERMANENTE" ===
        // Este popup debe aparecer INMEDIATAMENTE y desaparecer a los 3 segundos.
        const permanentMessage = actionType === 'remove'
            ? "La decisión de eliminar/añadir favoritos se hará permanente en 2 segundos." // Mensaje para cuando se quita
            : "La decisión de eliminar/añadir favoritos se hará permanente en 2 segundos."; // Mensaje para cuando se añade

        setPopupMessage(permanentMessage);
        setPopupErrandId(item.errand_id); // Asociar el popup al ítem
        setShowPopup(true); // Muestra el popup

        // Oculta el popup después de 3 segundos (su propio temporizador)
        popupTimeoutRef.current = setTimeout(() => {
            setShowPopup(false);
            setPopupMessage("");  // Limpiar el mensaje después de ocultar
            setPopupErrandId(null);
        }, 3000); // 3000 milisegundos = 3 segundos

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
                                        {/* Ventana emergente (Popup/Toast) */}
                                        {showPopup && popupErrandId === item.errand_id && (
                                            <div
                                                style={{ // Estilos básicos para el popup. Considera usar CSS modules o clases.
                                                    position: 'fixed',
                                                    bottom: '20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    borderRadius: '5px',
                                                    zIndex: '1000', // Asegura que esté por encima de otros elementos
                                                    textAlign: 'center',
                                                    fontSize: '1em',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {popupMessage}
                                            </div>
                                        )}
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