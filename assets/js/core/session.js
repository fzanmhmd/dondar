(function () {
    function get() {
        try {
            return JSON.parse(localStorage.getItem('sesi'));
        } catch (error) {
            return null;
        }
    }

    function set(session) {
        localStorage.setItem('sesi', JSON.stringify(session));
    }

    function clear() {
        localStorage.removeItem('sesi');
    }

    function requireRole(role, loginUrl) {
        const session = get();
        if (!session || session.role !== role) {
            window.location.href = loginUrl || '../../index.html';
            return null;
        }
        return session;
    }

    function bindLogout(selector, loginUrl) {
        const button = document.querySelector(selector);
        if (!button) return;
        button.addEventListener('click', () => {
            clear();
            window.location.href = loginUrl || '../../index.html';
        });
    }

    window.DonDarSession = {
        get,
        set,
        clear,
        requireRole,
        bindLogout
    };
})();
