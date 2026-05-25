const booksDatabase = {
    doujin: [
        { id: 1, title: "先喝完这杯", subtitle: "霸图中心 · 关于林敬言的退役", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/book1", pageCount: 8, characters: ["韩文清", "张新杰", "林敬言", "张佳乐"], displayIcon: "assets/Icons/icon_carrot.png", type: "doujin" },
        { id: 2, title: "噩梦", subtitle: "双花中心 · CP向", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/book2", pageCount: 2, characters: ["张佳乐", "孙哲平"], displayIcon: "assets/Icons/icon_heart.png", type: "doujin" },
        { id: 3, title: "Q市选手日记", subtitle: "霸图中心 · 短篇集", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/book3", pageCount: 2, characters: ["韩文清", "张新杰", "林敬言", "张佳乐"], displayIcon: "assets/Icons/icon_carrot.png", type: "doujin" }
    ],
    short: [
        { id: 101, title: "叶修长啥样啊?", subtitle: "叶乐 · CP向", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/short1", pageCount: 2, characters: ["叶修", "张佳乐"], displayIcon: "assets/Icons/icon_heart.png", type: "short" },
        { id: 102, title: "你能再讲一次遇到我那天的故事吗", subtitle: "双花中心 · CP向", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/short2", pageCount: 2, characters: ["张佳乐", "孙哲平"], displayIcon: "assets/Icons/icon_heart.png", type: "short" },
        { id: 103, title: "黑兔与白蔷薇", subtitle: "哥特童话", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/short3", pageCount: 2, characters: ["黑兔", "白蔷薇"], displayIcon: "assets/Icons/icon_carrot.png", type: "short" },
        { id: 104, title: "电子眼泪谎话", subtitle: "赛博短篇 / 意识流", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/short4", pageCount: 2, characters: ["电子幽灵", "人类"], displayIcon: "assets/Icons/icon_heart.png", type: "short" }
    ]
};

// ─── Reader State ────────────────────────────────────────────────
let readerState = {
    book: null,
    currentPage: 1,   // 1-based; on desktop this is the LEFT page of the spread
    totalPages: 0,
    isMobile: false
};

function isMobileView() {
    return window.innerWidth < 768;
}

// ─── Image helpers ───────────────────────────────────────────────
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function handleImgError(e, title) {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'%3E%3Crect width='120' height='160' fill='%23ffe0e8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b95c7a' font-size='14' font-weight='bold'%3E🐰 ${escapeHtml(title).slice(0, 6)}%3C/text%3E%3C/svg%3E`;
}

function handleIconError(e) {
    e.target.onerror = null;
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff8c42'%3E%3Cpath d='M16,10L15.8,6.2C15.2,5.5 14.3,5 13.3,5H10.7C9.7,5 8.8,5.5 8.2,6.2L8,10H16Z M7,11v6c0,1.1 0.9,2 2,2h6c1.1,0 2-0.9 2-2v-6H7Z'/%3E%3C/svg%3E";
}

function pageFallbackSvg(pageNum) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 560'%3E%3Crect width='400' height='560' fill='%23fdf5f7'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4a0b0' font-size='64'%3E🐰%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23c07090' font-size='20' font-weight='bold'%3E第 ${pageNum} 页%3C/text%3E%3C/svg%3E`;
}

// ─── Reader Open / Close ─────────────────────────────────────────
function openReader(book) {
    readerState.book = book;
    readerState.totalPages = book.pageCount || 1;
    readerState.isMobile = isMobileView();
    // Desktop: start at spread 1 (pages 1-2). Mobile: start at page 1.
    readerState.currentPage = 1;

    const overlay = document.getElementById('readerOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Title
    document.getElementById('readerTitle').textContent = book.title;

    renderReaderPages();
    updateReaderControls();
}

function closeReader() {
    const overlay = document.getElementById('readerOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    readerState.book = null;
}

// ─── Render Pages ────────────────────────────────────────────────
function renderReaderPages() {
    const { book, currentPage, totalPages, isMobile } = readerState;
    const stage = document.getElementById('readerStage');
    stage.innerHTML = '';

    if (isMobile) {
        // Single page
        stage.className = 'reader-stage mobile';
        const img = makePageImg(book, currentPage);
        stage.appendChild(img);
    } else {
        // Two-page spread: show pages currentPage (left) and currentPage+1 (right)
        stage.className = 'reader-stage desktop';
        const leftImg = makePageImg(book, currentPage);
        leftImg.classList.add('page-left');

        const rightPageNum = currentPage + 1;
        if (rightPageNum <= totalPages) {
            const rightImg = makePageImg(book, rightPageNum);
            rightImg.classList.add('page-right');
            stage.appendChild(leftImg);
            stage.appendChild(rightImg);
        } else {
            // Odd last page: show single centered
            leftImg.classList.add('page-single-last');
            stage.appendChild(leftImg);
        }
    }
}

function makePageImg(book, pageNum) {
    const img = document.createElement('img');
    img.className = 'reader-page-img';
    img.src = `${book.pagepath}/page${pageNum}.jpg`;
    img.alt = `第${pageNum}页`;
    img.draggable = false;
    img.onerror = () => {
        img.onerror = null;
        img.src = pageFallbackSvg(pageNum);
    };
    return img;
}

// ─── Navigation ──────────────────────────────────────────────────
function readerPrev() {
    const { isMobile } = readerState;
    const step = isMobile ? 1 : 2;
    if (readerState.currentPage > 1) {
        readerState.currentPage = Math.max(1, readerState.currentPage - step);
        renderReaderPages();
        updateReaderControls();
    }
}

function readerNext() {
    const { isMobile, totalPages } = readerState;
    const step = isMobile ? 1 : 2;
    const maxStart = isMobile ? totalPages : (totalPages % 2 === 0 ? totalPages - 1 : totalPages);
    if (readerState.currentPage < maxStart) {
        readerState.currentPage = Math.min(maxStart, readerState.currentPage + step);
        renderReaderPages();
        updateReaderControls();
    }
}

function updateReaderControls() {
    const { currentPage, totalPages, isMobile } = readerState;
    const step = isMobile ? 1 : 2;

    const prevBtn = document.getElementById('readerPrev');
    const nextBtn = document.getElementById('readerNext');

    prevBtn.disabled = currentPage <= 1;

    const maxStart = isMobile ? totalPages : (totalPages % 2 === 0 ? totalPages - 1 : totalPages);
    nextBtn.disabled = currentPage >= maxStart;

    // Page indicator
    if (isMobile) {
        document.getElementById('readerPageInfo').textContent = `${currentPage} / ${totalPages}`;
    } else {
        const rightPage = Math.min(currentPage + 1, totalPages);
        if (rightPage > currentPage) {
            document.getElementById('readerPageInfo').textContent = `${currentPage}–${rightPage} / ${totalPages}`;
        } else {
            document.getElementById('readerPageInfo').textContent = `${currentPage} / ${totalPages}`;
        }
    }
}

// ─── Keyboard / Resize ───────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (!readerState.book) return;
    if (e.key === 'ArrowLeft') readerPrev();
    if (e.key === 'ArrowRight') readerNext();
    if (e.key === 'Escape') closeReader();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!readerState.book) return;
        const wasMobile = readerState.isMobile;
        readerState.isMobile = isMobileView();
        if (wasMobile !== readerState.isMobile) {
            // Snap to a clean page when switching layout
            if (!readerState.isMobile && readerState.currentPage % 2 === 0) {
                readerState.currentPage = Math.max(1, readerState.currentPage - 1);
            }
            renderReaderPages();
            updateReaderControls();
        }
    }, 200);
});

// Touch/swipe support
(function initSwipe() {
    let touchStartX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', e => {
        if (!readerState.book) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) readerNext();
            else readerPrev();
        }
    }, { passive: true });
})();

