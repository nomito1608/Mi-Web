/* =========================================================
   Tellcenter - Control Horario (boceto)
   Simula el reloj de la jornada y de las pausas.
   No guarda nada: al recargar la página vuelve a empezar.
   ========================================================= */

// Estados posibles. "trabajo: true" = ese tiempo cuenta como jornada trabajada.
const ESTADOS = {
    trabajando: { texto: 'Trabajando',  nombre: 'Trabajo',  icono: '▶',  color: 'on',    ev: 'ev-work',  trabajo: true },
    pausa:      { texto: 'En pausa',    nombre: 'Pausa',    icono: '⏸',  color: 'pause', ev: 'ev-pause', trabajo: false },
    break:      { texto: 'En break',    nombre: 'Break',    icono: '☕', color: 'pause', ev: 'ev-pause', trabajo: false },
    almuerzo:   { texto: 'Almorzando',  nombre: 'Almuerzo', icono: '🍽️', color: 'pause', ev: 'ev-pause', trabajo: false },
    reunion:    { texto: 'En reunión',  nombre: 'Reunión',  icono: '👥', color: 'call',  ev: 'ev-call',  trabajo: true },
    personal:   { texto: 'Personal',    nombre: 'Personal', icono: '🚶', color: 'pause', ev: 'ev-pause', trabajo: false }
};

// Datos de la jornada actual
let estado = 'idle';        // idle | trabajando | pausa | break | almuerzo | reunion | personal
let inicioJornada = null;   // Hora de entrada
let inicioEstado = null;    // Cuándo empezó el estado actual
let trabajadoMs = 0;        // Tiempo trabajado de estados ya terminados

// Elementos de la página
const elEstado = document.getElementById('ch-state');
const elEstadoTxt = document.getElementById('ch-state-text');
const elTiempo = document.getElementById('ch-time');
const elInfo = document.getElementById('ch-info');
const elPlayLabel = document.getElementById('ch-play-label');
const elFichajes = document.getElementById('ch-fichajes');
const botones = document.querySelectorAll('.ch-btn');

/* ---------- Utilidades de formato ---------- */
function reloj(ms) {
    const s = Math.floor(ms / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const seg = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${seg}`;
}
function duracion(ms) {
    const min = Math.floor(ms / 60000);
    if (min < 1) return `${Math.floor(ms / 1000)} s`;
    if (min < 60) return `${min} min`;
    return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
}
function hora(fecha) {
    // Formato 08:05 AM
    let h = fecha.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')} ${ampm}`;
}

/* ---------- Cálculos ---------- */
function msEnEstado() {
    return inicioEstado ? Date.now() - inicioEstado : 0;
}
function msTrabajados() {
    const actual = ESTADOS[estado] && ESTADOS[estado].trabajo ? msEnEstado() : 0;
    return trabajadoMs + actual;
}

/* ---------- Historial ---------- */
function agregarFichaje(icono, claseColor, titulo, detalle) {
    const ev = document.createElement('div');
    ev.className = 'ch-ev';
    ev.innerHTML = `
        <span class="ch-ev-ico ${claseColor}">${icono}</span>
        <div><b>${titulo}</b><small>${detalle}</small></div>
        <span class="ch-ev-time">Hoy ${hora(new Date())}</span>`;
    elFichajes.prepend(ev);
}

/* ---------- Cambiar de estado ---------- */
function cambiarEstado(nuevo) {
    if (nuevo === estado) return;
    const ahora = Date.now();
    const anterior = estado;
    const tiempoAnterior = msEnEstado();

    // Cerrar el estado anterior
    if (ESTADOS[anterior] && ESTADOS[anterior].trabajo) trabajadoMs += tiempoAnterior;

    // Finalizar jornada
    if (nuevo === 'finalizar') {
        agregarFichaje('⏹', 'ev-stop', 'Finaliza jornada', `${duracion(trabajadoMs)} trabajadas`);
        estado = 'idle';
        inicioEstado = null;
        render();
        elEstado.dataset.color = 'stop';
        elEstadoTxt.textContent = 'Jornada finalizada';
        elTiempo.textContent = reloj(trabajadoMs);
        elInfo.textContent = `Entrada ${hora(new Date(inicioJornada))} · Salida ${hora(new Date(ahora))}`;
        elPlayLabel.textContent = 'Iniciar nueva jornada';
        inicioJornada = null;
        trabajadoMs = 0;
        return;
    }

    // Iniciar jornada
    if (anterior === 'idle') {
        inicioJornada = ahora;
        agregarFichaje('▶', 'ev-work', 'Inicia jornada', 'Desde el portal');
    } else if (nuevo === 'trabajando') {
        agregarFichaje('▶', 'ev-work', 'Vuelve a trabajar', `Después de ${ESTADOS[anterior].nombre} · ${duracion(tiempoAnterior)}`);
    } else {
        const e = ESTADOS[nuevo];
        const detalle = anterior === 'trabajando' ? (e.trabajo ? 'Cuenta como jornada' : 'Pausa') : `Después de ${ESTADOS[anterior].nombre} · ${duracion(tiempoAnterior)}`;
        agregarFichaje(e.icono, e.ev, `Inicia ${e.nombre}`, detalle);
    }

    estado = nuevo;
    inicioEstado = ahora;
    render();
}

/* ---------- Mostrar en pantalla ---------- */
function render() {
    // Botones visibles según el estado
    botones.forEach(function (b) {
        const e = b.dataset.estado;
        b.classList.toggle('activo', e === estado);
        if (estado === 'idle') b.hidden = e !== 'trabajando';
        else if (estado === 'trabajando') b.hidden = e === 'trabajando';
        else b.hidden = false;
    });
    if (estado !== 'idle') elPlayLabel.textContent = 'Volver a trabajar';
    actualizarReloj();
}

function actualizarReloj() {
    if (estado === 'idle') return;
    const e = ESTADOS[estado];
    elEstado.dataset.color = e.color;
    elEstadoTxt.textContent = e.texto;

    if (estado === 'trabajando') {
        // Reloj grande = jornada trabajada
        elTiempo.textContent = reloj(msTrabajados());
        elInfo.textContent = `Entrada a las ${hora(new Date(inicioJornada))}`;
    } else {
        // Reloj grande = tiempo en esta pausa / reunión
        elTiempo.textContent = reloj(msEnEstado());
        elInfo.textContent = `Jornada trabajada: ${reloj(msTrabajados())} · Entrada ${hora(new Date(inicioJornada))}`;
    }
}

/* ---------- Eventos ---------- */
botones.forEach(function (b) {
    b.addEventListener('click', function () { cambiarEstado(b.dataset.estado); });
});
setInterval(actualizarReloj, 1000);
