
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

