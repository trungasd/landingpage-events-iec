

async function addNews() {
    var inputImage = document.getElementById('inputNewsImage').files[0];
    var inputTitle = document.getElementById('inputNewsTitle').value;
    var inputContent = document.getElementById('inputNewsContent').value;
    var inputLink = document.getElementById('inputNewsLink').value;

    if (!inputImage || !inputTitle || !inputContent || !inputLink) {
        alert('Vui lòng nhập đầy đủ thông tin tin tức.');
        return;
    }


    if (inputImage.size > 5 * 1024 * 1024) {
        alert('Hình ảnh quá lớn. Vui lòng chọn hình ảnh có kích thước dưới 5MB.');
        return;
    }


    const base64Image = await getFileAsBase64(inputImage);

    const newsData = {
        image: base64Image,
        title: inputTitle,
        content: inputContent,
        link: inputLink,
    };

    try {
        const res = await fetch('http://localhost:3000/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });

        if (!res.ok) {
            throw new Error('Failed to add news');
        }

        const data = await res.json();
        console.log('Thêm tin tức thành công:', data);
        loadNews();

        document.getElementById('inputNewsImage').value = '';
        document.getElementById('inputNewsTitle').value = '';
        document.getElementById('inputNewsContent').value = '';
        document.getElementById('inputNewsLink').value = '';

    } catch (error) {
        console.error('Lỗi khi thêm tin tức:', error.message);
        alert('Đã xảy ra lỗi khi thêm tin tức. Vui lòng thử lại sau.');
    }
}


function getFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function deleteNews(button) {
    var row = button.parentNode.parentNode;
    var newsId = row.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/news/${newsId}`, {
            method: 'DELETE',
            
        });

        if (!res.ok) {
            throw new Error('Failed to delete news');
        }

        row.parentNode.removeChild(row);

    } catch (error) {
        console.error('Error:', error);
    }
}

let currentNewsEditRow = null;

async function editNews(button) {
    currentNewsEditRow = button.parentNode.parentNode;
    var newsId = currentNewsEditRow.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/news/${newsId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Fetch request failed with status ${res.status}`);
        }

        const news = await res.json();
        console.log(news);

    
        document.getElementById('inputNewsTitle').value = news.title;
        document.getElementById('inputNewsContent').value = news.content;
        document.getElementById('inputNewsLink').value = news.link;

    
        currentNewsEditRow.dataset.image = news.image;
        currentNewsEditRow.dataset.title = news.title;
        currentNewsEditRow.dataset.content = news.content;
        currentNewsEditRow.dataset.link = news.link;

    
        document.querySelector('.btn__add-news').style.display = 'none';
        document.querySelector('.btn__update-news').style.display = 'inline';

    } catch (error) {
        console.error('Error fetching news:', error.message);
    }
}


async function updateNews() {
    if (!currentNewsEditRow) {
        console.error('Không có tin tức nào được chỉnh sửa.');
        return;
    }

    var inputImage = document.getElementById('inputNewsImage').files[0];
    var inputTitle = document.getElementById('inputNewsTitle').value;
    var inputContent = document.getElementById('inputNewsContent').value;
    var inputLink = document.getElementById('inputNewsLink').value;
    var newsId = currentNewsEditRow.dataset.id;

    if (!inputTitle || !inputContent || !inputLink) {
        alert('Vui lòng nhập đầy đủ thông tin tin tức.');
        return;
    }

    try {
    
        let base64Image = currentNewsEditRow.dataset.image;
        if (inputImage) {
            base64Image = await getFileAsBase64(inputImage);
        }

        const newsData = {
            image: base64Image,
            title: inputTitle,
            content: inputContent,
            link: inputLink,
        };

        const res = await fetch(`http://localhost:3000/api/news/${newsId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });

        if (!res.ok) {
            throw new Error(`Fetch request failed with status ${res.status}`);
        }

        var cells = currentNewsEditRow.getElementsByTagName('td');
        if (base64Image) {
            cells[0].innerHTML = `<img src="${base64Image}" width="100px" height="100px">`;
        }
        cells[1].innerHTML = inputTitle;
        cells[2].innerHTML = inputContent;
        cells[3].innerHTML = inputLink;

        document.getElementById('inputNewsImage').value = '';
        document.getElementById('inputNewsTitle').value = '';
        document.getElementById('inputNewsContent').value = '';
        document.getElementById('inputNewsLink').value = '';

        currentNewsEditRow = null;
        document.querySelector('.btn__add-news').style.display = 'inline';
        document.querySelector('.btn__update-news').style.display = 'none';

    } catch (error) {
        console.error('Error updating news:', error.message);
    }
}


async function loadNews() {
    try {
        const res = await fetch('http://localhost:3000/api/news', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch news');
        }

        const newsList = await res.json();

        var table = document.getElementById('newsTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        newsList.forEach(news => {
            var newRow = table.insertRow(table.rows.length);
            newRow.dataset.id = news._id;

            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            var cell5 = newRow.insertCell(4);

            cell1.innerHTML = '<img src="' + news.image + '" width="100px" height="100px">';
            cell2.innerHTML = news.title;
            cell3.innerHTML = news.content;
            cell4.innerHTML = news.link;
            cell5.innerHTML = '<button class="btn__delete-news" onclick="deleteNews(this)">Xóa</button>' +
                              '<button class="btn__edit-news" onclick="editNews(this)">Sửa</button>';
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadNews);
