(function () {
    DonDarDB.init();

    const form = document.querySelector('#form-minta-akses');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nama = document.querySelector('#nama-minta').value.trim();
        const nohp = document.querySelector('#nohp-minta').value.trim();
        const alasan = document.querySelector('#alasan').value.trim();

        if (!nama || !nohp || !alasan) {
            DonDarUI.showMessage(form, 'error', 'Semua kolom wajib diisi.');
            return;
        }

        if (nohp.length < 10 || !/^[0-9]+$/.test(nohp)) {
            DonDarUI.showMessage(form, 'error', 'No. HP harus berupa angka minimal 10 digit.');
            return;
        }

        const permintaan = DonDarDB.getPermintaan();
        permintaan.push({
            id: DonDarDB.createId('AKS'),
            nama,
            nohp,
            alasan,
            waktu: new Date().toLocaleString('id-ID'),
            status: 'menunggu'
        });

        DonDarDB.savePermintaan(permintaan);
        DonDarUI.showMessage(form, 'success', 'Permintaan berhasil dikirim.');
        form.reset();
    });
})();
