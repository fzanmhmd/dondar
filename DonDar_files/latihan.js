// =====================
// DATABASE SIMULASI
// =====================
function initDatabase() {
    // Cek apakah data petugas sudah ada, kalau belum buat default
    if (!localStorage.getItem('petugas')) {
        const defaultPetugas = [
            { id: 'OJAN', password: '1234', nama: 'Muhammad Fauzan', status: 'aktif' },
            { id: 'PTG002', password: 'abcd', nama: 'Siti Rahayu', status: 'aktif' }
        ];
        localStorage.setItem('petugas', JSON.stringify(defaultPetugas));
    }

    // Cek apakah data pendonor sudah ada
    if (!localStorage.getItem('pendonor')) {
        const defaultPendonor = [];
        localStorage.setItem('pendonor', JSON.stringify(defaultPendonor));
    }

    // Cek apakah permintaan akses petugas sudah ada
    if (!localStorage.getItem('permintaan_akses')) {
        localStorage.setItem('permintaan_akses', JSON.stringify([]));
    }
}

// Jalankan saat halaman load
initDatabase();


// =====================
// TOGGLE ROLE
// =====================
function setRole(role) {
    const slider = document.querySelector('.slider');
    const formPetugas = document.getElementById('form-petugas');
    const formPendonor = document.getElementById('form-pendonor');

    if (role === 'petugas') {
        slider.style.left = '0%';
        formPendonor.classList.add('hidden');
        formPendonor.classList.remove('slide-in');
        formPetugas.classList.remove('hidden');
        setTimeout(() => formPetugas.classList.add('slide-in'), 10);

    } else if (role === 'pendonor') {
        slider.style.left = '50%';
        formPetugas.classList.add('hidden');
        formPetugas.classList.remove('slide-in');
        formPendonor.classList.remove('hidden');
        setTimeout(() => formPendonor.classList.add('slide-in'), 10);
    }
}


// =====================
// LOGIN PETUGAS
// =====================
document.getElementById('ginpetugas').addEventListener('click', function () {
    // Ambil nilai input dari form petugas
    const inputs = document.querySelectorAll('#form-petugas input');
    const idPetugas = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    // Validasi tidak boleh kosong
    if (idPetugas === '' || password === '') {
        tampilkanError('form-petugas', 'ID Petugas dan Password harus diisi!');
        return;
    }

    // Ambil data petugas dari localStorage
    const dataPetugas = JSON.parse(localStorage.getItem('petugas'));

    // Cari petugas yang cocok
    const petugas = dataPetugas.find(p => p.id === idPetugas && p.password === password);

    if (petugas) {
        if (petugas.status !== 'aktif') {
            tampilkanError('form-petugas', 'Akun kamu belum diaktifkan!');
            return;
        }
        // Simpan sesi login
        localStorage.setItem('sesi', JSON.stringify({
            role: 'petugas',
            nama: petugas.nama,
            id: petugas.id
        }));
        window.location.href = 'dashboard-petugas.html';
    } else {
        tampilkanError('form-petugas', 'ID atau Password salah!');
    }
});


// =====================
// LOGIN PENDONOR
// =====================
document.getElementById('ginpendonor').addEventListener('click', function () {
    const inputs = document.querySelectorAll('#form-pendonor input');
    const nohp = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (nohp === '' || password === '') {
        tampilkanError('form-pendonor', 'No. HP dan Password harus diisi!');
        return;
    }

    const dataPendonor = JSON.parse(localStorage.getItem('pendonor'));
    const pendonor = dataPendonor.find(p => p.nohp === nohp && p.password === password);

    if (pendonor) {
        localStorage.setItem('sesi', JSON.stringify({
            role: 'pendonor',
            nama: pendonor.nama,
            nohp: pendonor.nohp
        }));
        window.location.href = 'dashboard-pendonor.html';
    } else {
        tampilkanError('form-pendonor', 'No. HP atau Password salah!');
    }
});


// =====================
// FUNGSI TAMPILKAN ERROR
// =====================
// Fungsi ini menampilkan pesan error di dalam form
function tampilkanError(formId, pesan) {
    // Hapus error lama kalau ada
    const errorLama = document.querySelector(`#${formId} .error-msg`);
    if (errorLama) errorLama.remove();

    // Buat elemen error baru
    const error = document.createElement('p');
    error.className = 'error-msg';
    error.textContent = pesan;
    error.style.cssText = 'color:white; background:rgba(255,0,0,0.4); padding:6px 14px; border-radius:20px; font-size:12px; margin:0;';

    document.getElementById(formId).appendChild(error);

    // Hilang otomatis setelah 3 detik
    setTimeout(() => error.remove(), 3000);
}
