document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const eyeIcon = document.getElementById('eyeicon');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Lấy giá trị từ các ô nhập email và mật khẩu
        const email = emailInput.value;
        const password = passwordInput.value;

        // Gửi yêu cầu đăng nhập đến API
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Giả sử API trả về một token khi đăng nhập thành công
                localStorage.setItem('authToken', data.token);
                window.location.href = '/src/publics/admin.html';
            } else {
                alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        });
    });

    // Logic hiển thị/ẩn mật khẩu
    eyeIcon.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Thay đổi icon (Bạn cũng có thể thay đổi hình ảnh để biểu thị trạng thái 'hiển thị' hoặc 'ẩn')
        eyeIcon.src = type === 'password' ? '../assets/img/eye-close.png' : '../assets/img/eye-open.png';
    });
});