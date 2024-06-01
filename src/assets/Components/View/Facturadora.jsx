import React, { useEffect, useState } from "react";
import validarNombre, {
  ErrorMensaje,
  MensajeAlert,
} from "../Tools/Validadores";
import Header from "./Header";
import {
  ProductDetail,
  ProductList,
} from "../Logic/ConsultarProductos";
import { ConsultarProductos } from "../Base/BdProductos";
import { GuardarFactura } from "../Base/BdFactura";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from "@nextui-org/react";

import { TablaDetalles } from "./GestorVentas";

const CrearFacturaForm = () => {
  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handelOpenAlert = () => {
    setShowAlert(true);
  };
  const handelSetMensaje = (mensaje) => {
    setMensaje(mensaje);
  };
  //mensaje de alerta
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F5F5F5]">

      {showAlert && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <MensajeAlert
            message={mensaje.Mensaje}
            onClose={handleCloseAlert}
            isError={mensaje.isError}
            buttonColor={mensaje.colorBoton}
            textColor={mensaje.colorText}
            buttonText={mensaje.textBoton}
          />
        </div>
      )}

      <Header
        title="FruityFolio"
      />
      <div className="flex justify-center items-center mx-auto mt-16 ">
        <TarjetaFactura handelOpenAlert={handelOpenAlert} handelSetMensaje={handelSetMensaje} />
      </div>
    </div>
  );
};
export default CrearFacturaForm;

