import { Outlet, useLocation } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from 'react';
import { authenticationServices } from "../services/authenticationServices";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { store, dispatch: globalDispatch } = useGlobalReducer();
    const location = useLocation(); // Obtiene el objeto de ubicación actual

    // Este useEffect se ejecutará cada vez que la ubicación (ruta) cambie
    useEffect(() => {
        const fetchUserDataOnNavigation = async () => {
            // Solo intenta actualizar si hay un token (el usuario está logueado)
            if (store.main.auth.token) {
                try {
                    const userData = await authenticationServices.userDataActualization();
                    if (userData) {
                        globalDispatch({ type: "SET_USER_DATA", payload: userData });
                        console.log("Datos de usuario actualizados al navegar:", userData);
                    }
                } catch (error) {
                    console.error("Error al actualizar datos de usuario en navegación:", error);
                    // Opcional: Si el token expira o es inválido, podrías forzar un logout.
                    // if (error.message && error.message.includes("invalid token")) {
                    //     globalDispatch({ type: "LOGOUT" });
                    //     localStorage.removeItem("jwt-token");
                    // }
                }
            }
        };

        fetchUserDataOnNavigation();
    }, [location.pathname, store.main.auth.token, globalDispatch]); // Dependencias: pathname, token y globalDispatch


    return (
        <ScrollToTop>
            <Navbar />
            <div className="min-vh-100">
                <Outlet />
            </div>
            <Footer />
        </ScrollToTop>
    )
}