import React, { useEffect, useState } from "react";
import Header from "./Header";
import { TarjetaActualizarVenta, TarjetaVenta } from "./Facturadora";
import { ActualizarDetallesFactura, ActualizarFactura, EliminarDetalleFactura, EliminarFactura, consultarDetallesFactura, consultarFactura, guardarVentas } from "../Base/BdFactura";
import Loading from "./LoadingScreen";

function GestorVentasView() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const [listaFacturas, setListaFacturas] = useState([]);
    const consultaFacturas = async () => {
        
        try {
            //setLoading(true);
            const respuesta = await consultarFactura(usuario.username);
            //setLoading(false);

            if (respuesta.datos) {
                setListaFacturas(respuesta.datos.sort((a, b) => a.id - b.id));
            } else {
                
            }
        } catch (error) {
            
        }

    }
    useEffect(() => {
        consultaFacturas();
    }, [listaFacturas]);

    return (
        //Div principal
        <div className="bg-[#F5F5F5] h-screen overflow-hidden">
            <Header
                link="/paginaPrincipal"
                logoRightSrc="ruta-a-la-imagen-derecha.jpg"
                logoAlt="FruityFolio logo"
                title="FruityFolio"
                subtitle="Consulta tus ventas"
            />
            <div className="">
                <ConsultarFactura listaFacturas={listaFacturas} consultarFactura={ConsultarFactura}></ConsultarFactura>
            </div>
        </div>
    );
}

export default GestorVentasView;

const FacturaBasica = ({ factura, onFacturaClick }) => {
    const { id, fecha, cliente, preciototal } = factura;

    const handleClick = () => {
        onFacturaClick(factura);
    };

    return (
        <div
            className="factura-basica cursor-pointer w-[400px] m-5 hover:bg-slate-300 p-2 rounded-lg"
            onClick={handleClick}
        >
            <div className="flex justify-between items-center">
                <h3>Factura #{id}</h3>
                <p>Fecha: {fecha}</p>
            </div>
            <div className="bg-white rounded-lg p-5 flex justify-between items-center">
                <p>Cliente: {cliente.nombre}</p>
                <p>Total: ${preciototal}</p>
            </div>
        </div>
    );
};

