(() => {
        const root = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        const starfieldToggle = document.getElementById('starfield-toggle');
        function saveAppearance() {
            try {
                localStorage.setItem('site-theme', root.dataset.theme);
                localStorage.setItem('site-starfield', root.dataset.starfield);
            } catch {}
        }
        function syncAppearanceControls() {
            const stars = root.dataset.starfield === 'true';
            const dark = root.dataset.theme === 'dark' || stars;
            starfieldToggle.setAttribute('aria-pressed', String(stars));
            themeToggle.setAttribute('aria-pressed', String(dark));
            themeToggle.textContent = dark ? '☀️' : '🌙';
            themeToggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', themeToggle.title);
        }
        starfieldToggle.addEventListener('click', () => {
            root.dataset.starfield = String(root.dataset.starfield !== 'true');
            saveAppearance();
            syncAppearanceControls();
        });
        themeToggle.addEventListener('click', () => {
            const dark = root.dataset.theme === 'dark' || root.dataset.starfield === 'true';
            root.dataset.theme = dark ? 'light' : 'dark';
            root.dataset.starfield = 'false';
            saveAppearance();
            syncAppearanceControls();
        });
        syncAppearanceControls();

        // One iframe means switching providers also stops the previous video.
        function setupVideoSwitchers() {
            document.querySelectorAll('.video-switcher').forEach(switcher => {
                const frame = switcher.querySelector('iframe');
                switcher.querySelector('.video-controls').hidden = false;
                const buttons = switcher.querySelectorAll('[data-video-src]');
                buttons.forEach(button => {
                    button.onclick = () => {
                        if (button.getAttribute('aria-pressed') === 'true') return;
                        frame.src = button.dataset.videoSrc;
                        frame.title = (switcher.dataset.title || 'Video') + ' — ' + button.textContent;
                        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
                    };
                });
            });
        }
		const lightboxState = {
			overlay: null,
			imageEl: null,
			captionEl: null,
			prevBtn: null,
			nextBtn: null,
			currentIndex: 0,
			currentItems: []
		};

		function createLightboxIfNeeded() {
			if (lightboxState.overlay) return;

			const overlay = document.createElement('div');
			overlay.className = 'lightbox-overlay';
            overlay.inert = true;

			overlay.innerHTML = `
				<div class="lightbox-content" role="dialog" aria-modal="true">
					<button class="lightbox-close" aria-label="Close">&times;</button>
					<div class="lightbox-inner">
						<button class="lightbox-arrow lightbox-prev" aria-label="Previous">&#10094;</button>
						<img class="lightbox-image" alt="">
						<button class="lightbox-arrow lightbox-next" aria-label="Next">&#10095;</button>
					</div>
					<p class="lightbox-caption"></p>
				</div>
			`;

			document.body.appendChild(overlay);

			const img = overlay.querySelector('.lightbox-image');
			const caption = overlay.querySelector('.lightbox-caption');
			const prevBtn = overlay.querySelector('.lightbox-prev');
			const nextBtn = overlay.querySelector('.lightbox-next');
			const closeBtn = overlay.querySelector('.lightbox-close');

			lightboxState.overlay = overlay;
			lightboxState.imageEl = img;
			lightboxState.captionEl = caption;
			lightboxState.prevBtn = prevBtn;
			lightboxState.nextBtn = nextBtn;

			function showCurrent() {
				const item = lightboxState.currentItems[lightboxState.currentIndex];
				if (!item) return;
				img.src = item.src;
				img.alt = item.alt || '';
				caption.textContent = item.caption || '';
			}

			function showRelative(delta) {
				const len = lightboxState.currentItems.length;
				if (!len) return;
				lightboxState.currentIndex = (lightboxState.currentIndex + delta + len) % len;
				showCurrent();
			}

			function hide() {
				overlay.classList.remove('is-visible');
                overlay.inert = true;
                lightboxState.trigger?.focus();
				document.removeEventListener('keydown', handleKeydown);
			}

			function handleKeydown(e) {
				if (e.key === 'Escape') hide();
                if (e.key === 'Tab') {
                    const controls = [closeBtn, prevBtn, nextBtn];
                    const current = controls.indexOf(document.activeElement);
                    e.preventDefault();
                    controls[(current + (e.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
                }
				if (e.key === 'ArrowRight') showRelative(1);
				if (e.key === 'ArrowLeft') showRelative(-1);
			}

			overlay.addEventListener('click', (e) => {
				// click on the dark backdrop closes
				if (e.target === overlay) {
					hide();
				}
			});

			closeBtn.addEventListener('click', hide);
			prevBtn.addEventListener('click', () => showRelative(-1));
			nextBtn.addEventListener('click', () => showRelative(1));

			lightboxState.show = function (items, startIndex) {
				lightboxState.currentItems = items || [];
				lightboxState.currentIndex = startIndex || 0;
				showCurrent();
				lightboxState.trigger = document.activeElement;
                overlay.inert = false;
                overlay.classList.add('is-visible');
                closeBtn.focus();
				document.addEventListener('keydown', handleKeydown);
			};
		}

		function setupImageGridLightbox() {
			const shadow = document;

			createLightboxIfNeeded();

			const gridImages = shadow.querySelectorAll('.image-grid img');

			gridImages.forEach((img) => {
				// The page initializes once.
				img.onclick = null;

				img.style.cursor = 'zoom-in';
                img.tabIndex = 0;
                img.setAttribute('role', 'button');
                img.setAttribute('aria-label', 'Enlarge ' + (img.alt || 'image'));
                img.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        img.click();
                    }
                });

				img.addEventListener('click', () => {
					const figure = img.closest('figure');
					const grid = figure ? figure.closest('.image-grid') : img.closest('.image-grid');
					if (!grid) return;

					const imgs = grid.querySelectorAll('img');
					const items = [];

					imgs.forEach((gridImg) => {
						const fig = gridImg.closest('figure');
						const captionEl = fig ? fig.querySelector('figcaption') : null;

						items.push({
							src: gridImg.currentSrc || gridImg.src,
							alt: gridImg.alt || '',
							caption: captionEl ? captionEl.textContent.trim() : ''
						});
					});

					const index = Array.from(imgs).indexOf(img);
					lightboxState.show(items, Math.max(index, 0));
				});
			});
		}

		let snowEnabled = false;
		let snowInterval = null;

		function ensureSnowContainer() {
			let container = document.getElementById('snow-container');
			if (!container) {
				container = document.createElement('div');
				container.id = 'snow-container';
				document.body.appendChild(container);
			}
			return container;
		}

		function createSnowflake() {
			const container = ensureSnowContainer();

			const flake = document.createElement('span');
			flake.className = 'snowflake';

			// Very high chance of being a flat circle
			const isCircle = Math.random() < 0.95; // 95% circles, 5% snowflakes

			// Random horizontal position
			flake.style.left = Math.random() * 100 + 'vw';

			// Random duration for fall
			const duration = 5 + Math.random() * 6; // 5–11s
			flake.style.animationDuration = duration + 's';

			if (isCircle) {
				// Simple dot
				flake.textContent = '•';
				const size = 0.18 + Math.random() * 0.6; // 0.18–0.78rem
				flake.style.fontSize = size + 'rem';

				// Circles: wide opacity range for subtle depth
				const opacity = 0.12 + Math.random() * 0.7; // 0.12–0.82
				flake.style.opacity = opacity.toFixed(2);
			} else {
				// Rare snowflake glyphs
				flake.textContent = Math.random() < 0.4 ? '✻' : '❄';
				const size = 0.7 + Math.random() * 0.8; // 0.7–1.5rem
				flake.style.fontSize = size + 'rem';

				// Flakes more visible
				const opacity = 0.45 + Math.random() * 0.5; // 0.45–0.95
				flake.style.opacity = opacity.toFixed(2);
			}

			// Optional depth blur
			if (Math.random() < 0.35) {
				const blur = (Math.random() * 1.5).toFixed(1);
				flake.style.filter = `blur(${blur}px)`;
			}

			// Pick a wind pattern (all linear – no easing stalls)
			const variant = Math.random();
			if (variant < 0.33) {
				flake.style.animationName = 'snowfall-left';
			} else if (variant < 0.66) {
				flake.style.animationName = 'snowfall-right';
			} else {
				flake.style.animationName = 'snowfall';
			}

			container.appendChild(flake);

			// Clean up after animation
			setTimeout(() => {
				if (flake.parentNode === container) {
					container.removeChild(flake);
				}
			}, duration * 1000 + 500);
		}

		function startSnow() {
			if (snowInterval) return;
			ensureSnowContainer();
			// Heavier snowfall
			snowInterval = setInterval(createSnowflake, 30); // was 300 / 120
		}

		function stopSnow() {
			if (!snowInterval) return;
			clearInterval(snowInterval);
			snowInterval = null;
			const container = document.getElementById('snow-container');
			if (container) {
				container.innerHTML = '';
			}
		}

		const snowToggle = document.getElementById('snow-toggle');
		if (snowToggle) {
			snowToggle.addEventListener('click', () => {
				snowEnabled = !snowEnabled;
                snowToggle.setAttribute('aria-pressed', String(snowEnabled));
				if (snowEnabled) {
					startSnow();
					snowToggle.classList.add('is-on');
				} else {
					stopSnow();
					snowToggle.classList.remove('is-on');
				}
			});
		}

setupVideoSwitchers();
setupImageGridLightbox();
document.querySelectorAll('footer button').forEach(button => button.hidden = false);
})();
