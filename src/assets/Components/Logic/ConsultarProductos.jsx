import React, { useState } from "react";
import { BuscarImagenDefault } from "./Defaultimage";
import { InputField } from "../View/CrearProducto";

export const ProductList =  ({ products, onSelectProduct }) => {
  const [buscar, setBuscar] = useState("");
  
  const handelBuscar = (newValue) => {
    setBuscar(newValue);
    handelFiltro(newValue);
    
  };


  const [filtro, setFlitro] = useState([]);
  
  const handelFiltro = (nombre) => {
    if(nombre===""){
      setFlitro([])  
    }else{
      // Filtrar la lista de productos por nombre
      const productosFiltrados = products.filter(producto => producto.name.toLowerCase().includes(nombre.toLowerCase()));


    // Hacer algo con los productos filtrados, por ejemplo, actualizar el estado
    setFlitro(productosFiltrados);
    }
    console.log(filtro)
    
  };


  return (
    <div className="flex flex-col items-center w-[500px] h-[600px]">
      <div className="text-black  w-[300px] h-[80px] px-2 mb-5">
        <InputField
          label="Busca tu producto"
          id="Buscar"
          type="text"
          placeholder="Buscalo por Nombre"
          value={buscar}
          onChange={(e) => handelBuscar(e.target.value)}
          errorMessage={""}
        />
      </div>
      <div className="flex flex-col justify-start items-center max-h-[400px] overflow-y-auto">
        {filtro.length > 0 ? (
          // Si hay productos filtrados, mostrar los productos filtrados
          filtro.map((producto) => (
            <div
              key={producto.id}
              className="border bg-white p-2 cursor-pointer m-2 w-[400px] hover:bg-gray-200 shadow-md rounded-md flex justify-between items-center"
              onClick={() => onSelectProduct(producto)}
            >
              <div>
                <h2 className="text-lg font-bold my-1">{producto.name}</h2>
                <p className="text-gray-800">${producto.price}</p>
              </div>

              <img
                src={BuscarImagenDefault(producto.img)}
                alt="Imagen del producto"
                className="w-20 h-auto object-cover mr-4"
              />
            </div>
          ))
        ) : (
          // Si no hay productos filtrados, mostrar todos los productos
          products.map((producto) => (
            <div
              key={producto.id}
              className="border bg-white p-2 cursor-pointer m-2 w-[400px] hover:bg-gray-200 shadow-md rounded-md flex justify-between items-center"
              onClick={() => onSelectProduct(producto)}
            >
              <div>
                <h2 className="text-lg font-bold my-1">{producto.name}</h2>
                <p className="text-gray-800">${producto.price}</p>
              </div>

              <img
                src={BuscarImagenDefault(producto.img)}
                alt="Imagen del producto"
                className="w-20 h-auto object-cover mr-4"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const ProductDetail = ({ product }) => {
  if(product!=null){
    return (
      <div className="flex flex-col items-center max-w-[80%] pb-10">
        <h2 className="text-lg font-bold mb-2 text-center my-5">
          {product.name}
        </h2>
        <div className="flex justify-between">
          <img
            src={BuscarImagenDefault(product.img)}
            alt="Imagen del producto"
            className="w-[50%] h-auto "
          />
          <div className="flex flex-col justify-center">
            <div className="flex justify-between">
              <p className="font-bold mx-4">Precio: </p>
              <p className="">{"$ " + product.price}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-bold mx-2">Cantidad:</p>
              <p>{product.stock + " Kg"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-bold">Descripción</p>
          <div className="text-black bg-yellow-100 p-1 rounded-lg">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    );
  }

  
};


 function ListaPoductos() {
  const products = [
    {
      id: 1,
      name: "fruta y mas fruta",
      description:
        "Descubre la nueva colección de productos que te sorprenderán. ¡Calidad, estilo y funcionalidad en cada artículo!",
      img: "Granadillas",
      stock: 5000,
      price: 2000000,
    },
    {
      id: 2,
      name: "Producto 2",
      description: "Descripción del Producto 2",
      img: "Guanabana",
      stock: 5000,
      price: 200,
    },
    {
      id: 3,
      name: "Producto 3",
      description: "Descripción del Producto 3",
      img: "Guineo",
      stock: 5000,
      price: 300,
    },
    {
      id: 4,
      name: "Producto 4",
      description: "Descripción del Producto 4",
      img: "Kiwi",
      stock: 5000,
      price: 300,
    },
    {
      id: 5,
      name: "Producto 5",
      description: "Descripción del Producto 5",
      img: "LimonAmarillo",
      stock: 5000,
      price: 300,
    },
    {
      id: 6,
      name: "Producto 6",
      description: "Descripción del Producto 6",
      img: "Lulo",
      stock: 5000,
      price: 300,
    },
    // Agrega más productos aquí según sea necesario
  ];

  return products;
}
