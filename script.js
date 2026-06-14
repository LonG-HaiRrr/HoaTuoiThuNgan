document.addEventListener("DOMContentLoaded", function() {

    // =========================================================================
    // 1. THUẬT TOÁN AUTO-DETECT ẢNH (KHÔNG CẦN KHAI BÁO SỐ LƯỢNG)
    // Cách dùng: Đổi tên tất cả ảnh thành banner (1).jpg, banner (2).jpg...
    // Script sẽ tự động dò tìm đến khi hết ảnh thì thôi.
    // =========================================================================
    
    const sliderContainer = document.getElementById('hero-slider');
    let validImages = [];
    let checkIndex = 1;
    const maxCheck = 30; // Quét tối đa 30 ảnh để tránh treo trình duyệt

    function loadDynamicImages() {
        if (checkIndex > maxCheck) {
            initSlider(); // Dừng quét nếu vượt quá 30 ảnh
            return;
        }

        let img = new Image();
        img.onload = function() {
            // Nếu ảnh tồn tại, đưa vào mảng và tiếp tục quét số tiếp theo
            validImages.push(`img/b (${checkIndex}).jpg`);
            checkIndex++;
            loadDynamicImages();
        };
        img.onerror = function() {
            // Nếu lỗi (nghĩa là đã hết ảnh ở thư mục), lập tức khởi chạy Slider
            initSlider();
        };
        img.src = `img/b (${checkIndex}).jpg`;
    }

    // Bắt đầu quá trình dò tìm ngay khi tải trang
    loadDynamicImages();

    function initSlider() {
        if (validImages.length === 0) return; // Không có ảnh nào thì bỏ qua

        // Sinh HTML cho từng ảnh tìm được
        validImages.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide' + (index === 0 ? ' active' : '');
            slide.style.backgroundImage = `url('${src}')`;
            sliderContainer.appendChild(slide);
        });

        // Nếu có từ 2 ảnh trở lên thì thiết lập vòng lặp chuyển đổi
        if (validImages.length > 1) {
            let currentSlideIndex = 0;
            const slides = document.querySelectorAll('.hero-slide');
            
            // THỜI GIAN ĐỔI ẢNH: Đã chỉnh xuống 4 giây (4000ms) để khớp với tốc độ zoom 5 giây của CSS
            const slideIntervalTime = 4000; 

            setInterval(() => {
                slides[currentSlideIndex].classList.remove('active');
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                slides[currentSlideIndex].classList.add('active');
            }, slideIntervalTime);
        }
    }


    // =========================================================================
    // CÁC CHỨC NĂNG CÒN LẠI GIỮ NGUYÊN
    // =========================================================================

    // 2. HIỆU ỨNG CUỘN TRANG XUẤT HIỆN DẦN
    const revealElements = document.querySelectorAll(".reveal");
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    }
    window.addEventListener("scroll", checkReveal);
    checkReveal();

    // 3. ĐÓNG MỞ MENU TRÊN THIẾT BỊ DI ĐỘNG
    const menuToggle = document.getElementById("mobile-menu");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link, .btn-nav");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            menuToggle.classList.toggle("is-active");
            navbar.classList.toggle("active");
        });
    }
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("is-active");
            navbar.classList.remove("active");
        });
    });

    // 4. XỬ LÝ GỬI FORM THÔNG TIN (Cấu hình link App Script của bạn ở đây)
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    const form = document.getElementById('booking-sheet-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> ĐANG GỬI THÔNG TIN...</span>';

            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                alert('Cảm ơn Quý khách! Dữ liệu đã được gửi thành công.');
                form.reset();
                resetSubmitButton();
            })
            .catch(error => {
                console.error('Lỗi kết nối:', error);
                alert('Đã xảy ra lỗi hệ thống. Vui lòng thử lại.');
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