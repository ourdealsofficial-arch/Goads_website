// GoAds Legal Portal - Robust Click-Switching & Navigation Logic

function switchPolicyTab(tabId) {
    // Default to privacy if unknown or anything other than terms
    if (tabId !== 'terms') {
        tabId = 'privacy';
    }

    // 1. Update tab button states
    const buttons = document.querySelectorAll('.switch-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });

    // 2. Toggle content containers
    const privacyContent = document.getElementById('tab-privacy');
    const termsContent = document.getElementById('tab-terms');

    if (tabId === 'terms') {
        if (privacyContent) {
            privacyContent.classList.remove('active');
            privacyContent.style.display = 'none';
        }
        if (termsContent) {
            termsContent.classList.add('active');
            termsContent.style.display = 'block';
        }
    } else {
        if (termsContent) {
            termsContent.classList.remove('active');
            termsContent.style.display = 'none';
        }
        if (privacyContent) {
            privacyContent.classList.add('active');
            privacyContent.style.display = 'block';
        }
    }

    // 3. Update URL hash
    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, '#' + tabId);
    }

    // 4. Update dynamic Table of Contents
    updateTableOfContents(tabId);
}

// Dynamic Table of Contents generator
function updateTableOfContents(activeTabId) {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;
    tocList.innerHTML = '';

    const activeContent = document.getElementById('tab-' + activeTabId);
    if (!activeContent) return;

    const sections = activeContent.querySelectorAll('.policy-section');
    sections.forEach((section, index) => {
        const titleEl = section.querySelector('h2');
        if (titleEl) {
            const sectionId = section.getAttribute('id') || `${activeTabId}-sec-${index + 1}`;
            section.setAttribute('id', sectionId);

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${sectionId}`;
            a.className = 'toc-link';
            a.textContent = titleEl.textContent.trim();

            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(sectionId);
                if (target) {
                    const pos = target.offsetTop - 100;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            });

            li.appendChild(a);
            tocList.appendChild(li);
        }
    });
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check initial hash
    const hash = window.location.hash.replace('#', '');
    if (hash === 'terms' || hash === 'terms-conditions') {
        switchPolicyTab('terms');
    } else {
        switchPolicyTab('privacy');
    }

    // Segmented button listeners
    const buttons = document.querySelectorAll('.switch-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.getAttribute('data-tab');
            switchPolicyTab(tab);
        });
    });

    // Print button
    const printBtn = document.getElementById('btn-print-policy');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Search filter
    const searchInput = document.getElementById('policy-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const activeContent = document.querySelector('.policy-tab-content.active');
            if (!activeContent) return;

            const sections = activeContent.querySelectorAll('.policy-section');
            sections.forEach(sec => {
                const text = sec.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = 'none';
                }
            });
        });
    }
});
