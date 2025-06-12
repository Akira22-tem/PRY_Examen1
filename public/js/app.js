document.addEventListener('DOMContentLoaded', () => {
    /*** DATOS COMPARTIDOS ***/
    const datosClientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const datosProductos = JSON.parse(localStorage.getItem('productos')) || [];

    /*** MÓDULO DE CLIENTES ***/
    const formularioCliente = document.getElementById('cliente-form');
    const listaClientes = document.getElementById('clientes-lista');
    if (formularioCliente && listaClientes) {
        let clientes = [...datosClientes];
        let idClienteEdicion = null;

        const mostrarClientes = () => {
            if (!clientes.length) {
                listaClientes.innerHTML = '<p>No hay clientes registrados.</p>';
                return;
            }
            let html = `<table class="table"><thead><tr><th>ID</th><th>Nombre</th><th>Cédula</th><th>Dirección</th><th>Acciones</th></tr></thead><tbody>`;
            clientes.forEach(cliente => html += `
        <tr>
          <td>${cliente.id}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.cedula}</td>
          <td>${cliente.direccion}</td>
          <td>
            <button class="btn btn-warning btn-sm boton-editar-cliente" data-id="${cliente.id}">Editar</button>
            <button class="btn btn-danger btn-sm boton-eliminar-cliente" data-id="${cliente.id}">Eliminar</button>
          </td>
        </tr>`);
            html += `</tbody></table>`;
            listaClientes.innerHTML = html;
        };

        const guardarClientes = () => localStorage.setItem('clientes', JSON.stringify(clientes));

        formularioCliente.addEventListener('submit', evento => {
            evento.preventDefault();
            const nombre = document.getElementById('nombre-cliente').value.trim();
            const cedula = document.getElementById('cedula-cliente').value.trim();
            const direccion = document.getElementById('direccion-cliente').value.trim();

            if (!nombre || !cedula || !direccion) return;

            if (idClienteEdicion) {
                // Editar cliente existente
                clientes = clientes.map(cliente =>
                    cliente.id === idClienteEdicion ? { ...cliente, nombre, cedula, direccion } : cliente
                );
                idClienteEdicion = null; // Resetear el ID de edición
                formularioCliente.querySelector('button[type="submit"]').textContent = 'Registrar Cliente';
            } else {
                // Agregar nuevo cliente
                clientes.push({ id: Date.now(), nombre, cedula, direccion });
            }

            guardarClientes();
            mostrarClientes();
            formularioCliente.reset();
        });

        listaClientes.addEventListener('click', evento => {
            const id = +evento.target.dataset.id;

            if (evento.target.matches('.boton-editar-cliente')) {
                const cliente = clientes.find(c => c.id === id);
                document.getElementById('nombre-cliente').value = cliente.nombre;
                document.getElementById('cedula-cliente').value = cliente.cedula;
                document.getElementById('direccion-cliente').value = cliente.direccion;
                formularioCliente.querySelector('button[type="submit"]').textContent = 'Actualizar Cliente';
                idClienteEdicion = id; // Guardar el ID del cliente que se está editando
            }

            if (evento.target.matches('.boton-eliminar-cliente') && confirm('¿Está seguro de eliminar este cliente?')) {
                clientes = clientes.filter(c => c.id !== id);
                guardarClientes();
                mostrarClientes();
            }
        });

        mostrarClientes();
    }

    /*** MÓDULO DE PRODUCTOS ***/
    const formularioProducto = document.getElementById('producto-form');
    const listaProductos = document.getElementById('productos-lista');
    if (formularioProducto && listaProductos) {
        let productos = [...datosProductos];
        let idProductoEdicion = null;

        const mostrarProductos = () => {
            if (!productos.length) {
                listaProductos.innerHTML = '<p>No hay productos registrados.</p>';
                return;
            }
            let html = `<table class="table"><thead><tr><th>ID</th><th>Nombre</th><th>Código</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>`;
            productos.forEach(producto => html += `
        <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.codigo}</td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td>
            <button class="btn btn-warning btn-sm boton-editar-producto" data-id="${producto.id}">Editar</button>
            <button class="btn btn-danger btn-sm boton-eliminar-producto" data-id="${producto.id}">Eliminar</button>
          </td>
        </tr>`);
            html += `</tbody></table>`;
            listaProductos.innerHTML = html;
        };

        const guardarProductos = () => localStorage.setItem('productos', JSON.stringify(productos));

        formularioProducto.addEventListener('submit', evento => {
            evento.preventDefault();
            const nombre = document.getElementById('nombre-producto').value.trim();
            const codigo = document.getElementById('codigo-producto').value.trim();
            const precio = parseFloat(document.getElementById('precio-producto').value);

            if (!nombre || !codigo || isNaN(precio)) return;

            if (idProductoEdicion) {
                // Editar producto existente
                productos = productos.map(producto =>
                    producto.id === idProductoEdicion ? { ...producto, nombre, codigo, precio } : producto
                );
                idProductoEdicion = null; // Resetear el ID de edición
                formularioProducto.querySelector('button[type="submit"]').textContent = 'Registrar Producto';
            } else {
                // Agregar nuevo producto
                productos.push({ id: Date.now(), nombre, codigo, precio });
            }

            guardarProductos();
            mostrarProductos();
            formularioProducto.reset();
        });

        listaProductos.addEventListener('click', evento => {
            const id = +evento.target.dataset.id;

            if (evento.target.matches('.boton-editar-producto')) {
                const producto = productos.find(p => p.id === id);
                document.getElementById('nombre-producto').value = producto.nombre;
                document.getElementById('codigo-producto').value = producto.codigo;
                document.getElementById('precio-producto').value = producto.precio;
                formularioProducto.querySelector('button[type="submit"]').textContent = 'Actualizar Producto';
                idProductoEdicion = id; // Guardar el ID del producto que se está editando
            }

            if (evento.target.matches('.boton-eliminar-producto') && confirm('¿Está seguro de eliminar este producto?')) {
                productos = productos.filter(p => p.id !== id);
                guardarProductos();
                mostrarProductos();
            }
        });

        mostrarProductos();
    }

    /*** MÓDULO DE FACTURACIÓN ***/
    const formularioFactura = document.getElementById('factura-form');
    const selectorCliente = document.getElementById('cliente-factura');
    const selectorProducto = document.getElementById('producto-factura');
    const campoCantidad = document.getElementById('cantidad-producto');
    const botonAgregarProducto = document.getElementById('agregar-producto');
    const listaProductosFactura = document.getElementById('productos-factura-lista');
    const elementoResumenFactura = document.getElementById('factura-resumen');
    const elementoVistaPrevia = document.getElementById('vista-previa');
    let idFacturaEdicion = null;

    if (formularioFactura) {
        // Verificar si viene de edición
        const parametros = new URLSearchParams(window.location.search);
        idFacturaEdicion = parametros.get('edit');
        let articulos = [];

        // Poblar selectores
        selectorCliente.innerHTML = '<option value="" disabled selected>Seleccione un cliente</option>' +
            datosClientes.map(cliente => `<option value="${cliente.id}">${cliente.nombre} (${cliente.cedula})</option>`).join('');
        selectorProducto.innerHTML = '<option value="" disabled selected>Seleccione un producto</option>' +
            datosProductos.map(producto => `<option value="${producto.id}">${producto.nombre} - ${producto.codigo} ($${producto.precio.toFixed(2)})</option>`).join('');

        const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
        if (idFacturaEdicion) {
            // Cargar factura a editar
            const facturaEditar = facturas.find(factura => factura.id === +idFacturaEdicion);
            if (facturaEditar) {
                selectorCliente.value = facturaEditar.clienteId;
                articulos = [...facturaEditar.items];
                formularioFactura.querySelector('button[type="submit"]').textContent = 'Actualizar Factura';
            }
        }

        const mostrarArticulos = () => {
            if (!articulos.length) {
                listaProductosFactura.innerHTML = '<p>No hay productos agregados a la factura.</p>';
                elementoResumenFactura.textContent = '';
                elementoVistaPrevia.innerHTML = '';
                return;
            }

            let tabla = `<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>`;
            let totalGeneral = 0;

            articulos.forEach((articulo, indice) => {
                const subtotal = articulo.precio * articulo.cantidad;
                totalGeneral += subtotal;
                tabla += `<tr>
          <td>${articulo.nombre}</td>
          <td>${articulo.cantidad}</td>
          <td>$${articulo.precio.toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
          <td><button class="boton-eliminar-articulo" data-index="${indice}">Quitar</button></td>
        </tr>`;
            });

            tabla += `</tbody></table>`;
            listaProductosFactura.innerHTML = tabla;
            elementoResumenFactura.textContent = `Total General: $${totalGeneral.toFixed(2)}`;

            const clienteSeleccionado = datosClientes.find(cliente => cliente.id === +selectorCliente.value);
            const fechaActual = new Date().toLocaleString('es-ES');

            elementoVistaPrevia.innerHTML = `
        <div class="encabezado-vista-previa">
          <p><strong>Cliente:</strong> ${clienteSeleccionado?.nombre || 'No seleccionado'}</p>
          <p><strong>Fecha:</strong> ${fechaActual}</p>
        </div>
        ${tabla}
        <p class="total-vista-previa"><strong>Total a Pagar: $${totalGeneral.toFixed(2)}</strong></p>
      `;

            // Agregar eventos para eliminar artículos
            listaProductosFactura.querySelectorAll('.boton-eliminar-articulo').forEach(boton =>
                boton.addEventListener('click', () => {
                    articulos.splice(+boton.dataset.index, 1);
                    mostrarArticulos();
                })
            );
        };

        botonAgregarProducto.addEventListener('click', () => {
            const idProducto = +selectorProducto.value;
            const cantidad = +campoCantidad.value;

            if (!idProducto || cantidad < 1) {
                alert('Por favor seleccione un producto y especifique una cantidad válida.');
                return;
            }

            const productoSeleccionado = datosProductos.find(producto => producto.id === idProducto);
            articulos.push({
                id: productoSeleccionado.id,
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                cantidad
            });

            mostrarArticulos();
            campoCantidad.value = 1;
            selectorProducto.selectedIndex = 0;
        });

        selectorCliente.addEventListener('change', mostrarArticulos);

        formularioFactura.addEventListener('submit', evento => {
            evento.preventDefault();

            if (!selectorCliente.value || !articulos.length) {
                alert('Por favor seleccione un cliente y agregue al menos un producto.');
                return;
            }

            const facturasActualizadas = facturas.filter(factura => factura.id !== +idFacturaEdicion);
            const nuevaFactura = {
                id: idFacturaEdicion ? +idFacturaEdicion : Date.now(),
                clienteId: +selectorCliente.value,
                items: articulos,
                fecha: new Date().toISOString()
            };

            facturasActualizadas.push(nuevaFactura);
            localStorage.setItem('facturas', JSON.stringify(facturasActualizadas));

            alert(idFacturaEdicion ? 'Factura actualizada exitosamente' : 'Factura creada exitosamente');
            window.location.href = 'facturas.html';
        });

        mostrarArticulos();
    }

    /*** MÓDULO DE HISTORIAL DE FACTURAS ***/
    const elementoHistorial = document.getElementById('facturas-lista');
    if (elementoHistorial) {
        let facturas = JSON.parse(localStorage.getItem('facturas')) || [];

        const mostrarHistorial = () => {
            if (!facturas.length) {
                elementoHistorial.innerHTML = '<p>No se han generado facturas aún.</p>';
                return;
            }

            let contenidoHtml = '';

            facturas.forEach(factura => {
                const cliente = datosClientes.find(c => c.id === factura.clienteId) || {};
                const fechaFormateada = new Date(factura.fecha).toLocaleString('es-ES');
                const totalFactura = factura.items.reduce((suma, articulo) => suma + articulo.precio * articulo.cantidad, 0);

                contenidoHtml += `
          <div class="elemento-historial">
            <p><strong>Factura N° ${factura.id}</strong> - ${cliente.nombre || 'Cliente no encontrado'} - ${fechaFormateada} - Total: $${totalFactura.toFixed(2)}</p>
            <button class="alternar-detalles" data-id="${factura.id}">Ver Detalles</button>
            <button class="boton-editar-factura" data-id="${factura.id}">✏️ Editar</button>
            <button class="boton-eliminar-factura" data-id="${factura.id}">🗑️ Eliminar</button>
            <div class="detalles-factura" id="detalles-${factura.id}" style="display:none; margin-top:10px;">
              <table>
                <thead>
                  <tr><th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  ${factura.items.map(articulo =>
                    `<tr>
                      <td>${articulo.nombre}</td>
                      <td>${articulo.cantidad}</td>
                      <td>$${articulo.precio.toFixed(2)}</td>
                      <td>$${(articulo.precio * articulo.cantidad).toFixed(2)}</td>
                    </tr>`
                ).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
            });

            elementoHistorial.innerHTML = contenidoHtml;

            // Agregar eventos de interacción
            elementoHistorial.querySelectorAll('.alternar-detalles').forEach(boton =>
                boton.addEventListener('click', () => {
                    const divDetalles = document.getElementById('detalles-' + boton.dataset.id);
                    const estaVisible = divDetalles.style.display !== 'none';
                    divDetalles.style.display = estaVisible ? 'none' : 'block';
                    boton.textContent = estaVisible ? 'Ver Detalles' : 'Ocultar Detalles';
                })
            );

            elementoHistorial.querySelectorAll('.boton-eliminar-factura').forEach(boton =>
                boton.addEventListener('click', () => {
                    if (confirm('¿Está seguro de eliminar esta factura? Esta acción no se puede deshacer.')) {
                        facturas = facturas.filter(factura => factura.id !== +boton.dataset.id);
                        localStorage.setItem('facturas', JSON.stringify(facturas));
                        mostrarHistorial();
                    }
                })
            );

            elementoHistorial.querySelectorAll('.boton-editar-factura').forEach(boton =>
                boton.addEventListener('click', () => {
                    window.location.href = `facturacion.html?edit=${boton.dataset.id}`;
                })
            );
        };

        mostrarHistorial();
    }
});
