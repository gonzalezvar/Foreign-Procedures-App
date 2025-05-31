import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useFavorites } from "../hooks/favoriteReducer";
import Button from '@mui/material/Button';
import { useState } from "react";

export const ErrandDetail = () => {
    const { errand_id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const { state: favoritesState, dispatch: favoriteReducer } = useFavorites();

    const [showProcedures, setShowProcedures] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);

    const stoOfErrands = store.content.errands.data || [];

    const singleErrand = stoOfErrands.find(
        (item) => item.errand_id === parseInt(errand_id)
    );

    if (!singleErrand) {
        return <div>No se encontró el trámite.</div>;
    }

    const handleFavorite = (e, item) => {
        e.stopPropagation();
        const userId = store.main.user_data ? store.main.user_data.users_id : null;
        const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);

        if (isFavorite) {
            favoritesServices.removeFavorite(favoriteReducer, item.errand_id);
        } else {
            favoritesServices.addFavorite(favoriteReducer, userId, {
                id: item.errand_id,
                name: item.errand_name,
            });
        }
    };

    const isFavorite = true;

    return (
        <>
            <style>
                {`
                .limited-height {
                    max-height: 300px;
                    overflow-y: auto;
                }
                `}
            </style>
            <div className="col-md-6 mb-4 mx-auto bg-white mt-5 rounded shadow-sm p-3">
                <img
                    src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="card-img-top rounded"
                    alt="errand"
                    style={{ objectFit: "cover", height: "300px", width: "100%" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                    <div className="rounded mt-2">
                        <h5 className="card-title mx-auto text-center">{singleErrand.name}</h5>
                        <hr />
                        <p className="card-text">
                            <strong>Tipo de trámite:</strong> {singleErrand.errand_type.description}
                        </p>
                        {singleErrand.procedures && (
                            <div className="mb-3">
                                <button
                                    className="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center"
                                    onClick={() => setShowProcedures(!showProcedures)}
                                >
                                    Procedimientos
                                    <span className={`ms-2 transition ${showProcedures ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s' }}>
                                        ▼
                                    </span>
                                </button>
                                {showProcedures && (
                                    <div className="mt-2 border rounded p-2 bg-light overflow-auto" style={{ maxHeight: "300px" }}>
                                        {singleErrand.procedures}
                                    </div>
                                )}
                            </div>
                        )}
                        {singleErrand.requirements && (
                            <div className="mb-3">
                                <h6 className="fw-bold">Requerimientos</h6>
                                <div className="mt-2 border rounded p-2 bg-light overflow-auto" style={{ maxHeight: "300px" }}>
                                    {singleErrand.requirements}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-3 text-end">
                        <Button
                            variant="contained"
                            size="large"
                            style={{ textDecoration: 'none', backgroundColor: 'orange' }}
                            onClick={(e) => handleFavorite(e)}
                        >
                            {isFavorite ? "❤️" : "🤍"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

ErrandDetail.propTypes = {
    match: PropTypes.object
};