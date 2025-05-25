// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state

// Define and export the Single component which displays individual item details.
export const Single = () => {
  const { id, type, typeImage } = useParams();  // Obtenemos los parámetros de la URL
  const { store } = useGlobalReducer();
  
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

const singleItem = ;
  
  if (!singleItem) {
    return <div>No se encontró el elemento.</div>;
  }

  const imageUrl = `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${typeImage}/${id}.jpg`;

  const fallbackImage = "https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/placeholder.jpg";

  const handleError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <>
      <div className="p-5 mb-4 bg-body-tertiary rounded-3">
        <div className="row m-2 p-2 text-start border border-danger">
          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <img
              style={{ objectFit: "contain", objectPosition: "center", height: "20rem" }}
              src={imageUrl}
              onError={handleError}
              className="card-img-top"
              alt={`${typeImage}/${id}`}
            />
          </div>
          <div className="col-md-8">
            <h1 className="display-5 fw-bold">{singleItem.result.properties.name}</h1>
            <p className="col fs-4">{singleItem.result.description || "Don't have a description"}</p>
          </div>
        </div>

        {/* Campos con cambios dinámicos */}
        <div className="container">
          <div className="row m-2 p-2 text-center border border-danger">
            {resourceFields[type]?.map(field => {
              const value = singleItem.result.properties[field.key];
              return (
                <div className="col-md-2 d-flex align-items-center justify-content-center" key={field.key}>
                  <p className="mb-0">{field.label}: {value || "N/A"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
Single.propTypes = {
  // Although 'match' prop is defined here, it is not used in the component.
  // Consider removing or using it as needed.
  match: PropTypes.object
};