const TarjetaFactura = ({ handelOpenAlert, handelSetMensaje }) => {
  //Datos para el cliente
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  //Mensajes de error de ingreso de datos
  const [errorMessageCedula, setErrorMessageCedula] = useState(null);
  const [errorMessageNombre, setErrorMessageNombre] = useState(null);
  const [errorMessageCorreo, setErrorMessagCorreo] = useState(null);

  //Controladores de cliente

  const handleCedula = (newValue) => {
    if (newValue >= 0 && newValue <= 9999999999) {
      setCedula(newValue);
      setErrorMessageCedula(null);
    } else if (newValue >= 9999999999) {
      setCedula(newValue);
      setErrorMessageCedula("No se admiten mas de 10 nuemros");
    } else if (/^[a-zA-Z]+$/.test(newValue)) {

      setErrorMessageCedula("No se admiten letras");
    }
  };

  const handleNombre = (newValue) => {
    setNombre(newValue);
    if (validarNombre(newValue) || newValue == "") {

      setErrorMessageNombre(null);
    } else {
      setErrorMessageNombre("No se admite numeros");
    }
  };

  const handleCorreo = (newValue) => {
    setCorreo(newValue);
    setErrorMessagCorreo(null);
  };
  const handleOnBulrCorreo = (newValue) => {
    // Expresión regular para validar un correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el valor ingresado coincide con el patrón de correo electrónico
    if (!newValue.match(emailPattern) && newValue != "") {
      // Si el correo electrónico no es válido, podrías mostrar un mensaje de error o ejecutar alguna lógica adicional
      setErrorMessagCorreo("Correo electrónico no válido");
    } else {
      // Si el correo electrónico es válido, actualiza el estado con el nuevo valor
      setCorreo(newValue);
      setErrorMessagCorreo(null);
    }
  };

  //Datos Factura
  const fechaActual = new Date();

  //Controladores de Factura
  const handelFechaActual = () => {
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses son indexados desde 0
    const año = fechaActual.getFullYear();

    // Aseguramos que los números tengan dos dígitos
    const diaStr = dia < 10 ? "0" + dia : dia.toString();
    const mesStr = mes < 10 ? "0" + mes : mes.toString();

    const fechaFormateada = `${diaStr}/${mesStr}/${año}`;
    return fechaFormateada;
  };
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

  const [idSimulado, SetIdsimulado] = useState(0);

  const handelIdSimulado = (agregar) => {
    if (agregar) {
      SetIdsimulado(idSimulado + 1);
    } else {
      SetIdsimulado(idSimulado - 1)
    }
  }

  //Lista Ventas
  const [listVentas, setListVentas] = useState([]);
  const [totalPago, setTotalPago] = useState(0);

  const AgregarVenta = (Producto, Cantida, Total) => {
    // Crea una nueva copia del array listVentas y agrega el nuevo objeto de venta
    handelIdSimulado(true)
    const nuevaListaVentas = [
      ...listVentas,
      {
        id: idSimulado,
        producto: Producto,
        cantidadvendida: Cantida,
        subprecio: Total,
      },
    ];

    const nuevoPrecio = totalPago + Total;

    // Actualiza el estado de totalPago con el nuevo valor
    setTotalPago(nuevoPrecio);

    // Actualiza el estado listVentas con la nueva lista
    setListVentas(nuevaListaVentas);
  };

  //Mostrar agregar o actualizar
  const [showAgregarProducto, setShowAgregarProducto] = useState(true);
  const [showActualizarProducto, setShowActualizarProducto] = useState(false);

  const [productoActualizar, setproductoActualizar] = useState(null);

  const handelshowAgregarProducto = (value) => {
    setShowAgregarProducto(value);
  };

  const handelshowActualizarProducto = (value, producto) => {
    console.log(producto)
    if (value === true) {
      setShowAgregarProducto(false);
      setproductoActualizar(producto);
      setShowActualizarProducto(value);
    } else {
      setShowAgregarProducto(true);
      setShowActualizarProducto(false);
    }
  };

  const ActualizarVenta = (Producto, Cantidad, Total) => {
    // Crea una copia de la lista de ventas
    const nuevaListaVentas = [...listVentas];

    // Encuentra la posición del objeto de venta que deseas actualizar
    const index = nuevaListaVentas.findIndex(
      (venta) => venta.producto.id === Producto.id
    );

    if (index !== -1) {
      // Si se encuentra el objeto en la lista
      // Actualiza el objeto de venta en la lista con los nuevos valores
      nuevaListaVentas[index] = {
        ...nuevaListaVentas[index],
        cantidadvendida: Cantidad,
        subprecio: Total,
      };

      // Calcula el nuevo totalPago sumando el total de todas las ventas en la lista
      const nuevoPrecio = nuevaListaVentas.reduce(
        (acumulador, venta) => acumulador + venta.subprecio,
        0
      );

      // Actualiza el estado totalPago con el nuevo valor
      setTotalPago(nuevoPrecio);

      // Actualiza el estado listVentas con la nueva lista actualizada
      setListVentas(nuevaListaVentas);
    } else {
      console.error("Venta no encontrada en la lista.");
    }
    handelshowActualizarProducto(false);
  };

  const EliminarVenta = (ProductoId) => {
    // Copia la lista de ventas actual
    handelIdSimulado(false);
    const nuevaListaVentas = [...listVentas];

    // Encuentra el índice del objeto de venta que deseas eliminar
    const index = nuevaListaVentas.findIndex(
      (venta) => venta.producto.id === ProductoId.id
    );

    if (index !== -1) {
      // Elimina el objeto de la lista
      nuevaListaVentas.splice(index, 1);

      // Actualiza el estado de listVentas con la lista actualizada
      setListVentas(nuevaListaVentas);
      const nuevoPrecio = nuevaListaVentas.reduce(
        (acumulador, venta) => acumulador + venta.total,
        0
      );

      // Actualiza el estado totalPago con el nuevo valor
      setTotalPago(nuevoPrecio);
    } else {
      console.error("aqui Venta no encontrada en la lista.");
      console.log(ProductoId);
    }
    handelshowActualizarProducto(false);
  };
  const CancelarActualizacionVenta = () => {
    handelshowActualizarProducto(false);
  };

  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [successMessage, setSuccessMessage] = useState(false); // Estado para mostrar el mensaje de éxito

  const guardarFactura = async () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (errorMessageCedula == null && errorMessageCorreo == null && errorMessageNombre == null && cedula != "" && correo != "" && nombre != "" && listVentas != null) {
      const cliente = {
        cedula: cedula,
        nombre: nombre,
        correo: correo
      }
      const factura = {
        cliente: cliente,
        fechaActual: handelFechaActualGuardar(),
        listaProductosVendidos: listVentas,
        total: totalPago,
        usuarioUsername: usuario.username
      }
      const mensaje = {
        Mensaje: "Datos guardados correctamente",
        colorBoton: "green",
        colorText: "text-black-700",
        isError: true,

      };
      handelSetMensaje(mensaje)

      handelOpenAlert();
      await GuardarFactura(factura);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      const mensajeError = {
        Mensaje: "Datos no guardados, verifique la lista de ventas, y los datos del cliente",
        colorBoton: "red",
        colorText: "text-black-700",
        isError: true,
        textBoton: "Cerrar",
      };
      handelSetMensaje(mensajeError)
      handelOpenAlert();

    }
  }
  //Desarrolar mensaje de error 
  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });



  return (

    <div className="w-full flex justify-center ">

      <Card className="w-1/3">
        <CardHeader>
          <div className="flex justify-between mt-4">
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <InputField
                label="Cedula del cliente"
                id="cedula"
                type="text"
                placeholder="Cedula del cliente"
                value={cedula}
                onChange={(e) => handleCedula(e.target.value)}
                errorMessage={errorMessageCedula}
              />
            </div>
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <InputField
                label="Nombre del cliente"
                id="nombre"
                type="text"
                placeholder="Nombre del cliente"
                value={nombre}
                onChange={(e) => handleNombre(e.target.value)}
                errorMessage={errorMessageNombre}
              />
            </div>
            <div className="w-full sm:w-1/3">
              <InputField
                label="Correo"
                id="Correo"
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => handleCorreo(e.target.value)}
                errorMessage={errorMessageCorreo}
                onBlur={(e) => handleOnBulrCorreo(e.target.value)}
              />
            </div>
          </div>

        </CardHeader>

        <CardBody>
          <h1 className=" text-xl font-bold mb-2">
            Fecha {handelFechaActual()}
          </h1>

          <TablaDetalles listaFacturas={listVentas} showActualizarVenta={handelshowActualizarProducto}></TablaDetalles>

        </CardBody>

        <CardFooter>
          <div className="w-full flex flex-row justify-between mt-4  items-center">

            <Chip color="success" className="w-1/4 text-center text-lg font-bold text-white p-4"

            >{"Total: " + totalPago}</Chip>
            <Button
              color="success"
              onClick={() => guardarFactura()}
              className="p-5 text-white font-bold text-lg "
            >
              Guardar
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showAgregarProducto && (
        <div
          className="w-[30%] mx-5"
        >
          <TarjetaVenta
            AgregarVenta={AgregarVenta}
            ListaProductosVendidos={listVentas}
          />
        </div>
        
      )}
      {showActualizarProducto && (
        <div className="w-1/3">
          <TarjetaActualizarVenta
            productActualizar={productoActualizar}
            ActualizarVenta={ActualizarVenta}
            EliminarVenta={EliminarVenta}
            CancelarActualizacionVenta={CancelarActualizacionVenta}
          />
        </div>

      )}
    </div>

  );
};


