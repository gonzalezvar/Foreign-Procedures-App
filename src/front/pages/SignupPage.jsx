import { Signup } from "../components/Signup";

export const SignupPage = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center mb-4 text-success">Crear Cuenta</h3>
                <Signup />
            </div>
        </div>
    );
};
          