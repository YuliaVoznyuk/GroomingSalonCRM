document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо роль користувача з localStorage
    const userRole = localStorage.getItem('userRole');

    // Елементи меню
    const menu = document.getElementById('menu-items');

  if (userRole === 'Manager') {
      // Додаємо вкладку "Грумери"
      const groomersItem = document.createElement('li');
      groomersItem.classList.add('nav-item');
      groomersItem.innerHTML = '<a class="nav-link" href="#groomers">Грумери</a>';
      menu.appendChild(groomersItem);

      // Видаляємо непотрібні вкладки
      const aboutItem = menu.querySelector('a[href="#about"]').parentElement;
      const priceItem = menu.querySelector('a[href="#price"]').parentElement;
      if (aboutItem) aboutItem.remove();
      if (priceItem) priceItem.remove();
  }
});