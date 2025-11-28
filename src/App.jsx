// App.jsx (Código Modificado)
import { useState } from "react";
import Sidebar, { SECTIONS } from "./components/Sidebar/Sidebar";
import ClientsPage from "./pages/ClientsPage/ClientsPage";
import VehiclesPage from "./pages/VehiclesPage/VehiclesPage";
import WorkordersPage from "./pages/WorkordersPage/WorkordersPage";
import MechanicsPage from "./pages/MechanicsPage/MechanicsPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import AuthPage from "./pages/AuthPage/AuthPage";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") 
  );
  
  // 1. Inicializa la sección según el estado de login
  const [activeSection, setActiveSection] = useState(
    isLoggedIn ? SECTIONS.CLIENTS : SECTIONS.AUTH
  );

  // 2. CREAR FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🗑️ Borra el token
    setIsLoggedIn(false); // 🔄 Actualiza el estado principal
    setActiveSection(SECTIONS.AUTH); // Redirige al login
  };

  const renderContent = () => {
    // Si NO está logueado, esta función no se debería llamar (por el renderizado condicional), 
    // pero si se llamara, simplemente devolvería el contenido normal.
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
      case SECTIONS.AUTH: // Si el usuario va a Auth mientras está logueado (solo ocurre si lo forzamos)
        return <AuthPage onLoginSuccess={() => {}} />;
      default:
        return <p>Selecciona una sección.</p>;
    }
  };

  return (
    <div className="app-layout">
      {isLoggedIn ? (
        <>
          {/* 3. PASAR LAS PROPS NECESARIAS AL SIDEBAR */}
          <Sidebar
            activeSection={activeSection}
            onChangeSection={setActiveSection}
            isAuthenticated={isLoggedIn} // ✅ Le decimos al Sidebar si estamos logueados
            onLogout={handleLogout} // ✅ Le pasamos la función para que la ejecute el botón
          />
          <main className="main-content">{renderContent()}</main>
        </>
      ) : (
        <AuthPage
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setActiveSection(SECTIONS.CLIENTS);
          }}
        />
      )}
    </div>
  );
}

export default App;