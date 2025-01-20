document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://localhost:7016/api/Animals"; 
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModal = document.getElementById("closeModal");
    const addAnimalBtn = document.getElementById("addAnimalBtn");
    const animalTable = document.getElementById("animalTable").querySelector("tbody");
    const animalForm = document.getElementById("animalForm");
    const animalIdInput = document.getElementById("animalId");
    let animals = [];
    const openModal = (isEdit = false, index = null) => {
        modal.style.display = "flex";
        modalTitle.textContent = isEdit ? "Редагувати" : "Додати тварину";

        if (isEdit) {
            const animal = animals[index];
            animalIdInput.value = animal.id;
            document.getElementById("name").value = animal.name;
            document.getElementById("species").value = animal.species;
            document.getElementById("breed").value = animal.breed;
            document.getElementById("age").value = animal.age;
            editIndex = index;
        } else { 
            animalForm.reset();
            editIndex = null;
        }
    };
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
    const fetchAnimals = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Помилка завантаження даних.");
            animals = await response.json();
            renderTable();
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    animalForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const clientId = localStorage.getItem("userId");
        const animal= {
            id:animalIdInput.value.trim() ? parseInt(animalIdInput.value.trim()) : undefined,
            name: document.getElementById("name").value,
            species: document.getElementById("species").value,
            breed: document.getElementById("breed").value,
            age: parseInt(document.getElementById("age").value),
            clientId: parseInt(clientId)
        
        };
       
        try {
            const animalIdVal = animalIdInput.value.trim();
            let response;

            if (animalIdVal) {

                 response = await fetch(`${apiUrl}/${animalIdVal}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(animal),
                });
                
                if (!response.ok) throw new Error("Помилка оновлення даних.");
                await fetchAnimals();  
            } else {
                 response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(animal),

                });
               
                if (!response.ok) throw new Error("Помилка додавання даних.");
                const responseBody = await response.json();
                animals.push(responseBody);
            }
            renderTable();
            modal.style.display = "none";
        } catch (error) {
            console.error("Помилка:", error);
        }
    });
    document.querySelectorAll(".delete").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            if (confirm("Ви впевнені, що хочете видалити цього грумера?")) {
                deleteAnimal(animals[index].id, index);
            }
        })
    );
    const deleteAnimal = async (id, index) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Помилка видалення даних.");
            animals.splice(index, 1);
            renderTable();
        } catch (error) {
            console.error("Помилка:", error);
        }
    };
    const renderTable = () => {
        animalTable.innerHTML = "";
        animals.forEach((animal, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${animal.name}</td>
                <td>${animal.species}</td>
                <td>${animal.breed}</td>
                <td>${animal.age}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Редагувати</button>
                    <button class="btn delete" data-index="${index}">Видалити</button>
                </td>
            `;
            animalTable.appendChild(row);
        });

        document.querySelectorAll(".edit").forEach((btn) =>
            btn.addEventListener("click", (e) => openModal(true, e.target.dataset.index))
        );
        document.querySelectorAll(".delete").forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                deleteAnimal(animals[index].id, index);
            })
        );
    };

    addAnimalBtn.addEventListener("click", () => openModal(false));

    fetchAnimals();

});
