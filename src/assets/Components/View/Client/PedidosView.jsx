import React, { useState, useEffect } from 'react';
import Header from "../Header";
import { BuscarImagenDefault } from '../../Logic/Defaultimage';
import { ConsultarProductosPorStock } from '../../Base/BdProductos';
import { GuardarFactura } from '../../Base/BdFactura';
import { postPedido } from '../../Base/BdPedido';
import { MensajeAlert } from '../../Tools/Validadores';

const ProductGrid = ({ addToCart, cartItems }) => {
    const [productos, setProductos] = useState([]);
    const ListaColores = ["#C8F1CB", "#ADD87C", "#F3BF1B", "#BEB6F6", "#F1DA9B"]
    useEffect(() => {

        const tienda = JSON.parse(localStorage.getItem('tienda'));

        // Llamada a la función ConsultarProductos al montar el componente
        async function fetchData() {
            const { datos, error } = await ConsultarProductosPorStock(tienda.username,true);
            if (error) {
                console.error('Error al cargar productos:', error);
            } else {
                setProductos(datos);
            }
        }
        fetchData();
    }, []);
    let index = 0;
    function manejoColores() {
        const color = ListaColores[index];
        index = (index + 1) % ListaColores.length;
        return color;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {productos.map((product) => (
                <Product
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    isInCart={cartItems.some(item => item.id === product.id)}
                    colorFondo={manejoColores()}
                />
            ))}
        </div>
    );
};


const Product = ({ product, addToCart, isInCart, colorFondo }) => {
    const [quantity, setQuantity] = useState(1); // Default quantity is 1 kg

    const handelSetQuantity = (value) => {
        if (value <= product.stock && value>0) {
            setQuantity(value)
        }else if(value<=0){
            setQuantity(1);
        }
         else {
            setQuantity(product.stock)
        }
    }

    return (
        <div style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${"white"})` }} className="border mb border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center bg-gradient-to-b from-white">
            <img src={BuscarImagenDefault(product.img)} alt={product.name} className="w-40 h-40 object-cover mb-4 rounded-md" />
            <div className="flex flex-col items-center text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{product.name.toUpperCase()}</h3>
                <p className="text-gray-500 mt-2 font-bold">Disponible: <span className="text-green-500 font-semibold">{product.stock} kg</span></p>
                <p className="text-lg font-bold text-blue-600 mt-2">{product.price}$/kg</p>
            </div>
            <div className="flex items-center mb-4">
                <input
                    type="number"
                    min="1"
                    max={product.stock}
                    className="border rounded p-1 w-24 text-center mx-2"
                    value={quantity}
                    onChange={(e) => handelSetQuantity(e.target.value)}
                    disabled={isInCart}
                />
                <button
                    className={`py-1 px-4 rounded ${isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    onClick={() => addToCart(product, quantity)}
                    disabled={isInCart}
                >
                    {isInCart ? 'En el carrito' : 'Agregar'}
                </button>
            </div>
        </div>
    );
};

