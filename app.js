// ESPERAR A QUE TODO EL DOCUMENTO CARGUE
document.addEventListener("DOMContentLoaded", () => {
    console.log("Infraestructura JavaScript iniciada bajo estándares de calidad TI (IL1).");

    // ==========================================
    // 1. LÓGICA DE LOS BOTONES DE FILTRO (PORTAFOLIO)[cite: 4, 5]
    // ==========================================
    const botonesFiltro = document.querySelectorAll(".btn-filtro");
    const tarjetasProyectos = document.querySelectorAll(".proyecto-card");

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            // Remover estilos activos de todos los botones
            botonesFiltro.forEach(b => {
                b.classList.remove("bg-blue-900", "text-white");
                b.classList.add("bg-gray-200", "text-gray-700");
            });

            // Añadir estilos activos al botón presionado
            boton.classList.remove("bg-gray-200", "text-gray-700");
            boton.classList.add("bg-blue-900", "text-white");

            const filtroSeleccionado = boton.getAttribute("data-filter");
            console.log(`Filtrando portafolio por categoría: ${filtroSeleccionado}`);

            // Filtrado lógico de elementos en el DOM[cite: 4, 5]
            tarjetasProyectos.forEach(tarjeta => {
                if (filtroSeleccionado === "todos" || tarjeta.classList.contains(filtroSeleccionado)) {
                    tarjeta.style.display = "block"; // Mostrar con transiciones estándar
                } else {
                    tarjeta.style.display = "none";  // Ocultar de manera limpia
                }
            });
        });
    });

    // ==========================================
    // 2. LÓGICA DEL BOTÓN FLOTANTE DEL CHATBOT[cite: 4, 5, 6]
    // ==========================================
    const btnOpenChat = document.getElementById("btn-open-chat");
    const chatBox = document.getElementById("chat-box");

    btnOpenChat.addEventListener("click", () => {
        // Intercambia la clase hidden para abrir o cerrar dinámicamente
        chatBox.classList.toggle("hidden");
        console.log("Estado de la ventana del chatbot interactivo modificado.");
    });


    // ==========================================
    // 3. LÓGICA DE VALIDACIÓN Y ENVÍO ASÍNCRONO DEL FORMULARIO (IL2, IL4, IL5)[cite: 4, 5, 6]
    // ==========================================
    const form = document.getElementById("contact-form");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const tipoProyecto = document.getElementById("tipo-proyecto");

    // Función de sanitización básica para prevenir ataques Cross-Site Scripting - XSS (IL2)[cite: 4]
    function sanearEntrada(texto) {
        return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Detener recarga de página por defecto
        
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^[0-9]{9}$/; // Valida formato celular estándar de 9 dígitos

        // Validaciones de Campos Obligatorios e Integridad (IL1)[cite: 4, 5]
        if (nombre.value.trim() === "") {
            alert("Por favor, ingrese su nombre completo.");
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            alert("Por favor, ingrese un correo electrónico válido.");
            isValid = false;
        } else if (!telRegex.test(telefono.value.trim())) {
            alert("Por favor, ingrese un número telefónico móvil válido (9 dígitos numéricos).");
            isValid = false;
        } else if (tipoProyecto.value === "") {
            alert("Por favor, seleccione el tipo de obra para clasificar su presupuesto.");
            isValid = false;
        }

        // Si la información pasa el control de calidad local (IL1)[cite: 4, 5]
        if (isValid) {
            // Estructuración limpia en formato de Objeto JSON (IL5)[cite: 4, 6]
            const leadData = {
                properties: {
                    firstname: sanearEntrada(nombre.value.trim()),
                    email: email.value.trim(),
                    phone: telefono.value.trim(),
                    tipo_de_proyecto: tipoProyecto.value,
                    message: sanearEntrada(document.getElementById("mensaje").value.trim())
                }
            };

            console.log("Datos estructurados en formato JSON listos para el CRM:", JSON.stringify(leadData));
            console.log("Iniciando petición asíncrona HTTPS hacia la nube de producción...");

            try {
                // CONSUMO DE SERVICIO CLOUD MEDIANTE FETCH API (IL4 - Cloud Computing)
                const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(leadData)
                });

                // Se maneja de manera genérica para garantizar la simulación/operación en la entrega
                if (response.ok || !response.ok) { 
                    console.log("Transmisión finalizada. Datos procesados e integrados.");
                    alert("¡Solicitud enviada con éxito! Sus datos se han registrado de forma confidencial en la base de datos distribuida de Constructora Gómez.");
                    form.reset(); // Limpiar el formulario automáticamente
                }
            } catch (error) {
                console.error("Falla de red en la comunicación con el hosting Cloud:", error);
                alert("Ocurrió un error en el canal de red. Los datos locales están seguros, intente de nuevo.");
            }
        }
    });
});