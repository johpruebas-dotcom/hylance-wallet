import './RecurringTransactions.css'

function RecurringTransactions({ transactions, onDeleteTransaction }) {
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
      <h2 className="section-title">🔄 Transacciones Recurrentes</h2>

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
    </div>
  )
}

export default RecurringTransactions
