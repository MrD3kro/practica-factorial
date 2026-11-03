// Interfaz para la función factorial() definida en app.js.
// Este archivo solo agrega la validación y los eventos del formulario.

const MIN = 0;
const MAX = 170;

const formulario = document.querySelector("#factorial-form");
const inputNumero = document.querySelector("#numero");
const mensaje = document.querySelector("#mensaje");
const botonCalcular = document.querySelector("#calcular");
const cajaResultado = document.querySelector("#resultado");
const etiquetaResultado = document.querySelector("#resultado-etiqueta");
const valorResultado = document.querySelector("#resultado-valor");
const valorCientifico = document.querySelector("#resultado-cientifico");

function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("is-error", esError);
    inputNumero.classList.toggle("is-invalid", esError);
}

function ocultarResultado() {
    cajaResultado.hidden = true;
    etiquetaResultado.textContent = "";
    valorResultado.textContent = "";
    valorCientifico.textContent = "";
}

function limpiarEntrada(valor) {
    // Solo dígitos y como máximo 3 caracteres (el mayor valor posible es 170).
    return valor.replace(/\D/g, "").slice(0, 3);
}

/**
 * Devuelve el número en notación científica (ej: 120 -> "1.2e+2").
 * Para resultados exactos se usan todos los dígitos enteros, sin redondear.
 */
function aNotacionCientifica(valor, esExacto) {
    if (!Number.isFinite(valor)) return String(valor);

    if (esExacto) {
        const digitos = BigInt(valor).toString().replace(/0+$/, "");
        const exponente = BigInt(valor).toString().length - 1;
        const mantisa = digitos.length > 1
            ? `${digitos[0]}.${digitos.slice(1)}`
            : digitos;
        return `${mantisa}e+${exponente}`;
    }

    // Number.toExponential() sin argumentos usa la representación más corta.
    return valor.toExponential();
}

/**
 * Valida el contenido actual del input y actualiza el estado de la UI.
 * @returns {number|null} el número si es válido, o null si no lo es.
 */
function validarEntrada() {
    const texto = inputNumero.value;

    if (texto === "") {
        mostrarMensaje(`Escribe un número entre ${MIN} y ${MAX}.`);
        botonCalcular.disabled = true;
        return null;
    }

    const numero = Number(texto);

    if (!Number.isInteger(numero) || numero < MIN) {
        mostrarMensaje(`El número debe ser un entero mayor o igual a ${MIN}.`, true);
        botonCalcular.disabled = true;
        return null;
    }

    if (numero > MAX) {
        mostrarMensaje(`El número no puede ser mayor a ${MAX}.`, true);
        botonCalcular.disabled = true;
        return null;
    }

    mostrarMensaje(`Número válido: ${numero}.`);
    botonCalcular.disabled = false;
    return numero;
}

// Al escribir: elimina letras, signos y espacios.
inputNumero.addEventListener("input", () => {
    const limpio = limpiarEntrada(inputNumero.value);
    if (inputNumero.value !== limpio) {
        inputNumero.value = limpio;
    }
    ocultarResultado();
    validarEntrada();
});

// Bloquea las teclas que no sean dígitos (permite atajos como Ctrl+C/V/A).
inputNumero.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

    const teclasPermitidas = [
        "Backspace", "Delete", "Tab", "Enter", "Escape",
        "ArrowLeft", "ArrowRight", "Home", "End",
    ];

    if (teclasPermitidas.includes(evento.key)) return;

    if (evento.key.length === 1 && !/^\d$/.test(evento.key)) {
        evento.preventDefault();
    }
});

// Vuelve a validar al pegar, arrastrar o autocompletar.
inputNumero.addEventListener("paste", () => {
    setTimeout(() => {
        inputNumero.value = limpiarEntrada(inputNumero.value);
        ocultarResultado();
        validarEntrada();
    }, 0);
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const numero = validarEntrada();
    if (numero === null) {
        inputNumero.focus();
        return;
    }

    const resultado = factorial(numero);

    // Hasta 22! el resultado es exacto; de ahí en adelante Number pierde precisión.
    const esExacto = numero <= 22;

    etiquetaResultado.textContent = esExacto
        ? `${numero}! =`
        : `${numero}! ≈ (aproximado, límite de precisión de Number)`;

    valorResultado.textContent = esExacto
        ? BigInt(resultado).toLocaleString("es-CO")
        : resultado.toExponential(10);

    valorCientifico.textContent = aNotacionCientifica(resultado, esExacto);

    cajaResultado.hidden = false;
});
