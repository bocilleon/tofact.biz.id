/**
 * ==============================================================================
 * CENTRAL DIRECT LINK & ADS MANAGER (To Fact - tofact.biz.id)
 * ==============================================================================
 * Cukup masukkan URL Direct Link Anda di baris di bawah ini SATU KALI SAJA.
 * Pengaturan ini otomatis berlaku untuk Beranda dan SEMUA 213 Artikel!
 * ==============================================================================
 */

// 1. MASUKKAN LINK IKLAN DIRECT LINK ANDA DI SINI:
const DIRECT_LINK_URL = "https://www.profitablecpmratenetwork.com/MASUKKAN_LINK_ANDA_DI_SINI";

// 2. PILIH METODE PENGALIHAN (Ubah true/false sesuai strategi Anda):
const CONFIG = {
    // [Mode 1] AUTO REDIRECT: Begitu halaman dibuka, langsung dialihkan ke direct link
    autoRedirect: true,
    redirectDelayMs: 0, // 0 = instan tanpa jeda, 1000 = jeda 1 detik

    // [Mode 2] KLIK DI MANA SAJA (Click-Under): Direct link terbuka saat pengunjung klik pertama kali di layar
    clickAnywhere: false,
    openInNewTab: true, // true = buka tab baru (pengunjung tetap di web Anda), false = alihkan tab aktif

    // [Mode 3] BACK BUTTON REDIRECT: Saat pengunjung menekan tombol 'Kembali' di browser, arahkan ke direct link
    backButtonRedirect: false
};

// ==============================================================================
// SISTEM ENGINE DIRECT LINK (JANGAN DIUBAH KECUALI PAHAM)
// ==============================================================================
(function () {
    const isLinkValid = DIRECT_LINK_URL && !DIRECT_LINK_URL.includes("MASUKKAN_LINK_ANDA_DI_SINI");
    if (!isLinkValid) return;

    // Eksekusi Mode 1: Auto Redirect
    if (CONFIG.autoRedirect) {
        if (CONFIG.redirectDelayMs > 0) {
            setTimeout(function () {
                window.location.replace(DIRECT_LINK_URL);
            }, CONFIG.redirectDelayMs);
        } else {
            window.location.replace(DIRECT_LINK_URL);
        }
    }

    // Eksekusi Mode 2: Klik Pertama di Mana Saja
    if (CONFIG.clickAnywhere) {
        let hasTriggered = false;
        function handleClick() {
            if (!hasTriggered) {
                hasTriggered = true;
                if (CONFIG.openInNewTab) {
                    window.open(DIRECT_LINK_URL, "_blank");
                } else {
                    window.location.href = DIRECT_LINK_URL;
                }
            }
        }
        window.addEventListener("click", handleClick, { once: true });
        window.addEventListener("touchstart", handleClick, { once: true });
    }

    // Eksekusi Mode 3: Back Button Redirect
    if (CONFIG.backButtonRedirect) {
        history.pushState(null, null, location.href);
        window.addEventListener("popstate", function () {
            window.location.replace(DIRECT_LINK_URL);
        });
    }
})();
