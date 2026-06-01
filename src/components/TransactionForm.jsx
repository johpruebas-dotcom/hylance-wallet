import { useState } from 'react'
import './TransactionForm.css'

function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState('income')
  const [frequency, setFrequency] = useState('monthly')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isRecurring, setIsRecurring] = useState(true)
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTransaction({
      id: Date.now(),
      type,
      frequency,
      description,
      amount: parseFloat(amount),
      date,
      isRecurring: frequency !== 'occasional' && isRecurring,
      endDate: frequency !== 'occasional' && isRecurring ? endDate : null
    })
    setDescription('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setEndDate('')
  }

  return (
    <div className="form-section">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>
        </div>
        <div className="form-group">
          <label>Frecuencia</label>
          <select value={frequency} onChange={(e) => {
            setFrequency(e.target.value)
            setIsRecurring(e.target.value !== 'occasional')
          }}>
            <option value="monthly">Mensual</option>
            <option value="biweekly">Quincenal</option>
            <option value="occasional">Ocasional</option>
          </select>
        </div>
        {frequency !== 'occasional' && (
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              Repetir automáticamente
            </label>
          </div>
        )}
        {isRecurring && frequency !== 'occasional' && (
          <div className="form-group">
            <label>Fecha de fin (opcional)</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Dejar vacío para repetir indefinidamente"
            />
          </div>
        )}
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
          <label>Fecha de inicio</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Agregar Transacción</button>
      </form>
    </div>
  )
}

export default TransactionForm
