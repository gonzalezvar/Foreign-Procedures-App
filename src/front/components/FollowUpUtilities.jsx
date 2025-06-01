import { useState } from "react";
import { authenticationServices } from "../services/authenticationServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { motion } from "framer-motion";

export const FollowUpForm = () => {

    const { store, dispatch } = useGlobalReducer();

    const [followUpData, setFollowUpData] = useState({
        errand_name: "",
        reference_date: "",
        status_type: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFollowUpData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const followUpPost = {
                errand_name: followUpData.errand_name.trim(),
                status_type: followUpData.status_type,
                reference_date:
                    followUpData.status_type === "Finalizado"
                        ? followUpData.reference_date
                        : null
            };
            const userData = await authenticationServices.userDataActualization();
            dispatch({ type: "SET_USER_DATA", payload: userData });
        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}> {/*Follow up form*/}
            <div className="container d-flex align-items-center justify-content-center mt-4 mb-4">
                <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">
                            <i className="fas fa-envelope me-2 text-secondary"></i>
                            Nombre del trámite que quieres guardar
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="errand_name"
                            name="errand_name"
                            value={followUpData.errand_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Estado del trámite</label>
                        <select
                            className="form-select"
                            name="status_type"
                            value={followUpData.status_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar estado</option>
                            <option value="Iniciado">Iniciado</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>
                    {/* Show expiration date only if status is "finalizado" */}
                    {followUpData.status_type === "Finalizado" && (
                        <div className="mb-3">
                            <label className="form-label">Fecha de vencimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="reference_date"
                                value={followUpData.reference_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Ingresar
                    </button>
                </div>
            </div>
        </form >
    );
};

export const FollowUpMap = () => {
    const { store, _ } = useGlobalReducer();
    const startRouteStoreForFollowUpErrands = store?.main?.user_data?.follow_up
    console.log(startRouteStoreForFollowUpErrands);

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4"> {/* Follow up errands map */}
            {startRouteStoreForFollowUpErrands.map((item) => (
                // Using Framer Motion for animations
                <motion.div key={item.follow_up_id}
                    id={item.follow_up_id}
                    className="col-md-4 mb-4"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="card" style={{ width: '100%' }}> {/* Card for each errand */}
                        <img
                            src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            className="card-img-top"
                            alt="errand"
                        />
                        <div className="card-body"> { }
                            <h5 className="card-title">{item.errand_name}</h5>
                            <p className="card-text">{item.status_type}</p>
                            {item.status_type === "Iniciado" ? (<p className="card-text">Fecha de iniciación: {item.reference_date}</p>) : (<p className="card-text">Fecha de vencimiento: {item.reference_date}</p>)}
                        </div>
                    </div>
                </motion.div>
            ))
            }
        </div>
    );
};