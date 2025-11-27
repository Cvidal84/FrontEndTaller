import { useState } from "react";
import Sidebar, { SECTIONS } from "./components/Sidebar";
import ClientsPage from "./pages/ClientsPage/ClientsPage";
import VehiclesPage from "./pages/VehiclesPage/VehiclesPage";
import WorkordersPage from "./pages/WorkordersPage/WorkordersPage";
import MechanicsPage from "./pages/MechanicsPage/MechanicsPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import AuthPage from "./pages/AuthPage/AuthPage";

import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS.CLIENTS);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // 👈 si hay token, arranca logeado
  );

  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.CLIENTS:
        return <ClientsPage />;
      case SECTIONS.VEHICLES:
        return <VehiclesPage />;
      case SECTIONS.WORKORDERS:
        return <WorkordersPage />;
      case SECTIONS.MECHANICS:
        return <MechanicsPage />;
      case SECTIONS.CALENDAR:
        return <CalendarPage />;
      default:
        return <p>Selecciona una sección.</p>;
    }
  };

  return (
    <div className="app-layout">
      {isLoggedIn ? (
        <>
          <Sidebar
            activeSection={activeSection}
            onChangeSection={setActiveSection}
          />
          <main className="main-content">{renderContent()}</main>
        </>
      ) : (
        <AuthPage
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setActiveSection(SECTIONS.CLIENTS); // 👈 al logear, abre Clientes
          }}
        />
      )}
    </div>
  );
}

export default App;
