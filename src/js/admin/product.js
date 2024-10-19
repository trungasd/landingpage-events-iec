
let currentImageSrc = ''; // Biến lưu trữ đường dẫn hình ảnh của sản phẩm đang chỉnh sửa

// Hàm tìm kiếm sản phẩm
function searchProduct() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
    var table = document.getElementById('productTable');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'); // Lấy tất cả các hàng trong bảng

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var productName = cells[2].innerHTML.toLowerCase(); // Lấy tên sản phẩm từ cột thứ ba và chuyển thành chữ thường

        if (productName.includes(searchInput)) {
            rows[i].style.display = ''; // Hiển thị hàng nếu tên sản phẩm chứa từ khóa tìm kiếm
        } else {
            rows[i].style.display = 'none'; // Ẩn hàng nếu không khớp
        }
    }
}

// Hàm chuyển đổi file thành base64
function getFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Hàm thêm sản phẩm
 async function addProduct() {
    // Lấy giá trị đầu vào
    var inputImage = document.getElementById('inputProductImage').files[0];
    var inputPrice = document.getElementById('inputProductPrice').value;
    var inputName = document.getElementById('inputProductName').value;
    var inputLink = document.getElementById('inputProductLink').value;

    // Kiểm tra các giá trị đầu vào
    if (!inputImage || !inputPrice || !inputName || !inputLink) {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
        return;
    }

    if (inputPrice < 0) {
        alert('Giá sản phẩm phải lớn hơn 0');
        return;
    }

    // Kiểm tra kích thước hình ảnh
    if (inputImage.size > 5 * 1024 * 1024) { // 5MB
        alert('Hình ảnh quá lớnn. Vui lòng chọn hình ảnh có kích thước dưới 5MB.');
        return;
    }

    const base64Image = await getFileAsBase64(inputImage);

    const productData = {
        image: base64Image,
        price: inputPrice,
        name: inputName,
        link: inputLink,
    };

    try {
        const res = await fetch(`http://localhost:3000/api/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!res.ok) {
            throw new Error('Failed to add product');
        }

        const data = await res.json();
        console.log('Thêm sản phẩm thành công:', data);
        loadProduct(); // Cập nhật bảng sau khi thêm sản phẩm mới

        // Xóa dữ liệu trong các ô input
        document.getElementById('inputProductImage').value = '';
        document.getElementById('inputProductPrice').value = '';
        document.getElementById('inputProductName').value = '';
        document.getElementById('inputProductLink').value = '';
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error.message);
        alert('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại sau.');
    }
}

// Hàm xóa sản phẩm
async function deleteProduct(button) {
    var row = button.parentNode.parentNode;
    var productId = row.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error('Failed to delete product');
        }

        row.parentNode.removeChild(row); // Xóa hàng trong bảng
    } catch (error) {
        console.error('Error:', error);

    }
}

// Đặt biến toàn cục để lưu trữ hàng sản phẩm đang chỉnh sửa
let currentProductEditRow = null;

// Hàm chỉnh sửa sản phẩm
async function editProduct(button) {
    currentProductEditRow = button.parentNode.parentNode; // Lưu hàng hiện tại
    var productId = currentProductEditRow.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to get product ${res.status}`);
        }

        const product = await res.json();
        console.log(product);
        // Điền vào biểu mẫu với thông tin của sản phẩm đã chọn
        document.getElementById('inputProductPrice').value = product.price;
        document.getElementById('inputProductName').value = product.name;
        document.getElementById('inputProductLink').value = product.link;

        // Lưu thông tin hàng tin tức đang chỉnh sửa để sử dụng trong hàm updateProduct
        currentProductEditRow.dataset.image = product.image;
        currentProductEditRow.dataset.price = product.price;
        currentProductEditRow.dataset.name = product.name;
        currentProductEditRow.dataset.link = product.link;
    
        // Hiển thị nút "Cập nhật sản phẩm" và ẩn nút "Thêm sản phẩm"
        document.querySelector('.btn__add-product').style.display = 'none';
        document.querySelector('.btn__update-product').style.display = 'inline';
    } catch (error) {
        console.error('Error fetching product:', error.message);
    }
}

// Hàm cập nhật sản phẩm
async function updateProduct() {
    if (!currentProductEditRow) {
        alert('Không có sản phẩm nào đang được chỉnh sửa.');
        return;
    }

    // Lấy giá trị đầu vào
    var inputImage = document.getElementById('inputProductImage').files[0];
    var inputPrice = document.getElementById('inputProductPrice').value;
    var inputName = document.getElementById('inputProductName').value;
    var inputLink = document.getElementById('inputProductLink').value;
    var productId = currentProductEditRow.dataset.id;

    // Kiểm tra các giá trị đầu vào
    if (!inputPrice || !inputName || !inputLink) {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
        return;
    }

    if (inputPrice < 0) {
        alert('Giá sản phẩm phải lớn hơn 0');
        return;
    }

    try {
        // Chuyển đổi hình ảnh thành base64
        let base64Image = currentProductEditRow.dataset.image;
        if (inputImage) {
            base64Image = await getFileAsBase64(inputImage);
        }

        const productData = {
            image: base64Image,
            price: inputPrice,
            name: inputName,
            link: inputLink,
        };

        const res = await fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!res.ok) {
            throw new Error(`Failed to update product ${res.status}`);
        }

        // Cập nhật các giá trị vào hàng hiện tại
        var cells = currentProductEditRow.getElementsByTagName('td');
    
        // Cập nhật ảnh nếu người dùng chọn ảnh mới
        if (inputImage) {
            cells[0].innerHTML = `<img src="${base64Image}" width="100px" height="100px">`;
        } 
        cells[1].innerHTML = inputPrice;
        cells[2].innerHTML = inputName;
        cells[3].innerHTML = inputLink;
    
        // Xóa giá trị trong biểu mẫu
        document.getElementById('inputProductImage').value = '';
        document.getElementById('inputProductPrice').value = '';
        document.getElementById('inputProductName').value = '';
        document.getElementById('inputProductLink').value = '';
    
        // Đặt lại biến hàng hiện tại
        currentEditRow = null;
    
        // Hiển thị lại nút "Thêm sản phẩm" và ẩn nút "Cập nhật sản phẩm"
        document.querySelector('.btn__add-product').style.display = 'inline';
        document.querySelector('.btn__update-product').style.display = 'none';

    } catch (error) {
        console.error('Error updating product:', error.message);
    }
}

// Hàm tải sản phẩm từ cơ sở dữ liệu và hiển thị trong bảng
async function loadProduct() {
    try {
        const res = await fetch('http://localhost:3000/api/product',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fecth product');
        }

        const productList = await res.json();

        var table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        productList.forEach(product => {
            var newRow = table.insertRow(table.rows.length);
            newRow.dataset.id = product._id;

            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            var cell5 = newRow.insertCell(4);

            // Đặt giá trị trong bảng
            cell1.innerHTML = '<img src="' + product.image + '" width="100px" height="100px">';
            cell2.innerHTML = product.price;
            cell3.innerHTML = product.name;
            cell4.innerHTML = product.link;
            cell5.innerHTML = '<button class="btn__delete-product" onclick="deleteProduct(this)">Xóa</button>' + 
                              '<button class="btn__edit-product" onclick="editProduct(this)">Sửa</button>';
    
        });
    } catch(error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded',loadProduct);