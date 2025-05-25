export const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const contentServices = {
  getErrands: async (dispatch) => {
    dispatch({ type: "setLoading", category: "errands" });
    try {
      const request = await fetch(`${baseUrl}/api/errands`, {
        headers: {
          accept: "application/json",
        },
      });
      const errands = await request.json();
      console.log("API response:", errands);
      console.log(errands);
      dispatch({
        type: "setData",
        category: "errands",
        data: errands, // guardar el arreglo completo
      });

            localStorage.setItem("errands", JSON.stringify(errands));

      return errands;
      
    } catch (error) {}
  },

};