export const InputField = ({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
  onBlur,
}) => {
  return (
    <div className="mx-2">
      <label htmlFor={id} className="block text-black text-sm font-bold mb-2">
        {label}
      </label>
      <div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:bg-gray-200"
        />
        {errorMessage && ErrorMensaje(errorMessage, "w-full")}
      </div>
    </div>
  );
};

export const TarjetaVenta = ({ AgregarVenta, ListaProductosVendidos }) => {
  //Usuario
  const usuario = JSON.parse(localStorage.getItem('user'));

  //Variables para captura de datos
  const [cantidadVender, setCantidadVender] = useState(null);
  const [cobro, setCobro] = useState();
  const [precio, setPrecio] = useState();

  //variables para Mensajes de error
  const [errorMessageCantidadVender, setErrorMessageCantidadVender] =
    useState("");

  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });

  const handelCantidadVender = (value) => {
    if (value >= 0 && value <= productSell.stock) {
      setCantidadVender(value);
      setErrorMessageCantidadVender(null);
      handelCobro(value);
    } else if (value >= productSell.stock) {
      setCantidadVender(productSell.stock);
      setErrorMessageCantidadVender(
        "No puedes vender más de " + productSell.stock + "KG"
      );
    } else {
      setCantidadVender("");
      setErrorMessageCantidadVender("No se admiten valores negativos");
    }
  };

  const handelCobro = (value) => {
    setCobro(value * precio);
  };

  //Controladores de vista
  const [showListProduct, setShowListProduct] = useState(true);
  const [showDatailProduct, setShowDatailProduct] = useState(false);
  const [showAlert, setshowAlert] = useState(false);

  let [productSell, setproductSell] = useState(null);

  const handelShowListProduct = (value) => {
    if (value && cantidadVender > 0) {
      setShowListProduct(value);
      setShowDatailProduct(false);
      setErrorMessageCantidadVender(null);
      AgregarVenta(productSell, cantidadVender, cobro);


    } else {
      setshowAlert(true);
      setMensaje({
        Mensaje: "Error tiene que digitar una cantidad a vender ",
        colorBoton: "red",
        colorText: "red",
        isError: false,
        textBoton: "Cerrar",
      });
    }
  };

  const handelShowAlert = (value) => {
    setshowAlert(value);
  };
  const handelShowAlertClose = () => {
    setshowAlert(false);
  };

  const handelShowDetailProduct = (value) => {
    if (value != null) {
      setShowDatailProduct(true);
      setCobro(0);
      setCantidadVender(null);
      setShowListProduct(false);
      handelProductSell(value);
    } else {
      setShowDatailProduct(false);

      setShowListProduct(true);
    }
  };

  const handelProductSell = (value) => {
    setproductSell(value);
    setPrecio(value.price);
  };
  //Lista de productos de la base de datos
  const [listaProductos, setListaProductos] = useState([]);
  const [listaProductosBD, setListaProductosBD] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await consultarProductos(); // Espera a que se complete la consulta de productos
    };
    fetchData();
    FiltrarProductosVendidos()
  }, []);

  const consultarProductos = async () => {
    const respuesta = await ConsultarProductos(usuario.username);
    setListaProductos(respuesta.datos.sort((a, b) => a.id - b.id));
    setListaProductosBD(respuesta.datos.sort((a, b) => a.id - b.id))
  };



  const FiltrarProductosVendidos = () => {
    if (ListaProductosVendidos.length !== 0) {
      const listaFiltrada = listaProductosBD.filter(
        (producto) =>
          !ListaProductosVendidos.some(
            (venta) => venta.producto.id === producto.id
          )
      );
      setListaProductos(listaFiltrada);
    }
  };

  useEffect(() => {
    if (ListaProductosVendidos.length == 0) {
      consultarProductos();
    }
  }, [usuario.username]);

  useEffect(() => {
    FiltrarProductosVendidos();
  }, [ListaProductosVendidos]);

  return (
    <Card className=" flex flex-col min-h-[700px]  max-h-[700px] ">
      <CardHeader>
        <h2 className="text-black text-2xl font-bold text-center w-full">
          Selecione un producto a vender
        </h2>
      </CardHeader>

      <CardBody className="max-h-[560px] overflow-y-hidden">
        {showListProduct && (
          <div className="flex justify-center ">
            <ProductList
              products={listaProductos}
              onSelectProduct={handelShowDetailProduct}
            />
          </div>
        )}

        {showDatailProduct && (
          <>
            <div className="">
              <ProductDetail product={productSell} />
            </div>

            <div className="flex justify-between items-end w-full">
              <div className="">
                <InputField
                  label="Cantidad a vender KG"
                  id="Cantidad a vender"
                  type="text"
                  placeholder="Cantidad a vender kg"
                  value={cantidadVender}
                  onChange={(e) => handelCantidadVender(e.target.value)}
                  errorMessage={errorMessageCantidadVender}
                />
              </div>
              <div className="">
                <Chip  size="lg">Cobro : ${cobro ? cobro : 0} </Chip>
              </div>
            </div>

            
          </>
        )}
      </CardBody>
      <CardFooter>
        {showDatailProduct && (
          <div className="w-full flex justify-between p-5">
            <Button
              color="success"
              className=" text-white  w-[40%] mx-2"
              onClick={() => handelShowListProduct(true)}
            >
              AGREGAR VENTA
            </Button>

            <Button
            color="danger"
              className=" text-white w-[40%] rounded-lg mx-2"
              onClick={() => handelShowDetailProduct(null)}
            >
              CANCELAR
            </Button>
          </div>
        )}
        
      </CardFooter>
    </Card>

  );
};



