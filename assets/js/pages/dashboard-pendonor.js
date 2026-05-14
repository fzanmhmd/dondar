(function () {
    DonDarDB.init();

    const session = DonDarSession.requireRole('pendonor', '../../index.html');
    if (!session) return;

    DonDarSession.bindLogout('#btn-logout', '../../index.html');

    const donor = DonDarDB.getPendonor().find((item) => item.nohp === session.nohp);
    if (!donor) {
        DonDarSession.clear();
        window.location.href = '../../index.html';
        return;
    }

    document.querySelector('#nama-user').textContent = donor.nama;
    document.querySelector('#profile-name').textContent = donor.nama;
    document.querySelector('#profile-phone').textContent = donor.nohp;
    document.querySelector('#profile-blood').textContent = donor.golongan;
    document.querySelector('#profile-city').textContent = donor.kota;

    function getEligibility() {
        const issues = [];
        if (Number(donor.usia) < 17) issues.push('Usia belum memenuhi syarat minimal.');
        if (Number(donor.berat) < 45) issues.push('Berat badan sebaiknya minimal 45 kg.');

        const days = DonDarUI.daysSince(donor.terakhirDonor);
        if (days !== null && days < 60) {
            issues.push(`Jarak donor terakhir baru ${days} hari.`);
        }

        return issues;
    }

    function renderStats() {
        const riwayat = DonDarDB.getRiwayat().filter((item) => item.nohp === donor.nohp);
        const booking = DonDarDB.getBooking().filter((item) => item.nohp === donor.nohp);
        const stok = DonDarDB.getStok().find((item) => item.golongan === donor.golongan);
        const issues = getEligibility();

        document.querySelector('#stat-riwayat').textContent = riwayat.length;
        document.querySelector('#stat-booking').textContent = booking.length;
        document.querySelector('#stat-stok').textContent = stok ? stok.jumlah : 0;
        document.querySelector('#stat-status').textContent = issues.length ? 'Cek' : 'OK';
    }

    function renderEligibility() {
        const issues = getEligibility();
        const target = document.querySelector('#eligibility-list');

        if (!issues.length) {
            target.innerHTML = '<li><strong>Layak donor.</strong><br><span class="muted">Data dasar kamu memenuhi syarat umum.</span></li>';
            return;
        }

        target.innerHTML = issues.map((issue) => (
            `<li><strong>Perlu perhatian.</strong><br><span class="muted">${issue}</span></li>`
        )).join('');
    }

    function renderScheduleOptions() {
        const select = document.querySelector('#jadwal-booking');
        const jadwal = DonDarDB.getJadwal().sort((a, b) => a.tanggal.localeCompare(b.tanggal));
        select.innerHTML = jadwal.map((item) => (
            `<option value="${item.id}">${DonDarUI.formatDate(item.tanggal)} - ${item.lokasi}</option>`
        )).join('');
    }

    function renderHistory() {
        const rows = DonDarDB.getRiwayat().filter((item) => item.nohp === donor.nohp);
        const target = document.querySelector('#tabel-riwayat tbody');
        target.innerHTML = rows.length ? rows.map((item) => `
            <tr>
                <td>${DonDarUI.formatDate(item.tanggal)}</td>
                <td>${item.lokasi}</td>
                <td>${item.volume} ml</td>
                <td>${item.petugas}</td>
            </tr>
        `).join('') : DonDarUI.emptyRow(4, 'Belum ada riwayat donor.');
    }

    function renderBookings() {
        const jadwal = DonDarDB.getJadwal();
        const rows = DonDarDB.getBooking().filter((item) => item.nohp === donor.nohp);
        const target = document.querySelector('#tabel-booking tbody');
        target.innerHTML = rows.length ? rows.map((item) => {
            const schedule = jadwal.find((row) => row.id === item.jadwalId);
            return `
                <tr>
                    <td>${schedule ? DonDarUI.formatDate(schedule.tanggal) : '-'}</td>
                    <td>${schedule ? schedule.lokasi : '-'}</td>
                    <td>${DonDarUI.statusBadge(item.status)}</td>
                    <td>${item.catatan || '-'}</td>
                </tr>
            `;
        }).join('') : DonDarUI.emptyRow(4, 'Belum ada booking donor.');
    }

    document.querySelector('#form-booking').addEventListener('submit', (event) => {
        event.preventDefault();
        const jadwalId = document.querySelector('#jadwal-booking').value;
        const catatan = document.querySelector('#catatan-booking').value.trim();
        const booking = DonDarDB.getBooking();
        const alreadyBooked = booking.some((item) => (
            item.nohp === donor.nohp && item.jadwalId === jadwalId && item.status !== 'ditolak'
        ));

        if (alreadyBooked) {
            DonDarUI.showMessage(event.currentTarget, 'error', 'Kamu sudah booking jadwal ini.');
            return;
        }

        booking.push({
            id: DonDarDB.createId('BKG'),
            nohp: donor.nohp,
            jadwalId,
            catatan,
            status: 'menunggu',
            dibuat: DonDarDB.todayIso()
        });

        DonDarDB.saveBooking(booking);
        event.currentTarget.reset();
        DonDarUI.showMessage(event.currentTarget, 'success', 'Booking berhasil dibuat.');
        renderStats();
        renderBookings();
    });

    renderStats();
    renderEligibility();
    renderScheduleOptions();
    renderHistory();
    renderBookings();
})();
