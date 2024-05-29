import { Divider, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import HeaderClient from "./HederClient";
import { BaggageClaim, CircleCheck, PackageCheckIcon, TimerIcon } from "lucide-react";
import { PedidosSection } from "../GestionPedido";
import React, { useEffect, useState } from "react";
import { getPedidosClient } from "../../Base/BdPedido";
import SkeletonPedidosSection from "../Loading/Skeleton";
import { consultarDetallesFactura } from "../../Base/BdFactura";


export const CarritoViewClient=()=>{
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});


    //Loading
    const [isLoading, setIsLoading] = useState(false);

    const handelIsLoading = (estado) => {
        setIsLoading(estado);
    }
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

    const opcionMenu = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    useEffect(() => {
        async function getData() {
            handelIsLoading(true)
            const respuesta = await fetchOrders(opcionMenu);
            if (respuesta != null) {
                console.log(respuesta);
                setOrders(respuesta);
            } 
            handelIsLoading(false)
        }
        getData();
    }, [opcionMenu]);

    const handelOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }
    useEffect(() => {

    }, [orders])

    const toggleOrderDetails = async (orderId, facturaId) => {
        if (selectedOrder === orderId) {
            setSelectedOrder(null);
        } else {
            // Cargar los detalles del pedido si no están ya cargados
            if (!orderDetails[orderId]) {
                const { datos, error } = await consultarDetallesFactura(facturaId);
                if (datos) {
                    setOrderDetails(prevDetails => ({
                        ...prevDetails,
                        [orderId]: datos
                    }));
                } else {
                    console.error('Error al cargar los detalles del pedido:', error);
                }
            }
            setSelectedOrder(orderId);
        }
    };

    return(
        <div className="bg-[#F5F5F5] min-w-screen min-h-screen overflow-x-hidden flex flex-col">
            <HeaderClient />
            <div className="flex-grow flex">
                <div className="w-1/6 flex flex-col bg-white  shadow-lg py-2">
                    <h1 className="text-lg font-bold text-center">Revisa el estado de tus pedidos</h1>
                    <Divider ></Divider>
                    <Listbox
                        disallowEmptySelection
                        selectionMode="single"
                        color="primary"
                        variant="flat"
                        className="p-4"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <ListboxItem
                            key={"Pendiente"}
                            description="Pedidos que aún no han sido entregados"
                            startContent={<TimerIcon />}
                        >
                            Pendientes
                        </ListboxItem>

                        <ListboxItem
                            key={"Enviado"}
                            description="Pedidos en camino"
                            startContent={<BaggageClaim />}
                            className="my-2"
                        >
                            En Camino
                        </ListboxItem>

                        <ListboxItem
                            key={"Entregado"}
                            description="Pedidos entregados exitosamente"
                            startContent={<PackageCheckIcon />}
                            className="my-2"
                        >
                            Entregados
                        </ListboxItem>

                        <ListboxItem
                            key={"Todos"}
                            description="Todos los pedidos realizados"
                            startContent={<PackageCheckIcon />}
                            className="my-2"
                        >
                            Todos
                        </ListboxItem>


                    </Listbox>
                </div>
                
                <div className="w-3/4 p-5">
                    {isLoading ? (
                        <SkeletonPedidosSection />
                    ) : orders && orders.length > 0 ? (
                        <div className="flex-grow">
                            <PedidosSection
                                orders={orders}
                                toggleOrderDetails={toggleOrderDetails}
                                selectedOrder={selectedOrder}
                                orderDetails={orderDetails}
                                handelOrder={handelOrder}
                                vista={"cliente"}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col justify-center items-center">
                            <h1 className="text-center text-2xl font-bold">No hay pedidos</h1>
                            <img className="w-1/3" src="https://images.vexels.com/media/users/3/199917/isolated/preview/bb4a24c88a1633c7fb4bae097e5e7172-caja-vacia-isometrica.png" alt="No hay pedidos" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


async function fetchOrders(estado) {
    const usuario = JSON.parse(localStorage.getItem('user'));
    console.log(usuario)
    if (estado === "Todos") {
        estado = null;
    }
    const respuesta = await getPedidosClient(usuario.username, estado);
    if (respuesta.data) {
        let listaPedidos = respuesta.data;

        // Ordenar la lista de pedidos por estado: "Pendiente", "Enviado", "Entregado"
        listaPedidos.sort((a, b) => {
            if (a.estado === "Pendiente" && (b.estado === "Enviado" || b.estado === "Entregado")) {
                return -1;
            } else if (a.estado === "Enviado" && b.estado === "Entregado") {
                return -1;
            } else if (a.estado === "Entregado" || (b.estado === "Pendiente" || b.estado === "Enviado")) {
                return 1;
            }
            return 0;
        });

        return listaPedidos;
    }
    return null;
}

