import { useState, useEffect } from 'react';
import { addMonths, subMonths, format, parseISO, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import CalendarGrid from './CalendarGrid';
import AppointmentModal from './AppointmentModal';
import './CalendarPage.css';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // En una app real, esto vendría de una API o base de datos
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cuando cambian las citas
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Sistema de Notificaciones
  useEffect(() => {
    const checkAppointments = () => {
      const now = new Date();
      
      appointments.forEach(apt => {
        const aptDate = parseISO(`${apt.date}T${apt.time}`);
        const diff = differenceInMinutes(aptDate, now);
        
        // Notificar si faltan 15 minutos o si es la hora exacta (con un margen de 1 min)
        if (diff === 15 || diff === 0) {
          toast.info(`Cita con ${apt.clientName}`, {
            description: `${apt.vehicle} - ${apt.time}`,
            duration: 5000,
            icon: <CalendarIcon size={18} />
          });
        }
      });
    };

    const interval = setInterval(checkAppointments, 60000); // Chequear cada minuto
    return () => clearInterval(interval);
  }, [appointments]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
    toast.success('Cita agendada correctamente');
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="header-actions">
          <button className="nav-btn" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2>
            {format(currentDate, 'MMMM yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
          </h2>
          <button className="nav-btn" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        <button className="add-btn" onClick={() => {
          setSelectedDate(new Date());
          setIsModalOpen(true);
        }}>
          <Plus size={18} />
          Nueva Cita
        </button>
      </div>

      <CalendarGrid 
        currentDate={currentDate}
        appointments={appointments}
        onDateClick={handleDateClick}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        initialDate={selectedDate}
      />
    </div>
  );
}
