import React, { useState } from "react";
import { useUrlActions } from "../context/hooks/useUrlActions";

interface UrlShortenerProps {
  close: () => void;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ close }) => {
  const { addUrl } = useUrlActions();
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOriginalUrl("");
    setAlias("");
    await addUrl(originalUrl, alias);
    close();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl mb-4">Shorten URL</h1>
      <div className="mb-4">
        <label className="block mb-1">Original URL</label>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Alias (optional)</label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md"
      >
        Shorten
      </button>
    </form>
  );
};

export default UrlShortener;
