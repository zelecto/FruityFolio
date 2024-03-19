import React, { useState } from "react";
import Header from "./Header";
import { TarjetaActualizarVenta, TarjetaVenta } from "./Facturadora";


function GestorVentasView() {
    const listaFacturas = [
        {
            id: "1",
            numero: "1001",
            fecha: "2024-03-17",
            cliente: {
                nombre: "Juan Perez",
                cedula: "1234567890",
                correo: "juan@example.com",
            },
            productos: [
                {
                    id: 1,
                    name: "fruta y mas fruta",
                    description:
                        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
                    img: "Granadillas",
                    stock: 5000,
                    price: 2000000,
                    cantidad: 2,
                    total: 4000000,
                },
                {
                    id: 2,
                    name: "Producto 2",
                    description: "Descripción del Producto 2",
                    img: "Granadillas",
                    stock: 5000,
                    price: 200,
                    cantidad: 1,
                    total: 200,
                },
                {
                    id: 3,
                    name: "Producto 3",
                    description: "Descripción del Producto 3",
                    img: "Granadillas",
                    stock: 5000,
                    price: 300,
                    cantidad: 1,
                    total: 300,
                },
            ],
            total: 4020000,
        },
        {
            id: "1",
            numero: "1001",
            fecha: "2024-03-17",
            cliente: {
                nombre: "Juan Perez",
                cedula: "1234567890",
                correo: "juan@example.com",
            },
            productos: [
                {
                    id: 1,
                    name: "fruta y mas fruta",
                    description:
                        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
                    img: "Granadillas",
                    stock: 5000,
                    price: 2000000,
                    cantidad: 2,
                    total: 4000000,
                },
                {
                    id: 2,
                    name: "Producto 2",
                    description: "Descripción del Producto 2",
                    img: "Granadillas",
                    stock: 5000,
                    price: 200,
                    cantidad: 1,
                    total: 200,
                },
                {
                    id: 3,
                    name: "Producto 3",
                    description: "Descripción del Producto 3",
                    img: "Granadillas",
                    stock: 5000,
                    price: 300,
                    cantidad: 1,
                    total: 300,
                },
            ],
            total: 4020000,
        },
        {
            id: "1",
            numero: "1001",
            fecha: "2024-03-17",
            cliente: {
                nombre: "Juan Perez",
                cedula: "1234567890",
                correo: "juan@example.com",
            },
            productos: [
                {
                    id: 1,
                    name: "fruta y mas fruta",
                    description:
                        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
                    img: "Granadillas",
                    stock: 5000,
                    price: 2000000,
                    cantidad: 2,
                    total: 4000000,
                },
                {
                    id: 2,
                    name: "Producto 2",
                    description: "Descripción del Producto 2",
                    img: "Granadillas",
                    stock: 5000,
                    price: 200,
                    cantidad: 1,
                    total: 200,
                },
                {
                    id: 3,
                    name: "Producto 3",
                    description: "Descripción del Producto 3",
                    img: "Granadillas",
                    stock: 5000,
                    price: 300,
                    cantidad: 1,
                    total: 300,
                },
            ],
            total: 4020000,
        },
        {
            id: "1",
            numero: "1001",
            fecha: "2024-03-17",
            cliente: {
                nombre: "Juan Perez",
                cedula: "1234567890",
                correo: "juan@example.com",
            },
            productos: [
                {
                    id: 1,
                    name: "fruta y mas fruta",
                    description:
                        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
                    img: "Granadillas",
                    stock: 5000,
                    price: 2000000,
                    cantidad: 2,
                    total: 4000000,
                },
                {
                    id: 2,
                    name: "Producto 2",
                    description: "Descripción del Producto 2",
                    img: "Granadillas",
                    stock: 5000,
                    price: 200,
                    cantidad: 1,
                    total: 200,
                },
                {
                    id: 3,
                    name: "Producto 3",
                    description: "Descripción del Producto 3",
                    img: "Granadillas",
                    stock: 5000,
                    price: 300,
                    cantidad: 1,
                    total: 300,
                },
            ],
            total: 4020000,
        },
        {
            id: "1",
            numero: "1001",
            fecha: "2024-03-17",
            cliente: {
                nombre: "Juan Perez",
                cedula: "1234567890",
                correo: "juan@example.com",
            },
            productos: [
                {
                    id: 1,
                    name: "fruta y mas fruta",
                    description:
                        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
                    img: "Granadillas",
                    stock: 5000,
                    price: 2000000,
                    cantidad: 2,
                    total: 4000000,
                },
                {
                    id: 2,
                    name: "Producto 2",
                    description: "Descripción del Producto 2",
                    img: "Granadillas",
                    stock: 5000,
                    price: 200,
                    cantidad: 1,
                    total: 200,
                },
                {
                    id: 3,
                    name: "Producto 3",
                    description: "Descripción del Producto 3",
                    img: "Granadillas",
                    stock: 5000,
                    price: 300,
                    cantidad: 1,
                    total: 300,
                },
            ],
            total: 4020000,
        },
    ];

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
                <ConsultarFactura listaFacturas={listaFacturas}></ConsultarFactura>
            </div>
        </div>
    );
}

export default GestorVentasView;

const FacturaBasica = ({ factura, onFacturaClick }) => {
    const { numero, fecha, cliente, total } = factura;

    const handleClick = () => {
        onFacturaClick(factura);
    };

    return (
        <div
            className="factura-basica cursor-pointer w-[400px] m-5 hover:bg-slate-300 p-2 rounded-lg"
            onClick={handleClick}
        >
            <div className="flex justify-between items-center">
                <h3>Factura #{numero}</h3>
                <p>Fecha: {fecha}</p>
            </div>
            <div className="bg-white rounded-lg p-5 flex justify-between items-center">
                <p>Cliente: {cliente.nombre}</p>
                <p>Total: ${total}</p>
            </div>
        </div>
    );
};

