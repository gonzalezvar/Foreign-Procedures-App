import { useState } from "react";
import { authenticationServices } from "../services/authenticationServices";
import { TextField } from "@mui/material";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Signup = () => {

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState(
    {
      email: "",
      password: ""
    }
  )
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        email: signUpData.email.trim(),
        password: signUpData.password.trim()
      }
      await authenticationServices.signUp(newUser)
      setSuccessMessage("Haz credo tu cuenta ✅");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 1500);
    }
    catch (error) {
      console.error('Error al agregar usuario:', error);
      setErrorMessage("Error al crear cuenta. Por favor intenta de nuevo ❌");
      setTimeout(() => setErrorMessage(""), 1500);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center mb-4 text-success">Crear Cuenta</h3>
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
          <div className="container">
            <ul className="list-group">
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={signUpData.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                helperText="Ingrese un correo electrónico válido"
              />
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                value={signUpData.password}
                onChange={handleChange}
                fullWidth
                required
                type="password"
              />
              <button type="submit" className="btn btn-primary m-2">Submit</button>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};