import { useAppStore } from "../store";
import { useState } from "react";
import { useUrlActions } from "./useUrlActions";
import api from "../../services/api";
import { AxiosError } from "axios";

export const useAuthActions = () => {
  const { state, dispatch } = useAppStore();
  const { fetchUrls } = useUrlActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const me = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return dispatch({ type: "SET_USER", payload: null });
      }

      const { data } = await api.get("/auth/me");

      dispatch({ type: "SET_USER", payload: data.user });
      if (data.user) await fetchUrls();
      setError(null);
    } catch (e) {
      dispatch({ type: "SET_USER", payload: null });
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to fetch user");
      }
    } finally {
      setLoading(false);
    }
    return { user: state.user, error };
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      dispatch({ type: "SET_USER", payload: null });
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      dispatch({ type: "SET_USER", payload: data.user });
      localStorage.setItem("token", data.token);
      if (data.user) await fetchUrls();
      setError(null);
    } catch (e) {
      dispatch({ type: "SET_USER", payload: null });
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to sign up");
      }
    } finally {
      setLoading(false);
    }
    return { user: state.user, error };
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      dispatch({ type: "SET_USER", payload: null });
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      dispatch({ type: "SET_USER", payload: data.user });
      localStorage.setItem("token", data.token);
      if (data.user) await fetchUrls();
      setError(null);
    } catch (e) {
      dispatch({ type: "SET_USER", payload: null });
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
    return { user: state.user, error };
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      dispatch({ type: "SET_USER", payload: null });
      dispatch({ type: "SET_URLS", payload: [] });
      setError(null);
    } catch (e) {
      setError("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return {
    user: state.user,
    register,
    login,
    logout,
    me,
    loading,
    error,
  };
};
