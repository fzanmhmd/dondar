(function () {
    DonDarDB.init();

    const session = DonDarSession.requireRole('petugas', '../../index.html');
    if (!session) return;

    DonDarSession.bindLogout('#btn-logout', '../../index.html');
    document.querySelector('#nama-user').textContent = session.nama;

    function renderStats() {
        const pendonor = DonDarDB.getPendonor();
        const stok = DonDarDB.getStok();
        const booking = DonDarDB.getBooking();
        const permintaan = DonDarDB.getPermintaan();

        document.querySelector('#stat-pendonor').textContent = pendonor.length;
        document.querySelector('#stat-stok').textContent = stok.reduce((sum, item) => sum + Number(item.jumlah), 0);
        document.querySelector('#stat-booking').textContent = booking.filter((item) => item.status === 'menunggu').length;
        document.querySelector('#stat-akses').textContent = permintaan.filter((item) => item.status === 'menunggu').length;
    }

    function renderStock() {
        const target = document.querySelector('#tabel-stok tbody');
        target.innerHTML = DonDarDB.getStok().map((item) => {
            const status = item.jumlah < item.minimal ? 'kurang' : 'cukup';
            return `
                <tr>
                    <td><strong>${item.golongan}</strong></td>
                    <td>${item.jumlah} kantong</td>
                    <td>${item.minimal} kantong</td>
                    <td>${DonDarUI.statusBadge(status)}</td>
                    <td>
                        <div class="actions">
                            <button class="icon-btn" type="button" data-action="stock-minus" data-golongan="${item.golongan}">-</button>
                            <button class="icon-btn" type="button" data-action="stock-plus" data-golongan="${item.golongan}">+</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderBookings() {
        const pendonor = DonDarDB.getPendonor();
        const jadwal = DonDarDB.getJadwal();
        const rows = DonDarDB.getBooking();
        const target = document.querySelector('#tabel-booking tbody');

        target.innerHTML = rows.length ? rows.map((item) => {
            const donor = pendonor.find((row) => row.nohp === item.nohp);
            const schedule = jadwal.find((row) => row.id === item.jadwalId);
            const canAction = item.status === 'menunggu';
            return `
                <tr>
                    <td>${donor ? donor.nama : item.nohp}<br><span class="muted">${item.nohp}</span></td>
                    <td>${schedule ? DonDarUI.formatDate(schedule.tanggal) : '-'}<br><span class="muted">${schedule ? schedule.lokasi : '-'}</span></td>
                    <td>${item.catatan || '-'}</td>
                    <td>${DonDarUI.statusBadge(item.status)}</td>
                    <td>
                        <div class="actions">
                            <button class="btn small" type="button" data-action="approve-booking" data-id="${item.id}" ${canAction ? '' : 'disabled'}>Setuju</button>
                            <button class="btn small danger" type="button" data-action="reject-booking" data-id="${item.id}" ${canAction ? '' : 'disabled'}>Tolak</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('') : DonDarUI.emptyRow(5, 'Belum ada booking donor.');
    }

    function renderRequests() {
        const rows = DonDarDB.getPermintaan();
        const target = document.querySelector('#tabel-akses tbody');
        target.innerHTML = rows.length ? rows.map((item) => {
            const canAction = item.status === 'menunggu';
            return `
                <tr>
                    <td>${item.nama}<br><span class="muted">${item.nohp}</span></td>
                    <td>${item.alasan}</td>
                    <td>${item.waktu || '-'}</td>
                    <td>${DonDarUI.statusBadge(item.status)}</td>
                    <td>
                        <div class="actions">
                            <button class="btn small" type="button" data-action="approve-access" data-id="${item.id}" ${canAction ? '' : 'disabled'}>Setuju</button>
                            <button class="btn small danger" type="button" data-action="reject-access" data-id="${item.id}" ${canAction ? '' : 'disabled'}>Tolak</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('') : DonDarUI.emptyRow(5, 'Belum ada permintaan akses.');
    }

    function renderDonors() {
        const rows = DonDarDB.getPendonor();
        const target = document.querySelector('#tabel-pendonor tbody');
        target.innerHTML = rows.length ? rows.map((item) => `
            <tr>
                <td>${item.nama}<br><span class="muted">${item.nohp}</span></td>
                <td>${item.golongan}</td>
                <td>${item.usia} tahun / ${item.berat} kg</td>
                <td>${item.kota}</td>
                <td>${item.terakhirDonor ? DonDarUI.formatDate(item.terakhirDonor) : '-'}</td>
            </tr>
        `).join('') : DonDarUI.emptyRow(5, 'Belum ada pendonor.');
    }

    function renderSchedules() {
        const rows = DonDarDB.getJadwal();
        const target = document.querySelector('#tabel-jadwal tbody');
        target.innerHTML = rows.length ? rows.map((item) => `
            <tr>
                <td>${DonDarUI.formatDate(item.tanggal)}</td>
                <td>${item.lokasi}</td>
                <td>${item.kuota} orang</td>
            </tr>
        `).join('') : DonDarUI.emptyRow(3, 'Belum ada jadwal donor.');
    }

    function refresh() {
        renderStats();
        renderStock();
        renderBookings();
        renderRequests();
        renderDonors();
        renderSchedules();
    }

    document.querySelector('#tabel-stok').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const stok = DonDarDB.getStok();
        const item = stok.find((row) => row.golongan === button.dataset.golongan);
        if (!item) return;

        if (button.dataset.action === 'stock-plus') item.jumlah += 1;
        if (button.dataset.action === 'stock-minus') item.jumlah = Math.max(0, item.jumlah - 1);

        DonDarDB.saveStok(stok);
        refresh();
    });

    document.querySelector('#tabel-booking').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const booking = DonDarDB.getBooking();
        const item = booking.find((row) => row.id === button.dataset.id);
        if (!item) return;

        if (button.dataset.action === 'approve-booking') item.status = 'disetujui';
        if (button.dataset.action === 'reject-booking') item.status = 'ditolak';

        DonDarDB.saveBooking(booking);
        refresh();
    });

    document.querySelector('#tabel-akses').addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const permintaan = DonDarDB.getPermintaan();
        const request = permintaan.find((item) => item.id === button.dataset.id);
        if (!request) return;

        if (button.dataset.action === 'approve-access') {
            request.status = 'disetujui';
            const petugas = DonDarDB.getPetugas();
            const newId = `PTG${String(petugas.length + 1).padStart(3, '0')}`;
            petugas.push({
                id: newId,
                password: '1234',
                nama: request.nama,
                status: 'aktif'
            });
            DonDarDB.savePetugas(petugas);
        }

        if (button.dataset.action === 'reject-access') {
            request.status = 'ditolak';
        }

        DonDarDB.savePermintaan(permintaan);
        refresh();
    });

    document.querySelector('#form-jadwal').addEventListener('submit', (event) => {
        event.preventDefault();

        const tanggal = document.querySelector('#jadwal-tanggal').value;
        const lokasi = document.querySelector('#jadwal-lokasi').value.trim();
        const kuota = Number(document.querySelector('#jadwal-kuota').value);

        if (!tanggal || !lokasi || kuota < 1) {
            DonDarUI.showMessage(event.currentTarget, 'error', 'Tanggal, lokasi, dan kuota wajib diisi.');
            return;
        }

        const jadwal = DonDarDB.getJadwal();
        jadwal.push({
            id: DonDarDB.createId('JDW'),
            tanggal,
            lokasi,
            kuota
        });
        DonDarDB.saveJadwal(jadwal);
        event.currentTarget.reset();
        DonDarUI.showMessage(event.currentTarget, 'success', 'Jadwal donor berhasil ditambahkan.');
        refresh();
    });

    refresh();
})();
