(function () {
    function showMessage(target, type, text) {
        const host = typeof target === 'string' ? document.querySelector(target) : target;
        if (!host) return;

        const oldMessage = host.querySelector('.message');
        if (oldMessage) oldMessage.remove();

        const message = document.createElement('div');
        message.className = `message ${type || 'info'}`;
        message.textContent = text;
        host.appendChild(message);
    }

    function formatDate(value) {
        if (!value) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(value));
    }

    function daysSince(value) {
        if (!value) return null;
        const start = new Date(value);
        const now = new Date();
        return Math.floor((now - start) / (1000 * 60 * 60 * 24));
    }

    function statusBadge(status) {
        const normalized = (status || '').toLowerCase();
        let tone = '';
        if (['aktif', 'disetujui', 'selesai', 'cukup'].includes(normalized)) tone = 'ok';
        if (['menunggu', 'rendah', 'diproses'].includes(normalized)) tone = 'warn';
        if (['ditolak', 'kurang'].includes(normalized)) tone = 'danger';
        return `<span class="badge ${tone}">${status || '-'}</span>`;
    }

    function emptyRow(colspan, text) {
        return `<tr><td colspan="${colspan}" class="muted">${text}</td></tr>`;
    }

    window.DonDarUI = {
        showMessage,
        formatDate,
        daysSince,
        statusBadge,
        emptyRow
    };
})();
