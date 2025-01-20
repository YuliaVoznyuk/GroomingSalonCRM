const apiUrlAnimals = "https://localhost:7016/api/Animals"; 
const apiUrlServices = "https://localhost:7016/api/Services"; 
const apiUrlGroomers = "https://localhost:7016/api/Groomers"; 


async function loadAnimals() {
    const response = await fetch(apiUrlAnimals);
    if (!response.ok) {
        console.error('Помилка завантаження тварин');
        return [];
    }
    return response.json();
}


async function loadServices() {
    const response = await fetch(apiUrlServices);
    if (!response.ok) {
        console.error('Помилка завантаження послуг');
        return [];
    }
    return response.json();
}


async function loadGroomers() {
    const response = await fetch(apiUrlGroomers);
    if (!response.ok) {
        console.error('Помилка завантаження грумерів');
        return [];
    }
    return response.json();
}
function generateTimeSlots() {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
        times.push(`${hour}:00`);
    }
    return times;
}
async function loadAvailableTimes(date, groomerId) {
    const response = await fetch(`https://localhost:7016/api/AvailableTimes?date=${date}&groomerId=${groomerId}`);
    if (!response.ok) {
        console.error("Помилка завантаження доступних часів");
        return [];
    }
    return response.json(); 
}



async function loadDropdownData() {
    const animals = await loadAnimals();
    const services = await loadServices();
    const groomers = await loadGroomers();

    const animalSelect = document.getElementById("animal");
    animals.forEach(animal => {
        const option = document.createElement("option");
        option.value = animal.id;
        option.textContent = animal.name;
        animalSelect.appendChild(option);
    });

    const serviceSelect = document.getElementById("service");
    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });

    const groomerSelect = document.getElementById("groomer");
    groomers.forEach(groomer => {
        const option = document.createElement("option");
        option.value = groomer.id;
        option.textContent = groomer.surname;
        groomerSelect.appendChild(option);
    });
    const timeSlots = generateTimeSlots();
    const timeSelect = document.getElementById("appointmentTime");
    timeSlots.forEach(time => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

document.getElementById("appointmentDate").addEventListener("change", async (e) => {
    const selectedDate = document.getElementById("datePicker").value 
    const groomerId = document.getElementById("groomer").value;

    if (selectedDate && groomerId) {
        const formattedDate = selectedDate; 
        const times = await loadAvailableTimes(formattedDate, groomerId); 
        const timeSelect = document.getElementById("appointmentTime");

        timeSelect.innerHTML = "<option value=''>Оберіть час</option>";

        times.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    } else {
        
        const timeSelect = document.getElementById("appointmentTime");
        timeSelect.innerHTML = "<option value=''>Оберіть час</option>";
    }
});
window.onload = loadDropdownData;
document.getElementById("recordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const animalId = document.getElementById("animal").value;
    const serviceId = document.getElementById("service").value;
    const groomerId = document.getElementById("groomer").value;
    const notes = document.getElementById("notes").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;
  
    const fullDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    const record = {
        animalId: animalId,
        serviceId: serviceId,
        groomerId: groomerId,
        notes:notes,
        date: fullDateTime
    };
    try {
        const response = await fetch("https://localhost:7016/api/Appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) throw new Error("Помилка запису даних.");

        alert("Запис успішно створено!");

        loadAvailableTimes(appointmentDate).then((availableTimes) => {
            const timeSelect = document.getElementById("appointmentTime");
            timeSelect.innerHTML = "<option value=''>Оберіть час</option>";
            availableTimes.forEach((time) => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
        });
    } catch (error) {
        console.error("Помилка:", error);
        alert("Сталася помилка під час запису.");
    }
});
