// Journal Web App - TypeScript Version
import './style.css'

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    tags: string[];
    date: string;
    createdAt: string;
    updatedAt: string;
}

class JournalApp {
    private currentView: string = 'dashboard';
    private entries: JournalEntry[] = [];
    private currentEntry?: JournalEntry;
    private editingEntry?: JournalEntry;

    constructor() {
        this.init();
    }

    private init(): void {
        this.bindEvents();
        this.loadEntries();
        this.showView('dashboard');
    }

    private bindEvents(): void {
        // Navigation buttons
        document.getElementById('newEntryBtn')?.addEventListener('click', () => this.showNewEntryForm());
        document.getElementById('searchBtn')?.addEventListener('click', () => this.showSearchSection());
        document.getElementById('closeFormBtn')?.addEventListener('click', () => this.showDashboard());
        document.getElementById('closeSearchBtn')?.addEventListener('click', () => this.showDashboard());
        document.getElementById('backToListBtn')?.addEventListener('click', () => this.showDashboard());

        // Form submission
        document.getElementById('entryForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('saveDraftBtn')?.addEventListener('click', () => this.saveDraft());

        // Search
        document.getElementById('searchSubmitBtn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Entry actions
        document.getElementById('editEntryBtn')?.addEventListener('click', () => this.editCurrentEntry());
        document.getElementById('deleteEntryBtn')?.addEventListener('click', () => this.deleteCurrentEntry());
    }

    private showView(view: string): void {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(view);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        this.currentView = view;

        // Update navigation state
        this.updateNavigationState();
    }

    private showDashboard(): void {
        this.showView('dashboard');
        this.loadEntries();
        this.updateStats();
    }

    private showNewEntryForm(): void {
        this.showView('newEntryForm');
        this.clearForm();
    }

    private showSearchSection(): void {
        this.showView('searchSection');
        this.loadTagsForFilter();
    }

    private updateNavigationState(): void {
        // Update button states based on current view
        const buttons = document.querySelectorAll('.header-actions .btn');
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    private async loadEntries(): Promise<void> {
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

    private getSampleEntries(): JournalEntry[] {
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

    private renderRecentEntries(): void {
        const container = document.getElementById('recentEntriesList');
        if (!container) return;

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

    private updateStats(): void {
        const totalEntries = this.entries.length;
        const thisWeek = this.getThisWeekEntries();
        const uniqueTags = new Set(this.entries.flatMap(entry => entry.tags)).size;
        const streak = this.calculateStreak();

        this.updateElement('totalEntries', totalEntries.toString());
        this.updateElement('thisWeekEntries', thisWeek.toString());
        this.updateElement('totalTags', uniqueTags.toString());
        this.updateElement('streakDays', streak.toString());
    }

    private updateElement(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    private getThisWeekEntries(): number {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return this.entries.filter(entry => new Date(entry.date) >= oneWeekAgo).length;
    }

    private calculateStreak(): number {
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

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const entry: JournalEntry = {
            id: Date.now().toString(),
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag),
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

    private saveDraft(): void {
        const form = document.getElementById('entryForm') as HTMLFormElement;
        const formData = new FormData(form);
        
        const draft = {
            title: formData.get('title'),
            content: formData.get('content'),
            tags: formData.get('tags')
        };
        
        localStorage.setItem('journalDraft', JSON.stringify(draft));
        this.showToast('Borrador guardado', 'info');
    }

    private loadDraft(): void {
        const draft = localStorage.getItem('journalDraft');
        if (draft) {
            const draftData = JSON.parse(draft);
            (document.getElementById('entryTitle') as HTMLInputElement).value = draftData.title || '';
            (document.getElementById('entryContent') as HTMLTextAreaElement).value = draftData.content || '';
            (document.getElementById('entryTags') as HTMLInputElement).value = draftData.tags || '';
        }
    }

    private clearForm(): void {
        const form = document.getElementById('entryForm') as HTMLFormElement;
        form.reset();
        this.loadDraft();
    }

    private performSearch(): void {
        const query = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
        const dateFilter = (document.getElementById('dateFilter') as HTMLSelectElement).value;
        const tagFilter = (document.getElementById('tagFilter') as HTMLSelectElement).value;

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

    private renderSearchResults(entries: JournalEntry[]): void {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
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

    private loadTagsForFilter(): void {
        const allTags = [...new Set(this.entries.flatMap(entry => entry.tags))];
        const tagFilter = document.getElementById('tagFilter') as HTMLSelectElement;
        
        tagFilter.innerHTML = '<option value="">Todos los tags</option>' +
            allTags.map(tag => `<option value="${this.escapeHtml(tag)}">${this.escapeHtml(tag)}</option>`).join('');
    }

    public showEntryDetail(entryId: string): void {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        this.currentEntry = entry;
        
        this.updateElement('entryDetailTitle', entry.title);
        this.updateElement('entryDetailDate', this.formatDate(entry.date));
        this.updateElement('entryDetailContent', entry.content);
        
        const tagsContainer = document.getElementById('entryDetailTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = entry.tags.map(tag => 
                `<span class="tag">${this.escapeHtml(tag)}</span>`
            ).join('');
        }

        this.showView('entryDetail');
    }

    private editCurrentEntry(): void {
        if (!this.currentEntry) return;
        
        this.showNewEntryForm();
        
        // Populate form with current entry data
        (document.getElementById('entryTitle') as HTMLInputElement).value = this.currentEntry.title;
        (document.getElementById('entryContent') as HTMLTextAreaElement).value = this.currentEntry.content;
        (document.getElementById('entryTags') as HTMLInputElement).value = this.currentEntry.tags.join(', ');
        
        this.editingEntry = this.currentEntry;
    }

    private deleteCurrentEntry(): void {
        if (!this.currentEntry) return;
        
        if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
            this.entries = this.entries.filter(entry => entry.id !== this.currentEntry!.id);
            localStorage.setItem('journalEntries', JSON.stringify(this.entries));
            this.showToast('Entrada eliminada', 'success');
            this.showDashboard();
        }
    }

    // Utility functions
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    private formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private showLoading(): void {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    private hideLoading(): void {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        const container = document.getElementById('toastContainer');
        if (!container) return;

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

    private async simulateApiDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    (window as any).app = new JournalApp();
});