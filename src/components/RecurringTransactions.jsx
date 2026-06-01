import { useState } from 'react'
import './RecurringTransactions.css'

function RecurringTransactions({ transactions, onDeleteTransaction, onAddTransaction }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const recurringTransactions = transactions.filter(t => t.isRecurring)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getFrequencyLabel = (frequency) => {
    const labels = {
      monthly: 'Mensual',
      biweekly: 'Quincenal'
    }
    return labels[frequency] || frequency
  }

  const totalMonthlyIncome = recurringTransactions
    .filter(t => t.type === 'income' && t.frequency === 'monthly')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalMonthlyExpenses = recurringTransactions
    .filter(t => t.type === 'expense' && t.frequency === 'monthly')
    .reduce((sum, t) => sum + t.amount, 0)

  const netMonthly = totalMonthlyIncome - totalMonthlyExpenses

  return (
    <div className="recurring-section">
      <div className="recurring-header">
        <h2 className="section-title">🔄 Transacciones Recurrentes</h2>
        <button className="add-recurring-btn" onClick={() => setIsModalOpen(true)}>
          ➕ Agregar
        </button>
      </div>

      <div className="summary-cards-recurring">
        <div className="summary-card-rec income">
          <div className="card-icon">💰</div>
          <div>
            <p className="card-label">Ingresos Mensuales</p>
            <p className="card-amount">{formatCurrency(totalMonthlyIncome)}</p>
          </div>
        </div>
        <div className="summary-card-rec expense">
          <div className="card-icon">💸</div>
          <div>
            <p className="card-label">Gastos Mensuales</p>
            <p className="card-amount">{formatCurrency(totalMonthlyExpenses)}</p>
          </div>
        </div>
        <div className="summary-card-rec balance">
          <div className="card-icon">💎</div>
          <div>
            <p className="card-label">Disponible Mensual</p>
            <p className="card-amount">{formatCurrency(netMonthly)}</p>
          </div>
        </div>
      </div>

      {recurringTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <p>No hay transacciones recurrentes registradas</p>
        </div>
      ) : (
        <div className="recurring-list">
          {recurringTransactions.sort((a, b) => new Date(a.date) - new Date(b.date)).map(transaction => (
            <div key={transaction.id} className={`recurring-item ${transaction.type}`}>
              <div className="recurring-icon">
                {transaction.type === 'income' ? '💰' : '💸'}
              </div>
              <div className="recurring-info">
                <div className="recurring-description">{transaction.description}</div>
                <div className="recurring-meta">
                  <span className="frequency-badge">{getFrequencyLabel(transaction.frequency)}</span>
                  <span>Inicia el {formatDate(transaction.date)}</span>
                  {transaction.endDate && <span>• Hasta {formatDate(transaction.endDate)}</span>}
                </div>
              </div>
              <div className="recurring-amount">
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
              <button 
                className="delete-btn" 
                onClick={() => onDeleteTransaction(transaction.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Transacción Recurrente</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="mini-calendar-container">
              <CalendarMini onSelectDate={(date) => {
                setSelectedDate(date)
              }} initialDate={selectedDate} />
            </div>
            <TransactionFormMini 
              selectedDate={selectedDate}
              onSave={(transaction) => {
                onAddTransaction({ ...transaction, isRecurring: true })
                setIsModalOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function CalendarMini({ onSelectDate, initialDate }) {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate))

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const prevLastDay = new Date(year, month, 0)

    const firstDayOfWeek = firstDay.getDay()
    const lastDateOfMonth = lastDay.getDate()
    const prevLastDate = prevLastDay.getDate()

    let days = []

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevLastDate - i, otherMonth: true })
    }

    const today = new Date()
    for (let day = 1; day <= lastDateOfMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isSelected = dateStr === initialDate
      const isToday = today.getFullYear() === year &&
                      today.getMonth() === month &&
                      today.getDate() === day

      days.push({ day, isSelected, isToday, otherMonth: false, dateStr })
    }

    const totalDays = firstDayOfWeek + lastDateOfMonth
    const remainingDays = 42 - totalDays
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, otherMonth: true })
    }

    return days
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const days = renderCalendar()

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          ◀
        </button>
        <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          ▶
        </button>
      </div>
      <div className="mini-calendar-weekdays">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>
      <div className="mini-calendar-days">
        {days.map((d, i) => (
          <div
            key={i}
            className={`mini-day ${d.otherMonth ? 'other' : ''} ${d.isSelected ? 'selected' : ''} ${d.isToday ? 'today' : ''}`}
            onClick={() => !d.otherMonth && d.dateStr && onSelectDate(d.dateStr)}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  )
}

function TransactionFormMini({ selectedDate, onSave }) {
  const [type, setType] = useState('income')
  const [frequency, setFrequency] = useState('monthly')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: Date.now(),
      type,
      frequency,
      description,
      amount: parseFloat(amount),
      date: selectedDate,
      endDate: endDate || null,
      isRecurring: true
    })
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-mini-form">
      <div className="form-group">
        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </div>
      <div className="form-group">
        <label>Frecuencia</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="monthly">Mensual</option>
          <option value="biweekly">Quincenal</option>
        </select>
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Ej: Salario"
        />
      </div>
      <div className="form-group">
        <label>Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />
      </div>
      <div className="form-group">
        <label>Fecha de fin (opcional)</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="submit" className="save-btn">
        Guardar
      </button>
    </form>
  )
}

export default RecurringTransactions
