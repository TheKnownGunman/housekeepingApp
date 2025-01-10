import { createClient } from '@supabase/supabase-js'

// Securely store Supabase credentials
const supabaseUrl = "https://cfxjhngnlfhazkxfitja.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeGpobmdubGZoYXpreGZpdGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5ODg3NDcsImV4cCI6MjA1MTU2NDc0N30.MrsuwC9EKFFNsVWh_6ukps7df2LRHNycbpCSq8YgshA";
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to check if a given date matches today's date
function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

// Function to handle employee login
async function handleEmployeeLogin(employeeNumber) {
    try {
        // Fetch employee details by employee number
        const { data: employee, error: employeeError } = await supabase
            .from('Employee')
            .select('*')
            .eq('number', employeeNumber)
            .single();

        if (employeeError || !employee) {
            throw new Error('Try correct employee number.');
        }

        // Get today's date in 'dd.mm.yyyy' format
        const today = new Date();
        const formattedToday = today.toLocaleDateString('de-DE');

        // Fetch the shift for today
        const { data: shift, error: shiftError } = await supabase
            .from('Shift')
            .select('*')
            .eq('employee', employee.id)
            .eq('start', formattedToday)
            .single();

        if (shiftError || !shift) {
            throw new Error('No shift found for today.');
        }

        // Update the shift's start time to the current time
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const updatedShift = {
            start_date: `${formattedToday} ${currentTime}`
        };

        const { error: updateError } = await supabase
            .from('Shift')
            .update('start', updatedShift)
            .eq('id', shift.id);

        if (updateError) {
            throw new Error('Failed to update shift start time.');
        }

        // Store employee and shift details in session storage
        sessionStorage.setItem('employeeNumber', employeeNumber);
        sessionStorage.setItem('shiftId', shift.id);

        // Return employee name and shift ID
        return { name: employee.name, shiftId: shift.id };
    } catch (error) {
        console.error('Login Error:', error.message);
        throw error;
    }
}

// Event listener for login form submission
document.querySelector('.next').addEventListener('click', async (event) => {
    event.preventDefault();

    const employeeNumberInput = document.querySelector('.form-container input');
    const employeeNumber = employeeNumberInput.value.trim();

    if (!employeeNumber) {
        alert('Please enter your employee number.');
        return;
    }

    try {
        const { name, shiftId } = await handleEmployeeLogin(employeeNumber);
        alert(`Welcome, ${name}! Your shift ID is ${shiftId}.`);
        window.location.href = './templates/floor.html';
    } catch (error) {
        alert(error.message);
    }
});

const data = [
    { A: 'Row 1 Data A', B: 'Row 1 Data B', C: 'Row 1 Data C', D: 'Row 1 Data D' },
    { A: 'Row 2 Data A', B: 'Row 2 Data B', C: 'Row 2 Data C', D: 'Row 2 Data D' },
    { A: 'Row 3 Data A', B: 'Row 3 Data B', C: 'Row 3 Data C', D: 'Row 3 Data D' },
    { A: 'Row 4 Data A', B: 'Row 4 Data B', C: 'Row 4 Data C', D: 'Row 4 Data D' },
    { A: 'Row 4 Data A', B: 'Row 4 Data B', C: 'Row 4 Data C', D: 'Row 4 Data D' },
    { A: 'Row 4 Data A', B: 'Row 4 Data B', C: 'Row 4 Data C', D: 'Row 4 Data D' },
    { A: 'Row 4 Data A', B: 'Row 4 Data B', C: 'Row 4 Data C', D: 'Row 4 Data D' },
    { A: 'Row 4 Data A', B: 'Row 4 Data B', C: 'Row 4 Data C', D: 'Row 4 Data D' },
];


function populateTable(data) {
    const tableBody = document.querySelector('#dynamic-table tbody');

    
    data.forEach(item => {
        const row = document.createElement('tr'); 

        
        for (let key in item) {
            const cell = document.createElement('td');
            cell.textContent = item[key]; 
            row.appendChild(cell); 
        }

        
        tableBody.appendChild(row);
    });
}


populateTable(data);


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-250px';
        overlay.style.display = 'none';
    } else {
        sidebar.style.right = '0px';
        overlay.style.display = 'block';
    }
}

