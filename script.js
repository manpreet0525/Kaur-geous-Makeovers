document.addEventListener('DOMContentLoaded', function () {
    // Preloader - 2.5 seconds delay
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            // Optional: Remove from DOM after transition to free up memory
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2500); // 2.5 seconds
    }

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

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.section-title, .about-content, .feature-card, .service-card, .gallery-wrapper, .review-card, .map-container');

    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Dynamic Gallery Logic
    const galleryRoot = document.getElementById('dynamic-gallery-root');
    const galleryPath = 'gallery/';

    if (galleryRoot) {
        fetch(galleryPath + 'manifest.json')
            .then(response => {
                if (!response.ok) throw new Error("Manifest not found");
                return response.json();
            })
            .then(images => {
                if (!images || images.length === 0) {
                    galleryRoot.innerHTML = '<p class="text-center">No images found.</p>';
                    return;
                }

                // Build HTML Structure
                let mainImageSrc = galleryPath + images[0];

                let thumbsHtml = images.map((img, index) => {
                    return `<img src="${galleryPath + img}" class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}" onclick="changeImage(this)">`;
                }).join('');

                const galleryHtml = `
                    <div class="gallery-container">
                        <button class="gallery-btn prev" id="prev-btn">&#10094;</button>
                        <div class="gallery-main">
                            <img src="${mainImageSrc}" alt="Gallery Image" id="current-image">
                        </div>
                        <button class="gallery-btn next" id="next-btn">&#10095;</button>
                    </div>
                    <div class="gallery-thumbs" id="gallery-thumbs">
                        ${thumbsHtml}
                    </div>
                    <div class="text-center" style="margin-top: 10px; font-size: 0.9em; color: #888;">
                        <span id="gallery-counter">1 / ${images.length}</span>
                    </div>
                `;

                galleryRoot.innerHTML = galleryHtml;

                // Re-attach Event Listeners
                attachGalleryListeners(images);
            })
            .catch(err => {
                console.error('Error loading gallery:', err);
                galleryRoot.innerHTML = '<p class="text-center">Gallery could not be loaded. Please try again later.</p>';
            });
    }

    function attachGalleryListeners(images) {
        const mainImage = document.getElementById('current-image');
        const thumbs = document.querySelectorAll('.thumb');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const counter = document.getElementById('gallery-counter');
        let currentIndex = 0;

        // Function globally available or scoped here (we attach to window if needed for inline onclick, 
        // but we used inline onclick="changeImage(this)" so we must expose it)

        window.changeImage = function (element) {
            const newIndex = parseInt(element.getAttribute('data-index'));
            currentIndex = newIndex;
            updateGalleryDisplay();
        };

        function updateGalleryDisplay() {
            // Update Main Image
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = galleryPath + images[currentIndex];
                mainImage.style.opacity = '1';
            }, 200);

            // Update Thumbs
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[currentIndex].classList.add('active');

            // Scroll Thumb into view
            thumbs[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            // Update Counter
            if (counter) counter.innerText = `${currentIndex + 1} / ${images.length}`;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGalleryDisplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateGalleryDisplay();
            });
        }
    }
});
