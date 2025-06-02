const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const authenticationServices = {
  signUp: async ({ email, password }) => {
    try {
      const request = await fetch(`${baseUrl}/api/user/create`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const response = await request.json();
      if (!request.ok) {
        throw new Error(response.message || "Error al crear cuenta");
      }
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const request = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const response = await request.json();

      if (!request.ok) {
        throw new Error(response.message || "Error al iniciar sesión");
      }
      localStorage.setItem("jwt-token", response.token);
      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  userDataActualization: async () => {
    const token = localStorage.getItem("jwt-token");

    try {
      const resp = await fetch(`${baseUrl}/api/user/actualization`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (resp.status === 403) {
        throw new Error("Missing or invalid token");
      }
      if (!resp.ok) {
        throw new Error("There was a problem in the request");
      }
      const data = await resp.json();
      return data;
    } catch (error) {
      console.error("No se actualizo:", error);
      throw error;
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const resp = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (resp.status === 403) {
        throw new Error("Missing or invalid email");
      }
      if (!resp.ok) {
        throw new Error("There was a problem in the request");
      }
      const data = await resp.json();
      return data;
    } catch (error) {
      console.error(
        "Problema para enviar el correo de recuperar contraseña:",
        error
      );
      throw error;
    }
  },

  createFollowUp: async ({ errand_name, status_type, reference_date }) => {
    const token = localStorage.getItem("jwt-token");

    try {
      const response = await fetch(`${baseUrl}/api/user_follow_ups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          errand_name,
          status_type,
          reference_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear tarea de seguimiento");
      }

      return data;
    } catch (error) {
      console.error("Error al crear seguimiento:", error);
      throw error;
    }
  },
};
