document.getElementById('submitBtnRegisterClient').addEventListener('click', async () => {
    const formData = {
        Surname: document.getElementById('Surname').value,
        Name: document.getElementById('Name').value,
        Middlename: document.getElementById('Middlename').value,
        Username: document.getElementById('Username').value,
        Email: document.getElementById('Email').value,
        Password: document.getElementById('Password').value,
        Phone: document.getElementById('Phone').value,
        ConfirmPassword: document.getElementById('ConfirmPassword').value
    };

    try {
        const response = await fetch('https://localhost:7016/api/Account/RegisterClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Статус відповіді:', response.status);

        if (response.ok) {
          const text = await response.text();
          if (text) {
              const result = JSON.parse(text);
              alert('Реєстрація успішна!');
              console.log(result);
              handleRegistrationResponse(result);
        }} else {
            const error = await response.json().catch(() => null);
            alert('Помилка реєстрації: ' + JSON.stringify(error || 'Неочікувана відповідь'));
        }
    } catch (err) {
        alert('Виникла помилка: ' + err.message);
    }
});
function handleRegistrationResponse(response) {
  localStorage.setItem('userRole', response.Role);

  window.location.href = 'index.html';
}