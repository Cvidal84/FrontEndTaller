import { useState } from 'react';
import { X } from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose, onSave, initialDate }) {
  const [formData, setFormData] = useState({
    clientName: '',
    vehicle: '',
    date: initialDate ? new Date(initialDate).toISOString().split('T')[0] : '',
    time: '09:00',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nueva Cita</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente</label>
            <input
              required
              className="form-input"
              placeholder="Nombre del cliente"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Vehículo</label>
            <input
              required
              className="form-input"
              placeholder="Marca y Modelo"
              value={formData.vehicle}
              onChange={e => setFormData({...formData, vehicle: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Fecha</label>
              <input
                required
                type="date"
                className="form-input"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input
                required
                type="time"
                className="form-input"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Detalles de la reparación..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
