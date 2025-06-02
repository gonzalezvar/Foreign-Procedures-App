import { useState } from "react";
import { authenticationServices } from "../services/authenticationServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [successMessageRecoveryEmail, setSuccessMessageRecoveryEmail] = useState("");
  const [errorMessageRecoveryEmail, setErrorMessageRecoveryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      const loginUser = {
        email: loginData.email.trim(),
        password: loginData.password.trim()
      };
      const response = await authenticationServices.login(loginUser);
      setSuccessMessage("Login correcto ✅");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
        dispatch({ type: "LOGIN", payload: { token: response.token, user_data: response.user } });
      }, 1500);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage("Credenciales inválidas. Por favor intenta de nuevo ❌");
      setTimeout(() => setErrorMessage(""), 1500);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmitRecoveryPaswword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const emailForRecovery = {
        email: email
      };
      const response = await authenticationServices.forgotPassword(emailForRecovery);
      setSuccessMessageRecoveryEmail("Se te enviara un correo para recueprar la contraseña ✅");
      setTimeout(() => {
        setSuccessMessageRecoveryEmail("")
      }, 1500);

    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      setErrorMessageRecoveryEmail("Hay un error, vuelve a intentarlo más tarde ❌")
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}> {/* Log in form */}
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center text-primary mb-2">Bienvenido</h3>
          <p className="text-center text-muted mb-4">Inicia sesión para continuar</p>
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
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              Correo electrónico
            </label>
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
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock me-2 text-secondary"></i>
              Contraseña
            </label>
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
            <Link onClick={handleSubmitRecoveryPaswword} className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            Ingresar
          </button>

          <hr />

          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/signup")}
          >
            ¿No tienes cuenta? Regístrate
          </button>
          <div className="mt-2">
            {successMessageRecoveryEmail && (
              <div className="alert alert-success text-center" role="alert">
                {successMessageRecoveryEmail}
              </div>
            )}
            {errorMessageRecoveryEmail && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMessageRecoveryEmail}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
