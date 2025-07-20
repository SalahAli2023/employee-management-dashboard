
// Array to store Employees data 
let employees = [];

// DOM Elements

const employeeForm = document.querySelector('#employeeForm');// using querySelector
const nameInput = document.getElementsByName('nm')[0];// using getElementsByName
const roleInput = document.getElementById('role');// using getElementById
const salaryInput = document.getElementById('salary');
const statusSelect = document.getElementsByClassName('status')[0];// using getElementsByClassName
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeTableBody = document.getElementById('employeeTableBody');
const trashTableBody = document.getElementById('trashTableBody');
const showTrashBtn = document.getElementById('showTrashBtn');
const trashContainer = document.getElementById('trashContainer');
const activeCountSpan = document.getElementById('activeCount');
const trashCountSpan = document.getElementById('trashCount');
const totalPayrollSpan = document.getElementById('totalPayroll');

// ErrorMsg elements
const nameErrorMsg = document.getElementById('nameErrorMsg');
const roleErrorMsg = document.getElementById('roleErrorMsg');
const salaryErrorMsg = document.getElementById('salaryErrorMsg');
const statusErrorMsg = document.getElementById('statusErrorMsg');

// Filter elements
const searchNameInput = document.getElementById('searchName');
const filterRoleInput = document.getElementById('filterRole');
const filterStatusSelect = document.getElementById('filterStatus');
const filterSalaryMinInput = document.getElementById('filterSalaryMin');
const filterSalaryMaxInput = document.getElementById('filterSalaryMax');
const filterBonusMinInput = document.getElementById('filterBonusMin');
const filterBonusMaxInput = document.getElementById('filterBonusMax');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const deleteThresholdBtn = document.getElementById('deleteThresholdBtn');

// Bonus Modal elements
const bonusModal = document.getElementById('bonusModal');
const bonusPercentageInput = document.getElementById('bonusPercentage');
const applyBonusBtn = document.getElementById('applyBonusBtn');
const bonusErrorMsg = document.getElementById('bonusErrorMsg');
const closeModal = document.querySelector('.close');

// Regular expressions for validation
const nameRegex = /^[a-zA-Z\s]{2,60}$/;
const roleRegex = /^[a-zA-Z\s]{2,30}$/;
const salaryRegex = /^\d+$/;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    
    
    getData(); // get data from localStorage to array
    updateCounters();// Update counters
    updateTotalPayroll(); // Update total payroll

    // Display Employee tables & TrashTable
    displayEmployeeTable();
    displayTrashTable();
    
    // Event listeners
    employeeForm.addEventListener('submit', handleFormSubmit);
    showTrashBtn.addEventListener('click', toggleTrashContainer);

    // Filter event listeners
    searchNameInput.addEventListener('input', applyFilters);
    filterRoleInput.addEventListener('input', applyFilters);
    filterStatusSelect.addEventListener('change', applyFilters);
    filterSalaryMinInput.addEventListener('input', applyFilters);
    filterSalaryMaxInput.addEventListener('input', applyFilters);
    filterBonusMinInput.addEventListener('input', applyFilters);
    filterBonusMaxInput.addEventListener('input', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    deleteThresholdBtn.addEventListener('click', deleteEmployeesBelowThreshold);
    
    // Bonus modal event listeners
    applyBonusBtn.addEventListener('click', applyBonus);
    closeModal.addEventListener('click', () => bonusModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === bonusModal) bonusModal.style.display = 'none';
    });
});

// Update counters
function updateCounters() {
    activeCountSpan.textContent = employees.filter(emp => !emp.isDeleted).length;
    trashCountSpan.textContent = employees.filter(emp => emp.isDeleted).length;
}

