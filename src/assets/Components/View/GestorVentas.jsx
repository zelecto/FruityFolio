import React, { useEffect, useState } from "react";
import Header from "./Header";
import { TarjetaActualizarVenta, TarjetaVenta } from "./Facturadora";
import { ActualizarDetallesFactura, ActualizarFactura, EliminarDetalleFactura, EliminarFactura, consultarDetallesFactura, consultarFactura, guardarVentas } from "../Base/BdFactura";
import Loading from "./LoadingScreen";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, DateRangePicker, Pagination, Spinner, Tooltip, getKeyValue } from "@nextui-org/react";
import { CalendarCheck, CircleDollarSignIcon, FolderXIcon } from "lucide-react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";

function GestorVentasView() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const [listaFacturas, setListaFacturas] = useState([]);
    const [loading, setLoading] = useState(false);

    const consultaFacturas = async () => {
        try {
            setLoading(true);
            const respuesta = await consultarFactura(usuario.username);
            setLoading(false);

            if (respuesta.datos) {
                setListaFacturas(respuesta.datos.sort((a, b) => a.id - b.id));
            } else {
                setListaFacturas([]);
            }
        } catch (error) {
            setLoading(false);
            // Manejar el error si es necesario
        }
    };

    useEffect(() => {
        consultaFacturas();
    }, []); // Ejecutar solo una vez al cargar el componente


    useEffect(() => {

    }, [listaFacturas]);// Ejecutar solo una vez al cargar el componente

    const [factura, setFactura] = useState(null);

    return (
        <div className="bg-[#F5F5F5] min-h-screen w-screen flex flex-col">
            <Header title="FruityFolio" />

            {/*
        //<ConsultarFactura listaFacturas={listaFacturas} consultarFactura={ConsultarFactura} />
    */}
            <div className="w-full min-h-full flex-grow flex">
                <VistaPrueba listaFacturas={listaFacturas} isLoading={loading} setFactura={setFactura} />

                <div className="flex-grow flex justify-center items-center">
                    {factura ? (
                        <DetallesFactura consultarFactura={consultaFacturas} showDetallesFactura={setFactura} factura={factura} />
                    ) : (
                        <div className="text-white">Hola</div>
                    )}
                </div>
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
        <button onClick={handleClick}>
            <Card
                className="factura-basica cursor-pointer w-[400px] m-5 bg-black text-white p-2 rounded-lg"

            >
                <CardHeader className="flex justify-between items-center">
                    <h3>Factura #{id}</h3>
                    <p>Fecha: {fecha}</p>
                </CardHeader>
                <CardBody className=" rounded-lg p-5 flex flex-row justify-between">
                    <p>Cliente: {cliente.nombre}</p>
                    <p>Total: ${preciototal}</p>
                </CardBody>
            </Card>
        </button>

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
        setTotalPago(factura.preciototal)
    }, [factura.id]);



    const { numero: id, fecha, cliente } = factura;
    const [ListaProductosVendidos, setListaProductosVendidos] = useState([]);
    const [totalPago, setTotalPago] = useState(factura.preciototal);
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
        const nuevoPrecio = totalPago + Total;

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

    const [listaDetallesEliminados, setListaDetallesEliminados] = useState([]);
    const [listaDetallesActulizados, setListaDetallesActulizados] = useState([]);
    const actualizarOEliminarVenta = async (Producto, Cantidad, Total, isEliminacion) => {
        const nuevaListaVentas = [...ListaProductosVendidos];
        let nuevoPrecio;
        const index = nuevaListaVentas.findIndex((venta) => venta.producto.id === Producto.id);

        if (index !== -1) {

            if (isEliminacion) {
                console.clear()
                console.log(nuevaListaVentas[index].subprecio)
                nuevoPrecio = totalPago - nuevaListaVentas[index].subprecio;
                if (nuevoPrecio < 0) {
                    nuevoPrecio = 0;
                }
                const nuevaListaDetallesEliminados = [
                    ...listaDetallesEliminados,
                    nuevaListaVentas[index].id
                ];
                setListaDetallesEliminados(nuevaListaDetallesEliminados);

                nuevaListaVentas.splice(index, 1); // Eliminar la venta de la lista
                if (nuevaListaVentas.length === 0) {
                    await EliminarFactura(factura.id);
                    window.location.reload();
                    return;
                }
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

            if (!isEliminacion) {
                const nuevaListaDetallesEliminados = [
                    ...listaDetallesEliminados,
                    nuevaListaVentas[index]
                ];
                setListaDetallesActulizados(nuevaListaDetallesEliminados);
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

        if (listaDetallesEliminados.length > 0) {
            let promesasVentas = listaDetallesEliminados.map(async (venta) => {
                return await EliminarDetalleFactura(venta);
            });
            await Promise.all(promesasVentas);
            setListaDetallesEliminados([]);
        }

        if (listaDetallesActulizados.length > 0) {
            let promesasVentas = listaDetallesActulizados.map(async (venta) => {
                return await ActualizarDetallesFactura(venta);
            });
            await Promise.all(promesasVentas);
            setListaDetallesActulizados([]);
        }

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
        showDetallesFactura(null);

    }

    const eliminarFactra = async (idFactura) => {
        setIsLoading(true)
        setMensajeEmergente("Eliminando factura.....")
        const respuesta = await EliminarFactura(idFactura);
        setIsLoading(false)
        showDetallesFactura(false)
        window.location.reload()
    }

    return (
        <div className="">
            {isLoading ? <Spinner size="lg" label="Cargando..." labelColor="primary"></Spinner> :
                (
                    <div className="flex justify-between">
                        <Card className="min-w-[600px] min-h-[700px] p-2">
                            <CardHeader className="flex justify-between">
                                <h2 className="text-2xl font-bold">
                                    Detalles Factura
                                </h2>
                                <Chip color="primary" endContent={<CalendarCheck></CalendarCheck>}
                                    className="text-lg p-2"
                                >
                                    {fecha}
                                </Chip>
                            </CardHeader>

                            <CardBody>
                                <div className="flex justify-between">
                                    {Object.entries(cliente).map(([key, value]) => (
                                        <div key={key} className="flex items-center">
                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                            <p className="ml-2">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <TableFactura listaFacturas={ListaProductosVendidos}
                                    showActualizarVenta={handelShowActualizarVenta}
                                >
                                </TableFactura>
                                <div className="w-full flex justify-end p-2">
                                    <Chip color="success" className="text-xl text-white"
                                        endContent={<CircleDollarSignIcon></CircleDollarSignIcon>}
                                    >
                                        {`Total: ${totalPago}`}
                                    </Chip>
                                </div>

                            </CardBody>

                            <CardFooter>
                                <div className="w-full flex justify-between  ">
                                    <div className="w-1/2  flex flex-col justify-between ">
                                        <Button
                                            className="bg-slate-400 font-bold text-white m-2"
                                            onClick={() => showDetallesFactura(null)}
                                        >
                                            CANCELAR
                                        </Button>
                                        <Button
                                            color="success"
                                            className=" font-bold text-white m-2 "
                                            onClick={() => GuardarCambios(ListaProductosVendidos)}
                                        >
                                            CONFIRMAR ACTUALIZACION
                                        </Button>

                                    </div>

                                    <div className="w-1/2 flex flex-col justify-between">
                                        <Button
                                            color="primary"
                                            className=" font-bold text-white m-2"
                                            onClick={() => handelShowAgregarProducto(true)}
                                        >
                                            AGREGAR VENTA
                                        </Button>

                                        <Button
                                            color="danger"
                                            className="font-bold text-white m-2"
                                            onClick={() => eliminarFactra(factura.id)}
                                        >
                                            ELIMINAR
                                        </Button>
                                    </div>

                                </div>
                            </CardFooter>
                        </Card>
                        {showActualizarVenta && (
                            <div className="min-h-[700px]">
                                <TarjetaActualizarVenta
                                    productActualizar={productoActualizar}
                                    ActualizarVenta={actualizarOEliminarVenta}
                                    CancelarActualizacionVenta={handelShowActualizarVenta}
                                    EliminarVenta={actualizarOEliminarVenta}
                                ></TarjetaActualizarVenta>
                            </div>

                        )}
                        {showAgregarVenta && (
                            <TarjetaVenta AgregarVenta={AgregarVenta} ListaProductosVendidos={ListaProductosVendidos}></TarjetaVenta>
                        )}
                    </div>
                    

                    
                )
            }
        </div>


    );
};

const ConsultarFactura = ({ listaFacturas, consultarFactura }) => {
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(getFechaActual());
    const [filtroPorMesAnio, setFiltroPorMesAnio] = useState(true);
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);

    function getFechaActual() {
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaActual.getFullYear();
        return `${año}-${mes}-${dia}`;
    }

    useEffect(() => {
        // Limpieza de factura seleccionada cuando cambia la lista de facturas filtradas
        setFacturaSeleccionada(null);
    }, [facturasFiltradas]);

    const handleFacturaClick = (factura) => {
        setFacturaSeleccionada(factura);
    };

    const handleFechaSeleccionada = (event) => {
        setFechaSeleccionada(event.target.value);
    };

    const handleFiltrarPorMesAnio = () => {
        setFiltroPorMesAnio(true);
        setFechaSeleccionada(getFechaActual());
    };

    const handleFiltrarPorDiaMesAnio = () => {
        setFiltroPorMesAnio(false);
    };

    const filtrarPorFechaSeleccionada = (facturas) => {
        if (filtroPorMesAnio) {
            const [añoSeleccionado, mesSeleccionado] = fechaSeleccionada.split('-');
            return facturas.filter((factura) => {
                const fecha = new Date(factura.fecha);
                const añoFactura = fecha.getFullYear().toString();
                const mesFactura = (fecha.getMonth() + 1).toString().padStart(2, '0');
                return añoSeleccionado === añoFactura && mesSeleccionado === mesFactura;
            });
        } else {
            return facturas.filter((factura) => {
                const fecha = new Date(factura.fecha);
                const fechaSeleccionadaDate = new Date(fechaSeleccionada);
                return fecha.getFullYear() === fechaSeleccionadaDate.getFullYear() &&
                    fecha.getMonth() === fechaSeleccionadaDate.getMonth() &&
                    fecha.getDate() === fechaSeleccionadaDate.getDate();
            });
        }
    };

    // Actualizar la lista de facturas filtradas cuando cambian las condiciones de filtrado
    useEffect(() => {
        setFacturasFiltradas(filtrarPorFechaSeleccionada(listaFacturas));
    }, [listaFacturas, fechaSeleccionada, filtroPorMesAnio]);

    return (
        <div className="flex-grow">
            <div className="flex-grow flex justify-center w-full my-10">

                <Card className="w-[25%] min-h-[500px] bg-transparent shadow-none">
                    <CardHeader>
                        <h1 className="w-full text-3xl text-gold text-black font-bold text-center">Lista de Facturas</h1>
                    </CardHeader>

                    <CardBody className="flex items-center">
                        <div className="mt-4 mb-2">
                            <input type="date" id="fecha" name="fecha" value={fechaSeleccionada} onChange={handleFechaSeleccionada} className="rounded-lg border-2 border-gray-300 p-1 " />
                        </div>

                        <div className="flex justify-between w-full my-5 px-5">
                            <Button className={` ${filtroPorMesAnio ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                                onClick={handleFiltrarPorMesAnio}
                            >
                                Filtrar por Mes y Año
                            </Button>
                            <Button className={`${!filtroPorMesAnio ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                                onClick={handleFiltrarPorDiaMesAnio}
                            >
                                Filtrar por Día, Mes y Año
                            </Button>
                        </div>

                        {facturasFiltradas.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto max-w-full overflow-x-hidden">
                                {facturasFiltradas.map((factura) => (
                                    <FacturaBasica
                                        key={factura.id}
                                        factura={factura}
                                        onFacturaClick={handleFacturaClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="my-10 flex flex-col items-center justify-center">
                                <FolderXIcon size={50} color="red"></FolderXIcon>
                                <p className="text-lg text-red-500">No se encontraron facturas.</p>

                            </div>
                        )}
                    </CardBody>

                    <CardFooter>

                    </CardFooter>

                </Card>
                {facturaSeleccionada && (
                    <DetallesFactura factura={facturaSeleccionada} showDetallesFactura={handleFacturaClick}
                        consultarFactura={consultarFactura} />
                )}
            </div>
        </div>
    );
};

const NoFacturasFound = () => {
    return (
        <div className="flex flex-col items-center w-[500px] h-[600px] pt-14">
            <img src="https://freepngtransparent.com/wp-content/uploads/2023/03/X-Png-138.png" alt="No products found" className="w-48 h-48 mb-8" />
            <h2 className="text-2xl font-semibold text-gray-800">No hay facturas encontradas</h2>
        </div>
    );
};


const datos = () => {
    return (
        <div className="flex m-5">

            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 ">


                <div className="flex items-end">
                    <strong>Fecha:</strong>
                    <p className="ml-2">{fecha}</p>
                </div>
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

                                ${totalPago}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-between pt-3 mt-3 ">
                    <div className="w-1/2  flex flex-col justify-between ">
                        <button
                            className="bg-slate-400 font-bold text-white hover:bg-slate-700 rounded-lg mx-2 p-2 mb-2"
                            onClick={() => showDetallesFactura(null)}
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
                <div>
                    <TarjetaActualizarVenta
                        productActualizar={productoActualizar}
                        ActualizarVenta={actualizarOEliminarVenta}
                        CancelarActualizacionVenta={handelShowActualizarVenta}
                        EliminarVenta={actualizarOEliminarVenta}
                    ></TarjetaActualizarVenta>
                </div>

            )}
            {showAgregarVenta && (
                <TarjetaVenta AgregarVenta={AgregarVenta} ListaProductosVendidos={ListaProductosVendidos}></TarjetaVenta>
            )}


        </div>
    );
}



const VistaPrueba = ({ listaFacturas, isLoading, setFactura }) => {
    console.log(listaFacturas);
    const listaGrilla = listaFacturas.map(factura => {
        return {
            id: factura.id,
            fecha: factura.fecha,
            cliente: factura.cliente.nombre,
            total: factura.preciototal
        }
    })

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 14;

    const pages = Math.ceil(listaGrilla.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return listaGrilla.slice(start, end);
    }, [page, listaGrilla],
    );

    return (
        <div className="bg-white min-h-full mt-5">
            <h1 className="text-xl font-bold text-center w-full">Lista Facturas</h1>

            <DateRangePicker size="md" variant="flat" color="primary"
                className="p-10"
            ></DateRangePicker>

            <Table color="primary" selectionMode="single" selectionBehavior={"toggle"} onRowAction={(key) => setFactura(listaFacturas.find(item => item.id == key))}

                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key={"cliente"}>Cliente</TableColumn>
                    <TableColumn key={"fecha"}>Fecha</TableColumn>
                    <TableColumn key={"total"}>Total</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay factura en esta fecha"}
                    isLoading={isLoading}
                    loadingContent={<Spinner color="primary" labelColor="primary" label="Cargando..." />}
                >
                    {items.map((item) =>
                        <TableRow key={item.id} >
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>




        </div>
    );
}





const TableFactura = ({ listaFacturas: listaDetalles, showActualizarVenta }) => {
    console.log(listaDetalles);
    const listaGrilla = listaDetalles.map(detalles => {
        return {
            id: detalles.id,
            nombre: detalles.producto.name,
            cantidad: detalles.cantidadvendida,
            precio: detalles.producto.price,
            subTotal: detalles.subprecio
        }
    })

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 6;

    const pages = Math.ceil(listaGrilla.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return listaGrilla.slice(start, end);
    }, [page, listaGrilla],
    );

    return (
        <div className="bg-white mt-5">
            <h1 className="text-xl font-bold text-center w-full">Lista Facturas</h1>

            <Table color="primary" selectionMode="single" selectionBehavior={"toggle"} onRowAction={(key) => 
                showActualizarVenta(true, listaDetalles.find(item => item.id == key).producto ) }
                bottomContent={
                    <div className="flex w-full justify-center my-5">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key={"nombre"}>Nombre</TableColumn>
                    <TableColumn key={"cantidad"}>Cantida</TableColumn>
                    <TableColumn key={"precio"}>Precio</TableColumn>
                    <TableColumn key={"subTotal"}>SubTotal</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay factura en esta fecha"}
                    
                >
                    {items.map((item) =>
                        <TableRow key={item.id} >
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>




        </div>
    );
}


