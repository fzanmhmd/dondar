(function () {
    DonDarDB.init();

    const form = document.querySelector('#form-daftar');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            nama: document.querySelector('#nama').value.trim(),
            nohp: document.querySelector('#nohp').value.trim(),
            golongan: document.querySelector('#golongan').value,
            usia: Number(document.querySelector('#usia').value),
            berat: Number(document.querySelector('#berat').value),
            kota: document.querySelector('#kota').value.trim(),
            password: document.querySelector('#password').value.trim(),
            konfirmasi: document.querySelector('#konfirmasi').value.trim()
        };

        if (!data.nama || !data.nohp || !data.kota || !data.password || !data.konfirmasi) {
            DonDarUI.showMessage(form, 'error', 'Semua kolom wajib diisi.');
            return;
        }

        if (data.nohp.length < 10 || !/^[0-9]+$/.test(data.nohp)) {
            DonDarUI.showMessage(form, 'error', 'No. HP harus berupa angka minimal 10 digit.');
            return;
        }

        if (data.usia < 17 || data.berat < 40) {
            DonDarUI.showMessage(form, 'error', 'Usia minimal 17 tahun dan berat minimal 40 kg.');
            return;
        }

        if (data.password.length < 4) {
            DonDarUI.showMessage(form, 'error', 'Password minimal 4 karakter.');
            return;
        }

        if (data.password !== data.konfirmasi) {
            DonDarUI.showMessage(form, 'error', 'Konfirmasi password tidak cocok.');
            return;
        }

        const pendonor = DonDarDB.getPendonor();
        if (pendonor.some((item) => item.nohp === data.nohp)) {
            DonDarUI.showMessage(form, 'error', 'No. HP sudah terdaftar.');
            return;
        }

        pendonor.push({
            nama: data.nama,
            nohp: data.nohp,
            password: data.password,
            golongan: data.golongan,
            usia: data.usia,
            berat: data.berat,
            kota: data.kota,
            terakhirDonor: '',
            status: 'aktif'
        });

        DonDarDB.savePendonor(pendonor);
        DonDarUI.showMessage(form, 'success', 'Pendaftaran berhasil. Silakan login.');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 900);
    });
})();
