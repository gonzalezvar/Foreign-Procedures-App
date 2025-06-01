// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useEffect, useState } from 'react';
import { authenticationServices } from "../services/authenticationServices";
import { Button } from "@mui/material";

export const MiPerfil = () => {

  const { store, dispatch } = useGlobalReducer()

  const userID = store?.main?.user_data?.users_id;
  const email = store?.main?.user_data?.email;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const emailForRecovery = {
        email: email
      };
      const response = await authenticationServices.forgotPassword(emailForRecovery);
      setSuccessMessage("Se te enviara un correo para recueprar la contraseña ✅");
      setTimeout(() => {
        setSuccessMessage("")
      }, 1500);

    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      setErrorMessage("Hay un error, vuelve a intentarlo más tarde ❌")
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center text-primary mb-2">Datos</h3>
          {userID ?
            (<>
              <p className="text-center fs-5 text-secondary mb-4">
                Correo: {email}
              </p>
              <Button className="mb-2" variant="contained" size="large" onClick={handleSubmit}>
                Cambiar contaseña
              </Button>
              {successMessage && (
                <div className="alert alert-success text-center" role="alert">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger text-center" role="alert">
                  {errorMessage}
                </div>
              )}
            </>)
            :
            (<p>Debes loguearte</p>)
          }
          <Button variant="contained" size="large">
            <Link style={{ color: 'white', textDecoration: 'none' }} to="/">
              Back home
            </Link>
          </Button>
        </div>
      </div>
    </div >
  );
};
