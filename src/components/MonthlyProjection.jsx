import { useState } from 'react'
import './MonthlyProjection.css'

function MonthlyProjection({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const generateRecurringTransactions = () => {
    const generated = []
    const monthStart = new Date(selectedYear, selectedMonth, 1)
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0)

    transactions.forEach(t => {
      if (t.isRecurring) {
        let currentDate = new Date(t.date)
        while (currentDate <= monthEnd) {
          if (currentDate >= monthStart) {
            generated.push({
              ...t,
              id: `${t.id}-${currentDate.toISOString()}`,
              date: currentDate.toISOString().split('T')[0],
              isGenerated: true
            })
          }
          if (t.frequency === 'monthly') {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
          } else if (t.frequency === 'biweekly') {
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
          }
          if (t.endDate && currentDate > new Date(t.endDate)) break
        }
      } else if (new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd) {
        generated.push(t)
      }
    })

    return generated
  }

  const monthTransactions = generateRecurringTransactions()

  const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="projection-section">
      <h2>📊 Proyección Mensual</h2>
      <div className="projection-header">
        <button onClick={() => {
          let newMonth = selectedMonth - 1
          let newYear = selectedYear
          if (newMonth < 0) { newMonth = 11; newYear -= 1 }
          setSelectedMonth(newMonth)
          setSelectedYear(newYear)
        }}>←</button>
        <h3>{monthNames[selectedMonth]} {selectedYear}</h3>
        <button onClick={() => {
          let newMonth = selectedMonth + 1
          let newYear = selectedYear
          if (newMonth > 11) { newMonth = 0; newYear += 1 }
          setSelectedMonth(newMonth)
          setSelectedYear(newYear)
        }}>→</button>
      </div>

      <div className="projection-cards">
        <div className="projection-card income">
          <div className="projection-icon">💰</div>
          <div>
            <p className="projection-label">Ingresos</p>
            <p className="projection-amount">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="projection-card expense">
          <div className="projection-icon">💸</div>
          <div>
            <p className="projection-label">Gastos</p>
            <p className="projection-amount">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
        <div className="projection-card balance">
          <div className="projection-icon">💎</div>
          <div>
            <p className="projection-label">Disponible</p>
            <p className="projection-amount">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      <div className="projection-list">
        <h4>Transacciones del mes</h4>
        {monthTransactions.length === 0 ? (
          <p className="empty-text">No hay transacciones para este mes</p>
        ) : (
          <div className="projection-items">
            {monthTransactions.sort((a, b) => new Date(a.date) - new Date(b.date)).map(t => (
              <div key={t.id} className="projection-item">
                <span className="projection-date">{new Date(t.date).getDate()}</span>
                <span className="projection-desc">{t.description} {t.isGenerated && <span className="recurring-badge">🔄</span>}</span>
                <span className={`projection-amt ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthlyProjection
