import { Link, useParams } from "react-router-dom";  
import PropTypes from "prop-types";  
import useGlobalReducer from "../hooks/useGlobalReducer";  
import { useFavorites } from "../hooks/favoriteReducer";

export const ErrandDetail = () => {
    const { errand_id } = useParams();  
    const { store, dispatch } = useGlobalReducer();
     const { state: favoritesState, dispatch: favoriteReducer } = useFavorites();
  

    // const getLocalStorage = localStorage.getItem("errands");
    const stoOfErrands = store.content.errands.data || [];


const singleErrand = stoOfErrands.find(
    (item) => item.errand_id === parseInt(errand_id)
);

if (!singleErrand) {
    return <div>No se encontró el trámite.</div>;
}

    const isFavorite = favoritesState.favorites.some(fav => fav.id === uid);

     const handleFavorite = (e) => {
        e.stopPropagation();
        favoriteReducer({ type: "toggleFavorite", payload: { id: uid, name } });
    };

    return (
        <>
           <div className="col-md-4 mb-4">
        <div className="card" style={{ width: '100%' }}>
            <img
                src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="errand"
            />
            <div className="card-body">
                <h5 className="card-title">{singleErrand.name}</h5>
                <p className="card-text">Descripción del tipo de trámite{singleErrand.errand_type.description}</p>
                <p className="card-text">Procedimiento{singleErrand.procedures}</p>
                <p className="card-text">Requerimientos:{singleErrand.requirements}</p>
                <button
                    className="btn btn-warning"
                    onClick={(e) => handleFavorite(e)}
                >
                    {isFavorite ? "❤️" : "🤍"}
                </button>
            </div>
        </div>
    </div>
        </>
    );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
ErrandDetail.propTypes = {
    // Although 'match' prop is defined here, it is not used in the component.
    // Consider removing or using it as needed.
    match: PropTypes.object
};