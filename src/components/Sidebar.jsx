// src/components/Sidebar.jsx
const SECTIONS = {
  CLIENTS: "clients",
  VEHICLES: "vehicles",
  WORKORDERS: "workorders",
  CALENDAR: "calendar",
  MECHANICS: "mechanics",
  AUTH: "auth",
};

export { SECTIONS };

export default function Sidebar({ activeSection, onChangeSection }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Taller</h1>
      </div>

      <nav className="sidebar-menu">
        <button
          className={
            activeSection === SECTIONS.CLIENTS ? "menu-btn active" : "menu-btn"
          }
          onClick={() => onChangeSection(SECTIONS.CLIENTS)}
        >
          Clientes
        </button>

        <button
          className={
            activeSection === SECTIONS.VEHICLES
              ? "menu-btn active"
              : "menu-btn"
          }
          onClick={() => onChangeSection(SECTIONS.VEHICLES)}
        >
          Vehículos
        </button>

        <button
          className={
            activeSection === SECTIONS.WORKORDERS
              ? "menu-btn active"
              : "menu-btn"
          }
          onClick={() => onChangeSection(SECTIONS.WORKORDERS)}
        >
          Reparaciones
        </button>

        <button
          className={
            activeSection === SECTIONS.CALENDAR
              ? "menu-btn active"
              : "menu-btn"
          }
          onClick={() => onChangeSection(SECTIONS.CALENDAR)}
        >
          Calendario
        </button>

        <button
          className={
            activeSection === SECTIONS.MECHANICS
              ? "menu-btn active"
              : "menu-btn"
          }
          onClick={() => onChangeSection(SECTIONS.MECHANICS)}
        >
          Mecánicos
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          className={
            activeSection === SECTIONS.AUTH
              ? "menu-btn auth-btn active"
              : "menu-btn auth-btn"
          }
          onClick={() => onChangeSection(SECTIONS.AUTH)}
        >
          Iniciar sesión
        </button>
      </div>
    </aside>
  );
}
