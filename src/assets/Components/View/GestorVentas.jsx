import React, { useEffect, useState } from "react";
import Header from "./Header";
import { TarjetaActualizarVenta, TarjetaVenta } from "./Facturadora";
import { ActualizarDetallesFactura, ActualizarFactura, EliminarDetalleFactura, EliminarFactura, consultarDetallesFactura, consultarFactura, guardarVentas } from "../Base/BdFactura";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, DateRangePicker, Pagination, Spinner, Tooltip, getKeyValue } from "@nextui-org/react";
import { CalendarCheck, CircleDollarSignIcon } from "lucide-react";
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

                <div className="flex-grow min-h-full flex justify-center items-center">
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
        <div className="w-full">
            {isLoading ? <Spinner size="lg" label="Cargando..." labelColor="primary" className="w-full"></Spinner> :
                (
                    <div className="flex-grow px-10 flex justify-center">
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
                            <div className="w-1/3">
                                <TarjetaActualizarVenta
                                    productActualizar={productoActualizar}
                                    ActualizarVenta={actualizarOEliminarVenta}
                                    CancelarActualizacionVenta={handelShowActualizarVenta}
                                    EliminarVenta={actualizarOEliminarVenta}
                                ></TarjetaActualizarVenta>
                            </div>

                        )}
                        {showAgregarVenta && (
                            <div className="">
                                <TarjetaVenta AgregarVenta={AgregarVenta} ListaProductosVendidos={ListaProductosVendidos}></TarjetaVenta>
                            </div>
                        )}
                    </div>
                    

                    
                )
            }
        </div>


    );
};


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


export const TableFactura = ({ listaFacturas: listaDetalles, showActualizarVenta }) => {
    console.log(listaDetalles,"Table");
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
            

            <Table  color="primary" selectionMode="single" selectionBehavior={"toggle"} 
                onRowAction={(key) => showActualizarVenta(true, listaDetalles.find(item => item.id == key).producto) }
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
                    wrapper: "min-h-[300px]",
                }}
            >
                <TableHeader >
                    <TableColumn className="text-lg" key={"nombre"}>Nombre</TableColumn>
                    <TableColumn className="text-lg" key={"cantidad"}>Cantida</TableColumn>
                    <TableColumn className="text-lg" key={"precio"}>Precio</TableColumn>
                    <TableColumn className="text-lg" key={"subTotal"}>SubTotal</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay ventas"} 
                    
                >
                    {items.map((item) =>
                        <TableRow key={item.id} >
                            {(columnKey) => <TableCell className="text-lg" >{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>




        </div>
    );
}