// Update total payroll
function updateTotalPayroll() {
    const total = employees
        .filter(emp => !emp.isDeleted) // Use filter function
        .reduce((sum, emp) => sum + (emp.salary || 0), 0); // Use reduce function
    totalPayrollSpan.textContent = total.toLocaleString();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Load data from localStorage
function getData() {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    }
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear error messages
    resetErrors();
    
    // Validate inputs
    const isValid = validateForm();
    
    if (isValid) {
        // Create new employee object
        const newEmployee = {
            id: Date.now(), // Simple unique ID
            name: nameInput.value.trim(),
            role: roleInput.value.trim(),
            salary: parseInt(salaryInput.value.trim()) || 0,
            status: statusSelect.value,
            bonus: 0,
            isDeleted: false
        };
        
        // Add to employees array
        employees.push(newEmployee);
        
        // Save to localStorage
        saveData();
        
        // show data
        displayEmployeeTable();
        updateCounters();
        updateTotalPayroll();

        // Reset form
        employeeForm.reset();
    }
}

function getStatusClass(status) {
    const statusClasses = {
        'Active': 'badge-active',
        'On Leave': 'badge-leave',
        'Terminated': 'badge-terminated'
    };
    return statusClasses[status] || '';
}

// Build & Show employee table
function displayEmployeeTable() {
    console.time('displayEmployeeTable');
    
    // Clear the table body
    employeeTableBody.innerHTML = '';
    
    // Filter out deleted employees
    const activeEmployees = employees.filter(emp => !emp.isDeleted);
    
    if (activeEmployees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Not found records</td>';
        employeeTableBody.appendChild(row);
        console.timeEnd('displayEmployeeTable');
        return;
    }
    
    // Create rows for each employee
    // activeEmployees.forEach(employee => {
    //     const row = document.createElement('tr');
        
    //     // Create name cell with possible high-salary badge
    //     const nameCell = document.createElement('td');
    //     nameCell.textContent = employee.name;
    //     if (employee.salary >= 100000) {
    //         const highSalaryBadge = document.createElement('span');
    //         highSalaryBadge.className = 'badge badge-high-salary';
    //         highSalaryBadge.textContent = 'High Salary';
    //         nameCell.appendChild(highSalaryBadge)//.style.alignItems="right";
    //     }

    //      // Create role cell
    //     const roleCell = document.createElement('td');
    //     roleCell.textContent = employee.role;
        
    //     // Create salary cell
    //     const salaryCell = document.createElement('td');
    //     salaryCell.textContent = String(employee.salary)+ ' R';
        
    //     // Create bonus cell with possible bonus badge
    //     const bonusCell = document.createElement('td');
    //     bonusCell.textContent = String(employee.bonus) + ' R';
    //     if (employee.bonus > 0) {
    //         const bonusBadge = document.createElement('span');
    //         bonusBadge.className = 'badge badge-bonus';
    //         bonusBadge.textContent = 'Bonus';
    //         bonusCell.appendChild(bonusBadge);
    //     }

    //     // Create status badge
    //     const statusBadge = document.createElement('span');
    //     statusBadge.className = 'badge';
        
    //     // Set badge class based on status
    //     if (employee.status === 'Active') {
    //         statusBadge.classList.add('badge-active');
    //     } else if (employee.status === 'On Leave') {
    //         statusBadge.classList.add('badge-leave');
    //     } else if (employee.status === 'Terminated') {
    //         statusBadge.classList.add('badge-terminated');
    //     }
        
    //     statusBadge.textContent = employee.status;
        
    //      // Create status cell
    //     const statusCell = document.createElement('td');
    //     statusCell.appendChild(statusBadge);

    //     // Create action buttons
    //     const bonusBtn = document.createElement('button');
    //     bonusBtn.className = 'action-btn btn-bonus';
    //     bonusBtn.textContent = 'Bonus';
    //     bonusBtn.addEventListener('click', () => openBonusModal(employee.id));
        
    //     const editBtn = document.createElement('button');
    //     editBtn.className = 'action-btn';
    //     editBtn.textContent = 'Edit';
    //     editBtn.addEventListener('click', () => editEmployee(employee.id));
        
    //     const deleteBtn = document.createElement('button');
    //     deleteBtn.className = 'action-btn btn-danger';
    //     deleteBtn.textContent = 'Delete';
    //     deleteBtn.addEventListener('click', () => deleteEmployee(employee.id));
        
    //     // Create actions cell
    //     const actionsCell = document.createElement('td');
    //     actionsCell.appendChild(bonusBtn);
    //     actionsCell.appendChild(editBtn);
    //     actionsCell.appendChild(deleteBtn);
        
    //     // // Set row content
    //     // row.innerHTML = `
    //     //     <td>${employee.name}</td>
    //     //     <td>${employee.role}</td>
    //     // `;
        
    //     // Append status badge and actions
    //     row.appendChild(nameCell);
    //     row.appendChild(roleCell);
    //     row.appendChild(salaryCell);
    //     row.appendChild(bonusCell);
    //     row.appendChild(statusCell);
    //     row.appendChild(actionsCell);
        
    //     // Add row to table
    //     employeeTableBody.appendChild(row);
    // });

     //Create rows for each employee using map function
    employeeTableBody.innerHTML = activeEmployees.map(employee => 
        `<tr>
            <td>${employee.name}${employee.salary >= 100000 ? '<span class="badge badge-high-salary">High Salary</span>' : ''}</td>
            <td>${employee.role}</td>
            <td>${employee.salary.toLocaleString()} R</td>
            <td>${employee.bonus.toLocaleString()} R${employee.bonus > 0 ? '<span class="badge badge-bonus">Bonus</span>' : ''}</td>
            <td><span class="badge ${getStatusClass(employee.status)}">${employee.status}</span></td>
            <td>
            <button class="action-btn btn-bonus" onclick="openBonusModal(${employee.id})">Bonus</button>
            <button class="action-btn" onclick="editEmployee(${employee.id})">Edit</button>
            <button class="action-btn btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        </tr>`).join('') || '<tr><td colspan="6" class="text-center">No records found</td></tr>';
        
   // console.timeEnd('displayEmployeeTable');
}

