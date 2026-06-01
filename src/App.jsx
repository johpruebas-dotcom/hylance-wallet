import { useState, useEffect } from 'react'
import './App.css'
import SummaryCards from './components/SummaryCards'
import Calendar from './components/Calendar'
import TransactionsList from './components/TransactionsList'
import MonthlyProjection from './components/MonthlyProjection'
import TransactionModal from './components/TransactionModal'
import RecurringTransactions from './components/RecurringTransactions'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
}

let db = null
try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} catch (e) {
  console.log('Firebase no configurado, usando localStorage temporalmente')
}

function App() {
  const [transactions, setTransactions] = useState([])
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard', 'register', 'recurring'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (db) {
      const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      })
      return unsubscribe
    } else {
      const saved = JSON.parse(localStorage.getItem('transactions')) || []
      setTransactions(saved)
    }
  }, [])

  const addTransaction = async (transaction) => {
    if (db) {
      await addDoc(collection(db, 'transactions'), transaction)
    } else {
      const newTransactions = [transaction, ...transactions]
      setTransactions(newTransactions)
      localStorage.setItem('transactions', JSON.stringify(newTransactions))
    }
  }

  const deleteTransaction = async (id) => {
    if (db) {
      await deleteDoc(doc(db, 'transactions', id))
    } else {
      const newTransactions = transactions.filter(t => t.id !== id)
      setTransactions(newTransactions)
      localStorage.setItem('transactions', JSON.stringify(newTransactions))
    }
  }

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr)
    setIsModalOpen(true)
  }

  const handleSaveModal = (transaction) => {
    addTransaction(transaction)
    setIsModalOpen(false)
  }

  return (
    <div className="app">
      <header>
        <h1>💖 Hylance Wallet</h1>
        <p className="subtitle">Tu control financiero personal (HYW)</p>
      </header>

      {/* Navegación */}
      <nav className="navigation">
        <button 
          className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-btn ${activeView === 'recurring' ? 'active' : ''}`}
          onClick={() => setActiveView('recurring')}
        >
          🔄 Recurrentes
        </button>
        <button 
          className={`nav-btn ${activeView === 'register' ? 'active' : ''}`}
          onClick={() => setActiveView('register')}
        >
          📝 Registrar
        </button>
      </nav>

      {/* Vista Dashboard */}
      {activeView === 'dashboard' && (
        <section className="section-info">
          <SummaryCards transactions={transactions} />
          <MonthlyProjection transactions={transactions} />
          <div className="calendar-container-section">
            <Calendar transactions={transactions} onDayClick={handleDayClick} />
          </div>
          <TransactionsList transactions={transactions} onDeleteTransaction={deleteTransaction} />
        </section>
      )}

      {/* Vista Transacciones Recurrentes */}
      {activeView === 'recurring' && (
        <section className="section-info">
          <RecurringTransactions 
            transactions={transactions} 
            onDeleteTransaction={deleteTransaction}
            onAddTransaction={addTransaction}
          />
        </section>
      )}

      {/* Vista Registrar Transacción */}
      {activeView === 'register' && (
        <section className="section-form">
          <h2 className="section-title">📝 Selecciona un día para registrar</h2>
          <div className="calendar-container-section">
            <Calendar transactions={transactions} onDayClick={handleDayClick} />
          </div>
        </section>
      )}

      {/* Modal para registrar transacción */}
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default App
