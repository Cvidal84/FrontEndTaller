// src/pages/AuthPage/AuthPage.jsx
import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
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
        // Tu backend suele devolver un string de error
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

      <div className="auth-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="usuario@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <button
          type="button"
          className="login-btn"
          onClick={handleLogin}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
