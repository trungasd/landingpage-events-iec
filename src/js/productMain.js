// Sử dụng Fetch API để lấy danh sách sản phẩm từ API
fetch('http://localhost:3000/api/product')
.then(response => response.json()) // Chuyển đổi phản hồi thành JSON
.then(products => {
    const productList = document.getElementById('product-list'); // Chọn phần tử đích

    // Lặp qua từng sản phẩm và tạo các phần tử HTML để hiển thị
    products.forEach(product => {
        // Tạo một thẻ <div> cho từng sản phẩm
        const productItem = document.createElement('div');
        productItem.className = 'product-item'; // Thêm class cho <div>
        // Tạo nội dung HTML cho sản phẩm
        productItem.innerHTML = `
            <div class="product-item__img-bg" >
                <img src="${product.image}" class="product-item__img-book" alt="${product.name}"/>
            </div>
            <a class="product-item__name" href="${product.link}" target="_blank">${product.name}</a>
            <p class="product-item__price">${product.price}₫</p>
        `;
        
        // Thêm <div> sản phẩm vào danh sách sản phẩm
        productList.appendChild(productItem);
    });
})
.catch(error => console.error('Error fetching products:', error)); // Xử lý lỗi