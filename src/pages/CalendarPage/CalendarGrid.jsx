import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  format,
  isToday
} from 'date-fns';

export default function CalendarGrid({ currentDate, appointments, onDateClick, onAppointmentClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getAppointmentsForDay = (day) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), day));
  };

  return (
    <div className="calendar-grid">
      {weekDays.map(day => (
        <div key={day} className="week-day">
          {day}
        </div>
      ))}
      
      {days.map(day => {
        const dayAppointments = getAppointmentsForDay(day);
        
        return (
          <div
            key={day.toString()}
            className={`day-cell 
              ${!isSameMonth(day, monthStart) ? 'other-month' : ''}
              ${isToday(day) ? 'today' : ''}
            `}
            onClick={() => onDateClick(day)}
          >
            <div className="day-number">
              {format(day, 'd')}
            </div>
            
            {dayAppointments.map(apt => (
              <div 
                key={apt.id} 
                className="appointment-chip" 
                title={`${apt.time} - ${apt.clientName}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAppointmentClick(apt);
                }}
              >
                {apt.time} {apt.clientName}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
