import { useState } from "react";
import { motion } from "framer-motion";
import { authenticationServices } from "../services/authenticationServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Button from '@mui/material/Button';


export const FollowUpForm = () => {
    const { dispatch } = useGlobalReducer();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [followUpData, setFollowUpData] = useState({
        errand_name: "",
        reference_date: "",
        status_type: "",
        description: "",
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
                description: followUpData.description.trim(),
                reference_date:
                    followUpData.status_type === "finalizado"
                        ? followUpData.reference_date
                        : null,
            };
            await authenticationServices.createFollowUp(followUpPost);
            const userData = await authenticationServices.userDataActualization();
            dispatch({ type: "SET_USER_DATA", payload: userData });
            setSuccessMessage("✅ Añadido correctamente");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al crear tarea:", error);
            setErrorMessage("❌ Error al añadir");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    return (
        <>
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
            <form onSubmit={handleSubmit}>
                <div className="container d-flex align-items-center justify-content-center mt-4 mb-4">
                    <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                        <div className="mb-3">
                            <label htmlFor="errand_name" className="form-label">
                                <i className="fas fa-envelope me-2 text-secondary"></i>
                                Nombre del trámite que quieres guardar
                            </label>
                            <input
                                type="text"
                                className="form-control"
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
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                <i className="fas fa-envelope me-2 text-secondary"></i>
                                Description del trámite
                            </label>
                            <textarea
                                type="text"
                                className="form-control"
                                name="description"
                                value={followUpData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
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
                        <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}>
                            Ingresar
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export const FollowUpMap = () => {
    const { store, dispatch } = useGlobalReducer();
    const followUps = store?.main?.user_data?.follow_up || [];

    const [editing, setEditing] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmDeleteMessage, setShowConfirmDeleteMessage] = useState(false);

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

    const [followUpData, setFollowUpData] = useState({
        errand_name: "",
        reference_date: "",
        status_type: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFollowUpData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEdit = async () => {
        setEditing(false)
        try {
            const editTask = {
                id: id,
                errand_name: item.errand_name.trim(),
                reference_date: item.reference_date,
                status_type: item.status_type,
                description: item.description.trim(),
            };
            console.log(editTask.id);

            await authenticationServices.editFollowUp(editTask);
            const updatedData = await authenticationServices.userDataActualization();
            dispatch({ type: "SET_USER_DATA", payload: updatedData });
        } catch (error) {
            console.error('Error al editar la tarea contacto:', error);
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
                        id={item.follow_up_id}
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

                                {editing ? (<div>
                                    <div className="mb-3">
                                        <label htmlFor="errand_name" className="form-label">
                                            <i className="fas fa-envelope me-2 text-secondary"></i>
                                            Nombre del trámite que quieres guardar
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
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
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            <i className="fas fa-envelope me-2 text-secondary"></i>
                                            Description del trámite
                                        </label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={followUpData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
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
                                    <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                                        onClick={() => { { handleEdit, setEditing(false) } }}
                                    >
                                        Save changes
                                    </Button>
                                    <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>) : (
                                    <div>
                                        <p className="card-title fs-4">{item.errand_name}</p>
                                        <p className="card-text fs-5">{item.status_type}</p>
                                        <p className="card-text fs-6">{item.description}</p>
                                        <p className="card-text">
                                            {item.status_type === "Iniciado"
                                                ? `Fecha de iniciación: ${item.reference_date}`
                                                : `Fecha de vencimiento: ${item.reference_date}`}
                                        </p>


                                        {showConfirmDeleteMessage ? (<div className="text-center" role="alert">
                                            <p className="fs-5">¿Estás seguro de eliminar esta tarea?</p>
                                            <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(220,52,68)" }}
                                                onClick={() => { handleDelete(item.follow_up_id), setShowConfirmDeleteMessage(false) }}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                                                onClick={() => setShowConfirmDeleteMessage(false)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>) : (
                                            <div>
                                                <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(220,52,68)" }}
                                                    onClick={() => setShowConfirmDeleteMessage(true)}
                                                >
                                                    Eliminar
                                                </Button>
                                                <Button variant="contained" type="submit" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                                                    onClick={() => setEditing(true)}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
};