const DetallesFactura = ({ factura, showDetallesFactura }) => {
    const { numero, fecha, cliente, productos, total } = factura;
    const [ListaProductosVendidos, setListaProductosVendidos] =
        useState(productos);

    const [totalPago, setTotalPago] = useState(null);
    const [showActualizarVenta, setShowActualizarProducto] = useState(false);
    const [showAgregarVenta, setShowAgregarVenta] = useState(false);
    
    const [productoActualizar, setProductoActualizar] = useState(null);
    
    const handelShowAgregarProducto = (mostrar) => {
        console.clear()
        console.log(factura)
        setShowAgregarVenta(mostrar);
        
    };
    const AgregarVenta = (Producto, Cantida, Total) => {
        // Crea una nueva copia del array listVentas y agrega el nuevo objeto de venta
        const nuevaListaVentas = [
            ...ListaProductosVendidos,
            {
                producto: Producto,
                cantidad: Cantida,
                total: Total,
            },
        ];

        const nuevoPrecio = totalPago + Total;

        // Actualiza el estado de totalPago con el nuevo valor
        setTotalPago(nuevoPrecio);

        // Actualiza el estado listVentas con la nueva lista
        setListaProductosVendidos(nuevaListaVentas);
    };

    const handelShowActualizarVenta = (mostrar, producto) => {
        setShowActualizarProducto(mostrar);
        setProductoActualizar(producto);
    };

    const ActualizarVenta = (Producto, Cantidad, Total) => {
        // Crea una copia de la lista de ventas
        const nuevaListaVentas = [...ListaProductosVendidos];
        console.log(productoActualizar);
        console.log("Lista de productos a actualizar");
        console.log(ListaProductosVendidos);

        // Encuentra la posición del objeto de venta que deseas actualizar
        const index = nuevaListaVentas.findIndex(
            (venta) => venta.id === Producto.id
        );

        if (index !== -1) {
            // Si se encuentra el objeto en la lista
            // Actualiza el objeto de venta en la lista con los nuevos valores
            nuevaListaVentas[index] = {
                ...nuevaListaVentas[index],
                cantidad: Cantidad,
                total: Total,
            };

            // Calcula el nuevo totalPago sumando el total de todas las ventas en la lista
            const nuevoPrecio = nuevaListaVentas.reduce(
                (acumulador, venta) => acumulador + venta.total,
                0
            );

            // Actualiza el estado totalPago con el nuevo valor

            // Actualiza el estado listVentas con la nueva lista actualizada
            setTotalPago(nuevoPrecio);
            setListaProductosVendidos(nuevaListaVentas);
        } else {
            console.error("Venta no encontrada en la lista.");
        }
        handelShowActualizarVenta(false, null);
    };

    const EliminarVenta = (ProductoId) => {
        // Copia la lista de ventas actual
        const nuevaListaVentas = [...ListaProductosVendidos];

        // Encuentra el índice del objeto de venta que deseas eliminar
        const index = nuevaListaVentas.findIndex(
            (venta) => venta.id === ProductoId
        );

        if (index !== -1) {
            // Elimina el objeto de la lista
            nuevaListaVentas.splice(index, 1);

            // Actualiza el estado de listVentas con la lista actualizada
            setListaProductosVendidos(nuevaListaVentas);
            const nuevoPrecio = nuevaListaVentas.reduce(
                (acumulador, venta) => acumulador + venta.total,
                0
            );

            setTotalPago(nuevoPrecio);
        } else {
            console.error("Venta no encontrada en la lista.");
        }
        handelShowActualizarVenta(false, null);
    };

    return (
        <div className="flex my-5">
            <div className="detalles-factura flex flex-col items-center bg-[#CCE6FF] rounded-lg shadow-md p-6 w-[600px]">
                <h2 className="text-3xl font-bold mb-4 p-4">
                    Detalles de la factura #{numero}
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
                                    {ListaProductosVendidos.map((producto, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-row justify-between border-t border-black p-4 hover:bg-slate-300 cursor-pointer"
                                            onClick={() => handelShowActualizarVenta(true, producto)}
                                        >
                                            <p className="w-1/4 text-center border-black pl-4">
                                                {producto.name}
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                {producto.cantidad} kg
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                ${producto.price}
                                            </p>
                                            <p className="w-1/4 text-center border-l border-black pl-4">
                                                ${producto.total}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-4 px-10 items-center">
                            <p className="w-1/4 text-center text-lg font-bold">Total :</p>
                            <p className="w-1/4 text-center text-lg font-bold pl-4">
                                ${totalPago ? totalPago : total}
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
                        //onClick={() => }
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
                        //onClick={() => EliminarVenta(productActualizar.id)}
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
                    ActualizarVenta={ActualizarVenta}
                    CancelarActualizacionVenta={handelShowActualizarVenta}
                    EliminarVenta={EliminarVenta}
                ></TarjetaActualizarVenta>
            )}
            {showAgregarVenta && (
                <TarjetaVenta AgregarVenta={AgregarVenta} ListaProductosVendidos={factura}></TarjetaVenta>
            )}


        </div>
    );
};

const ConsultarFactura = ({ listaFacturas }) => {
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    const handleFacturaClick = (factura) => {
        setFacturaSeleccionada(factura);
    };

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
                    <DetallesFactura factura={facturaSeleccionada} showDetallesFactura={handleFacturaClick}  />
                )}
            </div>
        </div>
    );
};
