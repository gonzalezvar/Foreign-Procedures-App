import { useState } from "react";
import { FollowUpForm, FollowUpMap } from "../components/FollowUpUtilities";
import { Button } from "react-bootstrap";


export const FollowUp = () => {
    const [showForm, setShowForm] = useState(true);
    const [showMap, setShowMap] = useState(true);

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">🗂️ Gestión de Trámites</h1>

            <div className="mb-3 text-center">
                <Button variant="contained" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Ocultar formulario" : "Mostrar formulario"}
                </Button>

                <Button variant="contained" className="m-2" size="large" style={{ color: "white", textDecoration: 'none', backgroundColor: "rgb(25, 118, 210)" }}
                    onClick={() => setShowMap(!showMap)}
                >
                    {showMap ? "Ocultar seguimientos" : "Mostrar seguimientos"}
                </Button>
            </div>
            {showForm && (
                <div className="mb-5">
                    <FollowUpForm />
                </div>
            )}
            {showMap && (
                <div>
                    <FollowUpMap />
                </div>
            )}
        </div>
    );
};