// Build & Show trash table
function displayTrashTable() {
    console.time('displayTrashTable');
    
    // Clear the table body
    trashTableBody.innerHTML = '';
    
    // Filter deleted employees
    const deletedEmployees = employees.filter(emp => emp.isDeleted);
    
    if (deletedEmployees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Trash is empty</td>';
        trashTableBody.appendChild(row);
        console.timeEnd('displayTrashTable');
        return;
    }
    
    // Create rows for each deleted employee
    // deletedEmployees.forEach(employee => {
    //     const row = document.createElement('tr');
        
    //      // Create name cell
    //     const nameCell = document.createElement('td');
    //     nameCell.textContent = employee.name;
        
    //     // Create role cell
    //     const roleCell = document.createElement('td');
    //     roleCell.textContent = employee.role;
        
    //     // Create salary cell
    //     const salaryCell = document.createElement('td');
    //     salaryCell.textContent =String(employee.salary)+ ' R';
        
    //     // Create bonus cell
    //     const bonusCell = document.createElement('td');
    //     bonusCell.textContent = String(employee.bonus + ' R');
        
    //     // Create status badge
    //     const statusBadge = document.createElement('span');
    //     statusBadge.className = 'badge';
        
    //     // Set badge class based on status
    //     if (employee.status === 'Active') {
    //         statusBadge.classList.add('badge-active');
    //     } else if (employee.status === 'On Leave') {
    //         statusBadge.classList.add('badge-leave');
    //     } else if (employee.status === 'Terminated') {
    //         statusBadge.classList.add('badge-terminated');
    //     }
        
    //     statusBadge.textContent = employee.status;
        
    //     // Create status cell
    //     const statusCell = document.createElement('td');
    //     statusCell.appendChild(statusBadge);

    //     // Create action buttons
    //     const restoreBtn = document.createElement('button');
    //     restoreBtn.className = 'action-btn btn-success';
    //     restoreBtn.textContent = 'Restore';
    //     restoreBtn.addEventListener('click', () => restoreEmployee(employee.id));
        
    //     const permDeleteBtn = document.createElement('button');
    //     permDeleteBtn.className = 'action-btn btn-danger';
    //     permDeleteBtn.textContent = 'Permanently Delete';
    //     permDeleteBtn.addEventListener('click', () => permanentlyDeleteEmployee(employee.id));
        
    //     // Create actions cell
    //     const actionsCell = document.createElement('td');
    //     actionsCell.appendChild(restoreBtn);
    //     actionsCell.appendChild(permDeleteBtn);
        
    //     // Append all status to the row
    //     row.appendChild(nameCell);
    //     row.appendChild(roleCell);
    //     row.appendChild(salaryCell);
    //     row.appendChild(bonusCell);
    //     row.appendChild(statusCell);
    //     row.appendChild(actionsCell);
        
    //     // Add row to table
    //     trashTableBody.appendChild(row);
    // });

    // using map function
    trashTableBody.innerHTML = deletedEmployees.map(employee =>
        `<tr>
            <td>${employee.name}</td>
            <td>${employee.role}</td>
            <td>${employee.salary.toLocaleString()} R</td>
            <td>${employee.bonus.toLocaleString()} R</td>
            <td><span class="badge ${getStatusClass(employee.status)}">${employee.status}</span></td>
            <td>
            <button class="action-btn btn-success" onclick="restoreEmployee(${employee.id})">Restore</button>
            <button class="action-btn btn-danger" onclick="permanentlyDeleteEmployee(${employee.id})">Delete</button>
            </td>
        </tr>`).join('') || '<tr><td colspan="6" class="text-center">Trash is empty</td></tr>';
    
    
    //console.timeEnd('displayTrashTable');
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Validate name
    if (!nameInput.value.trim()) {
        nameErrorMsg.innerText = 'Name is required';
        nameErrorMsg.style.display = 'block';
        isValid = false;
    } else if (!nameRegex.test(nameInput.value.trim())) {
        nameErrorMsg.innerText = 'Please enter a valid name (letters only)';
        nameErrorMsg.style.display = 'block';
        isValid = false;
    }
    
    // Validate role
    if (!roleInput.value.trim()) {
        roleErrorMsg.innerText = 'Role is required';
        roleErrorMsg.style.display = 'block';
        isValid = false;
    } else if (!roleRegex.test(roleInput.value.trim())) {
        roleErrorMsg.innerText = 'Please enter a valid role';
        roleErrorMsg.style.display = 'block';
        isValid = false;
    }
    
    // Validate salary
    if (!salaryInput.value.trim()) {
        salaryErrorMsg.innerText = 'Salary is required';
        salaryErrorMsg.style.display = 'block';
        isValid = false;
    } else if (!salaryRegex.test(salaryInput.value.trim())) {
        salaryErrorMsg.innerText = 'Please enter a valid salary (numbers only)';
        salaryErrorMsg.style.display = 'block';
        isValid = false;
    }

    // Validate status
    if (!statusSelect.value) {
        statusErrorMsg.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Reset error messages
function resetErrors() {
    nameErrorMsg.style.display = 'none';
    roleErrorMsg.style.display = 'none';
    salaryErrorMsg.style.display = 'none';
    statusErrorMsg.style.display = 'none';
}

// Edit employee
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);//Use find function
    
    if (!employee) return;
    
    // Prompt for new values
    const newName = prompt('Enter new name:', employee.name);
    if (newName === null || !newName.trim()) return;
    
    const newRole = prompt('Enter new role:', employee.role);
    if (newRole === null || !newRole.trim()) return;
    
    const newSalary = prompt('Enter new salary:', employee.salary);
    if (newSalary === null || !newSalary.trim() || !salaryRegex.test(newSalary.trim())) return;
    
    const newStatus = prompt('Enter new status (Active, On Leave, Terminated):', employee.status);
    if (newStatus === null || !['Active', 'On Leave', 'Terminated'].includes(newStatus)) return;
    
    // Update employee
    employee.name = newName.trim();
    employee.role = newRole.trim();
    employee.salary = Number(newSalary.trim());
    employee.status = newStatus;
    
    // Save and update UI
    saveData();
    displayEmployeeTable();
    updateTotalPayroll();
}

