import axios from 'axios';
import { useState } from 'react';
const url = "https://localhost:7208";

export async function GuardarFactura(factura) {
    console.clear();
    var respuestaFactura;
    
    try {
        
        const respuestaCliente = await ConsultarCliente(factura.cliente.cedula);
        
        console.log("respuesta cliente",respuestaCliente);
        if (respuestaCliente.datos==null) {
            respuestaFactura = await axios.post('https://localhost:7208/api/Clientes', factura.cliente);
        }
        const facturaGuardar = {
            fecha: factura.fechaActual,
            preciototal: factura.total,
            clienteCedula: factura.cliente.cedula,
            usuarioUsername: factura.usuarioUsername
        }
        respuestaFactura = await guardarFactura(facturaGuardar);

        

        console.log("respuesta factura",respuestaFactura);
        if(respuestaFactura.datos!=null){
            const listaVentas = factura.listaProductosVendidos.map((venta, index) => ({
                cantidadvendida: parseInt(venta.cantidad), 
                subprecio: parseFloat(venta.total), 
                idfactura: respuestaFactura.datos.id, 
                idproducto: venta.producto.id 
            }));
            let respuestaVentas;
            listaVentas.map(async(venta)=>{
                respuestaVentas=await guardarVentas(venta); 
            });
        }
    }
    catch (error) {
        return error;
    }
    
}


async function ConsultarCliente(cedula) {
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/Clientes/${cedula}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

async function guardarFactura(factura) {

    try {
        const respuesta = await axios.post(`https://localhost:7208/api/Facturas`,factura);
        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

async function guardarVentas(ventas) {

    try {
        const respuesta = await axios.post(`https://localhost:7208/api/DetallesProductosVendidos`, ventas);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}