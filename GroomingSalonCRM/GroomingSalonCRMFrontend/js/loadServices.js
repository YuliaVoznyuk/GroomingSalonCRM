
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://localhost:7016/api/Services"; 
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModal = document.getElementById("closeModal");
  const addServiceBtn = document.getElementById("addServiceBtn");
  const serviceTable = document.getElementById("serviceTable").querySelector("tbody");
  const serviceForm = document.getElementById("serviceForm");
  const serviceIdInput = document.getElementById("serviceId");
  let services = [];
  const openModal = (isEdit = false, index = null) => {
      modal.style.display = "flex";
      modalTitle.textContent = isEdit ? "Редагувати" : "Додати послугу";

      if (isEdit) {
          const service = services[index];
          serviceIdInput.value = service.id;
          document.getElementById("name").value = service.name;
          document.getElementById("description").value = service.description;
          document.getElementById("price").value = service.price;
          editIndex = index;
      } else {
        serviceForm.reset();
          editIndex = null;
      }
  };

  closeModal.addEventListener("click", () => {
      modal.style.display = "none";
  });

  const fetchServices = async () => {
      try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error("Помилка завантаження даних.");
          services = await response.json();
          renderTable();
      } catch (error) {
          console.error("Помилка:", error);
      }
  };

  serviceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const service = {
        id:serviceIdInput.value.trim() ? parseInt(serviceIdInput.value.trim()) : undefined,

          name: document.getElementById("name").value,
          description: document.getElementById("description").value,
          price: document.getElementById("price").value,
      };

      try {
          const serviceIdVal = serviceIdInput.value.trim();
          let response;

          if (serviceIdVal) {
               response = await fetch(`${apiUrl}/${service.id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(service),
              });
              
              if (!response.ok) throw new Error("Помилка оновлення даних.");
              await fetchServices();  

          } else {
               response = await fetch(apiUrl, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(service),
              });
              if (!response.ok) throw new Error("Помилка додавання даних.");
              const responseBody = await response.json();
                            services.push(responseBody);
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
          if (confirm("Ви впевнені, що хочете видалити цю послугу?")) {
            deleteService(services[index].id, index);
          }
      })
  );
  const deleteService = async (id, index) => {
      try {
          const response = await fetch(`${apiUrl}/${id}`, {
              method: "DELETE",
          });
          if (!response.ok) throw new Error("Помилка видалення даних.");
          services.splice(index, 1);
          renderTable();
      } catch (error) {
          console.error("Помилка:", error);
      }
  };

  const renderTable = () => {
    serviceTable.innerHTML = "";
    services.forEach((service, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${service.name}</td>
              <td>${service.description}</td>
              <td>${service.price}</td>
              <td>
                  <button class="btn edit" data-index="${index}">Редагувати</button>
                  <button class="btn delete" data-index="${index}">Видалити</button>
              </td>
          `;
          serviceTable.appendChild(row);
      });

      document.querySelectorAll(".edit").forEach((btn) =>
          btn.addEventListener("click", (e) => openModal(true, e.target.dataset.index))
      );
      document.querySelectorAll(".delete").forEach((btn) =>
          btn.addEventListener("click", (e) => {
              const index = e.target.dataset.index;
              deleteService(services[index].id, index);
          })
      );
  };

  addServiceBtn.addEventListener("click", () => openModal(false));

  fetchServices();

});