// Soft delete employee (move to trash)
function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    
    if (employeeIndex !== -1) {
        employees[employeeIndex].isDeleted = true;
        
        // Save and update UI
        saveData();
        displayEmployeeTable();
        displayTrashTable();
        updateCounters();
        updateTotalPayroll();
    }
}

// Move employee data from trash to employee table
function restoreEmployee(id) {
    if (!confirm('Are you sure you want to restore current employee data?')) return;
    
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    
    if (employeeIndex !== -1) {
        employees[employeeIndex].isDeleted = false;
        
        // Save and update UI
        saveData();
        displayEmployeeTable();
        displayTrashTable();
        updateCounters();
        updateTotalPayroll();
    }
}

// Permanently delete employee
function permanentlyDeleteEmployee(id) {
    if (!confirm('Are you sure you want to permanently delete this employee?')) return;
    
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    
    if (employeeIndex !== -1) {
        employees.splice(employeeIndex, 1);
        
        // Save and update UI
        saveData();
        displayTrashTable();
        updateCounters();
        updateTotalPayroll();
    }
}

// Show & hide trash container
function toggleTrashContainer() {
    if (trashContainer.style.display === 'none' || !trashContainer.style.display) {
        trashContainer.style.display = 'block';
        showTrashBtn.textContent = 'Hide Trash Bin';
    } else {
        trashContainer.style.display = 'none';
        showTrashBtn.textContent = 'Show Trash Bin';
    }
}

