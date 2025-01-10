// crud.js

// Supabase configuration
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch rooms for today's shift based on employee ID
async function getRoomsByShift(employeeId) {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const { data: shifts, error: shiftError } = await supabase
            .from('shifts')
            .select('id')
            .eq('start_date', today)
            .eq('employee_id', employeeId);

        if (shiftError) throw shiftError;
        if (!shifts.length) return []; // No shifts found for today

        const shiftId = shifts[0].id; // Assuming one shift per day
        const { data: rooms, error: roomError } = await supabase
            .from('shiftRoom')
            .select('room_id, rooms!inner(*)') // Join with rooms table
            .eq('shift_id', shiftId);

        if (roomError) throw roomError;
        return rooms.map(r => ({
            id: r.room_id,
            number: r.rooms.number,
            floor: r.rooms.floor,
            type: r.rooms.type, // Assuming room type exists
        }));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
}

// Create or update room data
async function createOrUpdateRoom(roomData) {
    try {
        const { id, ...data } = roomData; // Extract ID for update check

        // If room ID exists, update; otherwise, insert new room
        const { data: room, error } = id
            ? await supabase.from('rooms').update(data).eq('id', id)
            : await supabase.from('rooms').insert(data);

        if (error) throw error;
        return room;
    } catch (error) {
        console.error('Error creating/updating room:', error);
    }
}

// Example: Populate table dynamically in roomPage.html
async function populateRoomTable(employeeId) {
    const rooms = await getRoomsByShift(employeeId);
    const tableBody = document.querySelector('#dynamic-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    rooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.floor}</td>
            <td>${room.type}</td>
        `;
        tableBody.appendChild(row);
    });
}
