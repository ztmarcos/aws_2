// Journal Web App
class JournalApp {
    constructor() {
        this.currentView = 'dashboard';
        this.entries = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadEntries();
        this.showView('dashboard');
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('newEntryBtn').addEventListener('click', () => this.showNewEntryForm());
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearchSection());
        document.getElementById('closeFormBtn').addEventListener('click', () => this.showDashboard());
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.showDashboard());
        document.getElementById('backToListBtn').addEventListener('click', () => this.showDashboard());

        // Form submission
        document.getElementById('entryForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveDraft());

        // Search
        document.getElementById('searchSubmitBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Entry actions
        document.getElementById('editEntryBtn').addEventListener('click', () => this.editCurrentEntry());
        document.getElementById('deleteEntryBtn').addEventListener('click', () => this.deleteCurrentEntry());
    }

    showView(view) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        document.getElementById(view).classList.remove('hidden');
        this.currentView = view;

        // Update navigation state
        this.updateNavigationState();
    }

    showDashboard() {
        this.showView('dashboard');
        this.loadEntries();
        this.updateStats();
    }

    showNewEntryForm() {
        this.showView('newEntryForm');
        this.clearForm();
    }

    showSearchSection() {
        this.showView('searchSection');
        this.loadTagsForFilter();
    }

    updateNavigationState() {
        // Update button states based on current view
        const buttons = document.querySelectorAll('.header-actions .btn');
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    async loadEntries() {
        try {
            this.showLoading();
            
            // Simulate API call - in real implementation, this would call your Lambda function
            await this.simulateApiDelay();
            
            // For demo purposes, load from localStorage
            const savedEntries = localStorage.getItem('journalEntries');
            this.entries = savedEntries ? JSON.parse(savedEntries) : this.getSampleEntries();
            
            this.renderRecentEntries();
            this.updateStats();
            
        } catch (error) {
            this.showToast('Error cargando entradas', 'error');
        } finally {
            this.hideLoading();
        }
    }

    getSampleEntries() {
        return [
            {
                id: '1',
                title: 'Mi primer día con AWS',
                content: 'Hoy aprendí sobre S3, DynamoDB y Lambda. Es increíble cómo estos servicios pueden trabajar juntos para crear aplicaciones poderosas.',
                date: new Date().toISOString().split('T')[0],
                tags: ['aws', 'aprendizaje', 'tecnología'],
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Reflexiones sobre el desarrollo',
                content: 'El desarrollo de software es tanto arte como ciencia. Cada línea de código cuenta una historia.',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                tags: ['desarrollo', 'reflexión'],
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    renderRecentEntries() {
        const container = document.getElementById('recentEntriesList');
        const recentEntries = this.entries.slice(0, 5);

        if (recentEntries.length === 0) {
            container.innerHTML = `
                <div class="text-center mt-20">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 20px;"></i>
                    <h3 style="color: #718096; margin-bottom: 10px;">No hay entradas aún</h3>
                    <p style="color: #a0aec0;">¡Crea tu primera entrada para comenzar tu journal!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentEntries.map(entry => `
            <div class="entry-card" onclick="app.showEntryDetail('${entry.id}')">
                <h3>${this.escapeHtml(entry.title)}</h3>
                <div class="entry-meta">
                    <span class="entry-date">
                        <i class="fas fa-calendar"></i> ${this.formatDate(entry.date)}
                    </span>
                    <span class="entry-time">
                        <i class="fas fa-clock"></i> ${this.formatTime(entry.createdAt)}
                    </span>
                </div>
                <div class="entry-preview">${this.escapeHtml(entry.content.substring(0, 150))}${entry.content.length > 150 ? '...' : ''}</div>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalEntries = this.entries.length;
        const thisWeek = this.getThisWeekEntries();
        const uniqueTags = new Set(this.entries.flatMap(entry => entry.tags)).size;
        const streak = this.calculateStreak();

        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('thisWeekEntries').textContent = thisWeek;
        document.getElementById('totalTags').textContent = uniqueTags;
        document.getElementById('streakDays').textContent = streak;
    }

    getThisWeekEntries() {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return this.entries.filter(entry => new Date(entry.date) >= oneWeekAgo).length;
    }

    calculateStreak() {
        // Simple streak calculation - consecutive days with entries
        const sortedEntries = this.entries
            .map(entry => entry.date)
            .sort()
            .reverse();

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedEntries.length; i++) {
            const entryDate = new Date(sortedEntries[i]);
            entryDate.setHours(0, 0, 0, 0);
            
            if (entryDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (entryDate.getTime() < currentDate.getTime()) {
                break;
            }
        }

        return streak;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const entry = {
            id: Date.now().toString(),
            title: formData.get('title'),
            content: formData.get('content'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.showLoading();
            
            // Simulate API call
            await this.simulateApiDelay();
            
            // Add to entries array
            this.entries.unshift(entry);
            
            // Save to localStorage (in real app, this would be saved to DynamoDB via Lambda)
            localStorage.setItem('journalEntries', JSON.stringify(this.entries));
            
            this.showToast('¡Entrada creada exitosamente!', 'success');
            this.showDashboard();
            
        } catch (error) {
            this.showToast('Error creando entrada', 'error');
        } finally {
            this.hideLoading();
        }
    }

    saveDraft() {
        const formData = new FormData(document.getElementById('entryForm'));
        const draft = {
            title: formData.get('title'),
            content: formData.get('content'),
            tags: formData.get('tags')
        };
        
        localStorage.setItem('journalDraft', JSON.stringify(draft));
        this.showToast('Borrador guardado', 'info');
    }

    loadDraft() {
        const draft = localStorage.getItem('journalDraft');
        if (draft) {
            const draftData = JSON.parse(draft);
            document.getElementById('entryTitle').value = draftData.title || '';
            document.getElementById('entryContent').value = draftData.content || '';
            document.getElementById('entryTags').value = draftData.tags || '';
        }
    }

    clearForm() {
        document.getElementById('entryForm').reset();
        this.loadDraft();
    }

    performSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const dateFilter = document.getElementById('dateFilter').value;
        const tagFilter = document.getElementById('tagFilter').value;

        let filteredEntries = this.entries;

        // Text search
        if (query) {
            filteredEntries = filteredEntries.filter(entry => 
                entry.title.toLowerCase().includes(query) ||
                entry.content.toLowerCase().includes(query)
            );
        }

        // Date filter
        if (dateFilter) {
            const now = new Date();
            filteredEntries = filteredEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                switch (dateFilter) {
                    case 'today':
                        return entryDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return entryDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return entryDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Tag filter
        if (tagFilter) {
            filteredEntries = filteredEntries.filter(entry => 
                entry.tags.includes(tagFilter)
            );
        }

        this.renderSearchResults(filteredEntries);
    }

    renderSearchResults(entries) {
        const container = document.getElementById('searchResults');
        
        if (entries.length === 0) {
            container.innerHTML = `
                <div class="text-center mt-20">
                    <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 20px;"></i>
                    <h3 style="color: #718096;">No se encontraron entradas</h3>
                    <p style="color: #a0aec0;">Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="entry-card" onclick="app.showEntryDetail('${entry.id}')">
                <h3>${this.escapeHtml(entry.title)}</h3>
                <div class="entry-meta">
                    <span class="entry-date">
                        <i class="fas fa-calendar"></i> ${this.formatDate(entry.date)}
                    </span>
                </div>
                <div class="entry-preview">${this.escapeHtml(entry.content.substring(0, 150))}${entry.content.length > 150 ? '...' : ''}</div>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    loadTagsForFilter() {
        const allTags = [...new Set(this.entries.flatMap(entry => entry.tags))];
        const tagFilter = document.getElementById('tagFilter');
        
        tagFilter.innerHTML = '<option value="">Todos los tags</option>' +
            allTags.map(tag => `<option value="${this.escapeHtml(tag)}">${this.escapeHtml(tag)}</option>`).join('');
    }

    showEntryDetail(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        this.currentEntry = entry;
        
        document.getElementById('entryDetailTitle').textContent = entry.title;
        document.getElementById('entryDetailDate').textContent = this.formatDate(entry.date);
        document.getElementById('entryDetailContent').textContent = entry.content;
        
        const tagsContainer = document.getElementById('entryDetailTags');
        tagsContainer.innerHTML = entry.tags.map(tag => 
            `<span class="tag">${this.escapeHtml(tag)}</span>`
        ).join('');

        this.showView('entryDetail');
    }

    editCurrentEntry() {
        if (!this.currentEntry) return;
        
        this.showNewEntryForm();
        
        // Populate form with current entry data
        document.getElementById('entryTitle').value = this.currentEntry.title;
        document.getElementById('entryContent').value = this.currentEntry.content;
        document.getElementById('entryTags').value = this.currentEntry.tags.join(', ');
        
        this.editingEntry = this.currentEntry;
    }

    deleteCurrentEntry() {
        if (!this.currentEntry) return;
        
        if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
            this.entries = this.entries.filter(entry => entry.id !== this.currentEntry.id);
            localStorage.setItem('journalEntries', JSON.stringify(this.entries));
            this.showToast('Entrada eliminada', 'success');
            this.showDashboard();
        }
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    async simulateApiDelay() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JournalApp();
});
