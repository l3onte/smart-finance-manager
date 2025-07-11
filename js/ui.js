import * as api from './api.js';

let balance = 0;

let modal = document.getElementById('modal-principal');
const allDropdowns = document.querySelectorAll('.dropdown');
const modalTitle = document.querySelector('.modal__title');
const modalInputs = document.querySelector('.modal__inputs');
const modalFooter = document.querySelector('.modal__footer');
const dateFilter = document.getElementById('date-filter-input');
const expenseFilter = document.getElementById('expense-filter');
const increceFilter = document.getElementById('increase-filter');
const categoryFilter = document.getElementById('category-filter__input');
const searchInput = document.getElementById('table__search');
const saveBuget = document.getElementById('save-budget');

function modifyMovementModal() {
    modalTitle.innerHTML = `
        <h5>New Movement</h5>
    `;

    modalInputs.innerHTML = `
        <label for="description" class="modal__label">Description</label>
        <input type="text" class="modal__input" placeholder="Write a description">

        <select name="movement-type" id="movement-type" class="modal__input">
            <option selected>Select the movement type</option>
            <option value="increce">Increce</option>
            <option value="expense">Expense</option>
        </select>

        <select name="category" id="category" class="modal__input">
            <option selected>Select the category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="subscriptions">Subscription</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="gifts">Gifts</option>
            <option value="investments">Investments</option>
            <option value="refunds">Refunds</option>
            <option value="other">Other</option>
        </select>

        <label for="amount" class="modal__label">Amount</label>
        <input type="number" class="modal__input" placeholder="Write the amount">
    `;

    modalFooter.innerHTML = `
        <button class="modal__button reset--button">Reset</button>
        <button class="modal__button save--button" id="save-movement">Save</button>
    `
}

function modifyBudgetModal() {
    modalTitle.innerHTML = `
        <h5>New Budget</h5>
    `;

    modalInputs.innerHTML = `
        <select name="category" id="category" class="modal__input">
            <option selected>Select the category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="subscriptions">Subscription</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="gifts">Gifts</option>
            <option value="investments">Investments</option>
            <option value="refunds">Refunds</option>
            <option value="other">Other</option>
        </select>

        <label for="amount" class="modal__label">Amount</label>
        <input type="number" placeholder="Write the amount" id="amount" class="modal__input">
    
        <label for="month" class="modal__label">Month</label>
        <input type="number" min="1" max="12" placeholder="Introduce the Month" class="modal__input" id="month">
    `;

    modalFooter.innerHTML = `
        <button class="modal__button reset--button">Reset</button>
        <button class="modal__button save--button" id="save-budget">Save</button>
    `
}


export function openBudgetModal() {
    document.getElementById('new-budget__button').addEventListener('click', () => {
        isEditingBudget = false;
        currentBudgetId = null;

        modifyBudgetModal();
        modal.showModal();
    });
};


export function openMovementModal() {
    document.getElementById('new-movement__button').addEventListener('click', () => {
        modifyMovementModal();
        modal.showModal();
        extractMovementData();
    });
};

export function closeModal() {
    document.querySelector('.modal__close-button').addEventListener('click', () => {
        modal.close();
    });
};

export function showOptions() {
    document.querySelector('.options-button').addEventListener('click', () => {
        const options = document.querySelectorAll('.options__icons');

        options.forEach(button => {
            button.classList.toggle('show');
        });
    });
};

let sortByAsc = true;

export function sortByid() {
    document.querySelector('.sort-by-id').addEventListener('click', () => {
        showMovements("SortByID", sortByAsc);
        sortByAsc = !sortByAsc;
    });
}

export function sortByAlph() {
    document.querySelector('.sort-by-alph').addEventListener('click', () => {
        showMovements("SortByAlph", sortByAsc);
        sortByAsc = !sortByAsc;
    });
}

function sortBy(sortBy, asc, data) {
    switch (sortBy) {
        case "SortByID":
            data.sort((previus, current) =>  {
                return asc
                    ? Number(previus.id) - Number(current.id)
                    : Number(current.id) - Number(previus.id);
            });
        break;

        case "SortByAlph": 
            data.sort((previus, current) => {
                return asc
                    ? previus.description.localeCompare(current.description)
                    : current.description.localeCompare(previus.description);
            });
        break;
    }
}

export function sortByidBudget() {
    document.querySelector('.sort-by-id').addEventListener('click', () => {
        showBudgets("SortByID", sortByAsc);
        sortByAsc = !sortByAsc;
    });
}

export function sortByAlphBudget() {
    document.querySelector('.sort-by-alph').addEventListener('click', () => {
        showBudgets("SortByAlph", sortByAsc);
        sortByAsc = !sortByAsc;
    });
}

function sorByBudget(sortBy, asc, data) {
    switch (sortBy) {
        case "SortByID":
            data.sort((previus, current) =>  {
                return asc
                    ? Number(previus.id) - Number(current.id)
                    : Number(current.id) - Number(previus.id);
            });
        break;

        case "SortByAlph": 
            data.sort((previus, current) => {
                return asc
                    ? previus.category.localeCompare(current.category)
                    : current.category.localeCompare(previus.category);
            });
        break;
    }
}