// Open bonus modal
function openBonusModal(id) {
    currentEmployeeIdForBonus = id;
    bonusPercentageInput.value = '';
    bonusErrorMsg.style.display = 'none';
    bonusModal.style.display = 'block';
}

// Apply bonus to employee
function applyBonus() {
    const percentage = parseInt(bonusPercentageInput.value);
    
    // Validate input
    if (isNaN(percentage)) {
        bonusErrorMsg.innerText = 'Please enter a valid percentage';
        bonusErrorMsg.style.display = 'block';
        return;
    }
    
    if (percentage < 0 || percentage > 100) {
        bonusErrorMsg.innerText = 'Percentage must be between 0 and 100';
        bonusErrorMsg.style.display = 'block';
        return;
    }
    
    // Find employee and calculate bonus
    const employee = employees.find(emp => emp.id === currentEmployeeIdForBonus);
    if (employee) {
        employee.bonus = Math.round(employee.salary * (percentage / 100));
        
        // Save and update UI
        saveData();
        displayEmployeeTable();
        bonusModal.style.display = 'none';
    }
}

// Apply filters to employee table
function applyFilters() {
    const searchTerm = searchNameInput.value.toLowerCase();
    const roleFilter = filterRoleInput.value.toLowerCase();
    const statusFilter = filterStatusSelect.value;
    const salaryMin = parseInt(filterSalaryMinInput.value) || 0;
    const salaryMax = parseInt(filterSalaryMaxInput.value) || Infinity;
    const bonusMin = parseInt(filterBonusMinInput.value) || 0;
    const bonusMax = parseInt(filterBonusMaxInput.value) || Infinity;
    
    // Filter employees
    const filteredEmployees = employees.filter(emp => {
        return !emp.isDeleted &&
            emp.name.toLowerCase().includes(searchTerm) &&
            emp.role.toLowerCase().includes(roleFilter) &&
            (statusFilter === '' || emp.status === statusFilter) &&
            emp.salary >= salaryMin &&
            emp.salary <= salaryMax &&
            emp.bonus >= bonusMin &&
            emp.bonus <= bonusMax;
    });
    
    // Display filtered results
    displayFilteredEmployeeTable(filteredEmployees);
}