const Cart = ({ cartItems, removeFromCart }) => {
    // Calcular el subtotal sumando los precios de los productos en el carrito
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const fechaActual = new Date();
    const handelFechaActualGuardar = () => {
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses son indexados desde 0
        const año = fechaActual.getFullYear();

        // Aseguramos que los números tengan dos dígitos
        const diaStr = dia < 10 ? "0" + dia : dia.toString();
        const mesStr = mes < 10 ? "0" + mes : mes.toString();

        const fechaFormateada = `${año}-${mesStr}-${diaStr}`;
        return fechaFormateada;
    };

    const [showMensaje, setShowMensaje] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    const handelShowMensaje=(value,reload)=>{
        setShowMensaje(value);
        if (reload) {
            window.location.reload()
        }
    }

    const fetchData = async () => {
        const usuario = JSON.parse(localStorage.getItem('user'));
        const tienda = JSON.parse(localStorage.getItem('tienda'));

        // Crear una lista de productos vendidos para esta venta
        const listaProductosVendidos = cartItems.map(item => ({
            producto:{
                id:item.id
        },
            cantidad: item.quantity,
            total: item.price * item.quantity,
        }));
        const cliente = {
            cedula: usuario.cedula,
            nombre: usuario.nombre,
            correo: usuario.correo
        };
        
        const factura = {
            cliente: cliente,
            fechaActual: handelFechaActualGuardar(),
            listaProductosVendidos: listaProductosVendidos,
            total: subtotal,
            usuarioUsername: tienda.username
        };
        
        const facturaGuardada= await GuardarFactura(factura);
        const pedido={
            estado: "Pendiente",
            id_Factura: facturaGuardada.id,
            id_Tienda: tienda.id,
            precioTransporte: 0,
            username_Cliente: usuario.username
        }
        const response= await postPedido(pedido);
        console.log(response);
        if (response.datos) {
            setMensaje({
                title: "Pedido creado con éxito",
                Mensaje: "Su pedido ha sido creado satisfactoriamente.",
                colorBoton: "green",
                colorText: "text-black-700",
                isError: false,
                textBoton: "ACEPTAR"
            });

            setShowMensaje(true);
        }else{
            setMensaje({
                title: "Error al crear el pedido",
                Mensaje: "Hubo un problema al crear su pedido. Por favor, inténtelo de nuevo.",
                colorBoton: "red",
                colorText: "text-black-700",
                isError: true,
                textBoton: "Aceptar"
            });

            setShowMensaje(true);
        }
        // Aquí puedes enviar la factura al servidor o realizar otras acciones necesarias
    };

    return (
        <div className="fixed top-[175px] right-32 w-[400px] p-4 border border-gray-200 rounded h-[500px] overflow-y-auto bg-white shadow-lg z-50">
            {showMensaje &&
                <MensajeAlert
                    message={mensaje.Mensaje}
                    title={mensaje.title}
                    onClose={() => handelShowMensaje(false, !mensaje.isError)}
                    isError={mensaje.isError}
                    buttonColor={mensaje.colorBoton}
                    textColor={mensaje.colorText}
                    buttonText={mensaje.textBoton}
                />
            }
            <h2 className="text-xl text-center font-bold mb-4">Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center">
                    <img className='w-64 my-5 rounded-xl'
                        src="https://th.bing.com/th/id/OIG2.UgzdSFRMt9ZvNi5VJe3z?pid=ImgGn"
                        alt="" />
                    <h2 className='font-bold text-xl my-10'>Tu carrito esta vacio</h2>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border border-gray-200 rounded p-2 shadow-lg">
                            <div className="flex flex-col">
                                <p className="text-gray-800 font-bold mb-1">{item.name}</p>
                                <p className="text-gray-500 font-semibold">Cantidad: {item.quantity} kg</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-blue-600 font-bold mb-1">{item.price * item.quantity} $</p>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {cartItems.length > 0 && (
                <>
                    <hr className="my-4" />
                    <div className="flex justify-between items-center">

                        <p className="text-lg font-bold">TOTAL: {subtotal}$</p>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => { fetchData() }}
                        >
                            Ordenar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};


const PedidosView = () => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity) => {
        if (quantity <= product.stock) {
            setCartItems([...cartItems, { ...product, quantity: Number(quantity) }]);

        }
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    return (
        <div className='bg-[#F5F5F5]'>
            <Header
                link="/PaginaPrincipalClient"
                logoRightSrc="ruta-a-la-imagen-derecha.jpg"
                logoAlt="FruityFolio logo"
                title="¡Bienvenido a FruityFolio!"
                subtitle={`Compra las mejores frutas `}
            />
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <ProductGrid addToCart={addToCart} cartItems={cartItems} />
                    </div>
                    <div className="md:col-span-1">
                        <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PedidosView;