function filterBy(filter, filterData, data) {
    switch(filter) {
        case "date":
            return data.filter(dato => dato.date === filterData);
        break;
        case "expense":
            return data.filter(dato => dato.type === filterData);
        break;
        case "increase":
            return data.filter(dato => dato.type === filterData);
        break;
        case "category":
            return data.filter(dato => dato.category === filterData);
        break;
    };
}

function filterBySearch(term, data) {
    const lowerTerm = term.toLowerCase();

    return data.filter(movement => {

        return (
            movement.date.includes(lowerTerm) ||
            movement.description.toLowerCase().includes(lowerTerm) ||
            movement.type.toLowerCase().includes(lowerTerm) || 
            movement.category.toLowerCase().includes(lowerTerm) ||
            movement.amount.toString().includes(lowerTerm)
        );

    }); 
}

function filterBySearchBudget(term, data) {
    const lowerTerm = term.toLowerCase();

    return data.filter(budget => {
        return (
            budget.category.includes(lowerTerm) ||
            budget.amount.toString().includes(lowerTerm) ||
            budget.month.toString().includes(lowerTerm) 
        )
    });
}

export async function showMovements(sort = "", asc = true, filter = "", filterDate = "", search = "") {
    const budgets = await api.getBugets();
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ``;

    let data = await api.getMovements();
    let budgetAmount = {};


    console.log(budgets);

    if (sort !== "") {
        sortBy(sort, asc, data)
    }

    if (filter !== "") {
       data = filterBy(filter, filterDate, data);
    }

    if (search !== "") {
        data = filterBySearch(search, data);
    }

    data.forEach(element => {
        budgets.forEach(budget => {
            if (element.category === budget.category) {
                if (!budgetAmount[element.category]) {
                    budgetAmount[element.category] = 0;
                }

                budgetAmount[element.category] += element.amount;
            }
        });
    });

    for (const [key, value] of Object.entries(budgetAmount)) {
        let encontrado = false;
        budgets.forEach(budget => {
            if (value > budget.amount && encontrado === false) {
                alert(`Your superpassed the budget for ${key}`);
                encontrado = true;
            }
        });
    }

    console.log(budgetAmount);

    balance = 0;

    data.forEach((movement) => {
        const row = document.createElement('tr');

        if (movement.type === 'expense') {
            balance -= movement.amount;
        } else {
            balance += movement.amount;
        }

        let signo = "";
        if (balance < 0) {
            signo = "negative";
        } else {
            signo = "positive";
        }

        row.innerHTML = `
            <td>${movement.id}</td>
            <td>${movement.date}</td>
            <td>${movement.description}</td>
            <td class="movement-type-field">
                <strong class="movement-type ${movement.type}">
                   ${movement.type}
                </strong>
            </td>
            <td>${movement.category}</td>
            <td>${movement.amount}C$</td>
            <td>
                <strong class="${signo}">    
                    ${balance}$
                </strong>
            </td>
            <td class="actions-cell">
                <div class="options-container-table">
                    <button class="actions-button">☰</button>
                    <div class="dropdown hidden">
                        <button class="dropdown__option edit-btn" data-id="${movement.id}">✏️ Edit</button>
                        <button class="dropdown__option delete-btn" data-id="${movement.id}">🗑️ Delete</button>
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(row);
    });
}

let movementListenerAdded = false;

export function extractMovementData() {
    if (movementListenerAdded) return;
    movementListenerAdded = true;

    modal.addEventListener('click', async (event) => {
        if (event.target && event.target.id === 'save-movement') {
            const description = document.querySelector('input[placeholder="Write a description"]').value;
            const type = document.getElementById('movement-type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.querySelector('input[placeholder="Write the amount"]').value);

            const date = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

            const movement = {
                date,
                description,
                type,
                category,
                amount
            };

            await api.newMovement(movement);
            modal.close();
            showMovements();
        }
    });
}

function fillEditModal(movement) {
    document.querySelector('input[placeholder="Write a description"]').value = movement.description;
    document.getElementById('movement-type').value = movement.type;
    document.getElementById('category').value = movement.category;
    document.querySelector('input[placeholder="Write the amount"]').value = movement.amount;
}

function fillEditModalBudget(budget) {
    document.getElementById('category').value = budget.category;
    document.getElementById('amount').value = budget.amount;
    document.getElementById('month').value = budget.month;
}

function extractEditMovement(id) {
    modal.addEventListener('click', async function handleEdit(event) {
        if (event.target && event.target.id === 'save-movement') {
            const description = document.querySelector('input[placeholder="Write a description"]').value;
            const type = document.getElementById('movement-type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.querySelector('input[placeholder="Write the amount"]').value);
            const date = new Date().toLocaleDateString('en-CA');

            const movement = { date, description, type, category, amount };

            await api.updateMovement(id, movement).then(() => {
                modal.close();
                balance = 0;
                showMovements();
                modal.removeEventListener('click', handleEdit);
            });
        }
    })
}

export function openOptions() {
    document.addEventListener('click', async (event) => {

        if (!event.target.closest('.options-container-table')) {
            allDropdowns.forEach(menu => menu.classList.add('hidden'));
            return;
        };

        if (event.target.classList.contains('actions-button')) {
            const menu = event.target.nextElementSibling;

            allDropdowns.forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });

            menu.classList.toggle('hidden');
        };

        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.dataset.id;

            if (confirm('Are you sure you want to delete this movement?')) {
                await api.deleteMovement(id);
                balance = 0;
                showMovements();
            }
        };

        if (event.target.classList.contains('edit-btn')) {
            const id = event.target.dataset.id;
            const data = await api.getMovements();
            const movement = data.find(m => m.id === id);

            if (!movement) return alert('Movement not found');

            modifyMovementModal();
            fillEditModal(movement);
            modal.showModal();

            extractEditMovement(id);
        }
    });
}

export function filters() {
    document.querySelector('.filter--button').addEventListener('click', () => {
        document.querySelector('.dropdown-filters').classList.toggle('active');
    });
}

export function filterByDate() {
    dateFilter.addEventListener('change', () => {
        const date = dateFilter.value;
        showMovements("", "", "date", date);
    });
}

export function filterByExpense() {
    expenseFilter.addEventListener('change', () => {
        if (expenseFilter.checked) {
            showMovements("", "", "expense", "expense");
        } else {
            showMovements();
        }
    });
}

export function filterByIncrease() {
    increceFilter.addEventListener('change', () => {
        if (increceFilter.checked) {
            showMovements("", "", "increase", "increce");
        } else {
            showMovements();
        }
    });
}

export function filterByCategory() {
    categoryFilter.addEventListener('change', () => {
        const date = categoryFilter.value;
        showMovements("", "", "category", date);
    });
}

export function search() {
    searchInput.addEventListener('input', (event) => {
        const term = event.target.value;
        showMovements("", "", "", "", term);
    })
}

export function searchBudget() {
    searchInput.addEventListener('input', (event) => {
        const term = event.target.value;
        showBudgets("", "", "", "", term);
    })
}

let isEditingBudget = false;
let currentBudgetId = null;

export function extractBudgetData() {

    modal.addEventListener('click', async (event) => {
        if (event.target && event.target.id === "save-budget") {
            event.stopPropagation();

            const category = document.getElementById('category').value;
            const amount = document.getElementById('amount').value;
            const month = document.getElementById('month').value;

            let budget = {
                category,
                amount,
                month
            };

            if (isEditingBudget && currentBudgetId !== null) {
                await api.updateBudget(currentBudgetId, budget)
            } else {
                await api.newBuget(budget);
            }
            
            modal.close();
            showBudgets();

            isEditingBudget = false;
            currentBudgetId = null;
        };
    });
}

function changeMonth(data) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[data.month - 1] || "Invalid month";
}

export async function showBudgets(sort = "", asc = true, filter = "", filterDate = "", search = "") {
    const tbody = document.querySelector('.tbody-budget');
    tbody.innerHTML = ``;
    let data = await api.getBugets();

    if (sort !== "") {
        sorByBudget(sort, asc, data);
    }

    if (filter !== "") {
       data = filterBy(filter, filterDate, data);
    }

    if (search !== "") {
        data = filterBySearchBudget(search, data);
    }
    
    data.forEach(budget => {
        const tr = document.createElement('tr');
        const monthName = changeMonth(budget);
        
        tr.innerHTML = `
            <td>${budget.id}</td>
            <td>${monthName}</td>
            <td>${budget.category}</td>
            <td>${budget.amount}C$</td>
            <td class="actions-cell">
                <div class="options-container-table">
                    <button class="actions-button">☰</button>
                    <div class="dropdown hidden">
                        <button class="dropdown__option edit-btn" data-id="${budget.id}">✏️ Edit</button>
                        <button class="dropdown__option delete-btn" data-id="${budget.id}">🗑️ Delete</button>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

export function openBugetOptions() {
    document.addEventListener('click', async (event) => {
        if (!event.target.closest('.options-container-table')) {
            allDropdowns.forEach(menu => menu.classList.add('hidden'));
            return;
        };

        if (event.target.classList.contains('actions-button')) {
            const menu = event.target.nextElementSibling;

            allDropdowns.forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });

            menu.classList.toggle('hidden');
        };

        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.dataset.id;

            if (confirm('Are you sure you want to delete this budget?')) {
                await api.deleteBudget(id);
                showBudgets();
            }
        };

        if (event.target.classList.contains('edit-btn')) {
            const id = event.target.dataset.id;
            const data = await api.getBugets();
            const budget = data.find(b => b.id === id);

            if (!budget) return alert('Budget not found');

            modifyBudgetModal();
            fillEditModalBudget(budget);
            modal.showModal();

            isEditingBudget = true;
            currentBudgetId = budget.id;
        }
    }); 
}