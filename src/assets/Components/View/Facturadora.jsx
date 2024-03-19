import React, { useEffect, useState } from "react";
import validarNombre, {
  ErrorMensaje,
  MensajeAlert,
} from "../Tools/Validadores";
import Header from "./Header";
import {
  ListaPoductos,
  ProductDetail,
  ProductList,
} from "../Logic/ConsultarProductos";

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
        <MensajeAlert
          message={mensaje.Mensaje}
          onClose={handleCloseAlert}
          isError={mensaje.isError}
          buttonColor={mensaje.colorBoton}
          textColor={mensaje.colorText}
          buttonText={mensaje.textBoton}
        />
      )}
      <Header
        link="/paginaPrincipal"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="FruityFolio"
        subtitle="Añade un producto a tu catálogo."
      />
      <div className="flex justify-center items-center mx-auto mt-20 ">
        <TarjetaFactura />
      </div>
    </div>
  );
};
export default CrearFacturaForm;

const TarjetaFactura = () => {
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
      console.log("Aqui estoy");
      setErrorMessageCedula("No se admiten mas de 10 nuemros");
    } else if (/^[a-zA-Z]+$/.test(newValue)) {
      setCedula("");
      setErrorMessageCedula("No se admiten letras");
    }
  };

  const handleNombre = (newValue) => {
    if (validarNombre(newValue)) {
      setNombre(newValue);
      setErrorMessageNombre(null);
    } else {
      setNombre("");
      setErrorMessageNombre("No se admite numeros");
    }
  };

  const handleCorreo = (newValue) => {
    setCorreo(newValue);
    setErrorMessagCorreo("");
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
      setErrorMessagCorreo("");
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

  //Lista Ventas
  const [listVentas, setListVentas] = useState([]);
  const [totalPago, setTotalPago] = useState(0);

  const AgregarVenta = (Producto, Cantida, Total) => {
    // Crea una nueva copia del array listVentas y agrega el nuevo objeto de venta
    const nuevaListaVentas = [
      ...listVentas,
      {
        producto: Producto,
        cantidad: Cantida,
        total: Total,
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
    if (value === true) {
      setShowAgregarProducto(false);
      setproductoActualizar(producto.producto);
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
        cantidad: Cantidad,
        total: Total,
      };

      // Calcula el nuevo totalPago sumando el total de todas las ventas en la lista
      const nuevoPrecio = nuevaListaVentas.reduce(
        (acumulador, venta) => acumulador + venta.total,
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
    const nuevaListaVentas = [...listVentas];

    // Encuentra el índice del objeto de venta que deseas eliminar
    const index = nuevaListaVentas.findIndex(
      (venta) => venta.producto.id === ProductoId
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
      console.error("Venta no encontrada en la lista.");
    }
    handelshowActualizarProducto(false);
  };
  const CancelarActualizacionVenta = () => {
    handelshowActualizarProducto(false);
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col w-[900px] h-[650px] bg-[#CCE6FF] px-5 items-center rounded-md">
        <div className="flex justify-between rounded-md  w-[800px]">
          <div className="w-[800px]  flex justify-center items-center">
            <div className="flex justify-between">
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
          </div>
        </div>
        <div className="w-full flex justify-between px-5 mt-4">
          <h1 className=" text-2xl font-bold mb-2 text-center">
            FECHA {handelFechaActual()}
          </h1>
          <p className=" text-2xl text-slate-500 mb-2 text-center">
            # Factura : 1000000
          </p>
        </div>
        <div className="w-full h-full flex flex-col items-center p-5 rounded-md  ">
          {/* Color de fondo para los detalles de la factura */}
          <div className="flex flex-col w-full border border-black rounded-lg  h-full">
            <div className="flex flex-row justify-between p-4 bg-[#4D94FF]">
              <h2 className="font-semibold text-lg w-1/4 text-center">
                NOMBRE
              </h2>

              <h2 className="font-semibold text-lg w-1/4 text-center">
                CANTIDAD
              </h2>

              <h2 className="font-semibold text-lg w-1/4 text-center">
                PRECIO
              </h2>

              <h2 className="font-semibold text-lg w-1/4 text-center">TOTAL</h2>
            </div>

            {/* CONTENEDOR DE PRODUCTOS VENDIDOS */}
            <div className="max-h-[340px] overflow-auto">
              {/* PRODUCTO VENDIDO */}
              <div>
                {listVentas.map((venta, index) => (
                  <div
                    key={index}
                    onClick={() => handelshowActualizarProducto(true, venta)}
                    className="flex flex-row justify-between border-t border-black p-4 hover:bg-slate-300 cursor-pointer"
                  >
                    <p className="w-1/4 text-center  border-black pl-4">
                      {venta.producto.name}
                    </p>
                    <p className="w-1/4 text-center border-l border-black pl-4">
                      {venta.cantidad} kg
                    </p>
                    <p className="w-1/4 text-center border-l border-black pl-4">
                      ${venta.producto.price}
                    </p>
                    <p className="w-1/4 text-center border-l border-black pl-4">
                      ${venta.total}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-4 px-10 items-center">
            <p className=" w-1/4 text-center text-lg  font-bold">Total :</p>
            <p className=" w-1/4 text-center text-lg font-bold pl-4">
              $ {totalPago}
            </p>
          </div>
        </div>
      </div>

      {showAgregarProducto && (
        <TarjetaVenta
          AgregarVenta={AgregarVenta}
          ListaProductosVendidos={listVentas}
        />
      )}
      {showActualizarProducto && (
        <TarjetaActualizarVenta
          productActualizar={productoActualizar}
          ActualizarVenta={ActualizarVenta}
          EliminarVenta={EliminarVenta}
          CancelarActualizacionVenta={CancelarActualizacionVenta}
        />
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
      AgregarVenta(productSell, cantidadVender, cobro);
      
      FiltrarProductosVendidos();
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

  //filtrar productos vendidos
  

  const [listaProductos, setListaProductos] = useState([]);

  useEffect(() => {
    FiltrarProductosVendidos();
  }, [ListaProductosVendidos]); // Asegúrate de que el efecto se ejecute cada vez que cambie la lista de productos vendidos

  const FiltrarProductosVendidos = () => {
    const listaDefault = ListaPoductos();
    if (ListaProductosVendidos && ListaProductosVendidos.length !== 0) {
      setListaProductos(
        listaDefault.filter(
          (producto) =>
            !ListaProductosVendidos.some(
              (venta) => venta.producto.id === producto.id
            )
        )
      );
    } else {
      setListaProductos(listaDefault);
    }
    console.clear();
    console.log(ListaProductosVendidos);
  };

  return (
    <div className="flex flex-col items-center  mx-20 bg-[#CCE6FF] w-[500px] rounded-md">
      <div>
        <h2 className="text-black text-2xl font-bold mb-2 text-center">
          Selecione un producto a vender
        </h2>
      </div>

      {showAlert && (
        <MensajeAlert
          message={mensaje.Mensaje}
          onClose={handelShowAlertClose}
          isError={mensaje.isError}
          buttonColor={mensaje.colorBoton}
          textColor={mensaje.colorText}
          buttonText={mensaje.textBoton}
        />
      )}

      {showListProduct && (
        <div>
          <ProductList
            products={listaProductos}
            onSelectProduct={handelShowDetailProduct}
          />
        </div>
      )}
      {showDatailProduct && (
        <>
          <div className="flex justify-center bg-gray-100  rounded-lg shadow-md w-[400px] mt-5">
            <ProductDetail product={productSell} />
          </div>

          <div className=" flex px-5 justify-between items-center  mt-6 w-full h-[130px]">
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
            <div className="">
              <h2 className="">Cobro : ${cobro ? cobro : 0} </h2>
            </div>
          </div>

          <div className="w-full flex justify-between p-5 ">
            <button
              className="bg-green-400 font-bold text-white hover:bg-green-700 w-[40%] h-[200%] rounded-lg mx-2"
              onClick={() => handelShowListProduct(true)}
            >
              AGREGAR VENTA
            </button>

            <button
              className="bg-red-400 font-bold text-white hover:bg-red-700 w-[40%] h-[200%] rounded-lg mx-2"
              onClick={() => handelShowDetailProduct(null)}
            >
              CANCELAR
            </button>
          </div>
        </>
      )}
    </div>
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
      ActualizarVenta(productActualizar, cantidadVender, cobro);
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
    <>
      <div className="flex flex-col items-center mx-20 bg-[#CCE6FF] w-[500px] rounded-md">

        <div>
          <h2 className="text-black text-2xl font-bold mb-2 text-center">
            ACTUALIZA TU VENTA
          </h2>
        </div>

        {showAlert && (
          <MensajeAlert
            message={mensaje.Mensaje}
            onClose={handelShowAlertClose}
            isError={mensaje.isError}
            buttonColor={mensaje.colorBoton}
            textColor={mensaje.colorText}
            buttonText={mensaje.textBoton}
          />
        )}
        <div className="flex justify-center bg-gray-100  rounded-lg shadow-md w-[400px] mt-5">
          <ProductDetail product={productActualizar} />
        </div>

        <div className=" flex px-5 justify-between items-center  mt-6 w-full h-[130px]">
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
          <div className="">
            <h2 className="">Cobro : ${cobro ? cobro : 0} </h2>
          </div>
        </div>

        <div className="w-full flex justify-between p-5 ">
          <button
            className="bg-slate-400 font-bold text-white hover:bg-slate-700 w-[40%] h-[200%] rounded-lg mx-2"
            onClick={() => CancelarActualizacionVenta()}
          >
            CANCELAR
          </button>
          <button
            className="bg-green-400 font-bold text-white hover:bg-green-700 w-[40%] h-[200%] rounded-lg mx-2"
            onClick={() => handelActualizarVenta()}
          >
            ACTUALIZAR
          </button>
          <button
            className="bg-red-400 font-bold text-white hover:bg-red-700 w-[40%] h-[200%] rounded-lg mx-2"
            onClick={() => EliminarVenta(productActualizar.id)}
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </>
  );
};
