export const contentServices = {
  getErrands: async (dispatch) => {
    dispatch({ type: 'setLoading', category: 'errands' });
    try {

        // hay que congifurar para tarear la informaci{on del local storage para acelarar tiempos de carga y de paso hacer un dispacth desde aqui al store del content
        // const storedData = localStorage.getItem(localStorageKey);
        // if (storedData) {
        // const parsedData = JSON.parse(storedData);

        // dispatch({ type: 'setData', category: 'films', data: parsedData.films });
      const request = await fetch(
        "https://organic-space-robot-wrgw95p9wg9jhx74-3001.app.github.dev/api/errands",

        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const errands = await request.json();
      console.log("API response:", errands);
      console.log(errands);
      dispatch({
        type: 'setData',
        category: 'errands',
        errands: {
          name: errands.map(e => e.title),
          description: errands.map(e => e.procedure),
        },
      });

      return errands;
    } catch (error) {}
  },

  getErrandTypes: async () => {
    try {

        // const storedData = localStorage.getItem(localStorageKey);
        // if (storedData) {
        // const parsedData = JSON.parse(storedData);

        // dispatch({ type: 'setData', category: 'films', data: parsedData.films });
      const request = await fetch(
        "https://organic-space-robot-wrgw95p9wg9jhx74-3001.app.github.dev/api/errand-types",

        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const errandTypes = await request.json();
      console.log("API response:", errandTypes);
      console.log(errandTypes);

      dispatch({
        type: 'setData',
        category: 'errands',
        errands: {
          types: errandTypes,
        },
      });

      return errandTypes;
    } catch (error) {}
  }
}
