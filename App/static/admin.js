document.getElementById('admin-login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const adminId = document.getElementById('admin-id').value;
    const adminPassword = document.getElementById('admin-password').value;

    fetch('/admin-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            admin_id: adminId,
            admin_password: adminPassword,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('login-message');
        if (data.success) {
            messageElement.style.color = 'green';
            messageElement.textContent = 'Login successful!';
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Incorrect ID or Password. Please try again.';
        }
    })
    .catch(error => console.error('Error:', error));
});
