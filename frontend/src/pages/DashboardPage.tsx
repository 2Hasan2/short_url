import React from "react";
import UrlList from "../components/UrlList";
import { useAuthActions } from "../context/hooks/useAuthActions";

const DashboardPage: React.FC = () => {
  const { user } = useAuthActions();

  if (!user) return <p>Please log in to access the dashboard.</p>;

  return (
    <div>
      <div className="flex justify-evenly py-4">
        <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
      </div>
      <UrlList />
    </div>
  );
};

export default DashboardPage;
