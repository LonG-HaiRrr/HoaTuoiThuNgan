document.addEventListener("DOMContentLoaded", function() {

    // =========================================================================
    // 0. XỬ LÝ HEADER TRONG SUỐT KHI CUỘN TRANG
    // =========================================================================
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hàm gọi để chạy Animation cho cụm từ "Chuyên Nghiệp - Tận Tâm - Chu Đáo"
    function triggerTitleAnimation() {
        const title = document.getElementById('animated-title');
        if(!title) return;
        
        // Reset lại animation bằng cách gỡ bỏ class rồi ép trình duyệt reflow
        title.classList.remove('animate');
        void title.offsetWidth; // Ép reflow
        title.classList.add('animate');
    }

    // =========================================================================
    // 1. THUẬT TOÁN AUTO-DETECT ẢNH VÀ SLIDER
    // =========================================================================
    const sliderContainer = document.getElementById('hero-slider');
    let validImages = [];
    let checkIndex = 1;
    const maxCheck = 30;

    function loadDynamicImages() {
        if (checkIndex > maxCheck) {
            initSlider();
            return;
        }

        let img = new Image();
        img.onload = function() {
            validImages.push(`img/b (${checkIndex}).jpg`);
            checkIndex++;
            loadDynamicImages();
        };
        img.onerror = function() {
            initSlider();
        };
        img.src = `img/b (${checkIndex}).jpg`;
    }

    loadDynamicImages();

    function initSlider() {
        // Chạy animation text ngay lần load đầu tiên
        triggerTitleAnimation();

        if (validImages.length === 0) return;

        validImages.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide' + (index === 0 ? ' active' : '');
            slide.style.backgroundImage = `url('${src}')`;
            sliderContainer.appendChild(slide);
        });

        if (validImages.length > 1) {
            let currentSlideIndex = 0;
            const slides = document.querySelectorAll('.hero-slide');
            
            const slideIntervalTime = 4000; 

            setInterval(() => {
                slides[currentSlideIndex].classList.remove('active');
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                slides[currentSlideIndex].classList.add('active');
                
                // MỖI LẦN ĐỔI ẢNH -> KÍCH HOẠT LẠI ANIMATION CHỮ TỪ DƯỚI LÊN
                triggerTitleAnimation();
                
            }, slideIntervalTime);
        }
    }


    // =========================================================================
    // 2. HIỆU ỨNG CUỘN TRANG XUẤT HIỆN DẦN (SCROLL REVEAL)
    // =========================================================================
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

    // =========================================================================
    // 3. ĐÓNG MỞ MENU TRÊN THIẾT BỊ DI ĐỘNG
    // =========================================================================
    const menuToggle = document.getElementById("mobile-menu");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link, .btn-nav");

    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            menuToggle.classList.toggle("is-active");
            navbar.classList.toggle("active");
            // Ép đổi màu toggle cho dễ nhìn khi mở menu
            header.classList.add('scrolled');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("is-active");
            navbar.classList.remove("active");
        });
    });

    // =========================================================================
    // 4. XỬ LÝ GỬI FORM THÔNG TIN 
    // =========================================================================
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