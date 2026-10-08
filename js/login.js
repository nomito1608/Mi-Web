/* =========================================================
   Tellcenter - Login (SOLO DEMOSTRATIVO)
   ⚠️ La contraseña está escrita aquí, así que cualquiera puede
   verla con "Ver código fuente". Úsalo solo para la demo;
   en el proyecto real la validación debe hacerse en un servidor.
   ========================================================= */

// Usuario de demostración
const USUARIO_DEMO = {
    correo: 'adriana.tellcenter@tellcenter.com',
    clave: '123'
};

// Página a la que entra después de iniciar sesión
const PAGINA_INICIO = 'portal_empleado.html';

const form = document.getElementById('login-form');
const inputCorreo = document.getElementById('correo');
const inputClave = document.getElementById('password');
const error = document.getElementById('login-error');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const correo = inputCorreo.value.trim().toLowerCase();
    const clave = inputClave.value;

    if (correo === USUARIO_DEMO.correo && clave === USUARIO_DEMO.clave) {
        window.location.href = PAGINA_INICIO;
    } else {
        // Reinicia la animación del mensaje de error
        error.classList.remove('visible');
        void error.offsetWidth;
        error.classList.add('visible');
        inputClave.value = '';
        inputClave.focus();
    }
});

// Oculta el error cuando la persona vuelve a escribir
[inputCorreo, inputClave].forEach(function (input) {
    input.addEventListener('input', function () { error.classList.remove('visible'); });
});
