
// Array to store Employees data 
let employees = [];

// DOM Elements

const employeeForm = document.querySelector('#employeeForm');// using querySelector
const nameInput = document.getElementsByName('nm')[0];// using getElementsByName
const roleInput = document.getElementById('role');// using getElementById
const statusSelect = document.getElementsByClassName('status')[0];// using getElementsByClassName
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeTableBody = document.getElementById('employeeTableBody');
const trashTableBody = document.getElementById('trashTableBody');
const showTrashBtn = document.getElementById('showTrashBtn');
const trashContainer = document.getElementById('trashContainer');
const activeCountSpan = document.getElementById('activeCount');
const trashCountSpan = document.getElementById('trashCount');

// ErrorMsg elements
const nameErrorMsg = document.getElementById('nameErrorMsg');
const roleErrorMsg = document.getElementById('roleErrorMsg');
const statusErrorMsg = document.getElementById('statusErrorMsg');

// Regular expressions for validation
const nameRegex = /^[a-zA-Z\s]{2,60}$/;
const roleRegex = /^[a-zA-Z\s]{2,30}$/;

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    
    
    getData(); // get data from localStorage to array
    updateCounters();// Update counters
    
    // Display Employee tables & TrashTable
    displayEmployeeTable();
    displayTrashTable();
    
    // Event listeners
    employeeForm.addEventListener('submit', handleFormSubmit);
    showTrashBtn.addEventListener('click', toggleTrashContainer);
});

// Update counters
function updateCounters() {
    activeCountSpan.textContent = employees.filter(emp => !emp.isDeleted).length;
    trashCountSpan.textContent = employees.filter(emp => emp.isDeleted).length;
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
            status: statusSelect.value,
            isDeleted: false
        };
        
        // Add to employees array
        employees.push(newEmployee);
        
        // Save to localStorage
        saveData();
        
        // show data
        displayEmployeeTable();
        updateCounters();
        
        // Reset form
        employeeForm.reset();
    }
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
        row.innerHTML = '<td colspan="4" style="text-align: center;">Not found records</td>';
        employeeTableBody.appendChild(row);
        console.timeEnd('displayEmployeeTable');
        return;
    }
    
    // Create rows for each employee
    activeEmployees.forEach(employee => {
        const row = document.createElement('tr');
        
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
        
        // Create action buttons
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
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        // Set row content
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.role}</td>
        `;
        
        // Append status badge and actions
        const statusCell = document.createElement('td');
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        employeeTableBody.appendChild(row);
    });
    
    console.timeEnd('displayEmployeeTable');
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
        row.innerHTML = '<td colspan="4" style="text-align: center;">Trash is empty</td>';
        trashTableBody.appendChild(row);
        console.timeEnd('displayTrashTable');
        return;
    }
    
    // Create rows for each deleted employee
    deletedEmployees.forEach(employee => {
        const row = document.createElement('tr');
        
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
        
        // Create action buttons
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'action-btn btn-success';
        restoreBtn.textContent = 'Restore';
        restoreBtn.addEventListener('click', () => restoreEmployee(employee.id));
        
        const permDeleteBtn = document.createElement('button');
        permDeleteBtn.className = 'action-btn btn-danger';
        permDeleteBtn.textContent = 'Permanently Delete';
        permDeleteBtn.addEventListener('click', () => permanentlyDeleteEmployee(employee.id));
        
        // Create actions cell
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(restoreBtn);
        actionsCell.appendChild(permDeleteBtn);
        
        // Set row content
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.role}</td>
        `;
        
        // Append status badge and actions
        const statusCell = document.createElement('td');
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        // Add row to table
        trashTableBody.appendChild(row);
    });
    
    console.timeEnd('displayTrashTable');
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
    statusErrorMsg.style.display = 'none';
}



// Edit employee
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    
    if (!employee) return;
    
    // Prompt for new values
    const newName = prompt('Enter new name:', employee.name);
    if (newName === null || !newName.trim()) return;
    
    const newRole = prompt('Enter new role:', employee.role);
    if (newRole === null || !newRole.trim()) return;
    
    const newStatus = prompt('Enter new status (Active, On Leave, Terminated):', employee.status);
    if (newStatus === null || !['Active', 'On Leave', 'Terminated'].includes(newStatus)) return;
    
    // Update employee
    employee.name = newName.trim();
    employee.role = newRole.trim();
    employee.status = newStatus;
    
    // Save and update UI
    saveData();
    displayEmployeeTable();
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
    }
}

// Shoe & hide trash container
function toggleTrashContainer() {
    if (trashContainer.style.display === 'none' || !trashContainer.style.display) {
        trashContainer.style.display = 'block';
        showTrashBtn.textContent = 'Hide Trash Bin';
    } else {
        trashContainer.style.display = 'none';
        showTrashBtn.textContent = 'Show Trash Bin';
    }
}

