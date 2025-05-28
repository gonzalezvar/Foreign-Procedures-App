import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";
import Logo2 from "../assets/img/Logo2.png";

export const Navbar = () => {


	const { store, dispatch } = useGlobalReducer();
	const token = store?.main?.auth?.isAuthenticated;
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
		<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand fw-bold fs-4">
                    <img src={Logo2} alt="Logo página" className="img-fluid" style={{ height: "100px", width: "auto" }} />
                </Link>
				<div className="ms-auto d-flex gap-2">
					{token ?
						(<Link to="/favorites">
							<button className="btn btn-outline-primary">Favorites</button>
						</Link>)
						:
						(null)
					}
					{token ?
						(<Link to="/user_profile">
							<button className="btn btn-outline-primary">Mi perfil</button>
						</Link>)
						:
						(null)
					}
					{token ?
						(<button type="button" className="btn btn-outline-danger" onClick={logOutNavbar}>Logout</button>)
						:
						(<Link to="/login">
							<button className="btn btn-outline-primary">Login</button>
						</Link>)
					}
				</div>
			</div>
		</nav>
	);
};