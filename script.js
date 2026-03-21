document.addEventListener('DOMContentLoaded', () => {
    // ===== AUTH SYSTEM (Login/Logout) =====
    const authLink = document.getElementById('authLink');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function updateAuthUI() {
        if (authLink) {
            if (isLoggedIn) {
                authLink.innerText = 'Logout';
                authLink.href = '#';
                authLink.onclick = handleLogout;
                authLink.style.background = '#333'; // Darker for logout
            } else {
                authLink.innerText = 'Login';
                authLink.href = 'login.html';
                authLink.style.background = 'var(--accent-color)';
            }
        }
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            alert('Logged out successfully!');
            window.location.reload();
        }
    }

    updateAuthUI();

    // Password Visibility Toggle
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        const eyeIcon = togglePasswordBtn.querySelector('svg');
        // SVGs for eye open/closed
        const eyeOpenHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
        const eyeClosedHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;

        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            if (type === 'text') {
                eyeIcon.innerHTML = eyeClosedHTML;
                togglePasswordBtn.setAttribute('aria-label', 'Hide password');
            } else {
                eyeIcon.innerHTML = eyeOpenHTML;
                togglePasswordBtn.setAttribute('aria-label', 'Show password');
            }
        });
    }

    // Form submission animation handling (Interactivity demo)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        const loginBtn = document.querySelector('.login-btn');
        const btnText = loginBtn.querySelector('span');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate loading state
            const originalText = btnText.innerText;
            btnText.innerText = 'Signing In...';
            loginBtn.style.opacity = '0.8';
            loginBtn.style.cursor = 'wait';

            setTimeout(() => {
                btnText.innerText = 'Success!';
                loginBtn.style.background = '#10b981';

                // Save session for demo
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', document.getElementById('email').value);

                // Redirect to Home
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 1500);
        });
    }


    // Google Login Demo
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            // Just a visual feedback for now as actual Google auth requires API setup
            const originalContent = googleBtn.innerHTML;
            googleBtn.style.opacity = '0.8';
            googleBtn.innerHTML = '<span>Loading...</span>';
            setTimeout(() => {
                googleBtn.innerHTML = originalContent;
                googleBtn.style.opacity = '1';
            }, 1000);
        });
    }

    // ===== MODAL LOGIC FOR HOUSE DETAILS =====
    const houseModal = document.getElementById('houseModal');
    const closeBtn = document.querySelector('.close-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    // Modal Carousel State
    let modalImages = [];
    let currentModalSlide = 0;
    const modalSlides = document.getElementById('modalSlides');
    const modalDots = document.getElementById('modalDots');

    function updateModalCarousel() {
        if (modalSlides) {
            modalSlides.style.transform = `translateX(${-currentModalSlide * 100}%)`;
            // Update dots
            const dots = modalDots.querySelectorAll('.modal-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentModalSlide);
            });
        }
    }

    if (houseModal && closeBtn) {
        // Function to open modal
        viewButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const price = card.querySelector('.price').innerText;

                // Handle Multiple Images
                const imagesAttr = card.dataset.images;
                if (imagesAttr) {
                    modalImages = imagesAttr.split(',');
                } else {
                    modalImages = [card.querySelector('img').src];
                }

                // Inject Images and Dots
                if (modalSlides && modalDots) {
                    modalSlides.innerHTML = modalImages.map(img => `<img src="${img.trim()}" alt="House Image">`).join('');
                    modalDots.innerHTML = modalImages.map((_, i) => `<div class="modal-dot ${i === 0 ? 'active' : ''}" onclick="jumpToModalSlide(${i})"></div>`).join('');
                }

                currentModalSlide = 0;
                updateModalCarousel();

                // Populate Text Data
                document.getElementById('modalTitle').innerText = title;
                document.getElementById('modalDesc').innerText = desc;
                document.getElementById('modalPrice').innerText = price;

                // New Fields
                const fullAddress = card.dataset.fullAddress || "Contact owner for full address";
                const roomDetails = card.dataset.roomDetails || "Contact owner for specific room details";

                document.getElementById('modalAddress').innerText = fullAddress;
                document.getElementById('modalDetails').innerText = roomDetails;

                // Get Data from Attributes
                const ownerName = card.dataset.ownerName || "House Owner";
                const ownerPhone = card.dataset.ownerPhone || "Not Available";

                // Update Modal Content
                document.getElementById('ownerName').innerText = ownerName;
                document.getElementById('ownerPhone').innerText = ownerPhone;

                houseModal.style.display = 'block';
            });
        });

        // Modal Carousel Nav
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');

        if (modalPrev && modalNext) {
            modalPrev.addEventListener('click', () => {
                currentModalSlide = (currentModalSlide - 1 + modalImages.length) % modalImages.length;
                updateModalCarousel();
            });
            modalNext.addEventListener('click', () => {
                currentModalSlide = (currentModalSlide + 1) % modalImages.length;
                updateModalCarousel();
            });
        }

        // Global jump function for dots
        window.jumpToModalSlide = (index) => {
            currentModalSlide = index;
            updateModalCarousel();
        };

        // Close Modal
        closeBtn.addEventListener('click', () => {
            houseModal.style.display = 'none';
        });

        // Close outside click
        window.addEventListener('click', (e) => {
            if (e.target == houseModal) {
                houseModal.style.display = 'none';
            }
        });

        // Contact Owner Action
        const contactBtn = document.getElementById('contactBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                const phone = document.getElementById('ownerPhone').innerText;
                alert(`Calling owner at ${phone}...`);
                // In a real app, this could be a 'tel:' link or open a chat
                window.open(`tel:${phone}`);
            });
        }
    }

    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link (optional, good for UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('dropbtn')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    }
});
