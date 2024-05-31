import React, { useEffect, useState } from "react";
import { ProductList } from "../Logic/ConsultarProductos";
import { ProductDetail } from "../Logic/ConsultarProductos";
import Header from "./Header";
import { TarjetaCrearProducto } from "./CrearProducto";
import iconoCerrado from "../Icons/IconoCerrar.png";
import { BorrarProducto, ConsultarProductos } from "../Base/BdProductos";
import { MensajeAlert } from "../Tools/Validadores";
import LoadingScreen from "./LoadingScreen";
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner } from "@nextui-org/react";

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
    <div className="bg-[#F5F5F5] h-screen w-screen flex flex-col">
      <Header
        title="FruityFolio"
      />

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
      {loading ? <Spinner label="Cargando" color="primary" size="lg" className="flex-grow flex items-center justify-center"></Spinner>
      
      :(
        <div className="flex-grow flex justify-center items-center">
          <Card className="w-1/4 h-3/4">
            <CardHeader>
              <h1 className="w-full text-center font-bold text-xl">Lista de Productos</h1>
            </CardHeader>
            <CardBody className="w-full overflow-hidden">
              <div className="flex justify-center items-center">
                {listaProductos.length == 0 && NoProductsFound()}

                {listaProductos.length > 0 && (
                  <div>
                    <ProductList
                      products={listaProductos}
                      onSelectProduct={handleSelectProduct}
                    />
                  </div>
                )}
              </div>

            </CardBody>
            <CardFooter></CardFooter>
          </Card>
            {selectedProduct&& 
              <Card className="w-1/4 h-3/4 mx-5">
                <CardHeader>
                  <h2 className="text-xl font-bold w-full text-center" >
                    Detalles del Producto
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="flex  justify-center  mx-w-[80%]">
                    <ProductDetail product={selectedProduct} />
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="flex justify-between my-5 w-full h-1/5">
                    <Button

                      className="text-lg font-bold px-5"
                      onClick={() => handleSelectProduct(null)}
                    >
                      CERRAR
                    </Button>

                    <Button
                      color="primary"
                      className="text-lg font-bold px-5"
                      onClick={handelOpenShowActualizar}
                    >
                      EDITAR
                    </Button>

                    <Button
                      color="danger"
                      className="text-lg font-bold px-5"
                      onClick={() => EliminarProducto()}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            }
          
        </div>
      )}
      
      
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


