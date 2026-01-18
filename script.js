document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const menuLinks = mobileMenu.querySelectorAll('a');

    // Open Menu
    mobileToggle.addEventListener('click', function () {
        mobileMenu.classList.add('active');
    });

    // Close Menu
    closeMenu.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
    });

    // Close when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Change nav style on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Gallery Slider Logic
    const thumbs = document.querySelectorAll('.thumb');
    const mainImage = document.getElementById('current-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;

    // Function to change image
    window.changeImage = function (element) {
        // Update main image
        mainImage.style.opacity = '0'; // Fade out effect
        setTimeout(() => {
            mainImage.src = element.src;
            mainImage.style.opacity = '1';
        }, 300);

        // Update active class
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        element.classList.add('active');

        // Update current index
        currentIndex = Array.from(thumbs).indexOf(element);

        // Auto scroll thumbnail into view
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    // Next Button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % thumbs.length;
            changeImage(thumbs[currentIndex]);
        });
    }

    // Prev Button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
            changeImage(thumbs[currentIndex]);
        });
    }
});
