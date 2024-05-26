import React, { useEffect, useState } from 'react';
import Header from './Header';
import { getPedidos } from '../Base/BdPedido';
import { consultarDetallesFactura } from '../Base/BdFactura';
import { BuscarImagenDefault } from '../Logic/Defaultimage';
import IconoTienda from "../Icons/IconoTienda.png";
import IconoRepartidor from "../Icons/IconoRepartidor.png";
import LoadingModerno from "../Photo/loadinModerno.gif";
import fondo from "../Photo/fondo.png";
import SignoPregunta from "../Photo/SignoPregunta.png";
import { GetTiendaVirtualUsernameDetail } from '../Base/BdtiendaVirtual';
import TiendaFormulario from './formularioTienda';

import { SkeletonPedidosSection, SkeletonTiendaInfo } from './Loading/Skeleton';

const TiendaPage = () => {
    const [storeData, setStoreData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    //REGUISTRAR UNA TIENDA
    const [showReguistrarTienda, setShowReguistrarTienda] = useState(false);
    const [showFormularioTienda, setShowFormularioTienda] = useState(false);

    const handelshowReguistrarTienda = (mostrar) => {
        setShowReguistrarTienda(mostrar)
    }

    const handelShowFormularioTienda = (mostrar) => {
        setShowFormularioTienda(mostrar)
    }

    //Loading
    const [isLoading, setIsLoading] = useState(false);

    const handelIsLoading = (estado) => {
        setIsLoading(estado);
    }

    useEffect(() => {
        async function getData() {
            handelIsLoading(true)
            const respuesta = await fetchData();
            if (respuesta != null) {
                const { tiendaData, pedidosData } = respuesta;
                setStoreData(tiendaData);
                setOrders(pedidosData ? pedidosData : null);
            } else {
                setShowReguistrarTienda(true)
            }
            handelIsLoading(false)
        }
        getData();
    }, []);



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


    return (
        <div className='bg-[#F5F5F5] min-h-screen' >
           
            <Header
                link="/paginaPrincipal"
                logoRightSrc="ruta-a-la-imagen-derecha.jpg"
                logoAlt="FruityFolio logo"
                title="¡Bienvenido a FruityFolio!"
                subtitle={`Administra tu tienda virtual y pedidos`}
            />
            {showFormularioTienda && <TiendaFormulario handelshowReguistrarTienda={handelShowFormularioTienda}></TiendaFormulario>}
            {
                showReguistrarTienda ? (
                    
                    <div className="flex w-screen justify-center items-center overflow-hidden my-10">
                        <div className="flex flex-col items-center">
                            <h2 className="font-bold text-center text-4xl my-2">¿No tienes tienda?</h2>
                            <img className="w-80" src={SignoPregunta} alt="Signo Pregunta" />
                            <button
                                className="bg-green-400 hover:bg-green-600 w-30 p-2 rounded-md my-2"
                                onClick={() => handelShowFormularioTienda(true)}
                            >
                                <p className="text-white font-bold">CREA UNA</p>
                            </button>
                        </div>
                    </div>

                )
                    :
                    (
                        //Contenedor de informacion general 
                        <div className="container p-4 flex justify-center text-lg" >
                            <div className="w-1/3 flex justify-center">
                                {isLoading ? (
                                    <SkeletonTiendaInfo></SkeletonTiendaInfo>
                                ) : (
                                    <TiendaInfo storeData={storeData} />
                                )}
                            </div>
                            <div className="flex-grow ml-4">
                                {isLoading ? (
                                    <SkeletonPedidosSection></SkeletonPedidosSection>
                                ) : (
                                        orders ? (<PedidosSection
                                            orders={orders}
                                            toggleOrderDetails={toggleOrderDetails}
                                            selectedOrder={selectedOrder}
                                            orderDetails={orderDetails}
                                        />
                                        )
                                        :
                                        (
                                            <div className='flex flex-col justify-center items-center'>
                                                <h1 className='text-center text-2xl font-bold'>No hay pedidos pendientes</h1>
                                                    <img className='w-1/2' src="https://images.vexels.com/media/users/3/199917/isolated/preview/bb4a24c88a1633c7fb4bae097e5e7172-caja-vacia-isometrica.png" alt="" />
                                            </div>
                                        ) 
                                    
                                )}
                            </div>
                        </div>
                    )
            }
            

        </div>
    );
};

const TiendaInfo = ({ storeData }) => {
    return (
        <div className="w-96 h-[420px] bg-white p-4 rounded-lg shadow-md my-10">
            {storeData && (
                <div>
                    <h2 className='font-bold text-center'>Reporte del dia</h2>
                    <img src={IconoTienda} alt="Logo de la tienda" className="w-40 h-40 object-cover mb-4 mx-auto my-5" />
                    <h3 className="text-xl font-bold text-center mb-2">{storeData.tienda.nombre}</h3>
                    <p className="font-bold text-center mb-2">Pedidos atendido: <span className="font-semibold">{storeData.totalPedidos}</span></p>
                    <p className="font-bold text-center mb-2">Cobro Total: <span className="font-semibold">{storeData.sumaTotalCobros}$</span></p>
                    <p className="font-bold text-center mb-2">{storeData.tienda.direccion}</p>

                </div>
            )}
        </div>
    );
};

const PedidosSection = ({ orders, toggleOrderDetails, selectedOrder, orderDetails }) => {
    return (
        <div className=" mx-4">
            <h2 className="text-xl font-bold mb-4">Pedidos pendientes</h2>
            {orders.map((order) => (
                <div key={order.id} className="flex mb-4">
                    <PedidoCard order={order} toggleOrderDetails={toggleOrderDetails} selectedOrder={selectedOrder} orderDetails={orderDetails} />
                    {selectedOrder === order.id && orderDetails[order.id] && (
                        <EnvioSection orderId={order.id} />
                    )}
                </div>
            ))}
        </div>
    );
};

const PedidoCard = ({ order, toggleOrderDetails, selectedOrder, orderDetails }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleOrderDetails = async () => {
        setIsLoading(true);
        await toggleOrderDetails(order.id, order.factura.id);
        setIsLoading(false);
    };

    return (
        <div className="w-2/3 p-4 mr-5 bg-white border-gray-200 rounded shadow-md">
            <div className="p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={handleToggleOrderDetails}>
                    <div>
                        <p className="font-bold">{order.factura.fecha}</p>
                        <p className="font-bold">Cliente: <span className="text-gray-600 font-semibold">{order.factura.cliente.nombre}</span></p>
                        <p className="font-bold">Total: <span className="text-gray-600 font-semibold">{order.factura.preciototal}$</span></p>
                        <p className="font-bold">Dirección: <span className="text-gray-600 font-semibold">{order.clienteUsuario.direccionResidencia}</span></p>
                    </div>
                    <div className='mb-[5px]'>
                        <div className='bg-gray-300 rounded-full ml-5 mb-10 w-[120px] p-1'>
                            <p className='text-black text-center'>{order.estado}</p>
                        </div>
                        <button
                            className={`ml-5 px-3 py-1 rounded transition-colors w-[120px] ${selectedOrder === order.id ? ' bg-gray-500 text-white' : 'bg-blue-500 text-white'}`}
                            onClick={(e) => { e.stopPropagation(); handleToggleOrderDetails(); }}>
                            {selectedOrder === order.id ? 'Recoger' : 'Ver Detalles'}
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <img src={LoadingModerno} alt="Cargando..." className="" />
                    </div>
                ) : (
                    <div>
                        {selectedOrder === order.id && (
                            <div className="mt-4">
                                <h3 className="text-lg font-bold mb-2 text-center">Productos del Pedido</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {orderDetails[order.id].map((venta) => (
                                        <div key={venta.id} className="bg-gradient-to-b from-white to-blue-100 shadow-lg p-4 rounded-lg flex items-center">
                                            <img src={BuscarImagenDefault(venta.producto.img)} alt={venta.producto.name} className="w-24 h-24 object-cover mr-4" />
                                            <div>
                                                <p className="font-bold">{venta.producto.name}</p>
                                                <p className='font-bold'>{venta.cantidadvendida} KG</p>
                                                <p className='font-bold'>{venta.subprecio} $</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EnvioSection = ({ orderId }) => {
    const [envioPrice, setEnvioPrice] = useState(null);

    const handleEnviarPedido = () => {
        console.log("Pedido", orderId, "enviado con precio de envío:", envioPrice);
    };

    return (
        <div className="max-h-[400px] w-80 bg-white shadow-lg  flex flex-col items-center justify-between p-5">
            <p className='font-bold text-center'>Asignar Precio de Envío</p>
            <img src={IconoRepartidor} alt="Envío" className="w-48" />
            <div className="flex items-center justify-center space-x-4">
                <input
                    type="number"
                    className="w-24 h-10 border-gray-300 border rounded-lg px-2 py-1 text-center"
                    placeholder="Precio"
                    value={envioPrice}
                    onChange={(e) => setEnvioPrice(e.target.value)}
                />
                <button className="w-35 h-10 bg-green-400 hover:bg-green-600 text-white text-sm px-4 py-2 rounded" 
                onClick={handleEnviarPedido}>
                    Confirmar Envío
                </button>
            </div>
        </div>
    );
};

async function fetchData() {
    const tiendaData = await fetchStoreData();
    console.log(tiendaData)
    if (tiendaData != null) {
        const pedidosData = await fetchOrders(tiendaData.tienda.id);
        return { tiendaData, pedidosData };
    }
    return null;
}

async function fetchStoreData() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const fecha = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
    const estado = 'pendiente';
    const response = await GetTiendaVirtualUsernameDetail(usuario.username, fecha, estado);
    return response.datos;
}

async function fetchOrders(idtienda) {
    //TODO: PONER PENDIENTE
    const respuesta = await getPedidos(idtienda,"Pendiente");
    if(respuesta){
        const listaPedidos = respuesta.data;
        return listaPedidos;

    }
    return null;
}

export default TiendaPage;
