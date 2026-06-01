import './TransactionsList.css'

function TransactionsList({ transactions, onDeleteTransaction }) {
  const getFrequencyLabel = (frequency) => {
    const labels = {
      monthly: 'Mensual',
      biweekly: 'Quincenal',
      occasional: 'Ocasional'
    }
    return labels[frequency] || frequency
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="transactions-section">
      <h2>📋 Historial de Transacciones</h2>
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No hay transacciones registradas</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-description">
                  {transaction.description}
                  {transaction.isRecurring && <span className="recurring-badge">🔄</span>}
                </div>
                <div className="transaction-meta">
                  {getFrequencyLabel(transaction.frequency)} • {formatDate(transaction.date)}
                  {transaction.isRecurring && transaction.endDate && ` • Hasta ${formatDate(transaction.endDate)}`}
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
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

export default TransactionsList