// ─── Book Grid Rendering ─────────────────────────────────────────
function getAllBooks() {
    return [...booksDatabase.doujin, ...booksDatabase.short];
}

function renderBooks(type) {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;
    const books = type === 'doujin' ? booksDatabase.doujin : booksDatabase.short;
    document.getElementById('activeTypeLabel').innerText = type === 'doujin' ? '同人本' : '短篇';

    grid.innerHTML = books.map(book => `
        <div class="book-card" data-book-id="${book.id}" data-book-type="${book.type}" data-pagepath="${book.pagepath || ''}">
            <div class="cover-area">
                <img class="cover-img" src="${book.coverImg}" alt="${escapeHtml(book.title)}" onerror="handleImgError(event, '${escapeHtml(book.title)}')">
                <div class="card-icon-badge-single">
                    <img class="book-display-icon" src="${book.displayIcon || 'assets/Icons/icon_carrot.png'}" alt="icon" onerror="handleIconError(event)">
                </div>
                <div class="card-read-hint">点击试阅 →</div>
            </div>
            <div class="card-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-sub">${escapeHtml(book.subtitle || '')}</div>
                ${book.characters?.length ? `<div class="info-row"><span class="info-label">角色</span><span class="info-value">${book.characters.map(c => escapeHtml(c)).join(' · ')}</span></div>` : ''}
            </div>
        </div>
    `).join('');

    // Attach click listeners
    grid.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.bookId);
            const book = getAllBooks().find(b => b.id === id);
            if (book) openReader(book);
        });
    });
}

function initToggle() {
    const options = document.querySelectorAll('.toggle-option');
    const setActive = (type) => {
        options.forEach(opt => opt.classList.toggle('active', opt.dataset.type === type));
        renderBooks(type);
    };
    options.forEach(opt => opt.addEventListener('click', () => setActive(opt.dataset.type)));
    renderBooks('doujin');
}

document.addEventListener('DOMContentLoaded', () => {
    initToggle();

    // Close button
    document.getElementById('readerClose').addEventListener('click', closeReader);

    // Nav buttons
    document.getElementById('readerPrev').addEventListener('click', readerPrev);
    document.getElementById('readerNext').addEventListener('click', readerNext);

    // Click outside the book to close
    document.getElementById('readerOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('readerOverlay')) closeReader();
    });
});

window.handleImgError = handleImgError;
window.handleIconError = handleIconError;
