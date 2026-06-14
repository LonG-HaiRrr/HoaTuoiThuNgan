document.addEventListener("DOMContentLoaded", function() {

    // 1. CẤU HÌNH ĐƯỜNG LINK GOOGLE APP SCRIPT TẠI ĐÂY
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

    // 2. HIỆU ỨNG CUỘN TRANG XUẤT HIỆN DẦN (SCROLL REVEAL ANIMATION)
    const revealElements = document.querySelectorAll(".reveal");

    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85; // Điểm kích hoạt khi cuộn đến 85% màn hình

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.add('active'); // Thêm class để CSS xử lý hiển thị
            }
        });
    }

    window.addEventListener("scroll", checkReveal);
    checkReveal(); // Chạy ngay lập tức khi tải trang để quét các phần tử đầu tiên


    // 3. ĐÓNG MỞ MENU TRÊN THIẾT BỊ DI ĐỘNG (MOBILE MENU TOGGLE)
    const menuToggle = document.getElementById("mobile-menu");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link, .btn-nav");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            menuToggle.classList.toggle("is-active");
            navbar.classList.toggle("active");
        });
    }

    // Tự động đóng menu di động lại khi bấm vào bất kỳ một mục liên kết nào
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("is-active");
            navbar.classList.remove("active");
        });
    });


    // 4. XỬ LÝ GỬI FORM THÔNG TIN TRỰC TIẾP LÊN GOOGLE SHEET
    const form = document.getElementById('booking-sheet-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); // Chặn hành động tải lại trang mặc định của Form

            // Cập nhật giao diện nút bấm sang trạng thái chờ xử lý hiệu ứng đẹp mắt
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> ĐANG GỬI THÔNG TIN...</span>';

            // Thực hiện Fetch API gửi dữ liệu dạng FormData
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                // Thông báo thành công
                alert('Cảm ơn Quý khách! Dữ liệu đặt tiệc của Quý khách đã gửi thẳng về hệ thống Google Excel Excel thành công. Nhân viên tư vấn Hương Việt sẽ sớm gọi điện lại cho bạn.');
                
                form.reset(); // Xóa sạch dữ liệu vừa gõ trên Form
                resetSubmitButton();
            })
            .catch(error => {
                console.error('Lỗi kết nối Google Sheets:', error);
                alert('Đã xảy ra lỗi hệ thống trong quá trình kết nối tới dữ liệu Excel. Quý khách vui lòng thử lại sau.');
                resetSubmitButton();
            });
        });
    }

    function resetSubmitButton() {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.innerHTML = '<span>GỬI THÔNG TIN NGAY</span>';
    }
});