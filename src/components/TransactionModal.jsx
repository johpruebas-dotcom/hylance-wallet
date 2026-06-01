import { useState, useEffect } from 'react'
import './TransactionModal.css'

function TransactionModal({ isOpen, onClose, onSave, selectedDate }) {
  const [type, setType] = useState('income')
  const [frequency, setFrequency] = useState('monthly')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(true)
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (isOpen) {
      setType('income')
      setFrequency('monthly')
      setDescription('')
      setAmount('')
      setIsRecurring(true)
      setEndDate('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: Date.now(),
      type,
      frequency,
      description,
      amount: parseFloat(amount),
      date: selectedDate,
      isRecurring: frequency !== 'occasional' && isRecurring,
      endDate: frequency !== 'occasional' && isRecurring ? endDate : null
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Registrar Transacción</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
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
            <label>Fecha</label>
            <input 
              type="date" 
              value={selectedDate}
              readOnly
              style={{ backgroundColor: '#F0F0F0', cursor: 'not-allowed' }}
            />
          </div>
          <button type="submit" className="btn-primary">Guardar Transacción</button>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal
