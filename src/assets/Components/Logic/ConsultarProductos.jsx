import React, { useState } from "react";
import { BuscarImagenDefault } from "./Defaultimage";
import { InputField } from "../View/admin/producto/CrearProducto";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Tooltip } from "@nextui-org/react";
import { CircleDollarSign } from "lucide-react";
import { AnimacionEntrada } from "../Tools/animaciones";

export const ProductList = ({ products, onSelectProduct }) => {
  const [buscar, setBuscar] = useState("");

  const handelBuscar = (newValue) => {
    setBuscar(newValue);
    handelFiltro(newValue);

  };

  const [filtro, setFlitro] = useState([]);

  const handelFiltro = (nombre) => {
    if (nombre === "") {
      setFlitro([])
    } else {
      // Filtrar la lista de productos por nombre
      const productosFiltrados = products.filter(producto => producto.name.toLowerCase().includes(nombre.toLowerCase()));


      // Hacer algo con los productos filtrados, por ejemplo, actualizar el estado
      setFlitro(productosFiltrados);
    }
    console.log(filtro)

  };


  return (
    <AnimacionEntrada>
      <div className="flex flex-col items-center w-[500px] h-[600px]">
        <div className="text-black w-full px-10 mb-5">
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
    </AnimacionEntrada>
    
  );
};

export const ProductDetail = ({ product }) => {
  if (product != null) {
    return (
      <Card className="bg-white w-full" shadow="none">
        <CardHeader>
          <h2 className="w-full text-lg font-bold mb-2 text-center">
            {product.name}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center">
            <Image src={BuscarImagenDefault(product.img)}
              
              alt="Imagen del producto"
              className=" w-full h-[250px] rounded-l-none"
            ></Image>  
            <div className="flex justify-between w-full">
              <Tooltip content={"Precio"} placement={"bottom"} color="success" className="text-white">
                <Chip color="success" className="p-4">
                  <p className="text-white flex text-lg justify-center items-center">{product.price} <CircleDollarSign></CircleDollarSign> </p>
                </Chip>
              </Tooltip>

              <Tooltip content={"Stock"} placement={"bottom"} color="primary" className="text-white">
                <Chip color="primary" className="p-4">
                  <p className="text-white flex text-lg justify-between">{product.stock + " KG"}</p>
                </Chip>
              </Tooltip>
            </div>
          </div>
          
        </CardBody>

        <CardFooter className="">
          <div className="w-full text-black p-1 rounded-lg">
            <p>{product.description}</p>
          </div>
        </CardFooter>
      </Card>
    );
  }
};

