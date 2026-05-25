// 书库数据 (包含同人本 + 短篇)
// 每本书可以有独立的 displayIcon 路径
const booksDatabase = {
    doujin: [
        {
            id: 1,
            title: "先喝完这杯",
            subtitle: "霸图中心 · 关于林敬言的退役",
            coverImg: "assets/covers/book1.jpg",
            pagepath: "assets/pages/book1",  // 用于后续加载分页图片
            characters: ["韩文清", "张新杰", "林敬言","张佳乐"],
            displayIcon: "assets/Icons/icon_carrot.png",  // 自定义图标路径
            type: "doujin"
        },
        {
            id: 2,
            title: "噩梦",
            subtitle: "双花中心 · CP向",
            coverImg: "assets/covers/book2.jpg",
            pagepath: "assets/pages/book2",
            characters: ["张佳乐", "孙哲平"],
            displayIcon: "assets/Icons/icon_heart.png",   // 自定义图标路径
            type: "doujin"
        },
        {
            id: 3,
            title: "Q市选手日记",
            subtitle: "霸图中心 · 短篇集",
            coverImg: "assets/covers/book1.jpg",
            pagepath: "assets/pages/book3",
            characters: ["韩文清", "张新杰", "林敬言","张佳乐"],
            displayIcon: "assets/Icons/icon_carrot.png",
            type: "doujin"
        },
    ],
    short: [
        {
            id: 101,
            title: "叶修长啥样啊?",
            subtitle: "叶乐 · CP向",
            coverImg: "assets/covers/book1.jpg",
            pagepath: "assets/pages/short1",
            characters: ["叶修", "张佳乐"],
            displayIcon: "assets/Icons/icon_heart.png",
            type: "short"
        },
        {
            id: 102,
            title: "你能再讲一次遇到我那天的故事吗",
            subtitle: "双花中心 · CP向",
            coverImg: "assets/covers/book2.jpg",
            pagepath: "assets/pages/short2",
            characters: ["张佳乐", "孙哲平"],
            displayIcon: "assets/Icons/icon_heart.png",
            type: "short"
        },
        {
            id: 103,
            title: "黑兔与白蔷薇",
            subtitle: "哥特童话",
            coverImg: "assets/covers/book1.jpg",
            pagepath: "assets/pages/short3",
            characters: ["黑兔", "白蔷薇"],
            displayIcon: "assets/Icons/icon_carrot.png",
            type: "short"
        },
        {
            id: 104,
            title: "电子眼泪谎话",
            subtitle: "赛博短篇 / 意识流",
            coverImg: "assets/covers/book2.jpg",
            pagepath: "assets/pages/short4",
            characters: ["电子幽灵", "人类"],
            displayIcon: "assets/Icons/icon_heart.png",
            type: "short"
        }
    ]
};

// 防XSS辅助函数
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 图片加载失败时的备用方案 (封面图)
function handleImgError(event, title) {
    const img = event.target;
    img.onerror = null;
    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'%3E%3Crect width='120' height='160' fill='%23ffe0e8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b95c7a' font-size='14' font-weight='bold'%3E🐰 ${escapeHtml(title).substring(0, 6)}%3C/text%3E%3C/svg%3E`;
}

// 独立图标加载失败备用
function handleIconError(event) {
    const img = event.target;
    img.onerror = null;
    // 使用胡萝卜作为默认 fallback
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff8c42'%3E%3Cpath d='M16,10L15.8,6.2C15.2,5.5 14.3,5 13.3,5H10.7C9.7,5 8.8,5.5 8.2,6.2L8,10H16Z M7,11v6c0,1.1 0.9,2 2,2h6c1.1,0 2-0.9 2-2v-6H7Z'/%3E%3C/svg%3E";
}

// 渲染书籍网格 (每本书使用自己的 displayIcon)
function renderBooks(type) {
    const gridContainer = document.getElementById('booksGrid');
    if (!gridContainer) return;
    
    const books = type === 'doujin' ? booksDatabase.doujin : booksDatabase.short;
    const typeLabel = document.getElementById('activeTypeLabel');
    if (typeLabel) typeLabel.innerText = (type === 'doujin' ? '同人本' : '短篇');
    
    let html = '';
    books.forEach(book => {
        // 获取该书的独立图标路径，如果没有则使用默认胡萝卜
        const bookIcon = book.displayIcon || "assets/Icons/icon_carrot.png";
        // 生成角色标签 HTML
        const charactersHtml = book.characters && book.characters.length > 0 ? 
            `<div class="info-row"><span class="info-label">角色</span><span class="info-value">${book.characters.map(c => escapeHtml(c)).join(' · ')}</span></div>` : '';
        
        html += `
            <div class="book-card" data-book-id="${book.id}" data-book-type="${book.type}" data-pagepath="${book.pagepath || ''}">
                <div class="cover-area">
                    <img class="cover-img" src="${book.coverImg}" alt="${escapeHtml(book.title)}" onerror="handleImgError(event, '${escapeHtml(book.title)}')">
                    <!-- 每本书独立的图标，显示在封面角标位置 -->
                    <div class="card-icon-badge-single">
                        <img class="book-display-icon" src="${bookIcon}" alt="book icon" onerror="handleIconError(event)">
                    </div>
                </div>
                <div class="card-info">
                    <div class="book-title">
                        <span>${escapeHtml(book.title)}</span>
                    </div>
                    <div class="book-sub">${escapeHtml(book.subtitle || '')}</div>
                    ${charactersHtml}
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = html;
}

// 初始化切换功能
function initToggle() {
    const options = document.querySelectorAll('.toggle-option');
    let currentType = 'doujin';
    
    function setActive(activeType) {
        options.forEach(opt => {
            const typeVal = opt.getAttribute('data-type');
            if (typeVal === activeType) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        renderBooks(activeType);
        currentType = activeType;
    }
    
    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const typeVal = opt.getAttribute('data-type');
            if (typeVal === 'doujin') setActive('doujin');
            else if (typeVal === 'short') setActive('short');
        });
    });
    
    // 初始加载同人本
    renderBooks('doujin');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initToggle();
});

// 将处理函数挂载到全局，供HTML中的onerror调用
window.handleImgError = handleImgError;
window.handleIconError = handleIconError;