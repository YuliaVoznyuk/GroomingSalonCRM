

  
  document.getElementById("submitLoginBtn").addEventListener("click", async ()=> {
    //event.preventDefault(); // Запобігаємо стандартній відправці форми

    // Отримуємо дані з форми
    const username = document.getElementById("UserName").value;
    const password = document.getElementById("Password").value;

    // Формуємо об'єкт для запиту
    const requestData = {
        UserName: username,
        Password: password
    };

    try {
        // Виконуємо POST-запит
        const response = await fetch('https://localhost:7016/api/Account/Login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Успішний вхід:", data);
            const isManager = Array.isArray(data.Roles) && data.Roles.includes("Manager");
    
            localStorage.setItem('userRole', isManager ? 'Manager' : 'User');

            // Виконуємо дії після успішного входу, наприклад, перенаправлення
            window.location.href = "index.html"; // Заміна на потрібний URL
        } else {
            const errorText = await response.text();
            console.error("Помилка входу:", errorText);

            // Відображаємо повідомлення про помилку
            document.getElementById("Username-error").innerText = errorText;
        }
    } catch (error) {
        console.error("Помилка сервера:", error);
        document.getElementById("Username-error").innerText = "Сталася помилка, спробуйте пізніше.";
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');

    // Елементи меню
    const navbar = document.querySelector('.navbar-nav');
    const loginLink = document.querySelector('.search-box');

    if (userRole === 'Manager') {
        // Оновлення меню для менеджера
        navbar.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="index.html">Головна</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#managers">Менеджери</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#reports">Звіти</a>
        </li>
        `;

        // Змінюємо іконку "Увійти" на "Вийти"
        loginLink.innerHTML = `
            <a class="nav-link" href="logout.html">
                <i class="fa fa-sign-out text-white"></i> Вийти
            </a>`;
    } else {
        // Відображаємо іконку "Увійти", якщо користувач не авторизований
        loginLink.innerHTML = `
            <a class="nav-link" href="login.html">
                <i class="fa fa-user text-white"></i>
            </a>`;
    }
      // Отримуємо роль користувача з localStorage
    //   const userRole = localStorage.getItem('userRole');

    //   // Елементи меню
    //   const navbar = document.querySelector('.navbar-nav');
    //   const loginLink = document.querySelector('.search-box');

    // Створюємо вкладки для менеджера
   // const homeLink = document.createElement('li');
    //homeLink.classList.add('nav-item');
    //homeLink.innerHTML = `<a class="nav-link" href="index.html">Головна</a>`;
    //navbar.appendChild(homeLink);

    // Додаємо нові вкладки для менеджера
   // const newLinks = [
     //   { name: 'Менеджери', href: '#managers' },
       // { name: 'Звіти', href: '#reports' },
    //];

   // newLinks.forEach(link => {
     //   const li = document.createElement('li');
       // li.classList.add('nav-item');
        //li.innerHTML = `<a class="nav-link" href="${link.href}">${link.name}</a>`;
        //navbar.appendChild(li);
   // });




    //if (userRole === 'Manager') {
      //loginLink.innerHTML = `<a class="nav-link" href="logout.html"><i class="fa fa-sign-out text-white"></i> Вийти</a>`;

    //}
    //else
    //{
     // loginLink.innerHTML = `<a class="nav-link" href="login.html"><i class="fa fa-user text-white"></i></a>`;

    //}
    


    // if (userRole === 'Manager') {
    //     navbar.innerHTML = `
    //     <li class="nav-item">
    //         <a class="nav-link" href="index.html">Головна</a>
    //     </li>
    // `;
    //     const newLinks = [
    //         { name: 'Менеджери', href: '#managers' },
    //         { name: 'Звіти', href: '#reports' },
    //     ];

    //     newLinks.forEach(link => {
    //         const li = document.createElement('li');
    //         li.classList.add('nav-item');
    //         li.innerHTML = `<a class="nav-link" href="${link.href}">${link.name}</a>`;
    //         navbar.appendChild(li);
    //     });

    //     // Змінюємо значок "Увійти" на "Вийти"
    //     loginLinkContainer.innerHTML = `
    //         <a class="nav-link" href="logout.html">
    //             <i class="fa fa-sign-out text-white"></i> Вийти
    //         </a>`;
    // } else {
    //     // Відображаємо іконку "Увійти", якщо користувач не авторизований
    //     loginLinkContainer.innerHTML = `
    //         <a class="nav-link" href="login.html">
    //             <i class="fa fa-user text-white"></i>
    //         </a>`;
    // }
  });