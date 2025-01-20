
document.addEventListener("DOMContentLoaded", () => {
    const userRole = localStorage.getItem('userRole');
    const navbar = document.querySelector('.navbar-nav');
    const loginLink = document.querySelector('.search-box');
    navbar.innerHTML = '';
    const homeLink = document.createElement('li');
    homeLink.classList.add('nav-item');
    homeLink.innerHTML = `<a class="nav-link" href="index.html">Головна</a>`;
    navbar.appendChild(homeLink);
    if (!userRole) {

        navbar.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="#services">Послуги</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">Про нас</a></li>
            <li class="nav-item"><a class="nav-link" href="#price">Ціни</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact">Контакти</a></li>
        `;
        loginLink.innerHTML = `<a class="nav-link" href="login.html">
				<i class="fa fa-user text-white"></i></a>
			  </a>`;
    } else if (userRole === 'Manager') {
        navbar.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="groomers.html">Грумери</a></li>
            <li class="nav-item"><a class="nav-link" href="reports.html">Послуги</a></li>
            <li class="nav-item"><a class="nav-link" href="appointments.html">Записи</a></li>
        `;
        loginLink.innerHTML = `<a class="nav-link" href="" id="logoutLink" ><i class="fa fa-sign-out text-white"></i></a>`;
    } else if (userRole === 'Client') {
        navbar.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="animals.html">Мої тварини</a></li>
            <li class="nav-item"><a class="nav-link" href="appointments.html">Запис на послугу</a></li>
        `;
        loginLink.innerHTML = `<a class="nav-link" href="" id="logoutLink"><i class="fa fa-sign-out text-white"></i> </a>`;
    }
    document.getElementById('logoutLink').addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7016/api/Account/Logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                localStorage.removeItem('userRole');

                window.location.href = 'index.html'; 
            } else {
                alert('Помилка при виході!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Сталася помилка!');
        }
    });
});
  document.getElementById("submitLoginBtn").addEventListener("click", async ()=> {
    const username = document.getElementById("UserName").value;
    const password = document.getElementById("Password").value;
    const requestData = {
        UserName: username,
        Password: password
    };

    try {

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
            const userId = data.userId;
            const roles = data.roles || [];
            const isManager = roles.includes("Manager");
            localStorage.setItem('userId', userId);
            localStorage.setItem('userRole', isManager ? 'Manager' : (roles.includes("Client") ? 'Client' : 'Guest'));
            window.location.href = "index.html"; 
        } else {
            const errorText = await response.text();
            console.error("Помилка входу:", errorText);
            document.getElementById("Username-error").innerText = errorText;
        }
    } catch (error) {
        console.error("Помилка сервера:", error);
        document.getElementById("Username-error").innerText = "Сталася помилка, спробуйте пізніше.";
    }
});


