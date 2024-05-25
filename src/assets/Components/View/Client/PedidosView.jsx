import React, { useState, useEffect } from 'react';
import Header from "../Header";
import { BuscarImagenDefault } from '../../Logic/Defaultimage';
import { ConsultarProductos } from '../../Base/BdProductos';


const ProductGrid = ({ addToCart, cartItems }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Llamada a la función ConsultarProductos al montar el componente
        async function fetchData() {
            const { datos, error } = await ConsultarProductos('zelecto');
            if (error) {
                console.error('Error al cargar productos:', error);
            } else {
                setProductos(datos);
            }
        }
        fetchData();
    }, []); 
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {productos.map((product) => (
                <Product
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    isInCart={cartItems.some(item => item.id === product.id)}
                />
            ))}
        </div>
    );
};


const Product = ({ product, addToCart, isInCart }) => {
    const [quantity, setQuantity] = useState(1); // Default quantity is 1 kg

    return (
        <div className="border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center bg-white">
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
                    className="border rounded p-1 w-16 text-center mr-2"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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

    return (
        <div className="fixed top-[175px] right-32 w-[400px] p-4 border border-gray-200 rounded h-[500px] overflow-y-auto bg-white shadow-lg z-50">
            <h2 className="text-lg text-center font-bold mb-4">Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border border-gray-200 rounded p-2">
                            <div className="flex flex-col">
                                <p className="text-gray-800 font-bold mb-1">{item.name}</p>
                                <p className="text-gray-500 font-semibold">Cantidad: {item.quantity} kg</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-blue-600 font-bold mb-1">{item.price * item.quantity} $</p>
                                <button
                                    className="bg-red-500 text-white font-bold py-1 px-2 rounded"
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
                        
                        <button className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                            Ordenar
                        </button>
                        <p className="text-lg font-bold">TOTAL: {subtotal}$</p>
                    </div>
                </>
            )}
        </div>
    );
};


const PedidosView = () => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity) => {
        setCartItems([...cartItems, { ...product, quantity: Number(quantity) }]);
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    return (
        <div className='bg-[#F5F5F5]'>
            <Header
                link="/"
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
