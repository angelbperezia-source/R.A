(function () {
    var base = '<rect x="18" y="6" width="84" height="198" rx="16" fill="#080a09" stroke="url(#metal)" stroke-width="3"/><rect x="26" y="22" width="68" height="166" rx="7" fill="#030403"/><rect x="48" y="12" width="24" height="4" rx="2" fill="#2a312f"/>';
    var barra = '<rect class="barrido" x="26" y="22" width="68" height="10" fill="#a8e6c3"/>';
    var tilde = 'fill="none" stroke="#a8e6c3" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"';
    var escenas = {
        rota: ['Celular con la pantalla rota que se repara', base +
            '<g class="g-rota" fill="none" stroke="#f1f4f2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M70 22L62 60 74 82 58 120 66 150 60 188"/><path d="M62 60L40 74 30 96M74 82L92 94M58 120L38 132M66 150L88 160"/><path d="M70 22L62 60 74 82" stroke="#e5484d"/></g>' + barra +
            '<g class="ok"><circle cx="60" cy="105" r="22" fill="none" stroke="#a8e6c3" stroke-width="3"/><path d="M49 106l8 8 15-18" ' + tilde + '/></g>'],
        virus: ['Celular bloqueado por un virus que se limpia', base +
            '<g class="infectado"><rect class="tinte" x="26" y="22" width="68" height="166" rx="7" fill="#e5484d"/><g stroke="#e5484d" stroke-width="3" stroke-linecap="round" fill="none"><rect x="46" y="44" width="28" height="22" rx="4" fill="#e5484d" fill-opacity=".25"/><path d="M51 44v-7a9 9 0 0 1 18 0v7"/></g><g class="virus" stroke="#e5484d" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="122" r="15" fill="#e5484d" fill-opacity=".3"/><path d="M75 122h8M70.6 132.6l5.7 5.7M60 137v8M49.4 132.6l-5.7 5.7M45 122h-8M49.4 111.4l-5.7-5.7M60 107v-8M70.6 111.4l5.7-5.7"/><circle cx="55" cy="120" r="2" fill="#050605" stroke="none"/><circle cx="65" cy="120" r="2" fill="#050605" stroke="none"/></g></g>' + barra +
            '<g class="limpio"><path d="M60 78l26 10v24c0 20-12 32-26 38-14-6-26-18-26-38V88z" fill="none" stroke="#a8e6c3" stroke-width="3.5" stroke-linejoin="round"/><path d="M49 112l8 8 15-18" ' + tilde + '/></g>'],
        reparando: ['Celular en reparación con engranaje y barra de progreso', base +
            '<g class="engranaje"><circle cx="60" cy="100" r="26" fill="none" stroke="#a8e6c3" stroke-width="10" stroke-dasharray="6 6.5"/><circle cx="60" cy="100" r="17" fill="none" stroke="url(#metal)" stroke-width="3"/><circle cx="60" cy="100" r="5" fill="#e5484d"/></g><rect x="36" y="150" width="48" height="6" rx="3" fill="#1c2321"/><rect class="progreso" x="36" y="150" width="48" height="6" rx="3" fill="#e5484d"/>']
    };
    document.querySelectorAll("[data-celu]").forEach(function (el) {
        var e = escenas[el.getAttribute("data-celu")];
        if (e) el.innerHTML = '<svg class="celu" viewBox="0 0 120 210" role="img" aria-label="' + e[0] + '">' + e[1] + '</svg>';
    });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    addEventListener("pointermove", function (e) {
        document.body.style.setProperty("--mx", e.clientX + "px");
        document.body.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
})();
