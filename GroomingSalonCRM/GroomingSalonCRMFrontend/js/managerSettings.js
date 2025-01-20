document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');

    const menu = document.getElementById('menu-items');

  if (userRole === 'Manager') {
      const groomersItem = document.createElement('li');
      groomersItem.classList.add('nav-item');
      groomersItem.innerHTML = '<a class="nav-link" href="#groomers">Грумери</a>';
      menu.appendChild(groomersItem);

      const aboutItem = menu.querySelector('a[href="#about"]').parentElement;
      const priceItem = menu.querySelector('a[href="#price"]').parentElement;
      if (aboutItem) aboutItem.remove();
      if (priceItem) priceItem.remove();
  }
});