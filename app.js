// ==========================================
// ESTADO INICIAL & DADOS DE DEMONSTRAÇÃO
// ==========================================
const DEFAULT_STATE = {
    currentUser: {
        id: 'u1',
        name: 'Lucas Andrade',
        handle: '@lucas.dev',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
        bio: 'Engenheiro de Software Full-Stack | Construindo interfaces modernas e escaláveis 🚀',
        location: 'Curitiba, PR',
        following: ['u2', 'u3'],
        followersCount: 1284
    },
    stories: [
        { id: 's1', name: 'Mariana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80', caption: 'Setup pronto para mais um deploy ☕💻' },
        { id: 's2', name: 'Rafael', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80', caption: 'Fim de tarde incrível depois do trabalho 🌄' },
        { id: 's3', name: 'Camila', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80', caption: 'Refatorando toda a arquitetura CSS hoje!' },
        { id: 's4', name: 'Thiago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80', caption: 'Brainstorming com o time de produto ✨' }
    ],
    suggestions: [
        { id: 'u2', name: 'Mariana Costa', handle: '@maricosta.ux', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', verified: true },
        { id: 'u3', name: 'Rafael Mendes', handle: '@rafatech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', verified: true },
        { id: 'u4', name: 'Camila Rocha', handle: '@camila.codes', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', verified: false }
    ],
    posts: [
        {
            id: 'p1',
            authorId: 'u2',
            authorName: 'Mariana Costa',
            authorHandle: '@maricosta.ux',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
            verified: true,
            mood: '✨ Inspirada',
            content: 'Design systems bem documentados economizam centenas de horas entre design e engenharia. Qual biblioteca de componentes vocês mais curtem usar hoje? #DesignSystem #UIUX #Frontend',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80',
            timestamp: '2h',
            likes: ['u3'],
            reposts: 14,
            repostedByMe: false,
            bookmarked: false,
            comments: [
                { id: 'c1', author: 'Rafael Mendes', handle: '@rafatech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', text: 'Tailwind + componentes headless tem sido imbatível por aqui!' }
            ]
        },
        {
            id: 'p2',
            authorId: 'u3',
            authorName: 'Rafael Mendes',
            authorHandle: '@rafatech',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
            verified: true,
            mood: '🚀 Focado',
            content: 'Acabamos de reduzir o tempo de carregamento inicial da aplicação em 62% apenas otimizando bundle splitting e cache no edge. Performance também é UX! #WebDev #JavaScript',
            image: '',
            timestamp: '5h',
            likes: ['u1', 'u2'],
            reposts: 29,
            repostedByMe: true,
            bookmarked: true,
            comments: []
        }
    ],
    notifications: [
        { id: 'n1', icon: 'fa-heart text-rose-500', text: '<strong>Mariana Costa</strong> curtiu sua publicação.', time: '15m atrás' },
        { id: 'n2', icon: 'fa-retweet text-emerald-400', text: '<strong>Rafael Mendes</strong> repostou seu insight sobre arquitetura.', time: '1h atrás' },
        { id: 'n3', icon: 'fa-user-plus text-indigo-400', text: '<strong>Camila Rocha</strong> começou a seguir você.', time: '3h atrás' }
    ],
    chats: {
        u2: [
            { from: 'them', text: 'Oi Lucas! Vi seu novo projeto na Nexus, ficou muito fluido!' },
            { from: 'me', text: 'Valeu Mari! Usei Tailwind e persistência local para deixar instantâneo.' }
        ],
        u3: [
            { from: 'them', text: 'Bora marcar aquela call sobre micro-frontends amanhã?' }
        ]
    }
};

let state = JSON.parse(localStorage.getItem('nexus_social_v1')) || structuredClone(DEFAULT_STATE);
let currentView = 'feed';
let searchQuery = '';
let selectedMood = '';
let attachedImage = '';
let activeChatUser = 'u2';
let storyTimer = null;

function saveState() {
    localStorage.setItem('nexus_social_v1', JSON.stringify(state));
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 2600);
}

// ==========================================
// NAVEGAÇÃO & RENDERIZAÇÃO PRINCIPAL
// ==========================================
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    const titles = {
        feed: 'Página Inicial',
        explore: 'Explorar Tendências',
        notifications: 'Notificações',
        messages: 'Mensagens Diretas',
        bookmarks: 'Itens Salvos',
        profile: 'Meu Perfil'
    };
    document.getElementById('view-title').textContent = titles[view] || 'Nexus';
    render();
}

function render() {
    updateSidebarUser();
    renderWidgets();
    const container = document.getElementById('main-content');

    if (currentView === 'feed') container.innerHTML = renderFeedView();
    else if (currentView === 'explore') container.innerHTML = renderExploreView();
    else if (currentView === 'notifications') container.innerHTML = renderNotificationsView();
    else if (currentView === 'messages') container.innerHTML = renderMessagesView();
    else if (currentView === 'bookmarks') container.innerHTML = renderBookmarksView();
    else if (currentView === 'profile') container.innerHTML = renderProfileView();
}

function updateSidebarUser() {
    document.getElementById('sidebar-avatar').src = state.currentUser.avatar;
    document.getElementById('sidebar-name').textContent = state.currentUser.name;
    document.getElementById('sidebar-handle').textContent = state.currentUser.handle;
}

// ==========================================
// VIEWS (FEED, EXPLORE, CHAT, PERFIL, ETC)
// ==========================================
function renderFeedView() {
    const filteredPosts = filterPosts(state.posts);
    return `
        <!-- Barra de Stories -->
        <div class="flex gap-3.5 overflow-x-auto px-4 py-4 border-b border-slate-800/80">
            ${state.stories.map(s => `
                <button onclick="openStory('${s.id}')" class="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
                    <div class="p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 group-hover:scale-105 transition">
                        <img src="${s.avatar}" class="w-14 h-14 rounded-full object-cover border-2 border-slate-950">
                    </div>
                    <span class="text-xs text-slate-300 font-medium">${s.name}</span>
                </button>
            `).join('')}
        </div>

        <!-- Compositor de Post -->
        <div class="p-4 border-b border-slate-800/80 flex gap-3.5">
            <img src="${state.currentUser.avatar}" class="w-11 h-11 rounded-full object-cover shrink-0">
            <div class="flex-1 space-y-3">
                <textarea id="post-input" rows="2" maxlength="280" oninput="updateCharCount(this)"
                    placeholder="O que está acontecendo agora?"
                    class="w-full bg-transparent text-base text-slate-100 placeholder-slate-500 resize-none outline-none"></textarea>
                
                ${selectedMood ? `<div class="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    <span>Humor: ${selectedMood}</span>
                    <button onclick="setMood('')" class="hover:text-white">&times;</button>
                </div>` : ''}

                ${attachedImage ? `<div class="relative rounded-2xl overflow-hidden border border-slate-800">
                    <img src="${attachedImage}" class="max-h-72 w-full object-cover">
                    <button onclick="removeAttachedImage()" class="absolute top-2 right-2 bg-black/75 text-white w-7 h-7 rounded-full hover:bg-black">&times;</button>
                </div>` : ''}

                <div class="flex items-center justify-between pt-2 border-t border-slate-800/70">
                    <div class="flex items-center gap-1 text-indigo-400">
                        <label class="p-2 hover:bg-indigo-500/10 rounded-full cursor-pointer transition" title="Upload de Imagem">
                            <i class="fa-regular fa-image"></i>
                            <input type="file" accept="image/*" class="hidden" onchange="handleImageUpload(event)">
                        </label>
                        <button onclick="attachRandomPhoto()" class="p-2 hover:bg-indigo-500/10 rounded-full transition" title="Foto Aleatória">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </button>
                        <button onclick="cycleMood()" class="p-2 hover:bg-indigo-500/10 rounded-full transition" title="Adicionar Humor">
                            <i class="fa-regular fa-face-smile"></i>
                        </button>
                    </div>
                    <div class="flex items-center gap-3">
                        <span id="char-count" class="text-xs text-slate-500">0/280</span>
                        <button onclick="createPost()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-full transition shadow-md shadow-indigo-600/20 cursor-pointer">
                            Publicar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de Posts -->
        <div>
            ${filteredPosts.length ? filteredPosts.map(renderPostCard).join('') : `<p class="text-center text-slate-500 py-12">Nenhuma publicação encontrada.</p>`}
        </div>
    `;
}

function renderPostCard(post) {
    const isLiked = post.likes.includes(state.currentUser.id);
    const isOwner = post.authorId === state.currentUser.id;
    const formattedContent = post.content.replace(/(#\w+)/g, '<span onclick="filterByTag(\'$1\')" class="text-indigo-400 hover:underline cursor-pointer">$1</span>');

    return `
        <article class="post-card p-4 border-b border-slate-800/80 hover:bg-slate-900/30 transition">
            <div class="flex gap-3.5">
                <img src="${post.authorAvatar}" class="w-11 h-11 rounded-full object-cover shrink-0">
                <div class="flex-1 min-w-0">
                    <!-- Cabeçalho do Post -->
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 truncate">
                            <span class="font-bold text-sm hover:underline cursor-pointer truncate">${post.authorName}</span>
                            ${post.verified ? '<i class="fa-solid fa-circle-check text-indigo-400 text-xs"></i>' : ''}
                            <span class="text-xs text-slate-400 truncate">${post.authorHandle} · ${post.timestamp}</span>
                            ${post.mood ? `<span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full ml-1">${post.mood}</span>` : ''}
                        </div>
                        ${isOwner ? `<button onclick="deletePost('${post.id}')" class="text-slate-500 hover:text-rose-500 text-xs p-1" title="Excluir"><i class="fa-regular fa-trash-can"></i></button>` : ''}
                    </div>

                    <!-- Texto e Mídia -->
                    <p class="text-sm text-slate-200 mt-1.5 leading-relaxed whitespace-pre-line">${formattedContent}</p>
                    ${post.image ? `<img src="${post.image}" class="mt-3 rounded-2xl border border-slate-800 max-h-96 w-full object-cover">` : ''}

                    <!-- Barra de Interações -->
                    <div class="flex items-center justify-between max-w-md mt-3.5 text-slate-400 text-sm">
                        <button onclick="toggleComments('${post.id}')" class="flex items-center gap-1.5 hover:text-indigo-400 transition">
                            <i class="fa-regular fa-comment"></i>
                            <span>${post.comments.length}</span>
                        </button>
                        <button onclick="toggleRepost('${post.id}')" class="flex items-center gap-1.5 ${post.repostedByMe ? 'text-emerald-400' : 'hover:text-emerald-400'} transition">
                            <i class="fa-solid fa-retweet"></i>
                            <span>${post.reposts}</span>
                        </button>
                        <button onclick="toggleLike('${post.id}')" class="flex items-center gap-1.5 ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'} transition">
                            <i class="${isLiked ? 'fa-solid animate-heart' : 'fa-regular'} fa-heart"></i>
                            <span>${post.likes.length}</span>
                        </button>
                        <button onclick="toggleBookmark('${post.id}')" class="${post.bookmarked ? 'text-indigo-400' : 'hover:text-indigo-400'} transition">
                            <i class="${post.bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                        </button>
                    </div>

                    <!-- Área de Comentários -->
                    <div id="comments-${post.id}" class="hidden mt-3 pt-3 border-t border-slate-800/70 space-y-2.5">
                        ${post.comments.map(c => `
                            <div class="flex gap-2.5 bg-slate-900/70 p-2.5 rounded-xl text-xs">
                                <img src="${c.avatar}" class="w-7 h-7 rounded-full object-cover">
                                <div>
                                    <span class="font-semibold text-slate-200">${c.author}</span>
                                    <span class="text-slate-500 ml-1">${c.handle}</span>
                                    <p class="text-slate-300 mt-0.5">${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                        <div class="flex gap-2">
                            <input id="comment-input-${post.id}" type="text" placeholder="Escreva uma resposta..."
                                onkeypress="if(event.key==='Enter') addComment('${post.id}')"
                                class="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 text-xs outline-none focus:border-indigo-500">
                            <button onclick="addComment('${post.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-1.5 rounded-full font-medium">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderExploreView() {
    const tags = ['#WebDev', '#JavaScript', '#DesignSystem', '#UIUX', '#Frontend', '#IA'];
    return `
        <div class="p-4 border-b border-slate-800 flex flex-wrap gap-2">
            <button onclick="filterByTag('')" class="px-3.5 py-1.5 rounded-full text-xs font-medium ${!searchQuery ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}">Todos</button>
            ${tags.map(t => `
                <button onclick="filterByTag('${t}')" class="px-3.5 py-1.5 rounded-full text-xs font-medium ${searchQuery === t ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}">${t}</button>
            `).join('')}
        </div>
        <div>${filterPosts(state.posts).map(renderPostCard).join('')}</div>
    `;
}

function renderNotificationsView() {
    return `
        <div class="divide-y divide-slate-800/80">
            ${state.notifications.map(n => `
                <div class="p-4 flex items-center gap-3.5 hover:bg-slate-900/40 transition">
                    <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                        <i class="fa-solid ${n.icon}"></i>
                    </div>
                    <div class="flex-1 text-sm">
                        <p class="text-slate-200">${n.text}</p>
                        <span class="text-xs text-slate-500">${n.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMessagesView() {
    const partner = state.suggestions.find(u => u.id === activeChatUser) || state.suggestions[0];
    const history = state.chats[partner.id] || [];
    return `
        <div class="grid grid-cols-1 sm:grid-cols-3 h-[calc(100vh-65px)]">
            <div class="border-r border-slate-800 divide-y divide-slate-800/60">
                ${state.suggestions.map(u => `
                    <button onclick="selectChat('${u.id}')" class="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-900/60 transition ${u.id === partner.id ? 'bg-slate-900' : ''}">
                        <img src="${u.avatar}" class="w-10 h-10 rounded-full object-cover">
                        <div class="truncate">
                            <p class="text-sm font-semibold truncate">${u.name}</p>
                            <p class="text-xs text-slate-400 truncate">${u.handle}</p>
                        </div>
                    </button>
                `).join('')}
            </div>
            <div class="sm:col-span-2 flex flex-col justify-between p-4">
                <div class="space-y-3 overflow-y-auto max-h-[65vh] pr-1">
                    ${history.map(m => `
                        <div class="flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}">
                            <div class="max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-100 rounded-bl-none'}">
                                ${m.text}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="flex gap-2 pt-3 border-t border-slate-800">
                    <input id="chat-input" type="text" placeholder="Enviar mensagem para ${partner.name}..."
                        onkeypress="if(event.key==='Enter') sendMessage()"
                        class="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500">
                    <button onclick="sendMessage()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderBookmarksView() {
    const saved = state.posts.filter(p => p.bookmarked);
    return saved.length
        ? saved.map(renderPostCard).join('')
        : `<div class="text-center py-16 text-slate-500"><i class="fa-regular fa-bookmark text-3xl mb-2"></i><p>Você ainda não salvou nenhuma publicação.</p></div>`;
}

function renderProfileView() {
    const userPosts = state.posts.filter(p => p.authorId === state.currentUser.id);
    return `
        <div>
            <img src="${state.currentUser.cover}" class="w-full h-44 object-cover">
            <div class="px-4 pb-5 border-b border-slate-800">
                <div class="flex justify-between items-end -mt-12 mb-3">
                    <img src="${state.currentUser.avatar}" class="w-24 h-24 rounded-full object-cover border-4 border-slate-950">
                    <button onclick="toggleEditProfileModal(true)" class="px-4 py-1.5 rounded-full border border-slate-700 hover:bg-slate-900 text-sm font-semibold transition">
                        Editar Perfil
                    </button>
                </div>
                <h2 class="text-xl font-bold">${state.currentUser.name}</h2>
                <p class="text-sm text-slate-400">${state.currentUser.handle}</p>
                <p class="text-sm text-slate-200 mt-2.5">${state.currentUser.bio}</p>
                <div class="flex items-center gap-4 text-xs text-slate-400 mt-3">
                    <span><i class="fa-solid fa-location-dot mr-1"></i>${state.currentUser.location}</span>
                    <span><strong class="text-white">${state.currentUser.following.length}</strong> Seguindo</span>
                    <span><strong class="text-white">${state.currentUser.followersCount}</strong> Seguidores</span>
                </div>
            </div>
            <div>${userPosts.length ? userPosts.map(renderPostCard).join('') : '<p class="text-center text-slate-500 py-10">Nenhuma publicação ainda.</p>'}</div>
        </div>
    `;
}

// ==========================================
// AÇÕES & INTERATIVIDADE
// ==========================================
function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();
    if (!content && !attachedImage) return showToast('Escreva algo ou adicione uma imagem!');

    state.posts.unshift({
        id: 'p' + Date.now(),
        authorId: state.currentUser.id,
        authorName: state.currentUser.name,
        authorHandle: state.currentUser.handle,
        authorAvatar: state.currentUser.avatar,
        verified: true,
        mood: selectedMood,
        content,
        image: attachedImage,
        timestamp: 'Agora',
        likes: [],
        reposts: 0,
        repostedByMe: false,
        bookmarked: false,
        comments: []
    });

    selectedMood = '';
    attachedImage = '';
    saveState();
    render();
    showToast('Publicação enviada!');
}

function deletePost(id) {
    state.posts = state.posts.filter(p => p.id !== id);
    saveState();
    render();
    showToast('Publicação removida.');
}

function toggleLike(id) {
    const post = state.posts.find(p => p.id === id);
    const idx = post.likes.indexOf(state.currentUser.id);
    idx > -1 ? post.likes.splice(idx, 1) : post.likes.push(state.currentUser.id);
    saveState();
    render();
}

function toggleRepost(id) {
    const post = state.posts.find(p => p.id === id);
    post.repostedByMe = !post.repostedByMe;
    post.reposts += post.repostedByMe ? 1 : -1;
    saveState();
    render();
    showToast(post.repostedByMe ? 'Repostado no seu perfil!' : 'Repost desfeito.');
}

function toggleBookmark(id) {
    const post = state.posts.find(p => p.id === id);
    post.bookmarked = !post.bookmarked;
    saveState();
    render();
    showToast(post.bookmarked ? 'Salvo nos favoritos!' : 'Removido dos salvos.');
}

function toggleComments(id) {
    document.getElementById(`comments-${id}`).classList.toggle('hidden');
}

function addComment(id) {
    const input = document.getElementById(`comment-input-${id}`);
    const text = input.value.trim();
    if (!text) return;