export const TarjetaActualizarVenta = ({
  productActualizar,
  ActualizarVenta,
  EliminarVenta,
  CancelarActualizacionVenta,

}) => {
  const [cobro, setCobro] = useState();
  const [precio, setPrecio] = useState(productActualizar.price);

  //variables para Mensajes de error
  const [errorMessageCantidadVender, setErrorMessageCantidadVender] =
    useState("");

  const [showAlert, setshowAlert] = useState(false);
  const handelShowAlertClose = () => {
    setshowAlert(false);
  };

  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });

  const handelActualizarVenta = () => {
    if (cantidadVender > 0) {
      ActualizarVenta(productActualizar, cantidadVender, cobro, false);
    } else {
      setshowAlert(true);
      setMensaje({
        Mensaje: "Error tiene que digitar una cantidad a vender ",
        colorBoton: "red",
        colorText: "red",
        isError: false,
        textBoton: "Cerrar",
      });
    }
  };
  const [cantidadVender, setCantidadVender] = useState(null);

  const handelCantidadVender = (value) => {
    if (value >= 0 && value <= productActualizar.stock) {
      setCantidadVender(value);
      setErrorMessageCantidadVender(null);
      handelCobro(value);
    } else if (value >= productActualizar.stock) {
      setCantidadVender(productActualizar.stock);
      setErrorMessageCantidadVender(
        "No puedes vender más de " + productActualizar.stock + "KG"
      );
    } else {
      setCantidadVender("");
      setErrorMessageCantidadVender("No se admiten valores negativos");
    }
  };

  const handelCobro = (value) => {
    setCobro(value * precio);
  };

  return (
    <div className="px-5 min-h-full min-w-full">
      <Card className="mx-5" >
        <CardHeader>
          <h2 className="w-full text-black text-2xl font-bold mb-2 text-center">
            ACTUALIZA TU VENTA
          </h2>
        </CardHeader>

        <CardBody className="min-w-full  flex items-center">

          <ProductDetail product={productActualizar} />
          <div className="w-[250px]">
            <InputField
              label="Cantidad a vender KG"
              id="Cantidad a vender"
              type="text"
              placeholder="Cantidad a vender kg"
              value={cantidadVender}
              onChange={(e) => handelCantidadVender(e.target.value)}
              errorMessage={errorMessageCantidadVender}
            />
          </div>

        </CardBody>

        <CardFooter className="w-full h-20">
          <div className="w-full h-11 flex justify-between">
            <Button
              size="lg"
              className="font-bold"
              onClick={() => CancelarActualizacionVenta()}
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              color="success"
              onClick={() => handelActualizarVenta()}
              className="text-white font-bold"
            >
              Actualizar
            </Button>
            <Button
              size="lg"
              color="danger"
              onClick={() =>
                EliminarVenta(productActualizar, null, null, true)}
            >
              ELIMINAR
            </Button>
          </div>
        </CardFooter>

      </Card>
    </div>

  );
};

