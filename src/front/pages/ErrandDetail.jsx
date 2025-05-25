import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalReducer } from '../store';
import { API_URL } from '../config';

export const ErrandDetail = () => {
    const { errand_id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const selectedErrand = store.content.selected_errand;
    const contentLoading = store.content.contentLoading;
    const contentError = store.content.contentError;

    useEffect(() => {
        const fetchErrandDetail = async () => {
            if (!errand_id)
                return;

            if (selectedErrand && selectedErrand.id === parseInt(errand_id)) {
                return;
            }

            dispatch({ type: "SET_CONTENT_LOADING", payload: true });
            dispatch({ type: "CLEAR_APP_ERROR" });

            try {
                const response = await fetch(`${API_URL}/api/errands/${errand_id}`);
                if (!response.ok) {
                    throw new Error(`Error al cargar el trámite: ${response.statusText}`);
                }
                const data = await response.json();
                dispatch({ type: "SET_SELECTED_ERRAND", payload: data });
            } catch (error) {
                console.error("Error fetching errand detail:", error);
                dispatch({ type: "SET_CONTENT_ERROR", payload: error.message });
            } finally {
                dispatch({ type: "SET_CONTENT_LOADING", payload: false });
            }
        };

        fetchErrandDetail();
    }, [errand_id, selectedErrand, dispatch]);

    if (contentLoading) {
        return <div className="text-center p-4">Cargando información del trámite...</div>;
    }

    if (contentError) {
        return <div className="text-center p-4 text-red-500">Error: {contentError}</div>;
    }

    if (!selectedErrand || selectedErrand.id !== parseInt(errand_id)) {
        // Esto puede pasar si el fetch aún no ha terminado y el selectedErrand no coincide
        return <div className="text-center p-4">Trámite no encontrado o cargando...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{selectedErrand.title}</h1>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4">
                Categoría: {selectedErrand.category}
            </span>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Descripción General</h2>
                {/* parsed description */}
                <p className="text-gray-700 whitespace-pre-wrap">{selectedErrand.procedure}</p>
            </div>

            {/* Start form button */}
            <div className="mt-8 text-center">
                <button
                    onClick={async () => {
                        console.log(`Iniciar trámite para: ${selectedErrand.title}`);
                        if (!store.auth.isAuthenticated) {
                            alert("Debes iniciar sesión para rellenar un formulario.");
                            // navigate("/login");
                            return;
                        }
                        if (!store.user_data.users_id) {
                            alert("No se pudo obtener la información del usuario logueado.");
                            return;
                        }
                        if (!selectedErrand.errand_id) {
                            alert("No se pudo obtener la información del trámite.");
                            return;
                        }
                        //Podría mostrarse una pagina de Loading
                        dispatch({ type: "SET_APP_LOADING", payload: true });
                        dispatch({ type: "CLEAR_APP_ERROR" });

                        try {
                            const response = await fetch(`${API_URL}/api/user_follow_ups`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${store.auth.token}`
                                },
                                body: JSON.stringify({
                                    user_id: store.user_data.users_id,
                                    errand_name: selectedErrand.name, //name o id?
                                    status_type: "started",
                                    expiration_date: new Date().toISOString(),
                                })
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || `Error al iniciar el trámite: ${response.statusText}`);
                            }

                            const newFollowUp = await response.json();

                            dispatch({ type: "ADD_USER_FOLLOW_UP", payload: newFollowUp });
                            // Select to edit
                            dispatch({ type: "SET_SELECTED_USER_FOLLOW_UP", payload: newFollowUp });
                            // Redirect to the form page
                            //navigate(`user/follow_up/${newFollowUp.follow_up_id}/form`);

                        } catch (error) {
                            console.error("Error al iniciar el formulario del trámite:", error);
                            dispatch({ type: "SET_APP_ERROR", payload: error.message });
                        } finally {
                            dispatch({ type: "SET_APP_LOADING", payload: false });
                        }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Rellenar Formulario
                </button>
            </div>
            {/* Añadir requirements, offices, etc. */}
        </div>
    );
};