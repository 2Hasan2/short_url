import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export interface Url {
  _id: string;
  shortUrl: string;
  originalUrl: string;
  userId?: string;
  clicks: number;
  geoData: { country: string; clicks: number }[];
}

// Define the state structure
export type AppState = {
  user: User | null;
  urls: Url[];
};

// Define action types
export type AppAction =
  | { type: "SET_USER"; payload: AppState["user"] }
  | { type: "SET_URLS"; payload: AppState["urls"] }
  | { type: "ADD_URL"; payload: Url }
  | { type: "UPDATE_URL"; payload: Url }
  | { type: "DELETE_URL"; payload: Url };

// Reducer function to manage state transitions
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_URLS":
      return { ...state, urls: action.payload };

    case "ADD_URL":
      return { ...state, urls: [...state.urls, action.payload] };

    case "UPDATE_URL":
      return {
        ...state,
        urls: state.urls.map((url) =>
          url._id === action.payload._id ? action.payload : url
        ),
      };

    case "DELETE_URL":
      return {
        ...state,
        urls: state.urls.filter((url) => url._id !== action.payload._id),
      };

    default:
      return state;
  }
};

// Create a context for the store
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Context provider to wrap the application
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    urls: [],
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the store
// eslint-disable-next-line react-refresh/only-export-components
export const useAppStore = (): {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} => {
  const context = useContext(AppContext)!;
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
};