// Display filtered employee table
function displayFilteredEmployeeTable(filteredEmployees) {
    // Clear the table body
    employeeTableBody.innerHTML = '';
    
    if (filteredEmployees.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">No matching records found</td>';
        employeeTableBody.appendChild(row);
        return;
    }
    
    // Create rows for each filtered employee
    filteredEmployees.forEach(employee => {
        const row = document.createElement('tr');
        
        // Create name cell with possible high-salary badge
        const nameCell = document.createElement('td');
        nameCell.textContent = employee.name;
        if (employee.salary >= 100000) {
            const highSalaryBadge = document.createElement('span');
            highSalaryBadge.className = 'badge badge-high-salary';
            highSalaryBadge.textContent = 'High Salary';
            nameCell.appendChild(highSalaryBadge);
        }
        
        // Create role cell
        const roleCell = document.createElement('td');
        roleCell.textContent = employee.role;
        
        // Create salary cell
        const salaryCell = document.createElement('td');
        salaryCell.textContent = employee.salary.toLocaleString() + ' R';
        
        // Create bonus cell with possible bonus badge
        const bonusCell = document.createElement('td');
        bonusCell.textContent = employee.bonus.toLocaleString() + ' R';
        if (employee.bonus > 0) {
            const bonusBadge = document.createElement('span');
            bonusBadge.className = 'badge badge-bonus';
            bonusBadge.textContent = 'Bonus';
            bonusCell.appendChild(bonusBadge);
        }
        
        // Create status badge
        const statusBadge = document.createElement('span');
        statusBadge.className = 'badge';
        
        // Set badge class based on status
        if (employee.status === 'Active') {
            statusBadge.classList.add('badge-active');
        } else if (employee.status === 'On Leave') {
            statusBadge.classList.add('badge-leave');
        } else if (employee.status === 'Terminated') {
            statusBadge.classList.add('badge-terminated');
        }
        
        statusBadge.textContent = employee.status;
        
        // Create status cell
        const statusCell = document.createElement('td');
        statusCell.appendChild(statusBadge);
        
        // Create action buttons
        const bonusBtn = document.createElement('button');
        bonusBtn.className = 'action-btn btn-bonus';
        bonusBtn.textContent = 'Bonus';
        bonusBtn.addEventListener('click', () => openBonusModal(employee.id));
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editEmployee(employee.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteEmployee(employee.id));
        
        // Create actions cell
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(bonusBtn);
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        // Append all cells to the row
        row.appendChild(nameCell);
        row.appendChild(roleCell);
        row.appendChild(salaryCell);
        row.appendChild(bonusCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        employeeTableBody.appendChild(row);
    });
}

// Reset all filters
function resetFilters() {
    searchNameInput.value = '';
    filterRoleInput.value = '';
    filterStatusSelect.value = '';
    filterSalaryMinInput.value = '';
    filterSalaryMaxInput.value = '';
    filterBonusMinInput.value = '';
    filterBonusMaxInput.value = '';
    
    // Display all employees
    displayEmployeeTable();
}

// Delete employees with salary below or equal to threshold
function deleteEmployeesBelowThreshold() {
    if (!confirm('Are you sure you want to delete all employees with salary ≤ 20,000 R?')) return;
    
    const threshold = 20000;
    let count = 0;
    
    employees.forEach(emp => {
        if (!emp.isDeleted && emp.salary <= threshold) {
            emp.isDeleted = true;
            count++;
        }
    });
    
    if (count > 0) {
        // Save and update UI
        saveData();
        displayEmployeeTable();
        displayTrashTable();
        updateCounters();
        updateTotalPayroll();
        alert(`${count} employee(s) with salary ≤ ${String(threshold)} R moved to trash.`);
    } else {
        alert(`No employees found with salary ≤ ${String(threshold)} R.`);
    }
}
