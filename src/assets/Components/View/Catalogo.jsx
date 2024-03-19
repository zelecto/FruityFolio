import React, { useState } from "react";
import { ListaPoductos, ProductList } from "../Logic/ConsultarProductos";
import { ProductDetail } from "../Logic/ConsultarProductos";
import Header from "./Header";
import { TarjetaCrearProducto } from "./CrearProducto";

import iconoCerrado from "../Icons/IconoCerrar.png";

function ConsultaCatalogo() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };
  const handleSelectProduct2 = (product) => {
    setSelectedProduct(product);
  };
  

  const [showActualizar, setShowActualizar] = useState(false);

  const handelOpenShowActualizar = () => {
    setShowActualizar(true);
  };

  const handelCloseShowActualizar = () => {
    setShowActualizar(false);
  };
  const handelSetMensaje = (mensaje) => {
    
  };
  const handelOpenAlert = () => {
    setShowAlert(true);
  };

  return (
    <div className="bg-[#F5F5F5] h-screen">
      <Header
        link="/paginaPrincipal"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="FruityFolio"
        subtitle="Gestiona tu negocio de frutas con facilidad."
      />
      {showActualizar && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <button
            className="flex items-center justify-between w-[100px] h-10"
            onClick={handelCloseShowActualizar}
          >
            <h1>CERRAR</h1>
            <img src={iconoCerrado} alt="" className="w-10" />
          </button>

          <div className=" flex items-center justify-center mx-auto mt-2 ">
            <TarjetaCrearProducto
              TextButton={"Actualizar"}
              handelSetMensaje={handelSetMensaje}
              handelOpenAlert={handelOpenAlert}
              ActualizarProducto={selectedProduct}
            ></TarjetaCrearProducto>
          </div>
        </div>
      )}

      <div className="flex justify-center my-10 px-8">
        <div className="mx-20">
          <div className="flex flex-col justify-center items-center  bg-[#CCE6FF] rounded-lg  shadow-md ">
            <div className="w-full text-3xl text-gold text-black font-bold  text-center rounded-t-lg p-4">
              <h1>Lista de Productos</h1>
            </div>

            <div>
              <ProductList
                products={ListaPoductos()}
                onSelectProduct={handleSelectProduct}
              />
            </div>
          </div>
        </div>

        {selectedProduct && (
          <div className="flex flex-col  items-center bg-[#CCE6FF]  rounded-lg p-6 shadow-md max-w-[30%] max-h-[60%]">
            <h2 className="text-3xl font-bold mb-4 p-4">
              Detalles del Producto
            </h2>

            <div className="flex  justify-center bg-gray-100  rounded-lg shadow-md mx-w-[80%]">
              <ProductDetail product={selectedProduct} />
            </div>
            <div className="flex justify-between my-5 w-[90%]">
              <button
                className="bg-slate-500 font-bold text-white hover:bg-slate-700 w-[40%] h-[200%] rounded-lg mx-2"
                onClick={() => handleSelectProduct2(null)}
              >
                CERRAR
              </button>

              <button
                className="bg-blue-400 font-bold text-white hover:bg-blue-700 w-[40%] h-[200%] rounded-lg mx-2"
                onClick={handelOpenShowActualizar}
              >
                EDITAR
              </button>

              <button
                className="bg-red-400 font-bold text-white hover:bg-red-700 w-[40%] h-[200%] rounded-lg mx-2"
                onClick={() => handleSelectProduct2(null)}
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultaCatalogo;
