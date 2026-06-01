import { useState } from 'react'
import './Calendar.css'

function Calendar({ transactions, onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getAllTransactionDatesForMonth = (year, month) => {
    const dates = new Set()
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)

    transactions.forEach(t => {
      if (t.isRecurring) {
        let currentDate = new Date(t.date)
        while (currentDate <= monthEnd) {
          if (currentDate >= monthStart) {
            dates.add(currentDate.toISOString().split('T')[0])
          }
          if (t.frequency === 'monthly') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
          } else if (t.frequency === 'biweekly') {
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
          }
          if (t.endDate && currentDate > new Date(t.endDate)) break
        }
      } else {
        const tDate = new Date(t.date)
        if (tDate >= monthStart && tDate <= monthEnd) {
          dates.add(t.date)
        }
      }
    })

    return dates
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const prevLastDay = new Date(year, month, 0)
    
    const firstDayOfWeek = firstDay.getDay()
    const lastDateOfMonth = lastDay.getDate()
    const prevLastDate = prevLastDay.getDate()
    
    const transactionDates = getAllTransactionDatesForMonth(year, month)
    
    let days = []
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevLastDate - i, otherMonth: true })
    }
    
    const today = new Date()
    for (let day = 1; day <= lastDateOfMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasTransaction = transactionDates.has(dateStr)
      const isToday = today.getFullYear() === year && 
                      today.getMonth() === month && 
                      today.getDate() === day
      
      days.push({ day, hasTransaction, isToday, otherMonth: false, dateStr })
    }
    
    const totalDays = firstDayOfWeek + lastDateOfMonth
    const remainingDays = 42 - totalDays
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, otherMonth: true })
    }
    
    return { monthTitle: `${monthNames[month]} ${year}`, days }
  }

  const { monthTitle, days } = renderCalendar()

  const handleDayClick = (d) => {
    if (!d.otherMonth && d.dateStr && onDayClick) {
      onDayClick(d.dateStr)
    }
  }

  return (
    <div className="calendar-section">
      <div className="calendar-header-section">
        <h2>📅 Calendario</h2>
        <p className="calendar-hint">Haz clic en un día para agregar una transacción</p>
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            ←
          </button>
          <h3>{monthTitle}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            →
          </button>
        </div>
        <div className="calendar-weekdays">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>
        <div className="calendar-days">
          {days.map((d, i) => (
            <div 
              key={i} 
              className={`calendar-day ${d.otherMonth ? 'other-month' : ''} ${d.isToday ? 'today' : ''} ${d.hasTransaction ? 'has-transaction' : ''} ${!d.otherMonth ? 'clickable' : ''}`}
              onClick={() => handleDayClick(d)}
            >
              <span className="day-number">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
