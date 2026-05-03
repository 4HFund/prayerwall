// INITIAL DATA SEEDING
const initialData = [
    { id: 1, category: 'Urgent', text: 'Please pray for my dad who is in the ICU with complications from surgery. We need a miracle and peace.', display: 'Anonymous', count: 35, status: 'active', type: 'request', date: 'Shared Today' },
    { id: 2, category: 'Healing', text: 'Pray for my mom’s healing from cancer and strength for our family as we walk this journey.', display: 'A Foundery Family', count: 58, status: 'active', type: 'request', date: 'Updated Today' },
    { id: 3, category: 'Answered', text: 'Praise the Lord! My son got the job he interviewed for. Thank you for praying with us!', display: 'Grateful Mom', count: 72, status: 'answered', type: 'answered', date: 'Answered Today' }
];

let prayers = JSON.parse(localStorage.getItem('foundery_prayers')) || initialData;

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
    createEmbers();
    renderWall();
    renderFilters();
    updateStats();
});

function createEmbers() {
    const container = document.getElementById('emberContainer');
    for (let i = 0; i < 30; i++) {
        const ember = document.createElement('div');
        ember.className = 'ember';
        ember.style.left = Math.random() * 100 + 'vw';
        ember.style.width = ember.style.height = Math.random() * 4 + 2 + 'px';
        ember.style.animationDelay = Math.random() * 10 + 's';
        ember.style.animationDuration = Math.random() * 5 + 5 + 's';
        container.appendChild(ember);
    }
}

function renderWall(filter = 'All') {
    const wall = document.getElementById('prayerWall');
    wall.innerHTML = '';

    const filtered = filter === 'All' ? prayers : prayers.filter(p => p.category === filter || (filter === 'Answered' && p.type === 'answered'));

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = `prayer-card ${p.type === 'answered' ? 'answered-card' : ''}`;
        if(p.type === 'answered') card.style.background = 'var(--ans-bg)';
        
        card.innerHTML = `
            <div>
                <span class="card-tag tag-${p.category.toLowerCase()}">${p.category}</span>
                <p class="card-text">${p.text}</p>
            </div>
            <div class="card-footer">
                <div class="card-meta">
                    <strong>${p.display}</strong> • ${p.date}
                </div>
                <button class="btn btn-iprayed" onclick="handlePray(${p.id}, this)">
                    ${p.type === 'answered' ? '🙌 CELEBRATE THIS' : '🙏 I PRAYED'} (${p.count})
                </button>
            </div>
        `;
        wall.appendChild(card);
    });
}

function handlePray(id, btn) {
    if (btn.disabled) return;
    
    const index = prayers.findIndex(p => p.id === id);
    prayers[index].count++;
    localStorage.setItem('foundery_prayers', JSON.stringify(prayers));
    
    btn.classList.add('active');
    btn.disabled = true;
    btn.innerText = `❤️ AMEN (${prayers[index].count})`;
    
    setTimeout(() => {
        renderWall();
        updateStats();
    }, 1000);
}

function updateStats() {
    document.getElementById('stat-lifted').innerText = prayers.reduce((acc, curr) => acc + curr.count, 0);
    document.getElementById('stat-covered').innerText = prayers.filter(p => p.type === 'request').length;
    document.getElementById('stat-answered').innerText = prayers.filter(p => p.type === 'answered').length;
}

function renderFilters() {
    const cats = ['All', 'Urgent', 'Healing', 'Family', 'Anxiety', 'Provision', 'Salvation', 'Answered'];
    const container = document.getElementById('filterContainer');
    cats.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'filter-chip';
        btn.innerText = c;
        btn.onclick = () => renderWall(c);
        container.appendChild(btn);
    });
}

// MODAL LOGIC
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.getElementById('prayerForm').onsubmit = (e) => {
    e.preventDefault();
    const newReq = {
        id: Date.now(),
        category: document.getElementById('reqCat').value,
        text: document.getElementById('reqText').value,
        display: document.getElementById('reqDisplay').value,
        count: 0,
        status: 'active',
        type: 'request',
        date: 'Shared Today'
    };
    prayers.unshift(newReq);
    localStorage.setItem('foundery_prayers', JSON.stringify(prayers));
    renderWall();
    updateStats();
    closeModal('requestModal');
    alert("Thank you. Your request has been received.");
};
