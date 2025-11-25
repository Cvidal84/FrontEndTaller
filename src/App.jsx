import { useState } from "react";
import Sidebar, { SECTIONS } from "./components/Sidebar";
import ClientsPage from "./pages/ClientsPage";
import VehiclesPage from "./pages/VehiclesPage";
import WorkordersPage from "./pages/WorkordersPage";
import MechanicsPage from "./pages/MechanicsPage";
import CalendarPage from "./pages/CalendarPage";
import AuthPage from "./pages/AuthPage";   // 👈 ESTE

import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState(SECTIONS.CLIENTS);

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
      case SECTIONS.AUTH:
        return <AuthPage />;      // 👈 AQUÍ
      default:
        return <p>Selecciona una sección.</p>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
