// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import { useFavorites } from "../hooks/favoriteReducer";

// Define and export the Single component which displays individual item details.
export const ErrandDetail = () => {
    const { errand_id } = useParams();  // Obtenemos los parámetros de la URL
    const { store, dispatch } = useGlobalReducer();
     const { state: favoritesState, dispatch: favoriteReducer } = useFavorites();
  

    //   const resourceFields = {
    //     errands: [
    //         { label: "Gender", key: "gender" },
    //         { label: "Hair Color", key: "hair_color" },
    //         { label: "Eye Color", key: "eye_color" },
    //         { label: "Skin Color", key: "skin_color" },
    //         { label: "Height", key: "height" },
    //         { label: "Birth Year", key: "birth_year" },
    //     ],
    // };

    // const getLocalStorage = localStorage.getItem("errands");
    const stoOfErrands = store.content.errands.data || [];


const singleErrand = stoOfErrands.find(
    (item) => item.errand_id === parseInt(errand_id)
);

if (!singleErrand) {
    return <div>No se encontró el trámite.</div>;
}

    const indivualErrandData = stoOfErrands.map(item => ({
        errand_id: item.errand_id,
        errand_type_description: item.errand_type.description,
        errand_name: item.name,
        errand_procedures: item.procedures,
        errand_requirements: item.requirements,
    }))



    //   if (!singleItem) {
    //     return <div>No se encontró el elemento.</div>;
    //   }

    //   const imageUrl = `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${typeImage}/${id}.jpg`;

    //   const fallbackImage = "https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/placeholder.jpg";

    //   const handleError = (e) => {
    //     e.target.src = fallbackImage;
    //   };

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