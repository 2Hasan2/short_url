import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuthActions } from "./context/hooks/useAuthActions";

const App: React.FC = () => {
  const { me } = useAuthActions();
  useEffect(() => {
    me();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Header />
      <main className="container mx-auto h-full">
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
};

export default App;
