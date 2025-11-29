import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AppointmentModal({ onClose, onSave, onDelete, initialDate, appointment }) {
  const [formData, setFormData] = useState(() => {
    if (appointment) {
      return {
        clientName: appointment.clientName,
        vehicle: appointment.vehicle,
        date: appointment.date,
        time: appointment.time,
        description: appointment.description || ''
      };
    }
    return {
      clientName: '',
      vehicle: '',
      date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
      time: '09:00',
      description: ''
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{appointment ? 'Editar Cita' : 'Nueva Cita'}</h3>
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

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            {appointment && (
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => {
                  if(window.confirm('¿Estás seguro de que quieres anular esta cita?')) {
                    onDelete();
                  }
                }}
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
                Anular Cita
              </button>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="save-btn">
                {appointment ? 'Guardar Cambios' : 'Guardar Cita'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
