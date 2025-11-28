import { useEffect, useState } from "react";
import { getWorkorders } from "../../services/api";

export default function WorkordersPage() {
  const [workorders, setWorkorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const workorders = await getWorkorders();
        setWorkorders(workorders || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error cargando partes de trabajo");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Cargando órdenes de trabajo...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Órdenes de trabajo</h2>
      {workorders.length === 0 && <p>No hay órdenes de trabajo.</p>}
      <ul>
        {workorders.map((wo) => (
          <li key={wo._id}>
            <strong>Cliente:</strong> {wo.clientName} <br />
            <strong>Matrícula:</strong> {wo.vehiclePlate} <br />
            <strong>Estado:</strong> {wo.status} <br />
            <strong>Descripción:</strong> {wo.description} <br />
            <strong>Kms:</strong> {wo.kms ?? "N/D"} <br />
            <strong>Coste estimado:</strong>{" "}
            {wo.estimatedCost ?? "No indicado"} €
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
