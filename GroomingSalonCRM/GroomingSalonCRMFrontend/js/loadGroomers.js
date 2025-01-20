document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://localhost:7016/api/Groomers"; 
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModal = document.getElementById("closeModal");
    const addGroomerBtn = document.getElementById("addGroomerBtn");
    const groomerTable = document.getElementById("groomerTable").querySelector("tbody");
    const groomerForm = document.getElementById("groomerForm");
    const groomerIdInput = document.getElementById("groomerId");
    let groomers = [];
    const openModal = (isEdit = false, index = null) => {
        modal.style.display = "flex";
        modalTitle.textContent = isEdit ? "Редагувати" : "Додати грумера";

        if (isEdit) {
            const groomer = groomers[index];
            groomerIdInput.value = groomer.id;
            document.getElementById("nmae").value = groomer.nmae;
            document.getElementById("surname").value = groomer.surname;
            document.getElementById("middlename").value = groomer.middlename;
            document.getElementById("specialty").value = groomer.specialty;
            editIndex = index;
        } else {
            groomerForm.reset();
            editIndex = null;
        }
    };

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    const fetchGroomers = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Помилка завантаження даних.");
            groomers = await response.json();
            renderTable();
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    groomerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const groomer = {
            id:groomerIdInput.value.trim() ? parseInt(groomerIdInput.value.trim()) : undefined,
            nmae: document.getElementById("nmae").value,
            surname: document.getElementById("surname").value,
            middlename: document.getElementById("middlename").value,
            specialty: document.getElementById("specialty").value,
        };

        try {
            const groomerIdVal = groomerIdInput.value.trim();
            let response;

            if (groomerIdVal) {
                 response = await fetch(`${apiUrl}/${groomer.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(groomer),
                });
                
                if (!response.ok) throw new Error("Помилка оновлення даних.");
                await fetchGroomers();  

            } else {

                 response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(groomer),
                });
                if (!response.ok) throw new Error("Помилка додавання даних.");
                const responseBody = await response.json();
                groomers.push(responseBody);
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
                deleteGroomer(groomers[index].id, index);
            }
        })
    );
    const deleteGroomer = async (id, index) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Помилка видалення даних.");
            groomers.splice(index, 1);
            renderTable();
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    const renderTable = () => {
        groomerTable.innerHTML = "";
        groomers.forEach((groomer, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${groomer.nmae}</td>
                <td>${groomer.surname}</td>
                <td>${groomer.middlename}</td>
                <td>${groomer.specialty}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Редагувати</button>
                    <button class="btn delete" data-index="${index}">Видалити</button>
                </td>
            `;
            groomerTable.appendChild(row);
        });

        document.querySelectorAll(".edit").forEach((btn) =>
            btn.addEventListener("click", (e) => openModal(true, e.target.dataset.index))
        );
        document.querySelectorAll(".delete").forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                deleteGroomer(groomers[index].id, index);
            })
        );
    };

    addGroomerBtn.addEventListener("click", () => openModal(false));

    fetchGroomers();

});
