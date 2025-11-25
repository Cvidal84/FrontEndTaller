import { useEffect, useState } from "react";
import { getMechanics } from "../../services/api";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMechanics();
        setMechanics(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando mecánicos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Cargando mecánicos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Mecánicos</h2>
      {mechanics.length === 0 && <p>No hay mecánicos.</p>}
      <ul>
        {mechanics.map((m) => (
          <li key={m._id}>
            <strong>{m.name}</strong> — {m.telephone}
          </li>
        ))}
      </ul>
    </div>
  );
}
