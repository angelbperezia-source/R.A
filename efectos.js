(function () {
    var base = '<rect x="18" y="6" width="84" height="198" rx="16" fill="#080a09" stroke="url(#metal)" stroke-width="3"/><rect x="26" y="22" width="68" height="166" rx="7" fill="#030403"/><rect x="48" y="12" width="24" height="4" rx="2" fill="#2a312f"/>';
    var barra = '<rect class="barrido" x="26" y="22" width="68" height="10" fill="#84d5e9"/>';
    var tilde = 'fill="none" stroke="#84d5e9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"';
    var escenas = {
        rota: ['Celular con la pantalla rota que se repara', base +
            '<g class="g-rota" fill="none" stroke="#f1f4f2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M70 22L62 60 74 82 58 120 66 150 60 188"/><path d="M62 60L40 74 30 96M74 82L92 94M58 120L38 132M66 150L88 160"/><path d="M70 22L62 60 74 82" stroke="#4522b8"/></g>' + barra +
            '<g class="ok"><circle cx="60" cy="105" r="22" fill="none" stroke="#84d5e9" stroke-width="3"/><path d="M49 106l8 8 15-18" ' + tilde + '/></g>'],
        virus: ['Celular bloqueado por un virus que se limpia', base +
            '<g class="infectado"><rect class="tinte" x="26" y="22" width="68" height="166" rx="7" fill="#4522b8"/><g stroke="#4522b8" stroke-width="3" stroke-linecap="round" fill="none"><rect x="46" y="44" width="28" height="22" rx="4" fill="#4522b8" fill-opacity=".25"/><path d="M51 44v-7a9 9 0 0 1 18 0v7"/></g><g class="virus" stroke="#4522b8" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="122" r="15" fill="#4522b8" fill-opacity=".3"/><path d="M75 122h8M70.6 132.6l5.7 5.7M60 137v8M49.4 132.6l-5.7 5.7M45 122h-8M49.4 111.4l-5.7-5.7M60 107v-8M70.6 111.4l5.7-5.7"/><circle cx="55" cy="120" r="2" fill="#050605" stroke="none"/><circle cx="65" cy="120" r="2" fill="#050605" stroke="none"/></g></g>' + barra +
            '<g class="limpio"><path d="M60 78l26 10v24c0 20-12 32-26 38-14-6-26-18-26-38V88z" fill="none" stroke="#84d5e9" stroke-width="3.5" stroke-linejoin="round"/><path d="M49 112l8 8 15-18" ' + tilde + '/></g>'],
        reparando: ['Celular en reparación con engranaje y barra de progreso', base +
            '<g class="engranaje"><circle cx="60" cy="100" r="26" fill="none" stroke="#84d5e9" stroke-width="10" stroke-dasharray="6 6.5"/><circle cx="60" cy="100" r="17" fill="none" stroke="url(#metal)" stroke-width="3"/><circle cx="60" cy="100" r="5" fill="#4522b8"/></g><rect x="36" y="150" width="48" height="6" rx="3" fill="#1c2321"/><rect class="progreso" x="36" y="150" width="48" height="6" rx="3" fill="#4522b8"/>']
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

/* ---------- Fondo de panal interactivo (reacciona al mouse) ---------- */
(function () {
    var R = 30;                              // radio de cada hexágono
    var W = Math.sqrt(3) * R, H = 1.5 * R;   // separación horizontal / vertical
    var reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var oscuro = matchMedia("(prefers-color-scheme: dark)");
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.className = "panal-fondo";
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    document.documentElement.classList.add("panal-activo");
    document.body.insertBefore(cv, document.body.firstChild);

    var base = document.createElement("canvas"), bctx = base.getContext("2d");
    var vw = 0, vh = 0, dpr = 1, centros = [];
    var px = -9999, py = -9999, sx = -9999, sy = -9999, poder = 0, objetivo = 0;
    var ondas = [], corriendo = false;

    function trazo(c, x, y, r) {
        for (var i = 0; i < 6; i++) {
            var a = Math.PI / 180 * (60 * i - 90);
            var X = x + r * Math.cos(a), Y = y + r * Math.sin(a);
            i ? c.lineTo(X, Y) : c.moveTo(X, Y);
        }
        c.closePath();
    }

    function colores() {
        return oscuro.matches
            ? { linea: "132,213,233", brillo: "69,34,184", base: "rgba(150,160,156,0.20)" }
            : { linea: "69,34,184", brillo: "132,213,233", base: "rgba(119,119,119,0.24)" };
    }

    function medir() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        vw = innerWidth; vh = innerHeight;
        cv.width = base.width = Math.round(vw * dpr);
        cv.height = base.height = Math.round(vh * dpr);
        cv.style.width = vw + "px"; cv.style.height = vh + "px";
        centros = [];
        for (var fila = -1, y = -R; y < vh + 2 * R; fila++, y += H) {
            var desf = (fila & 1) ? W / 2 : 0;
            for (var x = -W + desf; x < vw + W; x += W) centros.push(x, y);
        }
        pintarBase();
        dibujar(performance.now());
    }

    function pintarBase() {
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bctx.clearRect(0, 0, vw, vh);
        bctx.strokeStyle = colores().base;
        bctx.lineWidth = 1;
        bctx.beginPath();
        for (var i = 0; i < centros.length; i += 2) trazo(bctx, centros[i], centros[i + 1], R);
        bctx.stroke();
    }

    function dibujar(t) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(base, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (reducido) return false;

        var c = colores(), seg = t / 1000, RADIO = 210;
        var activo = poder > 0.01 || ondas.length > 0;
        if (!activo) return false;

        for (var k = ondas.length - 1; k >= 0; k--) {
            if (seg - ondas[k].t0 > 1.4) ondas.splice(k, 1);
        }

        for (var i = 0; i < centros.length; i += 2) {
            var cx = centros[i], cy = centros[i + 1];
            var dx = cx - sx, dy = cy - sy, d = Math.sqrt(dx * dx + dy * dy);
            var f = 0;
            if (d < RADIO) { f = 1 - d / RADIO; f = f * f * (3 - 2 * f) * poder; }
            var onda = 0;
            for (var j = 0; j < ondas.length; j++) {
                var o = ondas[j], edad = seg - o.t0;
                var ox = cx - o.x, oy = cy - o.y;
                var dd = Math.sqrt(ox * ox + oy * oy), anillo = edad * 420;
                var q = (dd - anillo) / 46;
                onda = Math.max(onda, Math.exp(-q * q) * (1 - edad / 1.4));
            }
            var g = Math.max(f, onda);
            if (g < 0.02) continue;

            // los hexágonos se apartan del cursor y ondulan
            var empuje = f * 9 + onda * 5, norm = d || 1;
            var ex = cx + (dx / norm) * empuje + Math.sin(seg * 2.4 + cx * 0.04) * 2.2 * g;
            var ey = cy + (dy / norm) * empuje + Math.cos(seg * 2.1 + cy * 0.04) * 2.2 * g;
            var r = R * (0.9 + 0.14 * g);

            ctx.beginPath(); trazo(ctx, ex, ey, r);
            ctx.fillStyle = "rgba(" + c.linea + "," + (0.07 * g).toFixed(3) + ")";
            ctx.fill();
            ctx.lineWidth = 3.2 * g + 1;
            ctx.strokeStyle = "rgba(" + c.brillo + "," + (0.16 * g).toFixed(3) + ")";
            ctx.stroke();
            ctx.lineWidth = 0.9 + 1.2 * g;
            ctx.strokeStyle = "rgba(" + c.linea + "," + Math.min(0.9, 0.25 + 0.7 * g).toFixed(3) + ")";
            ctx.stroke();
        }
        return true;
    }

    function ciclo(t) {
        sx += (px - sx) * 0.16; sy += (py - sy) * 0.16;
        poder += (objetivo - poder) * 0.08;
        var sigue = dibujar(t);
        if (sigue) requestAnimationFrame(ciclo); else corriendo = false;
    }

    function despertar() {
        if (reducido || corriendo) return;
        corriendo = true;
        requestAnimationFrame(ciclo);
    }

    addEventListener("pointermove", function (e) {
        if (sx < -5000) { sx = e.clientX; sy = e.clientY; }
        px = e.clientX; py = e.clientY; objetivo = 1; despertar();
    }, { passive: true });
    addEventListener("pointerdown", function (e) {
        px = e.clientX; py = e.clientY;
        if (sx < -5000) { sx = px; sy = py; }
        ondas.push({ x: e.clientX, y: e.clientY, t0: performance.now() / 1000 });
        objetivo = 1; despertar();
    }, { passive: true });
    document.addEventListener("pointerleave", function () { objetivo = 0; despertar(); });
    document.documentElement.addEventListener("mouseleave", function () { objetivo = 0; despertar(); });
    addEventListener("pointerup", function (e) { if (e.pointerType === "touch") { objetivo = 0; despertar(); } }, { passive: true });
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(medir, 120); });
    if (oscuro.addEventListener) oscuro.addEventListener("change", function () { pintarBase(); despertar(); dibujar(performance.now()); });

    medir();
})();
