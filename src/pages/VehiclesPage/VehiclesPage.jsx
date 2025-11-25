import { useEffect, useState } from "react";
import { getVehicles } from "../../services/api";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando vehículos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Vehículos</h2>
      {vehicles.length === 0 && <p>No hay vehículos.</p>}
      <ul>
        {vehicles.map((v) => (
          <li key={v._id}>
            <strong>{v.plate}</strong> — {v.brand} {v.model} — kms:{" "}
            {v.kms ?? "N/D"}
          </li>
        ))}
      </ul>
    </div>
  );
}
