import { useState } from "react";
import { authenticationServices } from "../services/authenticationServices";
import { TextField } from "@mui/material";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


export const Login = () => {

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();


  const [loginData, setLoginData] = useState(
    {
      email: "",
      password: ""
    }
  )

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
      const response = await authenticationServices.login(loginUser)
      dispatch({ type: "LOGIN", payload: { token: response.token, user_data: response.user } });
      navigate("/");
    }
    catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <ul className="list-group">
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={loginData.email}
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
              value={loginData.password}
              onChange={handleChange}
              fullWidth
              required
              type="password"
            />
            <button type="submit" className="btn btn-primary m-2">Login</button>
          </ul>
        </div>
      </form>
      <div>
        <button type="button" className="btn btn-primary m-2" onClick={() => navigate("/signup")}>Don't have an user? Signup here</button>
      </div>
    </>
  );
};