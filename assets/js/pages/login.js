(function () {
    DonDarDB.init();

    const roleButtons = document.querySelectorAll('[data-role]');
    const formPetugas = document.querySelector('#form-petugas');
    const formPendonor = document.querySelector('#form-pendonor');

    function setRole(role) {
        roleButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.role === role);
        });
        formPetugas.hidden = role !== 'petugas';
        formPendonor.hidden = role !== 'pendonor';
    }

    roleButtons.forEach((button) => {
        button.addEventListener('click', () => setRole(button.dataset.role));
    });

    formPetugas.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.querySelector('#id-petugas').value.trim().toUpperCase();
        const password = document.querySelector('#password-petugas').value.trim();

        if (!id || !password) {
            DonDarUI.showMessage(formPetugas, 'error', 'ID petugas dan password harus diisi.');
            return;
        }

        const petugas = DonDarDB.getPetugas().find((item) => (
            item.id.toUpperCase() === id && item.password === password
        ));

        if (!petugas) {
            DonDarUI.showMessage(formPetugas, 'error', 'ID atau password petugas salah.');
            return;
        }

        if (petugas.status !== 'aktif') {
            DonDarUI.showMessage(formPetugas, 'error', 'Akun petugas belum aktif.');
            return;
        }

        DonDarSession.set({ role: 'petugas', id: petugas.id, nama: petugas.nama });
        window.location.href = 'pages/dashboard/petugas.html';
    });

    formPendonor.addEventListener('submit', (event) => {
        event.preventDefault();
        const nohp = document.querySelector('#nohp-pendonor').value.trim();
        const password = document.querySelector('#password-pendonor').value.trim();

        if (!nohp || !password) {
            DonDarUI.showMessage(formPendonor, 'error', 'No. HP dan password harus diisi.');
            return;
        }

        const pendonor = DonDarDB.getPendonor().find((item) => (
            item.nohp === nohp && item.password === password
        ));

        if (!pendonor) {
            DonDarUI.showMessage(formPendonor, 'error', 'No. HP atau password salah.');
            return;
        }

        DonDarSession.set({ role: 'pendonor', nohp: pendonor.nohp, nama: pendonor.nama });
        window.location.href = 'pages/dashboard/pendonor.html';
    });

    function renderStockSummary() {
        const target = document.querySelector('#login-stock-list');
        const rows = DonDarDB.getStok().slice(0, 4);
        target.innerHTML = rows.map((item) => `
            <div class="summary-item">
                <span>Golongan ${item.golongan}</span>
                <strong>${item.jumlah}</strong>
            </div>
        `).join('');
    }

    renderStockSummary();
})();
