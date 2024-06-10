import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import { ActualizarEstadoYPrecioEnvio, EliminarPedido, getPedidos } from '../../../Base/BdPedido';
import { consultarDetallesFactura } from '../../../Base/BdFactura';
import { BuscarImagenDefault } from '../../../Logic/Defaultimage';
import IconoTienda from "../../../Icons/IconoTienda.png";
import IconoRepartidor from "../../../Icons/IconoRepartidor.png";
import SignoPregunta from "../../../Photo/SignoPregunta.png";
import { GetTiendaVirtualUsernameDetail } from '../../../Base/BdtiendaVirtual';
import TiendaFormulario from './formularioTienda';
import { Select, SelectItem } from "@nextui-org/select";
import { SkeletonPedidosSection, SkeletonTiendaInfo } from '../../Loading/Skeleton';
import { BaggageClaim, Ban,  CircleDollarSignIcon,  Loader, PackageCheck, Trash2 } from 'lucide-react';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Input, Tooltip } from '@nextui-org/react';
import PropTypes from "prop-types";
const TiendaPage = () => {
    const [storeData, setStoreData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    //REGUISTRAR UNA TIENDA
    const [showReguistrarTienda, setShowReguistrarTienda] = useState(false);
    const [showFormularioTienda, setShowFormularioTienda] = useState(false);

    const handelShowFormularioTienda = (mostrar) => {
        setShowFormularioTienda(mostrar)
    }

    //Loading
    const [isLoading, setIsLoading] = useState(false);

    const handelIsLoading = (estado) => {
        setIsLoading(estado);
    }
    const [estado, setEstado] = React.useState(new Set([]));
    //Mostrar secion de consulta

    useEffect(() => {
        async function getData() {
            handelIsLoading(true)
            const respuesta = await fetchData(estado.anchorKey);
            if (respuesta != null) {
                const { tiendaData, pedidosData } = respuesta;
                setStoreData(tiendaData);
                setOrders(pedidosData);
            } else {
                setShowReguistrarTienda(true)
            }
            handelIsLoading(false)
        }
        getData();
    }, [estado]);

    const handelOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }

    useEffect(()=>{

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

    return (
      <div className="bg-[#F5F5F5] min-w-screen min-h-screen overflow-x-hidden ">
        <Header
          link="/paginaPrincipal"
          logoRightSrc="ruta-a-la-imagen-derecha.jpg"
          logoAlt="FruityFolio logo"
          title="¡Bienvenido a FruityFolio!"
          subtitle={`Administra tu tienda virtual y pedidos`}
        />
        {showReguistrarTienda ? (
          <div className="flex w-screen justify-center items-center overflow-hidden my-10">
            <div className="flex flex-col items-center">
              <h2 className="font-bold text-center text-4xl my-2">
                ¿No tienes tienda?
              </h2>
              <img className="w-80" src={SignoPregunta} alt="Signo Pregunta" />
              <TiendaFormulario
                handelshowReguistrarTienda={handelShowFormularioTienda}
              ></TiendaFormulario>
            </div>
          </div>
        ) : (
          //Contenedor de informacion general
          <div className="flex flex-col items-center">
            <div className="w-80 my-5">
              <Select
                labelPlacement="inside"
                label="Filtra tus pedidos"
                size="lg"
                selectedKeys={estado}
                onSelectionChange={setEstado}
                color="primary"
                className=" text-xl font-semibold text-black"
              >
                <SelectItem key={"Sinfiltro"} startContent={<Ban></Ban>}>
                  Sin filtro
                </SelectItem>
                <SelectItem key={"Pendiente"} startContent={<Loader></Loader>}>
                  Pedidos pendiente
                </SelectItem>
                <SelectItem
                  key={"Enviado"}
                  startContent={<BaggageClaim></BaggageClaim>}
                >
                  Pedidos enviado
                </SelectItem>
                <SelectItem
                  key={"Entregado"}
                  startContent={<PackageCheck></PackageCheck>}
                >
                  Pedidos Entregado
                </SelectItem>
              </Select>
            </div>

            <div className="w-screen flex p-4 justify-between text-lg">
              <div className="w-[25%] flex justify-center">
                {isLoading ? (
                  <SkeletonTiendaInfo></SkeletonTiendaInfo>
                ) : (
                  <TiendaInfo storeData={storeData} />
                )}
              </div>
              <div className="flex-grow mx-4 w-4/5">
                {isLoading ? (
                  <SkeletonPedidosSection></SkeletonPedidosSection>
                ) : orders && orders.length > 0 ? (
                  <PedidosSection
                    orders={orders}
                    toggleOrderDetails={toggleOrderDetails}
                    selectedOrder={selectedOrder}
                    orderDetails={orderDetails}
                    handelOrder={handelOrder}
                    vista={"usuario"}
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center text-2xl font-bold">
                      No hay pedidos {estado}
                    </h1>
                    <img
                      className="w-1/2"
                      src="https://images.vexels.com/media/users/3/199917/isolated/preview/bb4a24c88a1633c7fb4bae097e5e7172-caja-vacia-isometrica.png"
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

const TiendaInfo = ({ storeData }) => {
    return (
        <Card className="w-96 h-[420px] mx-10 bg-white px-4 rounded-lg shadow-xl ">
            {storeData && (
                <CardBody>
                    <h2 className='font-bold text-center'>Reporte del dia</h2>
                    <img src={IconoTienda} alt="Logo de la tienda" className="w-40 h-40 object-cover mb-4 mx-auto my-5" />
                    <h3 className="text-xl font-bold text-center mb-2">{storeData.tienda.nombre}</h3>
                    <div className='font-bold text-center mb-2 flex flex-col items-center justify-center'>
                        <p className= "">Pedidos Entregados: <span className="font-semibold"> {storeData.totalPedidos}</span></p>
                        <p className="flex">Cobro Total:
                            <span className="font-semibold flex justify-center items-center mx-2">
                                {storeData.sumaTotalCobros} <CircleDollarSignIcon className='mx-2'></CircleDollarSignIcon>
                            </span></p>
                        <p className="font-bold text-center mb-2">{storeData.tienda.direccion}</p>
                    </div>
                </CardBody>
            )}
        </Card>
    );
};
TiendaInfo.propTypes = {
  storeData: PropTypes.shape({
    tienda: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
    }),
    totalPedidos: PropTypes.number.isRequired,
    sumaTotalCobros: PropTypes.number.isRequired,
  }),
};

export const PedidosSection = ({ orders, toggleOrderDetails, selectedOrder, orderDetails, handelOrder,vista }) => {

    return (
        <div className="w-full">
            {orders.map((order) => (
                <div key={order.id} className="flex  mb-4">
                    <PedidoCard order={order} toggleOrderDetails={toggleOrderDetails} selectedOrder={selectedOrder} orderDetails={orderDetails} removerOrden={handelOrder} vista={vista} />
                    {selectedOrder === order.id && orderDetails[order.id] && (
                        <EnvioSection orderId={order.id} estado={order.estado} precio={order.precioTransporte} handelOrder={handelOrder} vista={vista} />
                    )}
                </div>
            ))}
        </div>
    );
};



PedidosSection.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      
    })
  ).isRequired,
  toggleOrderDetails: PropTypes.func.isRequired,
  selectedOrder: PropTypes.number,
  orderDetails: PropTypes.object.isRequired,
  handelOrder: PropTypes.func.isRequired,
  vista: PropTypes.string.isRequired,
};


const PedidoCard = ({ order, toggleOrderDetails, selectedOrder, orderDetails, removerOrden,vista }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleToggleOrderDetails = async () => {
        setIsLoading(true);
        await toggleOrderDetails(order.id, order.factura.id);
        setIsLoading(false);
    };

    const selecionIcono = () => {
        switch (order.estado) {
            case "Pendiente":
                return <Loader></Loader>
                
            case "Enviado":
                return <BaggageClaim></BaggageClaim>
            case "Entregado":
                return <PackageCheck></PackageCheck>
               
        }
    }
    const AsignarColor = () => {
        switch (order.estado) {
            case "Pendiente":
                return "bg-slate-400"
                
            case "Enviado":
                return "bg-green-400"
            case "Entregado":
                return "bg-blue-400"
                
            
        }
    }

    const fechEliminar= async()=>{
        setIsLoading(true);
        await EliminarPedido(order.id);
        setIsLoading(false);
        removerOrden(order.id);
        
    }
    return (
        <Card className='w-2/3 p-5'>
            <CardHeader className='flex justify-between items-center p-0'>
                <p className="font-bold">{order.factura.fecha}</p>
                <div className='flex justify-center items-center'>
                    <Chip endContent={selecionIcono()}
                        className={`${AsignarColor()} text-white `}
                        variant="Flat"
                        size='lg'
                    ><p className='font-bold'>{order.estado}</p></Chip>
                    <Tooltip content={vista=="usuario"? "Eliminar" : "Cancelar" } color='danger'>
                        {
                            !isLoading ? (
                                <Button
                                    onClick={() => fechEliminar()}
                                    size='sm'
                                    className='mx-6'
                                    color='danger'
                                    isDisabled={vista=="cliente" &&  order.estado!="Pendiente" ? true:false}
                                >
                                    {<Trash2></Trash2>}
                                </Button>
                            ):(
                                    <Button
                                        onClick={() => fechEliminar()}
                                        size='sm'
                                        className='mx-6'
                                        color='danger'
                                        isLoading
                                    >
                                    </Button>
                            )
                        }
                        
                    </Tooltip>
                    
                </div>
                
            </CardHeader>
            <CardBody className='p-0' >

                <button className="flex w-full justify-between items-end cursor-pointer" onKeyUp={""} onClick={handleToggleOrderDetails}>
                    <div>
                        <p className="font-bold">Cliente: <span className="text-gray-600 font-semibold">{order.factura.cliente.nombre}</span></p>
                        <p className="font-bold">Total: <span className="text-gray-600 font-semibold">{order.factura.preciototal}$</span></p>
                        <p className="font-bold">Dirección: <span className="text-gray-600 font-semibold">{order.clienteUsuario.direccionResidencia}</span></p>
                    </div>

                    {isLoading ? (
                        <Button color="primary" isLoading>
                            Loading
                        </Button>
                    ) : (
                        <Button
                            className={`ml-5 px-3 py-1 rounded transition-colors text-white w-[120px] font-semibold 
                                    ${selectedOrder === order.id ? ' transition-colors duration-300  bg-gray-500 ' : 'bg-blue-500'}`}
                            onClick={(e) => { e.stopPropagation(); handleToggleOrderDetails(); }}>
                            {selectedOrder === order.id ? 'Recoger' : 'Ver Detalles'}
                        </Button>
                    )}

                </button>
                {!isLoading && (
                    <div>
                        {selectedOrder === order.id && (
                            <div className="">
                                <h3 className="text-lg font-bold mb-2 text-center">Productos del Pedido</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {orderDetails[order.id].map((venta) => (
                                        <Tooltip key={venta.id} color='primary' showArrow={true} placement='bottom' size='lg' 
                                            content={ 
                                            <p className='flex'>{venta.subprecio} <CircleDollarSignIcon className='ml-2'></CircleDollarSignIcon></p>
                                            }>
                                        <Card key={venta.id} className="bg-black flex items-center">
                                            <CardBody className='bg-blue-400 rounded-lg flex justify-center items-center overflow-hidden'>
                                              
                                                <img src={BuscarImagenDefault(venta.producto.img)} alt={venta.producto.name} className="w-32 h-28 object-cover" />
                                                
                                            </CardBody>

                                            <CardFooter className='font-bold flex justify-between text-white'>
                                                <p>{venta.producto.name}</p>
                                                <p>{venta.cantidadvendida} KG</p>
                                            </CardFooter>
                                        </Card>
                                        </Tooltip>

                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardBody>
        </Card>

    );
};

PedidoCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    factura: PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      cliente: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
      }).isRequired,
      preciototal: PropTypes.number.isRequired,
    }).isRequired,
    estado: PropTypes.oneOf(["Pendiente", "Enviado", "Entregado"]).isRequired,
    clienteUsuario: PropTypes.shape({
      direccionResidencia: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  toggleOrderDetails: PropTypes.func.isRequired,
  selectedOrder: PropTypes.number,
  orderDetails: PropTypes.object.isRequired,
  removerOrden: PropTypes.func.isRequired,
  vista: PropTypes.string.isRequired,
};

const EnvioSection = ({ orderId, estado, precio, handelOrder, vista }) => {
    const [envioPrice, setEnvioPrice] = useState(precio);

    const handelEnvioPrice = (value) => {
        if (value > 0 && value < 1000000) {
            setEnvioPrice(value);
        } else {
            setEnvioPrice(4000);
        }
    };

    const fechActualizacion = async (estado) => {
        await ActualizarEstadoYPrecioEnvio(orderId, estado, envioPrice);
        handelOrder(orderId);
    };

    return (
        <div className="max-h-[400px] w-[350px] rounded-xl bg-white shadow-lg flex flex-col items-center justify-between p-5 mx-5">
            <p className="font-bold text-center">Asignar Precio de Envío</p>
            <img src={IconoRepartidor} alt="Envío" className="w-48" />
            <div className="flex items-center justify-center space-x-4">
                <Input
                    isDisabled={vista == "usuario" && estado === "Pendiente" ? false : true}
                    className="w-35"
                    type="number"
                    color="primary"
                    size="lg"
                    labelPlacement="outside"
                    placeholder={precio > 0 ? precio : "Precio"}
                    value={envioPrice}
                    onChange={(e) => handelEnvioPrice(e.target.value)}
                />
                {vista === "usuario" && estado === "Pendiente" && (
                    <Button
                        color="success"
                        className="w-35 h-10 text-white font-bold text-sm px-4 py-2 rounded"
                        onClick={() => fechActualizacion("Enviado")}
                    >
                        Confirmar Envío
                    </Button>
                )}
                {vista === "usuario" && estado === "Enviado" && (
                    <Button
                        color="success"
                        className="w-35 h-10 text-white font-bold text-sm px-6 py-2 rounded"
                        onClick={() => fechActualizacion("Entregado")}
                        isDisabled={estado === "Entregado" ? true : false}
                    >
                        Confirmar Recepción
                    </Button>
                )}
            </div>
        </div>
    );
};

EnvioSection.propTypes = {
  orderId: PropTypes.number.isRequired,
  estado: PropTypes.oneOf(["Pendiente", "Enviado", "Entregado"]).isRequired,
  precio: PropTypes.number,
  handelOrder: PropTypes.func.isRequired,
  vista: PropTypes.string.isRequired,
};


async function fetchData(estado) {
    const tiendaData = await fetchStoreData();
    if (tiendaData != null) {
        const pedidosData = await fetchOrders(tiendaData.tienda.id, estado);
        return { tiendaData, pedidosData };
    }
    return null;
}

async function fetchStoreData() {
    const usuario = JSON.parse(localStorage.getItem('user'));

    // Obtiene la fecha actual en UTC y la ajusta a medianoche
    const fechaActual = new Date();
    const fechaUTC = new Date(Date.UTC(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate()));
    const fecha = fechaUTC.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD

    console.log(fecha); // Muestra la fecha para verificar
    const estado = 'Entregado';
    const response = await GetTiendaVirtualUsernameDetail(usuario.username, fecha, estado);
    console.log(response);
    return response.datos;
}


async function fetchOrders(idtienda, estado) {
    if (estado =="Sinfiltro") {
        estado=null;
    }
    const respuesta = await getPedidos(idtienda, estado);
    if (respuesta) {
        const listaPedidos = respuesta.data;
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

fetchOrders.propTypes = {
  idtienda: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  estado: PropTypes.string.isRequired,
};

export default TiendaPage;
