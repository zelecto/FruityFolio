import React, { useEffect, useState } from "react";
import { ProductList, ProductDetail } from "../../../Logic/ConsultarProductos";
import Header from "../../Header";
import { TarjetaCrearProducto } from "./CrearProducto";
import { BorrarProducto, ConsultarProductos } from "../../../Base/BdProductos";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import toast from "react-hot-toast";

function ConsultaCatalogo() {
  const usuario = JSON.parse(localStorage.getItem("user"));
  const [selectedProduct, setSelectedProduct] = useState(null);

  const consultarProductos = async () => {
    setLoading(true);
    const respuesta = await ConsultarProductos(usuario.username);
    setLoading(false);
    if (respuesta.datos) {
      setListaProductos(respuesta.datos.sort((a, b) => a.id - b.id));
    } else {
      setListaProductos([]);
    }
  };


  useEffect(() => {
    consultarProductos();
  }, []);

  const [listaProductos, setListaProductos] = useState([]);
  
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const EliminarProducto = async () => {
    const loading=toast.loading("Eliminando producto");
    await BorrarProducto(selectedProduct);
    toast.dismiss(loading);
    await consultarProductos();
    handleSelectProduct(null); // Esto cierra la tarjeta de detalles del producto
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-[#F5F5F5] h-screen w-screen flex flex-col">
      <Header title="FruityFolio" />
      
      {loading ? (
        <Spinner
          label="Cargando"
          color="primary"
          size="lg"
          className="flex-grow flex items-center justify-center"
        ></Spinner>
      ) : (
        <div className="flex-grow flex justify-center items-center">
          <Card className="w-1/4 h-3/4">
            <CardHeader>
              <h1 className="w-full text-center font-bold text-xl">
                Lista de Productos
              </h1>
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
          {selectedProduct && (
            <Card className="w-1/4 h-3/4 mx-5">
              <CardHeader>
                <h2 className="text-xl font-bold w-full text-center">
                  Detalles del Producto
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex  justify-center  mx-w-[80%]">
                  <ProductDetail product={selectedProduct} />
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex justify-between my-5 w-full">
                  <Button
                    className="text-lg font-semibold px-5"
                    onClick={() => handleSelectProduct(null)}
                  >
                    Cerrar
                  </Button>
                  
                  <ModalUpdateProduct selectedProduct={selectedProduct} consultarProductos={consultarProductos}></ModalUpdateProduct>
                  
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
          )}
        </div>
      )}
    </div>
  );
}

const NoProductsFound = () => {
  return (
    <div className="flex flex-col items-center w-[500px] h-[600px] pt-14">
      <img
        src="https://freepngtransparent.com/wp-content/uploads/2023/03/X-Png-138.png"
        alt="No products found"
        className="w-48 h-48 mb-8"
      />
      <h2 className="text-2xl font-semibold text-gray-800">
        No hay productos encontrados
      </h2>
    </div>
  );
};

const ModalUpdateProduct = ({ selectedProduct, consultarProductos }) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        color="primary"
        className="text-lg font-bold px-5"
        onClick={onOpen}
      >
        Editar
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          <ModalHeader>
            <h1 className="w-full text-center font-bold">
              Actualiza tu producto
            </h1>
          </ModalHeader>
          <ModalBody>
            <div className="w-full">
              <TarjetaCrearProducto
                TextButton={"Actualizar"}
                ActualizarProducto={selectedProduct}
                actualizarListaProductos={consultarProductos}
              ></TarjetaCrearProducto>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              className="text-lg font-bold px-5"
              onClick={onOpenChange}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ModalUpdateProduct.propTypes = {
  selectedProduct: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    description: PropTypes.string,
    // Añade aquí otros campos que puedan estar en `selectedProduct`
  }).isRequired,
  consultarProductos: PropTypes.func.isRequired,
};

export default ConsultaCatalogo;
