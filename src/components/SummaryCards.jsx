import './SummaryCards.css'

function SummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="summary-cards">
      <div className="card income-card">
        <div className="card-icon">💰</div>
        <div className="card-info">
          <p className="card-label">Ingresos</p>
          <p className="card-amount">{formatCurrency(totalIncome)}</p>
        </div>
      </div>
      <div className="card expense-card">
        <div className="card-icon">💸</div>
        <div className="card-info">
          <p className="card-label">Gastos</p>
          <p className="card-amount">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
      <div className="card balance-card">
        <div className="card-icon">💎</div>
        <div className="card-info">
          <p className="card-label">Balance</p>
          <p className="card-amount">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards
