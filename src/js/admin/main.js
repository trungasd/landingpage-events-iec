// Hàm để hiển thị phần tử được chọn và ẩn các phần tử khác
function showContent(contentId) {
  // Lấy tất cả các phần tử có class là 'content__body'
  var contents = document.querySelectorAll(".content__body");

  // Duyệt qua tất cả các phần tử và ẩn chúng
  contents.forEach(function (content) {
    content.style.display = "none";
  });

  // Hiển thị phần tử có id tương ứng với contentId
  document.getElementById(contentId).style.display = "block";
}

// Lắng nghe sự kiện click trên các thẻ <a> trong menu
document.querySelectorAll(".sidebar__menu-item").forEach(function (menuItem) {
  menuItem.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    var targetId = menuItem.getAttribute("data-target"); // Lấy giá trị data-target
    showContent(targetId); // Hiển thị nội dung tương ứng
  });
});
// Mặc định hiển thị 'Trang chủ'
showContent("content__home");

// Lấy tất cả các liên kết trong menu
const menuItems = document.querySelectorAll(".sidebar__menu-item");

// Thêm sự kiện 'click' cho mỗi liên kết
menuItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết

    // Loại bỏ class 'action' từ tất cả các liên kết
    menuItems.forEach((link) => link.classList.remove("action"));

    // Thêm class 'action' vào liên kết đã nhấn
    this.classList.add("action");
  });
});

//Thời Gian
function time() {
  var today = new Date();
  var weekday = new Array(7);
  weekday[0] = "Chủ Nhật";
  weekday[1] = "Thứ Hai";
  weekday[2] = "Thứ Ba";
  weekday[3] = "Thứ Tư";
  weekday[4] = "Thứ Năm";
  weekday[5] = "Thứ Sáu";
  weekday[6] = "Thứ Bảy";
  var day = weekday[today.getDay()];
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  nowTime = h + " giờ " + m + " phút " + s + " giây";
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = day + ", " + dd + "/" + mm + "/" + yyyy;
  tmp = '<span class="date"> ' + today + " - " + nowTime + "</span>";
  document.getElementById("clock").innerHTML = tmp;
  clocktime = setTimeout("time()", "1000", "Javascript");

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
}

//Mặc định trang login
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/src/publics/login.html";
  }
});

//Xử lý nút đăng xuất
document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  window.location.href = "/src/publics/login.html";
});
