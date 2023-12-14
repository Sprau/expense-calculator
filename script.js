class ExpenseCalculator extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.expensesData = new Proxy(
        {
          expensesList: [],
          totalAmount: 0,
        },
        {
          set: (target, property, value) => {
            target[property] = value;
            this.updateUI();
            return true;
          },
        }
      );
    }
  
    connectedCallback() {
      this.render();
      this.setupForm();
    }
  
    updateUI() {
      const expensesListContainer = this.shadowRoot.getElementById('expensesList');
      const totalAmountContainer = this.shadowRoot.getElementById('totalAmount');
  
      expensesListContainer.innerHTML = '';
      totalAmountContainer.textContent = `Всего: ${this.expensesData.totalAmount.toFixed(2)}`
  
      this.expensesData.expensesList.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');
        expenseItem.innerHTML = `<span>${expense.name}: ${expense.amount.toFixed(2)}</span><button class="delete-btn" data-index="${index}">Удалить</button>`;
        expensesListContainer.appendChild(expenseItem);
      });
    }
  
    setupForm() {
      const form = this.shadowRoot.getElementById('expenseForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const expenseName = form.elements.name.value;
        const expenseAmount = form.elements.amount.value;
  
        if (expenseName && expenseAmount) {
          this.addExpense(expenseName, expenseAmount);
          form.reset();
        }
      });
  
      const expensesListContainer = this.shadowRoot.getElementById('expensesList');
      expensesListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
          const index = event.target.dataset.index;
          this.deleteExpense(index);
        }
      });
    }
  
    addExpense(name, amount) {
      const newExpense = {
        name: name,
        amount: parseFloat(amount),
      };
  
      this.expensesData.expensesList.push(newExpense);
      this.expensesData.totalAmount += newExpense.amount;
    }
  
    deleteExpense(index) {
      const deletedExpense = this.expensesData.expensesList.splice(index, 1)[0];
      this.expensesData.totalAmount -= deletedExpense.amount;
    }
  
    render() {
      const template = `
        <form id="expenseForm">
          <input type="text" name="name" placeholder="Название расхода" required>
          <input type="number" name="amount" placeholder="Сумма" step="0.00" required>
          <button type="submit">Добавить</button>
        </form>
        <div id="expensesList"></div>
        <div id="totalAmount">Всего: 0.00</div>
      `;
  
      this.shadowRoot.innerHTML = template;
    }
  }
  
  customElements.define('expense-calculator', ExpenseCalculator);
  