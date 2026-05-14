(function () {
    const keys = {
        petugas: 'petugas',
        pendonor: 'pendonor',
        permintaan: 'permintaan_akses',
        stok: 'stok_darah',
        jadwal: 'jadwal_donor',
        riwayat: 'riwayat_donor',
        booking: 'booking_donor'
    };

    const seed = {
        petugas: [
            { id: 'OJAN', password: '1234', nama: 'Muhammad Fauzan', status: 'aktif' },
            { id: 'PTG002', password: 'abcd', nama: 'Siti Rahayu', status: 'aktif' }
        ],
        pendonor: [
            {
                nama: 'Ayu Lestari',
                nohp: '081234567890',
                password: '1234',
                golongan: 'A+',
                usia: 23,
                berat: 54,
                kota: 'Bandung',
                terakhirDonor: '2026-03-12',
                status: 'aktif'
            }
        ],
        permintaan: [
            {
                id: 'AKS-1001',
                nama: 'Budi Santoso',
                nohp: '082233445566',
                alasan: 'Relawan PMI kecamatan',
                waktu: '14/05/2026, 09.30.00',
                status: 'menunggu'
            }
        ],
        stok: [
            { golongan: 'A+', jumlah: 14, minimal: 8 },
            { golongan: 'A-', jumlah: 5, minimal: 4 },
            { golongan: 'B+', jumlah: 9, minimal: 8 },
            { golongan: 'B-', jumlah: 3, minimal: 4 },
            { golongan: 'AB+', jumlah: 7, minimal: 5 },
            { golongan: 'AB-', jumlah: 2, minimal: 3 },
            { golongan: 'O+', jumlah: 16, minimal: 10 },
            { golongan: 'O-', jumlah: 4, minimal: 5 }
        ],
        jadwal: [
            { id: 'JDW-1001', tanggal: '2026-05-18', lokasi: 'PMI Kota Bandung', kuota: 35 },
            { id: 'JDW-1002', tanggal: '2026-05-22', lokasi: 'Kampus Merdeka Hall', kuota: 45 },
            { id: 'JDW-1003', tanggal: '2026-05-29', lokasi: 'Puskesmas Sukajadi', kuota: 25 }
        ],
        riwayat: [
            {
                id: 'RWY-1001',
                nohp: '081234567890',
                tanggal: '2026-03-12',
                lokasi: 'PMI Kota Bandung',
                volume: 350,
                petugas: 'OJAN'
            }
        ],
        booking: [
            {
                id: 'BKG-1001',
                nohp: '081234567890',
                jadwalId: 'JDW-1001',
                catatan: 'Datang pagi',
                status: 'menunggu',
                dibuat: '2026-05-14'
            }
        ]
    };

    function read(key, fallback) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return data ?? fallback;
        } catch (error) {
            return fallback;
        }
    }

    function save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function ensure(key, value) {
        if (!localStorage.getItem(key)) {
            save(key, value);
        }
    }

    function createId(prefix) {
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${Date.now().toString().slice(-5)}${random}`;
    }

    function migratePendonor() {
        const pendonor = read(keys.pendonor, []);
        const next = pendonor.map((item) => ({
            golongan: item.golongan || 'O+',
            usia: Number(item.usia || 18),
            berat: Number(item.berat || 50),
            kota: item.kota || 'Belum diisi',
            terakhirDonor: item.terakhirDonor || '',
            status: item.status || 'aktif',
            ...item
        }));
        save(keys.pendonor, next);
    }

    function migratePermintaan() {
        const permintaan = read(keys.permintaan, []);
        const next = permintaan.map((item) => ({
            id: item.id || createId('AKS'),
            status: item.status || 'menunggu',
            ...item
        }));
        save(keys.permintaan, next);
    }

    function addMissingSeedRows() {
        const petugas = read(keys.petugas, []);
        if (!petugas.some((item) => item.id === 'OJAN')) {
            petugas.unshift(seed.petugas[0]);
            save(keys.petugas, petugas);
        }

        const pendonor = read(keys.pendonor, []);
        if (!pendonor.some((item) => item.nohp === '081234567890')) {
            pendonor.unshift(seed.pendonor[0]);
            save(keys.pendonor, pendonor);
        }

        if (read(keys.stok, []).length === 0) save(keys.stok, seed.stok);
        if (read(keys.jadwal, []).length === 0) save(keys.jadwal, seed.jadwal);
        if (read(keys.riwayat, []).length === 0) save(keys.riwayat, seed.riwayat);
    }

    function init() {
        ensure(keys.petugas, seed.petugas);
        ensure(keys.pendonor, seed.pendonor);
        ensure(keys.permintaan, seed.permintaan);
        ensure(keys.stok, seed.stok);
        ensure(keys.jadwal, seed.jadwal);
        ensure(keys.riwayat, seed.riwayat);
        ensure(keys.booking, seed.booking);
        migratePendonor();
        migratePermintaan();
        addMissingSeedRows();
    }

    function todayIso() {
        return new Date().toISOString().slice(0, 10);
    }

    window.DonDarDB = {
        keys,
        init,
        read,
        save,
        createId,
        todayIso,
        getPetugas: () => read(keys.petugas, []),
        savePetugas: (value) => save(keys.petugas, value),
        getPendonor: () => read(keys.pendonor, []),
        savePendonor: (value) => save(keys.pendonor, value),
        getPermintaan: () => read(keys.permintaan, []),
        savePermintaan: (value) => save(keys.permintaan, value),
        getStok: () => read(keys.stok, []),
        saveStok: (value) => save(keys.stok, value),
        getJadwal: () => read(keys.jadwal, []),
        saveJadwal: (value) => save(keys.jadwal, value),
        getRiwayat: () => read(keys.riwayat, []),
        saveRiwayat: (value) => save(keys.riwayat, value),
        getBooking: () => read(keys.booking, []),
        saveBooking: (value) => save(keys.booking, value)
    };
})();
