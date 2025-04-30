// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario y la lista de gastos
    const formularioGasto = document.getElementById('formulario-gasto');
    const listaGastos = document.getElementById('gastos');

    // Elementos para mostrar los totales
    const totalPersona1Element = document.getElementById('total-persona1');
    const totalPersona2Element = document.getElementById('total-persona2');
    const deudaP1P2Element = document.getElementById('deuda-p1-p2');
    const deudaP2P1Element = document.getElementById('deuda-p2-p1');

    // Variables para almacenar los totales
    let totalPersona1 = 0;
    let totalPersona2 = 0;

    // Cargar datos desde localStorage
    cargarDatos();


     // Escuchar el evento de envío del formulario
     formularioGasto.addEventListener('submit', function(event) {
        // Prevenir el comportamiento por defecto del formulario (recargar la página)
        event.preventDefault();
    
         // Obtener los valores de los campos del formulario
        const descripcion = document.getElementById('descripcion').value;
        const monto = parseFloat(document.getElementById('monto').value);
        const pagoPersona1 = parseFloat(document.getElementById('pago-persona1').value);
        const pagoPersona2 = parseFloat(document.getElementById('pago-persona2').value);

        // Crear un nuevo elemento de lista para el gasto
        const nuevoGasto = document.createElement('li');
        nuevoGasto.classList.add('gasto-item');
        nuevoGasto.textContent = `Descripción: ${descripcion}, Monto: ${monto.toFixed(2)}, Pagado por Persona 1: ${pagoPersona1.toFixed(2)}, Pagado por Persona 2: ${pagoPersona2.toFixed(2)}`;


        // Crear un span para el botón de eliminación
        const botonEliminar = document.createElement('span');
        botonEliminar.textContent = 'X';
        botonEliminar.style.marginLeft = '10px';
        botonEliminar.style.cursor = 'pointer';
        botonEliminar.addEventListener('click', eliminarGasto);
        nuevoGasto.appendChild(botonEliminar);

        // Agregar el nuevo elemento a la lista de gastos
        listaGastos.appendChild(nuevoGasto);

        // Actualizar los totales
        totalPersona1 += pagoPersona1;
        totalPersona2 += pagoPersona2;

        // Actualizar el DOM con los nuevos totales
        totalPersona1Element.textContent = totalPersona1.toFixed(2);
        totalPersona2Element.textContent = totalPersona2.toFixed(2);

        // Calcular y actualizar las deudas
         actualizarDeudas();

        // Guardar los datos en localStorage
        guardarDatos();

        // Limpiar los campos del formulario
        formularioGasto.reset();
    })

    // Función para eliminar un gasto
    function eliminarGasto(event) {
        // Obtener el elemento li (el gasto)
        const gastoElement = event.target.parentElement;
        
        // Extraer el texto del gasto
        const textoGasto = gastoElement.firstChild.textContent.trim();

        const match = textoGasto.match(/Descripción: .+, Monto: ([\d.]+), Pagado por Persona 1: ([\d.]+), Pagado por Persona 2: ([\d.]+)/);
        if (match) {
            const [_, monto, pago1, pago2] = match.map(Number);

            // Restar los montos del gasto eliminado de los totales
            totalPersona1 -= pago1;
            totalPersona2 -= pago2;

            // Actualizar el DOM con los nuevos totales
            totalPersona1Element.textContent = totalPersona1.toFixed(2);
            totalPersona2Element.textContent = totalPersona2.toFixed(2);

            // Calcular y actualizar las deudas
            actualizarDeudas();

            // Guardar datos en localStorage
            guardarDatos();
        } else {
            console.error('Formato de texto no reconocido:', textoGasto);
        }

        // Eliminar el gasto de la lista
        listaGastos.removeChild(gastoElement);
        guardarDatos();
    }

    // Función para calcular y actualizar las deudas
    function actualizarDeudas() {
        const totalGastado = totalPersona1 + totalPersona2;
        const deberiaPagarCadaUno = totalGastado / 2;
        const diferenciaP1 = deberiaPagarCadaUno - totalPersona1;
        const diferenciaP2 = deberiaPagarCadaUno - totalPersona2;

        if (diferenciaP1 > 0) {
            deudaP1P2Element.textContent = diferenciaP1.toFixed(2);
            deudaP2P1Element.textContent = '0.00';
        } else if (diferenciaP2 > 0) {
            deudaP1P2Element.textContent = '0.00';
            deudaP2P1Element.textContent = diferenciaP2.toFixed(2);
        } else {
            deudaP1P2Element.textContent = '0.00';
            deudaP2P1Element.textContent = '0.00';
        }
    }



 // Función para guardar datos en localStorage
 function guardarDatos() {
    const gastos = [];
    listaGastos.querySelectorAll('li').forEach(item => {
        const textoGasto = item.firstChild.textContent.trim();
        gastos.push(textoGasto);
    });
    localStorage.setItem('gastos', JSON.stringify(gastos));
    localStorage.setItem('totalPersona1', totalPersona1);
    localStorage.setItem('totalPersona2', totalPersona2);
}

// Función para cargar datos desde localStorage
function cargarDatos() {
    const gastos = JSON.parse(localStorage.getItem('gastos'));
    if (gastos) {
        gastos.forEach(gasto => {
            const nuevoGasto = document.createElement('li');
            nuevoGasto.textContent = gasto;
            nuevoGasto.classList.add('gasto-item');

            // Agregar el nuevo elemento a la lista de gastos
            listaGastos.appendChild(nuevoGasto);

            // Crear un span para el botón de eliminación
            const botonEliminar = document.createElement('span');
            botonEliminar.textContent = 'X';
            botonEliminar.style.marginLeft = '10px';
            botonEliminar.style.cursor = 'pointer';
            botonEliminar.addEventListener('click', eliminarGasto);
            nuevoGasto.appendChild(botonEliminar);
        

        });
    }

    totalPersona1 = parseFloat(localStorage.getItem('totalPersona1')) || 0;
    totalPersona2 = parseFloat(localStorage.getItem('totalPersona2')) || 0;
    totalPersona1Element.textContent = totalPersona1.toFixed(2);
    totalPersona2Element.textContent = totalPersona2.toFixed(2);
    actualizarDeudas();
}



function reiniciarDatos() {
    // Eliminar elementos específicos
    localStorage.removeItem('gastos');
    localStorage.removeItem('totalPersona1');
    localStorage.removeItem('totalPersona2');

    // Reiniciar variables y actualizar el DOM
    totalPersona1 = 0;
    totalPersona2 = 0;
    totalPersona1Element.textContent = totalPersona1.toFixed(2);
    totalPersona2Element.textContent = totalPersona2.toFixed(2);
    deudaP1P2Element.textContent = '0.00';
    deudaP2P1Element.textContent = '0.00';

    // Limpiar la lista de gastos en el DOM
    listaGastos.innerHTML = '';
}

// Ejemplo de uso: asignar a un botón de reinicio
document.getElementById('boton-reiniciar').addEventListener('click', reiniciarDatos);

});


