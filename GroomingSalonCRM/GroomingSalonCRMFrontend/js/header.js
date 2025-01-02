document.addEventListener('DOMContentLoaded', async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    
    try {
      const response = await fetch('header.html'); // Завантаження хедера
      if (response.ok) {
        const headerHtml = await response.text();
        headerPlaceholder.innerHTML = headerHtml;
      } else {
        console.error('Не вдалося завантажити хедер:', response.status);
      }
    } catch (error) {
      console.error('Помилка при завантаженні хедера:', error);
    }
  });
  