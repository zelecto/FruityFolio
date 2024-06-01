import axios from 'axios';
const url = "https://localhost:7208";

// Función para obtener el token almacenado
function getToken() {
    return localStorage.getItem('token'); // Asegúrate de almacenar el token en el localStorage o en alguna otra parte cuando inicias sesión
}

// Configurar el interceptor para incluir el token en cada solicitud
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export async function GuardarFactura(factura) {
    try {
        const facturaGuardar = {
            fecha: factura.fechaActual,
            preciototal: factura.total,
            cliente: factura.cliente, // Enviamos todos los datos del cliente
            usuarioUsername: factura.usuarioUsername
        }

        // Guardamos la factura
        const respuestaFactura = await guardarFactura(facturaGuardar);

        if (respuestaFactura.datos != null) {
            // Si se guardó la factura correctamente, guardamos las ventas
            const listaVentas = factura.listaProductosVendidos.map((venta, index) => ({
                cantidadvendida: parseInt(venta.cantidadvendida),
                subprecio: parseFloat(venta.subprecio),
                idfactura: respuestaFactura.datos.id,
                idproducto: venta.producto.id
            }));

            // Guardamos cada venta de forma asíncrona
            let promesasVentas = listaVentas.map(async (venta) => {
                return await guardarVentas(venta);
            });

            // Esperamos a que se completen todas las promesas de guardado de ventas
            await Promise.all(promesasVentas);
            console.log(promesasVentas);
        }
        return respuestaFactura.datos;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function guardarFactura(factura) {
    try {
        const respuesta = await axios.post(`${url}/api/Facturas`, factura);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function guardarVentas(ventas) {
    try {
        const respuesta = await axios.post(`${url}/api/DetallesProductosVendidos`, ventas);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function consultarFactura(usuario, fechaInicio, fechaFinal) {
    const params = new URLSearchParams({
        fechaInicio,
        fechaFinal,
    }).toString();
    try {
        const respuesta = await axios.get(`${url}/api/Facturas/ByUser/${usuario}?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function consultarDetallesFactura(facturaID) {
    try {
        const respuesta = await axios.get(`${url}/api/DetallesProductosVendidos/ByFactura/${facturaID}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function ActualizarDetallesFactura(detalle) {
    try {
        const respuesta = await axios.put(`${url}/api/DetallesProductosVendidos/${detalle.id}`, detalle);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function ActualizarFactura(factura) {
    try {
        const respuesta = await axios.put(`${url}/api/Facturas/${factura.id}`, factura);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function EliminarDetalleFactura(id) {
    try {
        const respuesta = await axios.delete(`${url}/api/DetallesProductosVendidos/${id}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function EliminarFactura(id) {
    try {
        const respuesta = await axios.delete(`${url}/api/Facturas/${id}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}
