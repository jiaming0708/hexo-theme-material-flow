var customSearch;

document.addEventListener("DOMContentLoaded", function() {
    "use strict";
    const scrollCorrection = 70; // (header height = 50px) + (gap = 20px)

    function scrolltoElement(elem, correction = scrollCorrection) {
        const targetElem = elem.href ? document.querySelector(elem.getAttribute('href')) : elem;
        window.scrollTo({
            top: targetElem.offsetTop - correction,
            behavior: 'smooth'
        });
    }

    function setHeader() {
        if (!window.subData) return;
        const wrapper = document.querySelector('header .wrapper');
        const commentButton = wrapper.querySelector('.s-comment');
        const tocButton = wrapper.querySelector('.s-toc');
        const topButton = wrapper.querySelector('.s-top');

        wrapper.querySelector('.nav-sub .logo').textContent = window.subData.title;
        let pos = document.body.scrollTop;

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const del = scrollTop - pos;
            if (del >= 20) {
                pos = scrollTop;
                wrapper.classList.add('sub');
            } else if (del <= -20) {
                pos = scrollTop;
                wrapper.classList.remove('sub');
            }
        });

        const commentTarget = document.getElementById('comments');
        if (commentTarget) {
            commentButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                scrolltoElement(commentTarget);
            });
        } else {
            commentButton.remove();
        }

        const tocTarget = document.querySelector('.toc-wrapper');
        if (tocTarget && tocTarget.children.length) {
            tocButton.addEventListener('click', (e) => {
                e.stopPropagation();
                tocTarget.classList.toggle('active');
            });
        } else {
            tocButton.remove();
        }

        topButton.addEventListener('click', () => scrolltoElement(document.body));
    }

    function setHeaderMenu() {
        const headerMenu = document.querySelector('header .menu');
        const underline = headerMenu.querySelector('.underline');

        function setUnderline(item, transition = true) {
            item = item || headerMenu.querySelector('li a.active');
            if (!transition) underline.classList.add('disable-trans');
            if (item) {
                item.classList.add('active');
                item.parentElement.querySelectorAll('a').forEach(sib => {
                    if (sib !== item) sib.classList.remove('active');
                });
                underline.style.left = `${item.offsetLeft}px`;
                underline.style.width = `${item.offsetWidth}px`;
            } else {
                underline.style.left = '0px';
                underline.style.width = '0px';
            }
            if (!transition) {
                setTimeout(() => underline.classList.remove('disable-trans'), 0);
            }
        }

        headerMenu.addEventListener('mouseenter', (e) => {
            if (e.target.tagName === 'LI') setUnderline(e.target.querySelector('a'));
        });

        headerMenu.addEventListener('mouseleave', () => {
            setUnderline();
        });

        let activeLink = null;
        if (location.pathname === '/' || location.pathname.startsWith('/page/')) {
            activeLink = headerMenu.querySelector('.nav-home');
        } else {
            const name = location.pathname.match(/\/(.*?)\//);
            if (name && name.length > 1) {
                activeLink = headerMenu.querySelector(`.nav-${name[1]}`);
            }
        }
        setUnderline(activeLink, false);
    }

    function setHeaderMenuPhone() {
        const switcher = document.querySelector('.l_header .switcher .s-menu');
        switcher.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('z_menu-open');
            switcher.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            document.body.classList.remove('z_menu-open');
            switcher.classList.remove('active');
        });
    }

    function setHeaderSearch() {
        const switcher = document.querySelector('.l_header .switcher .s-search');
        const header = document.querySelector('.l_header');
        const search = document.querySelector('.l_header .m_search');
        if (!switcher) return;

        switcher.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('z_search-open');
            search.querySelector('input').focus();
        });

        document.addEventListener('click', () => {
            header.classList.remove('z_search-open');
        });

        search.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    function setWaves() {
        // Assuming Waves is already globally available
        Waves.attach('.flat-btn', ['waves-button']);
        Waves.attach('.float-btn', ['waves-button', 'waves-float']);
        Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
        Waves.attach('.flat-box', ['waves-block']);
        Waves.attach('.float-box', ['waves-block', 'waves-float']);
        Waves.attach('.waves-image');
        Waves.init();
    }

    function setScrollReveal() {
        const revealElems = document.querySelectorAll('.reveal');
        if (!revealElems.length) return;

        const sr = ScrollReveal({ distance: 0 });
        sr.reveal('.reveal');
    }

    function setTocToggle() {
        const toc = document.querySelector('.toc-wrapper');
        if (!toc) return;

        toc.addEventListener('click', (e) => {
            e.stopPropagation();
            toc.classList.add('active');
        });

        document.addEventListener('click', () => toc.classList.remove('active'));

        toc.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            scrolltoElement(e.target.tagName.toLowerCase() === 'a' ? e.target : e.target.parentElement);
        });

        const liElements = Array.from(toc.querySelectorAll('li a'));

        function getAnchor() {
            return liElements.map(elem => Math.floor(document.querySelector(elem.getAttribute('href')).offsetTop - scrollCorrection));
        }

        let anchor = getAnchor();

        function scrollListener() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (!anchor) return;

            let l = 0, r = anchor.length - 1, mid;
            while (l < r) {
                mid = Math.floor((l + r + 1) / 2);
                if (anchor[mid] === scrollTop) l = r = mid;
                else if (anchor[mid] < scrollTop) l = mid;
                else r = mid - 1;
            }
            liElements.forEach(elem => elem.classList.remove('active'));
            if (liElements[l]) liElements[l].classList.add('active');
        }

        window.addEventListener('resize', () => {
            anchor = getAnchor();
            scrollListener();
        });

        window.addEventListener('scroll', scrollListener);
        scrollListener();
    }

    function initializeCustomSearch() {
        if (SEARCH_SERVICE === 'google') {
            customSearch = new GoogleCustomSearch({
                apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
                engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'algolia') {
            customSearch = new AlgoliaSearch({
                apiKey: ALGOLIA_API_KEY,
                appId: ALGOLIA_APP_ID,
                indexName: ALGOLIA_INDEX_NAME,
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'hexo') {
            customSearch = new HexoSearch({
                imagePath: "/images/"
            });
        } else if (SEARCH_SERVICE === 'azure') {
            customSearch = new AzureSearch({
                serviceName: AZURE_SERVICE_NAME,
                indexName: AZURE_INDEX_NAME,
                queryKey: AZURE_QUERY_KEY,
                imagePath: "/images/"
            });
        }
    }

    // Initialize all functions
    setHeader();
    setHeaderMenu();
    setHeaderMenuPhone();
    setHeaderSearch();
    setWaves();
    setScrollReveal();
    setTocToggle();
    initializeCustomSearch();

    // Additional functions
    // $(".article .video-container").fitVids();

    setTimeout(() => {
        document.getElementById('loading-bar-wrapper').style.display = 'none';
    }, 300);
});
