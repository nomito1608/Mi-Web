document.addEventListener('DOMContentLoaded', () => {
    iniciarBannerDinamico();
    configurarEventosGlobales();
    configurarFormularioQuejas();
    iniciarCarouselTrabajo();
    configurarModalCotizar();
    configurarMenuMobile();
});

function iniciarBannerDinamico() {
    const banner = document.getElementById('dynamic-text');
    if (!banner) return;

    const anuncios = [
        "🚀 Nuevo Servicio: Migración de infraestructura a la Nube con 20% de descuento.",
        "💡 Soporte IT 24/7 activo. Tiempos de respuesta menores a 15 minutos.",
        "🎨 Renueva la interfaz de tu E-commerce con nuestro equipo de Diseño Web."
    ];
    let index = 0;

    setInterval(() => {
        index = (index + 1) % anuncios.length;
        banner.innerText = anuncios[index];
    }, 5000);
}

function configurarEventosGlobales() {
    const btnCotizar = document.getElementById('btn-cotizar');
    if (btnCotizar) {
        btnCotizar.addEventListener('click', () => {
            abrirModalCotizar();
        });
    }

    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') loginWorkSession();
        });
    }

    const empPasswordInput = document.getElementById('emp-password');
    if (empPasswordInput) {
        empPasswordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') loginEmpleado();
        });
    }
}

function configurarMenuMobile() {
    const navToggle = document.getElementById('navToggle');
    const publicNav = document.querySelector('.public-nav');
    if (navToggle && publicNav) {
        navToggle.addEventListener('click', () => {
            publicNav.classList.toggle('active');
            navToggle.textContent = publicNav.classList.contains('active') ? 'X' : 'MENU';
        });
    }
}

// Función de autenticación para empleados y Adriana
function loginEmpleado() {
    const user = document.getElementById('emp-usuario').value.trim();
    const pass = document.getElementById('emp-password').value.trim();
    const area = document.getElementById('area').value;

    const credencialesValidas = [
        { usuario: 'Adriana', clave: 'Elpoder16' },
        { usuario: 'Fredy16', clave: 'Elpoder16' },
        { usuario: 'empleado16', clave: 'Elpoder16' }
    ];

    const accesoValido = credencialesValidas.some(c => c.usuario === user && c.clave === pass);

    if (!accesoValido) {
        alert("Credenciales corporativas incorrectas. Intenta de nuevo.");
        return;
    }

    sessionStorage.setItem('tellcenter_user', user);
    sessionStorage.setItem('tellcenter_area', area);

    document.getElementById('login-empleados').style.display = 'none';
    document.getElementById('dashboard-empleado').style.display = 'block';

    const nombresArea = {
        manager: 'Manager - Panel de Control',
        cloud: 'Cloud & Infraestructura',
        soporte: 'Soporte Técnico',
        diseno: 'Diseño & E-commerce',
        consultoria: 'Consultoría & Proyectos'
    };

    const areaTexto = document.getElementById('area-actual');
    if (areaTexto) areaTexto.textContent = `${user} (${nombresArea[area] || area})`;

    document.querySelectorAll('.extra-card').forEach(el => el.style.display = 'none');
    const extra = document.getElementById('extra-' + area);
    if (extra) extra.style.display = 'block';
}

function loginWorkSession() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const credencialesValidas = [
        { usuario: 'Fredy16', clave: 'Elpoder16' },
        { usuario: 'empleado16', clave: 'Elpoder16' }
    ];
    const accesoValido = credencialesValidas.some(c => c.usuario === user && c.clave === pass);

    if (accesoValido) {
        sessionStorage.setItem('tellcenter_manager', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('hub-interno').style.display = 'block';
    } else {
        alert("Credenciales corporativas incorrectas. Intenta de nuevo.");
    }
}

function logoutWorkSession() {
    sessionStorage.removeItem('tellcenter_manager');
    if (document.getElementById('username')) document.getElementById('username').value = '';
    if (document.getElementById('password')) document.getElementById('password').value = '';
    document.getElementById('hub-interno').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

let carouselIndexTrabajo = 0;

function actualizarCarouselTrabajo() {
    const slides = document.querySelectorAll('#carousel-track .carousel-slide');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    if (!slides.length) return;

    slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === carouselIndexTrabajo);
    });
    dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === carouselIndexTrabajo);
    });
}

function cambiarSlideTrabajo(direccion) {
    const slides = document.querySelectorAll('#carousel-track .carousel-slide');
    if (!slides.length) return;
    carouselIndexTrabajo = (carouselIndexTrabajo + direccion + slides.length) % slides.length;
    actualizarCarouselTrabajo();
}

function irASlideTrabajo(index) {
    carouselIndexTrabajo = index;
    actualizarCarouselTrabajo();
}

function iniciarCarouselTrabajo() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    actualizarCarouselTrabajo();
    setInterval(function () {
        cambiarSlideTrabajo(1);
    }, 6000);
}

function abrirModalCotizar() {
    const modal = document.getElementById('modal-cotizar');
    if (!modal) return;
    modal.classList.add('open');
}

function cerrarModalCotizar() {
    const modal = document.getElementById('modal-cotizar');
    if (!modal) return;
    modal.classList.remove('open');
}

function enviarCotizacion() {
    const nombreInput = document.getElementById('cot-nombre');
    const correoInput = document.getElementById('cot-correo');
    const nombre = nombreInput ? nombreInput.value.trim() : '';
    const correo = correoInput ? correoInput.value.trim() : '';

    if (!nombre || !correo) {
        alert('Completa tu nombre y correo antes de enviar.');
        return;
    }

    cerrarModalCotizar();
    document.getElementById('form-cotizar').reset();
    alert('¡Gracias, ' + nombre + '! Recibimos tu solicitud y te contactaremos pronto.');
}

function configurarModalCotizar() {
    const modal = document.getElementById('modal-cotizar');
    if (!modal) return;

    modal.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModalCotizar();
    });
}

function reiniciarServidor(boton) {
    boton.innerText = "Reiniciando...";
    boton.style.backgroundColor = "#ffc107";
    boton.style.color = "#000";
    boton.disabled = true;

    setTimeout(() => {
        boton.innerText = "Instancia Operativa";
        boton.style.backgroundColor = "#28a745";
        boton.style.color = "#fff";
        alert("El servidor se ha reiniciado y sincronizado con la plataforma multinube correctamente.");
    }, 2500);
}

function configurarFormularioQuejas() {
    const form = document.getElementById('form-quejas');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('q-nombre').value.trim() || 'Anónimo';
        const equipo = document.getElementById('q-equipo').value;
        const tipo = document.getElementById('q-tipo').value;
        const mensajeInput = document.getElementById('q-mensaje');
        const mensaje = mensajeInput.value.trim();

        if (!mensaje) {
            alert('Escribe tu comentario antes de enviarlo.');
            return;
        }

        const lista = document.getElementById('buzon-items');
        const item = document.createElement('div');
        item.className = 'buzon-item';

        const meta = document.createElement('div');
        meta.className = 'buzon-meta';

        const tag = document.createElement('span');
        tag.className = 'buzon-tipo';
        tag.textContent = tipo;

        meta.appendChild(tag);
        meta.appendChild(document.createTextNode(equipo + ' · ' + nombre));

        const texto = document.createElement('p');
        texto.style.margin = '0';
        texto.textContent = mensaje;

        item.appendChild(meta);
        item.appendChild(texto);
        lista.prepend(item);

        form.reset();
        alert('¡Gracias! Tu comentario se envió correctamente.');
    });
}