const DetallesFactura = ({ factura, showDetallesFactura, consultarFactura }) => {

    const consultaDetalle = async () => {
        setIsLoading(true);
        setMensajeEmergente("Cargando factura...");
        const respuesta = await consultarDetallesFactura(factura.id);
        setIsLoading(false);
        if (respuesta.datos) {
            setListaProductosVendidos(respuesta.datos.sort((a, b) => a.id - b.id));
        } else {
            setListaProductosVendidos([]);

        }

    }
    useEffect(() => {
        consultaDetalle();
    }, [factura.id]);

    const { numero: id, fecha, cliente, preciototal } = factura;
    const [ListaProductosVendidos, setListaProductosVendidos] =
        useState([]);
    const [totalPago, setTotalPago] = useState(preciototal);
    const [showActualizarVenta, setShowActualizarProducto] = useState(false);
    const [showAgregarVenta, setShowAgregarVenta] = useState(false);

    const [productoActualizar, setProductoActualizar] = useState(null);

    const handelShowAgregarProducto = (mostrar) => {
        setShowActualizarProducto(false);
        setShowAgregarVenta(mostrar);

    };
    const AgregarVenta = (Producto, Cantida, Total) => {
        // Crea una nueva copia del array listVentas y agrega el nuevo objeto de venta
        const nuevaListaVentas = [
            ...ListaProductosVendidos,
            {
                producto: Producto,
                cantidadvendida: parseFloat(Cantida),
                subprecio: Total,
            },
        ];

        const nuevoPrecio = preciototal + Total;

        // Actualiza el estado de totalPago con el nuevo valor
        setTotalPago(nuevoPrecio);

        // Actualiza el estado listVentas con la nueva lista
        setListaProductosVendidos(nuevaListaVentas);
    };

    const handelShowActualizarVenta = (mostrar, producto) => {
        setShowAgregarVenta(false);
        setShowActualizarProducto(mostrar);
        setProductoActualizar(producto);
    };

    const actualizarOEliminarVenta = async (Producto, Cantidad, Total, isEliminacion) => {
        console.clear();
        const nuevaListaVentas = [...ListaProductosVendidos];
        let nuevoPrecio;
        const index = nuevaListaVentas.findIndex((venta) => venta.producto.id === Producto.id);
        
        if (index !== -1) {
            
            if (isEliminacion) {
                console.log("Esta es la lista");
                console.log(nuevaListaVentas[index].subprecio);
                console.log(totalPago);
                nuevoPrecio = totalPago - nuevaListaVentas[index].subprecio
                if ((nuevoPrecio)<0){
                    nuevoPrecio*=-1;
                }
                await EliminarDetalleFactura(nuevaListaVentas[index].id);
                nuevaListaVentas.splice(index, 1); // Eliminar la venta de la lista
                if (nuevaListaVentas.length == 0) {
                    await EliminarFactura(factura.id);
                    window.location.reload();
                    return;
                }
                // Eliminar el detalle de factura asociado
                
            } else {
                nuevaListaVentas[index] = {
                    ...nuevaListaVentas[index],
                    cantidadvendida: Cantidad,
                    subprecio: Total,
                };
                nuevoPrecio = nuevaListaVentas.reduce((acumulador, venta) => acumulador + venta.subprecio, 0);
            }

            setTotalPago(nuevoPrecio);
            setListaProductosVendidos(nuevaListaVentas);
            handelShowActualizarVenta(false, null);

            factura.preciototal = nuevoPrecio;
            

            await ActualizarFactura(factura);
            
            
            if (!isEliminacion) {
                await ActualizarDetallesFactura(nuevaListaVentas[index]);
            }
        } else {
            console.error("Venta no encontrada en la lista.");
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [mensajeEmergente, setMensajeEmergente] = useState("");


    const GuardarCambios = async (detallesVentas) => {
        // Filtrar los detalles de ventas que no tienen un id
        let detallesSinId = detallesVentas.filter(venta => !venta.id);

        // Crear nuevas instancias de objetos con los detalles requeridos
        let nuevosDetalles = detallesSinId.map(venta => {
            return {
                cantidadvendida: venta.cantidadvendida,
                subprecio: venta.subprecio,
                idfactura: factura.id,
                idproducto: venta.producto.id

            };
        });
        
        
        factura.preciototal = totalPago;
        await ActualizarFactura(factura);
        let promesasVentas = nuevosDetalles.map(async (venta) => {
            return await guardarVentas(venta);
        });
        setIsLoading(true);
        
        setMensajeEmergente("Actualizando la factura.....")
        // Esperamos a que se completen todas las promesas de guardado de ventas
        await Promise.all(promesasVentas);
        setIsLoading(false);
        setShowAgregarVenta(false);
        showDetallesFactura();
        
    }

    const eliminarFactra = async (idFactura) =>{
        const respuesta = await EliminarFactura(idFactura);
        console.log(respuesta);
    }

    return (

        <div className="flex my-5">
            {isLoading && <Loading message={mensajeEmergente}></Loading>}
            <div className="detalles-factura flex flex-col items-center bg-[#CCE6FF] rounded-lg shadow-md p-6 w-[600px]">
                <h2 className="text-3xl font-bold mb-4 p-4">
                    Detalles de la factura #{factura.id}
                </h2>
                <div className="flex flex-col justify-center  rounded-lg shadow-md w-full  p-4 bg-white">
                    <div className="flex justify-between px-5">
                        <div>
                            {Object.entries(cliente).map(([key, value]) => (
                                <div key={key} className="flex items-center">
                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                    <p className="ml-2">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end">
                            <strong>Fecha:</strong>
                            <p className="ml-2">{fecha}</p>
                        </div>
                    </div>

                    <div className="w-full h-full flex flex-col items-center p-5 rounded-md">
                        {/* Color de fondo para los detalles de la factura */}
                        <div className="flex flex-col w-full border border-black rounded-lg h-full">
                            <div className="flex flex-row justify-between p-4 bg-[#4D94FF]">
                                <h2 className="font-semibold text-lg w-1/4 text-center">
                                    NOMBRE
                                </h2>
                                <h2 className="font-semibold text-lg w-1/4 text-center">
                                    CANTIDAD
                                </h2>
                                <h2 className="font-semibold text-lg w-1/4 text-center">
                                    PRECIO
                                </h2>
                                <h2 className="font-semibold text-lg w-1/4 text-center">
                                    SubTOTAL
                                </h2>
                            </div>
                            {/* CONTENEDOR DE PRODUCTOS VENDIDOS */}
                            <div className="max-h-[340px] overflow-auto bg-[#CCE6FF]">
                                {/* PRODUCTO VENDIDO */}
                                <div>
                                    {ListaProductosVendidos.map((detalle, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-row justify-between border-t border-black p-4 hover:bg-slate-300 cursor-pointer"
                                            onClick={() => handelShowActualizarVenta(true, detalle.producto)}
                                        >
                                            <p className="w-1/4 text-center border-black pl-4">
                                                {detalle.producto.name}
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                {detalle.cantidadvendida} kg
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                ${detalle.producto.price}
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                ${detalle.subprecio}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-4 px-10 items-center">
                            <p className="w-1/4 text-center text-lg font-bold">Total :</p>
                            <p className="w-1/4 text-center text-lg font-bold pl-4">
                                ${totalPago ? totalPago : preciototal}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-between pt-3 mt-3 ">
                    <div className="w-1/2  flex flex-col justify-between ">
                        <button
                            className="bg-slate-400 font-bold text-white hover:bg-slate-700 rounded-lg mx-2 p-2 mb-2"
                            onClick={() => showDetallesFactura()}
                        >
                            CANCELAR
                        </button>
                        <button
                            className="bg-green-400 font-bold text-white hover:bg-green-700 rounded-lg mx-2 p-2"
                            onClick={() => GuardarCambios(ListaProductosVendidos)}
                        >
                            CONFIRMAR ACTUALIZACION
                        </button>

                    </div>

                    <div className="w-1/2  flex flex-col justify-between">
                        <button
                            className="bg-blue-400 font-bold text-white hover:bg-blue-700  rounded-lg mx-2 p-2 mb-2"
                            onClick={() => handelShowAgregarProducto(true)}
                        >
                            AGREGAR VENTA
                        </button>

                        <button
                            className="bg-red-400 font-bold text-white hover:bg-red-700 rounded-lg mx-2 p-2"
                            onClick={() => eliminarFactra(factura.id)}
                        >
                            ELIMINAR
                        </button>
                    </div>

                </div>
            </div>
            <div>

            </div>
            {showActualizarVenta && (
                <TarjetaActualizarVenta
                    productActualizar={productoActualizar}
                    ActualizarVenta={actualizarOEliminarVenta}
                    CancelarActualizacionVenta={handelShowActualizarVenta}
                    EliminarVenta={actualizarOEliminarVenta}
                ></TarjetaActualizarVenta>
            )}
            {showAgregarVenta && (
                <TarjetaVenta AgregarVenta={AgregarVenta} ListaProductosVendidos={ListaProductosVendidos}></TarjetaVenta>
            )}


        </div>
    );
};

const ConsultarFactura = ({ listaFacturas, consultarFactura }) => {
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    const handleFacturaClick = (factura) => {
        setFacturaSeleccionada(factura);
    };

    useEffect(() => {

    }, [facturaSeleccionada]);

    return (
        <div className="consultar-factura justify-between items-center h-screen w-full overflow-hidden ">
            <div className="flex justify-center px-8">
                <div className="mx-20 my-5">
                    <div className="flex flex-col justify-center items-center  bg-[#CCE6FF] rounded-lg  shadow-md w-[500px]">
                        <div className="w-full text-3xl text-gold text-black font-bold  text-center rounded-t-lg p-4">
                            <h1>Lista de Facturas</h1>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {listaFacturas.map((factura) => (
                                <FacturaBasica
                                    key={factura.id}
                                    factura={factura}
                                    onFacturaClick={handleFacturaClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {facturaSeleccionada && (
                    <DetallesFactura factura={facturaSeleccionada} showDetallesFactura={handleFacturaClick} consultarFactura={consultarFactura} />
                )}
            </div>
        </div>
    );
};
