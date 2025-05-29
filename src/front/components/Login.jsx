import { useState } from "react";
import { authenticationServices } from "../services/authenticationServices";
import { TextField } from "@mui/material";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";


export const Login = () => {

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = {
        email: loginData.email.trim(),
        password: loginData.password.trim()
      }
      const response = await authenticationServices.login(loginUser);
      dispatch({ type: "LOGIN", payload: { token: response.token, user_data: response.user } });
      navigate("/");
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
          <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
            <h3 className="text-center mb-4 text-primary">Iniciar Sesión</h3>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-1">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 text-end">
              <Link to="/recuperar-contraseña" className="text-decoration-none">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary w-100">Ingresar</button>

            <hr />

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/signup")}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
