document.addEventListener("DOMContentLoaded", () => {
    
    // --- LÓGICA 1: EFICIENCIA DEL NAVBAR AL HACER SCROLL ---
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("bg-white/95", "shadow-md", "h-16");
            header.classList.remove("h-20");
        } else {
            header.classList.remove("bg-white/95", "shadow-md", "h-16");
            header.classList.add("h-20");
        }
    });

    // --- LÓGICA 2: VALIDACIÓN SEGURA DEL FORMULARIO DE COTIZACIÓN (IL2) ---
    const form = document.getElementById("form-cotizacion");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Detener envío por defecto para controlarlo por código (IL1)
        let isValid = true;

        // Limpiar estados de error previos
        form.querySelectorAll("input, select").forEach(input => {
            input.classList.remove("invalid");
            const errorSpan = input.parentElement.querySelector(".error-msg");
            if (errorSpan) errorSpan.classList.add("hidden");
        });

        // Validar Campos Obligatorios y Sanear Entrada Básica
        const nombre = document.getElementById("nombre");
        const email = document.getElementById("email");
        const telefono = document.getElementById("telefono");
        const tipoProyecto = document.getElementById("tipo_proyecto");
        const privacidad = document.getElementById("privacidad");

        if (!nombre.value.trim()) {
            showError(nombre);
            isValid = false;
        }
        
        // Expresión regular estándar internacional de TI para correos
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email);
            isValid = false;
        }

        if (!/^[0-9]{9,}$/.test(telefono.value.trim())) {
            showError(telefono);
            isValid = false;
        }

        if (!tipoProyecto.value) {
            showError(tipoProyecto);
            isValid = false;
        }

        if (!privacidad.checked) {
            alert("Debe aceptar las políticas de privacidad y protección de datos.");
            isValid = false;
        }

        if (isValid) {
            // Estructuración limpia de datos organizados para CRM (IL4/IL5)
            const leadData = {
                properties: {
                    firstname: nombre.value.trim(),
                    email: email.value.trim(),
                    phone: telefono.value.trim(),
                    tipo_de_proyecto: tipoProyecto.value,
                    message: document.getElementById("mensaje").value.trim()
                }
            };

            console.log("Enviando datos estructurados al CRM...", leadData);
            
            // Simulación del envío asíncrono a la API (Fase 4 del plan)
            alert("¡Solicitud enviada con éxito! Sus datos han sido registrados de manera confidencial.");
            form.reset();
        }
    });

    function showError(element) {
        element.classList.add("invalid");
        const errorSpan = element.parentElement.querySelector(".error-msg");
        if (errorSpan) errorSpan.classList.remove("hidden");
    }

    // --- LÓGICA 3: INTERACCIÓN INTELIGENTE DEL CHATBOT (IL1) ---
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChat = document.getElementById("close-chat");
    const chatInput = document.getElementById("chat-input");
    const sendChat = document.getElementById("send-chat");
    const chatMessages = document.getElementById("chatbot-messages");

    chatbotToggle.addEventListener("click", () => chatbotWindow.classList.toggle("hidden"));
    closeChat.addEventListener("click", () => chatbotWindow.classList.add("hidden"));

    sendChat.addEventListener("click", procesarMensajeChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") procesarMensajeChat();
    });

    function procesarMensajeChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Agregar mensaje de usuario
        appendMessage(text, "user");
        chatInput.value = "";

        // Respuesta simulada automatizada basada en palabras clave
        setTimeout(() => {
            let reply = "Disculpe, no comprendí bien su mensaje. ¿Desea información sobre cotizaciones, plazos u obras residenciales?";
            const upperText = text.toUpperCase();

            if (upperText.includes("COTIZAR") || upperText.includes("COTIZACION") || upperText.includes("PRECIO")) {
                reply = "Para obtener una cotización exacta y estructurada, le sugiero completar el formulario técnico que está en nuestra sección de Contacto.";
            } else if (upperText.includes("RESIDENCIAL") || upperText.includes("CASA") || upperText.includes("DEPARTAMENTO")) {
                reply = "En Constructora Gómez diseñamos y edificamos complejos residenciales cumpliendo con estándares internacionales de sismo-resistencia. Revise nuestro portafolio.";
            } else if (upperText.includes("CRM") || upperText.includes("HUBSPOT")) {
                reply = "Este sitio cuenta con una arquitectura moderna que conecta sus consultas en tiempo real con nuestra plataforma en la nube HubSpot CRM.";
            }

            appendMessage(reply, "bot");
        }, 800);
    }

    function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    if (sender === "user") {
        msgDiv.className = "bg-blue-600 text-white p-3 rounded-xl rounded-tr-none max-w-[85%] ml-auto";
    } else {
        msgDiv.className = "bg-slate-200 text-slate-800 p-3 rounded-xl rounded-tl-none max-w-[85%]";
    }
    
    // USAR textContent EN LUGAR DE innerHTML ASEGURA EL CUMPLIMIENTO DE LA POLÍTICA DE INTEGRIDAD (IL2)
    msgDiv.textContent = sanearEntrada(text); 
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
        }
});

// FUNCIÓN DE SANITIZACIÓN ANTI-XSS (Alineado con IL2 - Integridad de la Información)
function sanearEntrada(texto) {
    const mapaCaracteres = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    // Reemplaza caracteres potencialmente peligrosos por entidades HTML seguras
    return texto.replace(/[&<>"'/]/g, (caracter) => mapaCaracteres[caracter]);
}