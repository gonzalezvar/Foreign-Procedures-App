export const initialStoreContent = () => ({
errands: {
      data: [],  
      loading: false,
    },
  })

export default function storeReducerContent(store, action = {}) {
  switch (action.type) {
        case 'setLoading':
      return {
        ...store,
        [action.category]: {
          ...store[action.category],
          loading: true,
        },
      };
    case 'setData':
      return {
        ...store,
        [action.category]: {
          data: action.data,
          loading: false,
        },
      };
 default:
      return store;
  }
}

// export const initialStoreContent = () => ({
//   errands: [],
//   selectedErrand: null,
//   contentLoading: false,
//   contentError: null,
// });

// export default function storeReducerContent(store, action = {}) {
//   switch (action.type) {
//     case "SET_CONTENT_LOADING":
//       return {
//         ...store,
//         contentLoading: action.payload,
//         contentError: null,
//       };

//     case "SET_CONTENT_ERROR":
//       return {
//         ...store,
//         contentError: action.payload,
//         contentLoading: false,
//       };

//     case "CLEAR_CONTENT_ERROR":
//         return {
//             ...store,
//             contentError: null
//         };

//     case "SET_ALL_ERRANDS":
//       return {
//         ...store,
//         errands: action.payload, // payload: array of errands
//         contentLoading: false,
//       };

//     case "SET_SELECTED_ERRAND":
//       return {
//         ...store,
//         selectedErrand: action.payload, // payload: single errand object
//         contentLoading: false,
//       };

//     default:
//       return store;
//   }
// }