

async function addEvent() {
    var inputImage = document.getElementById('inputEventImage').files[0];
    var inputTitle = document.getElementById('inputEventTitle').value;
    var inputContent = document.getElementById('inputEventContent').value;
    var inputLink = document.getElementById('inputEventLink').value;

    console.log(inputImage);
    console.log(inputTitle);
    console.log(inputContent);
    console.log(inputLink);

    if (!inputImage || !inputTitle || !inputContent || !inputLink) {
        alert('Vui lòng nhập đầy đủ thông tin sự kiện.');
        return;
    }


    if (inputImage.size > 5 * 1024 * 1024) {
        alert('Hình ảnh quá lớn. Vui lòng chọn hình ảnh có kích thước dưới 5MB.');
        return;
    }


    const base64Image = await getFileAsBase64(inputImage);

    const eventData = {
        image: base64Image,
        title: inputTitle,
        content: inputContent,
        link: inputLink,
    };

    try {
        const res = await fetch('http://localhost:3000/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        console.log(res);

        if (!res.ok) {
            throw new Error('Failed to add event');
        }

        const data = await res.json();
        console.log('Thêm sự kiện thành công:', data);
        loadEvent();

        document.getElementById('inputEventImage').value = '';
        document.getElementById('inputEventTitle').value = '';
        document.getElementById('inputEventContent').value = '';
        document.getElementById('inputEventLink').value = '';
    } catch (error) {
        console.error('Lỗi khi thêm sự kiện:', error.message);
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

async function deleteEvent(button) {
    var row = button.parentNode.parentNode;
    var eventId = row.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete event');
        }

        row.parentNode.removeChild(row);

    }catch (error) {
        console.error('Error:', error);
    }
}


let currentEventEditRow = null;

async function editEvent(button) {
    currentEventEditRow = button.parentNode.parentNode;
    var eventId = currentEventEditRow.dataset.id;

    try {
        const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error(`Fetch request failed with status ${res.status}`);
        }

        const event = await res.json();
        console.log(event);

    
        document.getElementById('inputEventTitle').value = event.title;
        document.getElementById('inputEventContent').value = event.content;
        document.getElementById('inputEventLink').value = event.link;

    
        currentEventEditRow.dataset.image = event.image;
        currentEventEditRow.dataset.title = event.title;
        currentEventEditRow.dataset.content = event.content;
        currentEventEditRow.dataset.link = event.link;

    
        document.querySelector('.btn__add-event').style.display = 'none';
        document.querySelector('.btn__update-event').style.display = 'inline';
    }catch (error) {
        console.error('Error fetching event:', error.message);
    }
}

async function updateEvent() {
    if (!currentEventEditRow) {
        console.error('Không có sự kiện nào được chỉnh sửa.');
        return;
    }

    var inputImage = document.getElementById('inputEventImage').files[0];
    var inputTitle = document.getElementById('inputEventTitle').value;
    var inputContent = document.getElementById('inputEventContent').value;
    var inputLink = document.getElementById('inputEventLink').value;
    var eventId = currentEventEditRow.dataset.id;

    if (!inputTitle ||!inputContent ||!inputLink) {
        alert('Vui lòng nhập đầy đ�� thông tin sự kiện.');
        return;
    }

    try {
    
        let base64Image = currentEventEditRow.dataset.image;
        if (inputImage) {
            base64Image = await getFileAsBase64(inputImage);
        }

        const eventData = {
            image: base64Image,
            title: inputTitle,
            content: inputContent,
            link: inputLink,
        };

        const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!res.ok) {
            throw new Error(`Fetch request failed: ${res.status}`);
        }

        var cells = currentEventEditRow.getElementsByTagName('td');
        if (base64Image) {
            cells[0].innerHTML = `<img src="${base64Image}" width="100px" height="100px">`;
        }

        cells[1].innerHTML = inputTitle;
        cells[2].innerHTML = inputContent;
        cells[3].innerHTML = inputLink;

        document.getElementById('inputEventImage').value = '';
        document.getElementById('inputEventTitle').value = '';
        document.getElementById('inputEventContent').value = '';
        document.getElementById('inputEventLink').value = '';

        currentEventEditRow = null;
        document.querySelector('btn__add-event').style.display = 'inline';
        document.querySelector('.btn__update-event').style.display = 'none';
    }catch (error) {
        console.error('Error updating event:', error.message);
    }
}

async function loadEvent() {
    try {
        const res = await fetch('http://localhost:3000/api/event', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error('Fetch request failed:');
        }

        const eventList = await res.json();

        var table = document.getElementById('eventTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        eventList.forEach(event => {
            var newRow = table.insertRow(table.rows.length);
            newRow.dataset.id = event._id;

            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            var cell5 = newRow.insertCell(4);

            cell1.innerHTML = '<img src="' + event.image + '" width="100px" height="100px">';
            cell2.innerHTML = event.title;
            cell3.innerHTML = event.content;
            cell4.innerHTML = event.link;
            cell5.innerHTML = '<button class="btn__delete-event" onclick="deleteEvent(this)">Xóa</button>' +
                              '<button class="btn__edit-event" onclick="editEvent(this)">Sửa</button>';
        });

    } catch (error) {
        console.error('Error loading events:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadEvent);


