import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalStore } from '../store';

const ErrandDetail = () => {
    const { errand_id } = useParams();
    const { store, dispatch } = useGlobalStore();
    const selectedErrand = store.content.selected_errand;

    useEffect(() => {
        const fetchErrandDetail = async () => {
            if (!errand_id)
                return;
            ////////////////////////////////////////////////////////////////////////
            dispatch({ type: "SET_CONTENT_LOADING", payload: true });
            dispatch({ type: "CLEAR_CONTENT_ERROR" });

            try {
                const response = await fetch(`${API_URL}/api/errands/${errand_id}`); // Tu endpoint Flask
                if (!response.ok) {
                    throw new Error(`Error al cargar el trámite: ${response.statusText}`);
                }
                const data = await response.json();
                dispatch({ type: "SET_SELECTED_ERRAND", payload: data }); // Guarda el detalle en el store
            } catch (error) {
                console.error("Error fetching errand detail:", error);
                dispatch({ type: "SET_CONTENT_ERROR", payload: error.message });
            } finally {
                dispatch({ type: "SET_CONTENT_LOADING", payload: false });
            }
        };

        fetchErrandDetail();
    }, [errand_id, selectedErrand, dispatch]); // Dependencias del useEffect

    if (store.content.contentLoading) {
        return <div className="text-center p-4">Cargando información del trámite...</div>;
    }

    if (store.content.contentError) {
        return <div className="text-center p-4 text-red-500">Error: {store.content.contentError}</div>;
    }

    if (!selectedErrand || selectedErrand.id !== parseInt(errand_id)) {
        // Esto puede pasar si el fetch aún no ha terminado y el selectedErrand no coincide
        return <div className="text-center p-4">Trámite no encontrado o cargando...</div>;
    }

    // Una vez que tenemos el trámite, lo mostramos
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{selectedErrand.title}</h1> {/* Asumo 'title' en tu API */}
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4">
                Categoría: {selectedErrand.category} {/* Asumo 'category' en tu API */}
            </span>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Descripción General</h2>
                {/* Aquí podrías renderizar un HTML parseado si 'description' es Markdown/HTML */}
                {/* Usar dangerouslySetInnerHTML con precaución si el contenido viene de fuera sin sanitizar */}
                <p className="text-gray-700 whitespace-pre-wrap">{selectedErrand.procedure}</p> {/* Asumo 'procedure' */}
                {/* O si es solo texto plano, simplemente <p>{selectedErrand.description}</p> */}
            </div>

            {/* Aquí es donde añadirías un botón para iniciar el formulario */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => {
                        // Lógica para iniciar un nuevo seguimiento o navegar al formulario
                        // Podrías dispatchear una acción para crear un nuevo follow_up en el backend
                        // y luego navegar a una ruta de formulario dinámico (ej: /tramite/:errand_id/form/:followUpId)
                        console.log(`Iniciar trámite para: ${selectedErrand.title}`);
                        // Ejemplo:
                        // dispatch({ type: "CREATE_NEW_FOLLOW_UP", payload: { errand_id: selectedErrand.id } });
                        // history.push(`/tramites/${errand_id}/formulario`);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Rellenar Formulario
                </button>
            </div>

            {/* Aquí podrías añadir más secciones del JSON original si las tienes:
      - Requisitos
      - Localización de oficinas
      - Documentación necesaria
      etc.
      */}
        </div>
    );
};

export default ErrandDetail;