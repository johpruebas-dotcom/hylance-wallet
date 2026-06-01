let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    renderTransactions();
    updateSummary();
    setDefaultDate();
    
    document.getElementById('transaction-form').addEventListener('submit', addTransaction);
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

function addTransaction(e) {
    e.preventDefault();
    
    const type = document.getElementById('type').value;
    const frequency = document.getElementById('frequency').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    
    const transaction = {
        id: Date.now(),
        type,
        frequency,
        description,
        amount,
        date
    };
    
    transactions.unshift(transaction);
    saveTransactions();
    renderTransactions();
    updateSummary();
    renderCalendar();
    
    e.target.reset();
    setDefaultDate();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    renderTransactions();
    updateSummary();
    renderCalendar();
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

function renderTransactions() {
    const container = document.getElementById('transactions-list');
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No hay transacciones registradas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-meta">
                    ${getFrequencyLabel(transaction.frequency)} • ${formatDate(transaction.date)}
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">🗑️</button>
        </div>
    `).join('');
}

function getFrequencyLabel(frequency) {
    const labels = {
        monthly: 'Mensual',
        biweekly: 'Quincenal',
        occasional: 'Ocasional'
    };
    return labels[frequency] || frequency;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    let html = '';
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">
                    <span class="day-number">${prevLastDate - i}</span>
                 </div>`;
    }
    
    const today = new Date();
    for (let day = 1; day <= lastDateOfMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasTransaction = transactions.some(t => t.date === dateStr);
        const isToday = today.getFullYear() === year && 
                        today.getMonth() === month && 
                        today.getDate() === day;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasTransaction) classes += ' has-transaction';
        
        html += `<div class="${classes}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                 </div>`;
    }
    
    const totalDays = firstDayOfWeek + lastDateOfMonth;
    const remainingDays = 42 - totalDays;
    for (let day = 1; day <= remainingDays; day++) {
        html += `<div class="calendar-day other-month">
                    <span class="day-number">${day}</span>
                 </div>`;
    }
    
    document.getElementById('calendar-days').innerHTML = html;
}