(function () {
    DonDarDB.init();

    const step1 = document.querySelector('#step-verifikasi');
    const step2 = document.querySelector('#step-password');
    const formVerify = document.querySelector('#form-verifikasi');
    const formReset = document.querySelector('#form-reset');
    let nomorTerverifikasi = '';

    formVerify.addEventListener('submit', (event) => {
        event.preventDefault();
        const nohp = document.querySelector('#nohp-reset').value.trim();
        const akun = DonDarDB.getPendonor().find((item) => item.nohp === nohp);

        if (!akun) {
            DonDarUI.showMessage(formVerify, 'error', 'No. HP tidak ditemukan.');
            return;
        }

        nomorTerverifikasi = nohp;
        step1.hidden = true;
        step2.hidden = false;
        DonDarUI.showMessage(formReset, 'info', `Akun ditemukan: ${akun.nama}.`);
    });

    formReset.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = document.querySelector('#pw-baru').value.trim();
        const konfirmasi = document.querySelector('#pw-konfirmasi').value.trim();

        if (password.length < 4) {
            DonDarUI.showMessage(formReset, 'error', 'Password minimal 4 karakter.');
            return;
        }

        if (password !== konfirmasi) {
            DonDarUI.showMessage(formReset, 'error', 'Konfirmasi password tidak cocok.');
            return;
        }

        const pendonor = DonDarDB.getPendonor();
        const index = pendonor.findIndex((item) => item.nohp === nomorTerverifikasi);
        if (index === -1) {
            DonDarUI.showMessage(formReset, 'error', 'Data akun tidak ditemukan.');
            return;
        }

        pendonor[index].password = password;
        DonDarDB.savePendonor(pendonor);
        DonDarUI.showMessage(formReset, 'success', 'Password berhasil diperbarui.');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 900);
    });
})();
