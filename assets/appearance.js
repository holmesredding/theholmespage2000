        // Restore appearance before painting; storage may be unavailable in private browsing.
        (() => {
            const root = document.documentElement;
            let theme = 'light';
            let stars = root.dataset.starfield === 'true';
            try {
                theme = localStorage.getItem('site-theme') === 'dark' ? 'dark' : 'light';
                const savedStars = localStorage.getItem('site-starfield');
                if (savedStars !== null) stars = savedStars === 'true';
            } catch {}
            root.dataset.theme = theme;
            root.dataset.starfield = String(stars);
        })();
