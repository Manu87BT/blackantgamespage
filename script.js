document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIALIZE PORTFOLIO ENGINE (If element exists on the page)
    const gamesContainer = document.getElementById("games-container");
    if (gamesContainer) {
        fetch("games_previews/games.json")
            .then(response => {
                if (!response.ok) throw new Error("Could not parse data mapping registry source file.");
                return response.json();
            })
            .then(gamesData => {
                if (gamesData.length > 0) {
                    renderStudioPortfolio(gamesData);
                    setupScrollObserver(); // NEW: Kickstart scroll visibility sensors
                } else {
                    gamesContainer.innerHTML = `<div class="loading-state">Portfolio coming soon!</div>`;
                }
            })
            .catch(error => {
                console.error("Initialization fault:", error);
                gamesContainer.innerHTML = `<div class="loading-state">Error loading components. Check console tracking.</div>`;
            });
    }

    // 2. INITIALIZE NEWS ENGINE (If element exists on the page)
    const newsGridFeed = document.getElementById("news-grid-feed");
    if (newsGridFeed) {
        fetch("news/news.json")
            .then(response => {
                if (!response.ok) throw new Error("Could not parse news data source structure.");
                return response.json();
            })
            .then(newsEntries => {
                if (newsEntries.length > 0) {
                    renderStudioNewsFeed(newsEntries);
                } else {
                    newsGridFeed.innerHTML = `<div class="loading-state">Check back soon for upcoming dispatches!</div>`;
                }
            })
            .catch(error => {
                console.error("News synchronization system fault:", error);
                newsGridFeed.innerHTML = `<div class="loading-state">Unable to verify current news matrix feed.</div>`;
            });
    }

    // ==========================================================================
    // PORTFOLIO RENDER FUNCTIONS
    // ==========================================================================
    function renderStudioPortfolio(games) {
        gamesContainer.innerHTML = ""; 

        const sectionTitle = document.createElement("div");
        sectionTitle.className = "portfolio-header";
        sectionTitle.innerHTML = `<h2>Our Games</h2>`;
        gamesContainer.appendChild(sectionTitle);

        games.forEach((game) => {
            const section = document.createElement("section");
            section.className = "game-entry-section";
            
            if (game.promoBg && game.promoBg.trim() !== "") {
                const bgLayer = document.createElement("div");
                bgLayer.className = "game-section-bg";
                bgLayer.style.backgroundImage = `url('${game.promoBg}')`;
                section.appendChild(bgLayer);
            }
            
            let storeButtons = "";
            if (game.playStoreUrl) {
                storeButtons += `
                    <a href="${game.playStoreUrl}" target="_blank" rel="noopener" class="btn-store">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.609 1.814L13.783 12 3.609 22.186A2.235 2.235 0 0 1 3 20.63V3.37a2.235 2.235 0 0 1 .609-1.556zm11.29 9.071l2.766-2.765L4.85 2.193a1.442 1.442 0 0 0-1.04-.153l11.089 10.845zm4.234 1.115l-3.125 1.785-2.85-2.85 2.85-2.85 3.125 1.785a1.433 1.433 0 0 1 0 2.13zM4.85 21.807l12.815-5.927-2.766-2.766L3.81 21.96a1.442 1.442 0 0 0 1.04-.153z"/>
                        </svg>
                        <div class="btn-text-wrapper">
                            <span class="btn-text-small">Get it on</span>
                            <span class="btn-text-large">Google Play</span>
                        </div>
                    </a>`;
            }
            if (game.appStoreUrl) {
                storeButtons += `
                    <a href="${game.appStoreUrl}" target="_blank" rel="noopener" class="btn-store">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
                        </svg>
                        <div class="btn-text-wrapper">
                            <span class="btn-text-small">Download on the</span>
                            <span class="btn-text-large">App Store</span>
                        </div>
                    </a>`;
            }

            let slidesHtml = "";
            let dotsHtml = ""; 

            game.media.forEach((item, index) => {
                const isActive = index === 0 ? "active" : "";
                dotsHtml += `<button class="slider-dot ${isActive}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`;

                if (item.type === "video") {
                    // REMOVED "autoplay" from raw HTML to give JavaScript manual scroll execution control
                    slidesHtml += `
                        <div class="slide-item ${isActive}" data-type="video">
                            <video muted playsinline controls src="${item.src}"></video>
                        </div>`;
                } else {
                    slidesHtml += `
                        <div class="slide-item ${isActive}" data-type="image">
                            <img src="${item.src}" alt="${game.title} screenshot.">
                        </div>`;
                }
            });

            let iconHtml = "";
            if (game.icon && game.icon.trim() !== "") {
                iconHtml = `<img src="${game.icon}" alt="${game.title} icon" class="game-title-icon">`;
            }

            const cardGrid = document.createElement("div");
            cardGrid.className = "game-card-grid";
            cardGrid.innerHTML = `
                <div class="game-info-side">
                    <div class="game-title-container">
                        ${iconHtml}
                        <h2>
                            <a href="${game.pageUrl || '#'}" class="game-title-link">${game.title}</a>
                        </h2>
                    </div>
                    <p>${game.description}</p>
                    <div class="store-buttons-container">
                        ${storeButtons}
                    </div>
                </div>
                
                <div class="game-media-column-wrapper">
                    <div class="game-media-side" id="slider-${game.id}">
                        <button class="slider-arrow arrow-left" aria-label="Previous Frame">&#8249;</button>
                        <div class="slider-viewport">
                            ${slidesHtml}
                        </div>
                        <button class="slider-arrow arrow-right" aria-label="Next Frame">&#8250;</button>
                    </div>
                    
                    <div class="slider-dots-container">
                        ${dotsHtml}
                    </div>
                </div>
            `;
            
            section.appendChild(cardGrid);
            gamesContainer.appendChild(section);
            attachSliderControls(game.id);
        });
    }

    function attachSliderControls(gameId) {
        const sliderContainer = document.getElementById(`slider-${gameId}`);
        const columnWrapper = sliderContainer.closest(".game-media-column-wrapper");
        
        const slides = sliderContainer.querySelectorAll(".slide-item");
        const leftArrow = sliderContainer.querySelector(".arrow-left");
        const rightArrow = sliderContainer.querySelector(".arrow-right");
        const dots = columnWrapper.querySelectorAll(".slider-dot");
        
        let currentIndex = 0;
        let rotationTimer = null;

        function clearRotationTimer() {
            if (rotationTimer) {
                clearInterval(rotationTimer);
                rotationTimer = null;
            }
        }

        function startRotationTimer() {
            clearRotationTimer();
            const currentActive = slides[currentIndex];
            
            if (currentActive.getAttribute("data-type") === "image") {
                rotationTimer = setInterval(() => {
                    showSlide(currentIndex + 1);
                }, 5000);
            }
        }

        function showSlide(index) {
            const currentActive = slides[currentIndex];
            if (currentActive.getAttribute("data-type") === "video") {
                const vid = currentActive.querySelector("video");
                setTimeout(() => {
                    vid.pause();
                    vid.currentTime = 0;
                }, 350); 
            }

            slides[currentIndex].classList.remove("active");
            if (dots[currentIndex]) dots[currentIndex].classList.remove("active");

            currentIndex = (index + slides.length) % slides.length;

            slides[currentIndex].classList.add("active");
            if (dots[currentIndex]) dots[currentIndex].classList.add("active");

            const nextActive = slides[currentIndex];
            if (nextActive.getAttribute("data-type") === "video") {
                clearRotationTimer(); 
                // Only fire playback if its container row section is currently verified visible on screen
                const section = sliderContainer.closest(".game-entry-section");
                if (section.classList.contains("is-visible-on-screen")) {
                    const vid = nextActive.querySelector("video");
                    vid.play().catch(e => console.log("Playback interaction locked:", e));
                }
            } else {
                startRotationTimer();
            }
        }

        leftArrow.addEventListener("click", () => showSlide(currentIndex - 1));
        rightArrow.addEventListener("click", () => showSlide(currentIndex + 1));

        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                const targetIndex = parseInt(dot.getAttribute("data-slide"), 10);
                if (targetIndex !== currentIndex) {
                    showSlide(targetIndex);
                }
            });
        });

        slides.forEach((slide) => {
            if (slide.getAttribute("data-type") === "video") {
                const videoElement = slide.querySelector("video");
                videoElement.addEventListener("ended", () => {
                    showSlide(currentIndex + 1);
                });
            }
        });

        // Store reference hooks onto element for Scroll engine accessibility routing
        sliderContainer.__customSliderEngine = {
            playCurrentVideo: () => {
                const current = slides[currentIndex];
                if (current.getAttribute("data-type") === "video") {
                    clearRotationTimer();
                    current.querySelector("video").play().catch(() => {});
                } else {
                    startRotationTimer();
                }
            },
            pauseCurrentVideo: () => {
                clearRotationTimer();
                const current = slides[currentIndex];
                if (current.getAttribute("data-type") === "video") {
                    current.querySelector("video").pause();
                }
            }
        };

        // Let scroll handler wake up the initial frame check configurations instead of instant running
        startRotationTimer();
    }

    // ==========================================================================
    // NEW: SMART SCROLL SCANNERS (LINKEDIN STYLE VIDEO FEED ROUTER)
    // ==========================================================================
    function setupScrollObserver() {
        const sections = document.querySelectorAll(".game-entry-section");
        
        const observerOptions = {
            root: null, // Tracks context relative directly to the browser window window viewport
            threshold: 0.55 // Requires at least 55% of the game block card to be visible before waking up
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const slider = section.querySelector(".game-media-side");
                if (!slider || !slider.__customSliderEngine) return;

                if (entry.isIntersecting) {
                    section.classList.add("is-visible-on-screen");
                    slider.__customSliderEngine.playCurrentVideo();
                } else {
                    section.classList.remove("is-visible-on-screen");
                    slider.__customSliderEngine.pauseCurrentVideo();
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ==========================================================================
    // NEWS FEED RENDER FUNCTIONS
    // ==========================================================================
    function renderStudioNewsFeed(articles) {
        newsGridFeed.innerHTML = ""; 

        articles.forEach((article) => {
            const card = document.createElement("article");
            card.className = "news-article-card";
            card.innerHTML = `
                <div class="news-card-metadata">
                    <span class="news-card-badge">${article.badge || 'Update'}</span>
                    <span class="news-card-date">${article.date || ''}</span>
                </div>
                <h3 class="news-card-title">${article.title}</h3>
                <p class="news-card-body">${article.description}</p>
            `;
            newsGridFeed.appendChild(card);
        });
    }
});