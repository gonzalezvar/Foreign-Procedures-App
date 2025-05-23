import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const Navbar = () => {


	const { store, dispatch } = useGlobalReducer();
	const token = store.auth.token;
	console.log("Como se ve en store:", token)

	const navigate = useNavigate();


	const logOutNavbar = () => {
		console.log("Token antes de logout:", localStorage.getItem("jwt-token"))
		localStorage.removeItem("jwt-token");
		dispatch({ type: "LOGOUT" });
		navigate("/login");
		console.log("Token después de logout:", localStorage.getItem("jwt-token")); // debe ser null
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				<div className="ml-auto">
					{token ?
						(<Link to="/user_profile">
							<button className="btn btn-primary">Mi perfil</button>
						</Link>)
						:
						(null)
					}
					{token ?
						(<button type="button" className="btn btn-primary" onClick={logOutNavbar}>Logout</button>)
						:
						(<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>)
					}
				</div>
			</div>
		</nav>
	);
};