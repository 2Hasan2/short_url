import { useAppStore } from "../store";
import { useState } from "react";
import api from "../../services/api";
import { Url } from "../store";
import { AxiosError } from "axios";

export const useUrlActions = () => {
  const { state, dispatch } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all URLs
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/user/links");
      dispatch({ type: "SET_URLS", payload: data.urls });
      setError(null);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to fetch URLs");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new URL
  const addUrl = async (originalUrl: string, shortUrl: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/shorten", { originalUrl, shortUrl });
      dispatch({ type: "ADD_URL", payload: data.url });
      setError(null);
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to add URL");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update an existing URL
  const updateUrl = async (id: string, newUrl: Url) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/update/${id}`, newUrl);
      dispatch({ type: "UPDATE_URL", payload: data.url });
      setError(null);
      console.log(data.url);

      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to update URL");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a URL
  const deleteUrl = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/delete/${id}`);
      dispatch({ type: "DELETE_URL", payload: { _id: id } as Url });
      setError(null);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.error);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to delete URL");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    urls: state.urls,
    fetchUrls,
    addUrl,
    updateUrl,
    deleteUrl,
    loading,
    error,
  };
};
