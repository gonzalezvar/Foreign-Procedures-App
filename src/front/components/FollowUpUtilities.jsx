import { useState } from "react";
import { motion } from "framer-motion";
import { authenticationServices } from "../services/authenticationServices";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const FollowUpForm = () => {
    const { dispatch } = useGlobalReducer();

    const [followUpData, setFollowUpData] = useState({
        errand_name: "",
        reference_date: "",
        status_type: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFollowUpData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const followUpPost = {
                errand_name: followUpData.errand_name.trim(),
                status_type: followUpData.status_type,
                reference_date:
                    followUpData.status_type === "finalizado"
                        ? followUpData.reference_date
                        : null,
            };

            await authenticationServices.createFollowUp(followUpPost);
            const userData = await authenticationServices.userDataActualization();
            dispatch({ type: "SET_USER_DATA", payload: userData });
        } catch (error) {
            console.error("Error al crear tarea:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                            <option value="finalizado">Finalizado</option>
                        </select>
                    </div>
                    {followUpData.status_type === "finalizado" && (
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
        </form>
    );
};

export const FollowUpMap = () => {
    const { store, dispatch } = useGlobalReducer();
    const followUps = store?.main?.user_data?.follow_up || [];
    const [successMessage, setSuccessMessage] = useState("");

    const handleDelete = async (id) => {
        try {
            await authenticationServices.deleteFollowUp(id);
            const updatedData = await authenticationServices.userDataActualization();
            dispatch({ type: "SET_USER_DATA", payload: updatedData });
            setSuccessMessage("✅ Eliminado correctamente");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al eliminar:", error);
            setSuccessMessage("❌ Error al eliminar");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <>
            {successMessage && (
                <div className="alert alert-success text-center" role="alert">
                    {successMessage}
                </div>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {followUps.map((item) => (
                    <motion.div
                        key={item.follow_up_id}
                        className="col-md-4 mb-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 10 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="card" style={{ width: "100%" }}>
                            <img
                                src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0"
                                className="card-img-top"
                                alt="errand"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.errand_name}</h5>
                                <p className="card-text">{item.status_type}</p>
                                <p className="card-text">
                                    {item.status_type === "Iniciado"
                                        ? `Fecha de iniciación: ${item.reference_date}`
                                        : `Fecha de vencimiento: ${item.reference_date}`}
                                </p>
                                <button
                                    onClick={() => handleDelete(item.follow_up_id)}
                                    className="btn btn-danger btn-sm mt-2"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
};
