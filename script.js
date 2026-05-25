const booksDatabase = {
    doujin: [
        { id: 1, title: "先喝完这杯", subtitle: "霸图中心 · 关于林敬言的退役", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/book1", characters: ["韩文清", "张新杰", "林敬言", "张佳乐"], displayIcon: "assets/Icons/icon_carrot.png", type: "doujin" },
        { id: 2, title: "噩梦", subtitle: "双花中心 · CP向", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/book2", characters: ["张佳乐", "孙哲平"], displayIcon: "assets/Icons/icon_heart.png", type: "doujin" },
        { id: 3, title: "Q市选手日记", subtitle: "霸图中心 · 短篇集", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/book3", characters: ["韩文清", "张新杰", "林敬言", "张佳乐"], displayIcon: "assets/Icons/icon_carrot.png", type: "doujin" }
    ],
    short: [
        { id: 101, title: "叶修长啥样啊?", subtitle: "叶乐 · CP向", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/short1", characters: ["叶修", "张佳乐"], displayIcon: "assets/Icons/icon_heart.png", type: "short" },
        { id: 102, title: "你能再讲一次遇到我那天的故事吗", subtitle: "双花中心 · CP向", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/short2", characters: ["张佳乐", "孙哲平"], displayIcon: "assets/Icons/icon_heart.png", type: "short" },
        { id: 103, title: "黑兔与白蔷薇", subtitle: "哥特童话", coverImg: "assets/covers/book1.jpg", pagepath: "assets/pages/short3", characters: ["黑兔", "白蔷薇"], displayIcon: "assets/Icons/icon_carrot.png", type: "short" },
        { id: 104, title: "电子眼泪谎话", subtitle: "赛博短篇 / 意识流", coverImg: "assets/covers/book2.jpg", pagepath: "assets/pages/short4", characters: ["电子幽灵", "人类"], displayIcon: "assets/Icons/icon_heart.png", type: "short" }
    ]
};

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
            </div>
            <div class="card-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-sub">${escapeHtml(book.subtitle || '')}</div>
                ${book.characters?.length ? `<div class="info-row"><span class="info-label">角色</span><span class="info-value">${book.characters.map(c => escapeHtml(c)).join(' · ')}</span></div>` : ''}
            </div>
        </div>
    `).join('');
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

document.addEventListener('DOMContentLoaded', initToggle);
window.handleImgError = handleImgError;
window.handleIconError = handleIconError;