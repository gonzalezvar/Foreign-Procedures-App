import { Outlet, useLocation } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from 'react';
import { authenticationServices } from "../services/authenticationServices";
import { contentServices } from "../services/contentServices"
import { motion, useScroll, useSpring } from "motion/react"


export const Layout = () => {
    const { store, dispatch: globalDispatch } = useGlobalReducer();
    const location = useLocation(); 

   
    useEffect(() => {
        const fetchUserDataOnNavigation = async () => {
            
            if (store.main.auth.token) {
                try {
                    const userData = await authenticationServices.userDataActualization();
                    if (userData) {
                        globalDispatch({ type: "SET_USER_DATA", payload: userData });
                    }
                } catch (error) {
                    console.error("Error al actualizar datos de usuario en navegación:", error);
                   
                }
            }
        };

        fetchUserDataOnNavigation();
    }, [location.pathname, store.main.auth.token, globalDispatch]);

    useEffect(() => {
  const localErrands = localStorage.getItem("errands");
  let shouldFetch = true;

  if (localErrands) {
    try {
      const parsed = JSON.parse(localErrands);
      const isExpired = Date.now() - parsed.timestamp > 1000 * 60 * 60; // Indica que se expirará a la hora
      if (!isExpired) {
        globalDispatch({
          type: "setData",
          category: "errands",
          data: parsed.data,
        });
        shouldFetch = false;
      }
    } catch (error) {
      console.error("Error reading errands from storage in layout:", error);
    }
  }

  if (shouldFetch) {
    contentServices.getErrands(globalDispatch);
  }
}, []);

const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001
	});

    return (
        <ScrollToTop>
            <Navbar />
            <div className="min-vh-100">
                <Outlet />
                 <motion.div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "#0d6efd",
                        transformOrigin: "0%",
                        scaleX
                      }}
                    />
            </div>
            <Footer />
        </ScrollToTop>
    )
}