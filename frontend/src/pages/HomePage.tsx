import React, { useState } from "react";
import UrlShortener from "../components/UrlShortener";
import UrlList from "../components/UrlList";
import { useAuthActions } from "../context/hooks/useAuthActions";

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthActions();
  if (!user)
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to access the dashboard.</p>
      </div>
    );

  return (
    <div className="container mx-auto">
      <UrlList />

      <div className="p-4 justify-center flex">
        {isOpen ? (
          <UrlShortener
            close={() => {
              setIsOpen(false);
            }}
          />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Add URL
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
