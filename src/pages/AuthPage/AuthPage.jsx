// src/pages/AuthPage/AuthPage.jsx

import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 💡 Modificamos handleLogin para aceptar el evento del formulario (e)
  const handleLogin = async (e) => {
    // 🛑 CLAVE: Evitar que la página se recargue (comportamiento por defecto del formulario)
    e.preventDefault(); 
    
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Debes completar todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data || "Credenciales incorrectas");
        return;
      }

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Sesión iniciada correctamente ✔");

      // Avisar al padre que el login fue exitoso
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>

      {/* 🔑 CLAVE: Usamos <form> y conectamos handleLogin al evento onSubmit */}
      <form className="auth-form" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          placeholder="usuario@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Añadimos required para mejor UX
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Añadimos required para mejor UX
        />

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        {/* El botón debe ser de tipo submit para funcionar con Enter */}
        <button
          type="submit" // 💡 CLAVE: Cambiar a type="submit"
          className="login-btn"
          // Ya no necesitamos el onClick; onSubmit del formulario lo manejará
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}