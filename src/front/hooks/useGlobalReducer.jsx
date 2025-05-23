import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";
import storeReducerContent, { initialStoreContent } from './storeContent';

// Combined initial state
const combinedInitialState = {
    main: initialStore(), // Rama para el store principal
    content: initialStoreContent(), // Rama para el storeContent
};

// Combined reducer function
const combinedReducer = (state, action) => {
    return {
        main: storeReducer(state.main, action), // Sub-rama 'main' a storeReducer
        content: storeReducerContent(state.content, action), // Sub-rama 'content' a storeReducerContent
    };
};

export const GlobalStoreContext = createContext();

export const GlobalStoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(combinedReducer, combinedInitialState);

    return (
        <GlobalStoreContext.Provider value={{ store, dispatch }}>
            {children}
        </GlobalStoreContext.Provider>
    );
};

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(GlobalStoreContext)
    return { dispatch, store };
}