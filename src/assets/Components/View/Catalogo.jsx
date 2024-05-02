import React, { useEffect, useState } from "react";
import { ProductList } from "../Logic/ConsultarProductos";
import { ProductDetail } from "../Logic/ConsultarProductos";
import Header from "./Header";
import { TarjetaCrearProducto } from "./CrearProducto";
import iconoCerrado from "../Icons/IconoCerrar.png";
import { BorrarProducto, ConsultarProductos } from "../Base/BdProductos";
import { MensajeAlert } from "../Tools/Validadores";
import LoadingScreen from "./LoadingScreen";

function ConsultaCatalogo() {

  const usuario = JSON.parse(localStorage.getItem('user'));
  const [selectedProduct, setSelectedProduct] = useState(null);

  const consultarProductos = async () => {
    setLoading(true);
    const respuesta = await ConsultarProductos(usuario.username);
    setLoading(false);
    // Imprimir el estatus error
    // console.log(respuesta.error.response.status);
    if (respuesta.datos) {
      setListaProductos(respuesta.datos.sort((a, b) => a.id - b.id));
    } else {
      setListaProductos([]);

    }

  }
  useEffect(() => {
    consultarProductos();
  }, []);


  const [listaProductos, setListaProductos] = useState([]);
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };
  const EliminarProducto = async () => {
    setLoading(true);
    handleSelectProduct(null); // Esto cierra la tarjeta de detalles del producto
    handelCloseShowActualizar();

    const respuesta = await BorrarProducto(selectedProduct);

    console.log(respuesta);
    consultarProductos();
    setLoading(false);

  };


  const [showActualizar, setShowActualizar] = useState(false);

  const handelOpenShowActualizar = () => {
    setShowActualizar(true);
  };

  const handelCloseShowActualizar = () => {
    setShowActualizar(false);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });
  const handelSetMensaje = (mensaje) => {
    setMensaje(mensaje);
  };
  const handelOpenAlert = () => {
    setShowAlert(true);
  };

  const handelCloseAlert = () => {
    setShowAlert(false);
    setShowActualizar(false);
  };

  const [loading, setLoading] = useState(false);


  return (
    <div className="bg-[#F5F5F5] h-screen">
      <Header
        link="/paginaPrincipal"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="FruityFolio"
        subtitle="Gestiona tu negocio de frutas con facilidad."
      />

      {loading && <LoadingScreen message="Cargando datos..." />}
      {showActualizar && (

        <div className="fixed top-6 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          {showAlert && (
            <MensajeAlert
              message={mensaje.Mensaje}
              onClose={handelCloseAlert}
              isError={mensaje.isError}
              buttonColor={mensaje.colorBoton}
              textColor={mensaje.colorText}
              buttonText={mensaje.textBoton}
            />
          )}

          <div className=" flex flex-col items-center justify-center mx-auto">

            <div className="w-full  flex justify-end px-12">
              <button
                className="flex items-center justify-end  h-10 bg bg-white rounded-md my-4 p-2"
                onClick={handelCloseShowActualizar}
              >
                <h1>CERRAR</h1>
                <img src={iconoCerrado} alt="" className="w-10" />
              </button>
            </div>
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
            {listaProductos.length == 0 && NoProductsFound()}
            {listaProductos.length > 0 && (<div>
              <ProductList
                products={listaProductos}
                onSelectProduct={handleSelectProduct}
              />
            </div>)}

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
                onClick={() => handleSelectProduct(null)}
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
                onClick={() => EliminarProducto()}
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


const NoProductsFound = () => {
  return (
    <div className="flex flex-col items-center w-[500px] h-[600px] pt-14">
      <img src="https://freepngtransparent.com/wp-content/uploads/2023/03/X-Png-138.png" alt="No products found" className="w-48 h-48 mb-8" />
      <h2 className="text-2xl font-semibold text-gray-800">No hay productos encontrados</h2>
    </div>
  );
};


