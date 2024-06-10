import React, { useEffect, useState } from "react";

import Header from "../../Header";
import { ProductDetail, ProductList } from "../../../Logic/ConsultarProductos";
import {
  ConsultarProductosPorStock,
} from "../../../Base/BdProductos";
import { GuardarFactura } from "../../../Base/BdFactura";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
} from "@nextui-org/react";
import { TablaDetalles } from "../tienda/GestorVentas";
import { Fingerprint, Mail, User, Users } from "lucide-react";

const CrearFacturaForm = () => {
  return (
    <div className="h-screen w-screen bg-[#F5F5F5]">

      <Header title="FruityFolio" />
      <div className="flex justify-center items-center mx-auto mt-16 ">
        <TarjetaFactura />
      </div>
    </div>
  );
};

import * as Yup from "yup";
import { useFormik } from "formik";
import InputFieldForm from "../../Components/input_From";
import toast from "react-hot-toast";
export default CrearFacturaForm;

const schemaClente = Yup.object({
  cedula: Yup.string()
    .matches(/^\d+$/, "No se admiten letras")
    .min(10, "Minimo 10 digitos")
    .max(10, "No se admiten más de 10 números")
    .required("La cédula es obligatoria"),
  nombre: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "No se admiten números")
    .trim()
    .required("El nombre es obligatorio")
    .test(
      "no-empty",
      "El nombre no puede estar vacío",
      (value) => value.trim() !== ""
    ),
  correo: Yup.string()
    .email("Correo electrónico no válido")
    .trim()
    .required("El correo es obligatorio")
    .test(
      "no-empty",
      "El correo no puede estar vacío",
      (value) => value.trim() !== ""
    ),
});

const TarjetaFactura = () => {
  const [recargar, setRecargar] = useState(false);

  const handelRecargar = () => {
    setRecargar(!recargar);
  };
  const formik = useFormik({
    initialValues: {
      cedula: "",
      nombre: "",
      correo: "",
    },

    validationSchema: schemaClente,
    onSubmit: async (values, { resetForm }) => {
      if (listVentas.length > 0) {
        const usuario = JSON.parse(localStorage.getItem("user"));
        const cliente = {
          cedula: values.cedula,
          nombre: values.nombre,
          correo: values.correo,
        };

        const factura = {
          cliente: cliente,
          fechaActual: handelFechaActualGuardar(),
          listaProductosVendidos: listVentas,
          total: totalPago,
          usuarioUsername: usuario.username,
        };
        const toastLoding = toast.loading("Guardando...");
        const data = await GuardarFactura(factura);
        toast.dismiss(toastLoding);
        if (data) {
          toast.success("Factura guardada");
          resetForm();
          handelRecargar();
          setListVentas([]);
        } else {
          toast.error(`${data}`);
        }
      } else {
        toast.error("No se han realizado ventas");
      }
    },
  });

  const inputConfigs = [
    {
      id: "cedula",
      label: "Cédula",
      startContent: (
        <Fingerprint
          color={
            formik.touched.cedula && Boolean(formik.errors.cedula)
              ? "#F31260"
              : "#338EF7"
          }
        ></Fingerprint>
      ),
    },
    {
      id: "nombre",
      label: "Nombre",
      startContent: (
        <User
          color={
            formik.touched.nombre && Boolean(formik.errors.nombre)
              ? "#F31260"
              : "#338EF7"
          }
        ></User>
      ),
    },
    {
      id: "correo",
      label: "Correo",
      startContent: (
        <Mail
          color={
            formik.touched.correo && Boolean(formik.errors.correo)
              ? "#F31260"
              : "#338EF7"
          }
        ></Mail>
      ),
    },
  ];

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

  const [idSimulado, setIdsimulado] = useState(0);

  const handelIdSimulado = (agregar) => {
    if (agregar) {
      setIdsimulado(idSimulado + 1);
    } else {
      setIdsimulado(idSimulado - 1);
    }
  };

  //Lista Ventas
  const [listVentas, setListVentas] = useState([]);
  const [totalPago, setTotalPago] = useState(0);

  const AgregarVenta = (Producto, Cantida, Total) => {
    // Crea una nueva copia del array listVentas y agrega el nuevo objeto de venta
    handelIdSimulado(true);
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

  const [productoActualizar, setProductoActualizar] = useState(null);

  const handelshowActualizarProducto = (value, producto) => {
    if (value === true) {
      setShowAgregarProducto(false);
      setProductoActualizar(producto);
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
      toast.error("aqui Venta no encontrada en la lista.");
    }
    handelshowActualizarProducto(false);
  };
  const CancelarActualizacionVenta = () => {
    handelshowActualizarProducto(false);
  };


  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full flex justify-center "
    >
      <Card className="w-1/3">
        <CardHeader className="felx flex-col">
          <h1 className="w-full flex justify-center font-bold text-xl mb-0">
            Datos cliente
          </h1>
          <div className="flex justify-between mt-4">
            {inputConfigs.map((config) => (
              <div className="mx-5">
                <InputFieldForm
                  key={config.id}
                  config={config}
                  formik={formik}
                  startContent={config.startContent}
                />
              </div>
            ))}
          </div>
        </CardHeader>

        <CardBody>
          <h1 className=" text-xl font-bold mb-2">
            Fecha {handelFechaActual()}
          </h1>

          <TablaDetalles
            listaFacturas={listVentas}
            showActualizarVenta={handelshowActualizarProducto}
          ></TablaDetalles>
        </CardBody>

        <CardFooter>
          <div className="w-full flex flex-row justify-between mt-4  items-center">
            <Chip
              color="success"
              className="w-1/4 text-center text-lg font-bold text-white p-4"
            >
              {"Total: " + totalPago}
            </Chip>
            <Button
              color="success"
              variant="ghost"
              type="submit"
              className="p-5  font-bold text-lg "
            >
              Guardar
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showAgregarProducto && (
        <div className="w-[30%] mx-5">
          <TarjetaVenta
            AgregarVenta={AgregarVenta}
            ListaProductosVendidos={listVentas}
            recargar={recargar}
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
    </form>
  );
};

export const TarjetaVenta = ({
  AgregarVenta,
  ListaProductosVendidos,
  recargar,
}) => {
  //Usuario
  const usuario = JSON.parse(localStorage.getItem("user"));

  //Variables para captura de datos
  const [cantidadVender, setCantidadVender] = useState(null);
  const [cobro, setCobro] = useState();
  const [precio, setPrecio] = useState();

  //variables para Mensajes de error
  const [errorMessageCantidadVender, setErrorMessageCantidadVender] =
    useState(null);

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

  const [productSell, setProductSell] = useState(null);

  const handelShowListProduct = (value) => {
    if (value && cantidadVender > 0) {
      setShowListProduct(value);
      setShowDatailProduct(false);
      setErrorMessageCantidadVender(null);
      AgregarVenta(productSell, cantidadVender, cobro);
      setErrorMessageCantidadVender(null);
    } else {
      setErrorMessageCantidadVender("Obligatorio");
    }
  };

  const handelShowDetailProduct = (value) => {
    if (value != null) {
      setShowDatailProduct(true);
      setCobro(0);
      setCantidadVender(null);
      setShowListProduct(false);
      handelProductSell(value);
      setErrorMessageCantidadVender(null);
    } else {
      setShowDatailProduct(false);

      setShowListProduct(true);
    }
  };

  const handelProductSell = (value) => {
    setProductSell(value);
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
    console.clear();
    console.log(ListaProductosVendidos,"Lista de productos vendidos")
    
  }, []);

  const consultarProductos = async () => {
    const respuesta = await ConsultarProductosPorStock(usuario.username, true);
    setListaProductos(respuesta.datos.sort((a, b) => a.id - b.id));

    FiltrarProductosVendidos(respuesta.datos.sort((a, b) => a.id - b.id));
    setListaProductosBD(respuesta.datos.sort((a, b) => a.id - b.id));
    
  };

  const FiltrarProductosVendidos = (listaProductosBD) => {
    if (ListaProductosVendidos.length !== 0) {
      console.log("Lista de la base de datos", listaProductosBD);
      const listaFiltrada = listaProductosBD.filter(
        (producto) =>
          !ListaProductosVendidos.some(
            (venta) => venta.producto.id === producto.id
          )
      );
      console.log("lista filtradas");
      console.log(listaFiltrada);
      setListaProductos(listaFiltrada);
      console.log([...listaProductos], "Lista actual");
    }
  };

  useEffect(() => {
    consultarProductos();
  }, [recargar]);

  useEffect(() => {
    FiltrarProductosVendidos(listaProductosBD);
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
              products={[...listaProductos]}
              onSelectProduct={handelShowDetailProduct}
            />
          </div>
        )}

        {showDatailProduct && (
          <>
            <div className="">
              <ProductDetail product={productSell} />
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="">
                <Input
                  color="primary"
                  size="lg"
                  variant="bordered"
                  labelPlacement="outside"
                  label="Cantidad a vender kg"
                  id="Cantidad a vender"
                  type="number"
                  value={cantidadVender}
                  onChange={(e) => handelCantidadVender(e.target.value)}
                  isInvalid={errorMessageCantidadVender ? true : false}
                  errorMessage={errorMessageCantidadVender}
                />
              </div>
              <div className="">
                <Chip size="lg">Cobro : ${cobro ? cobro : 0} </Chip>
              </div>
            </div>
          </>
        )}
      </CardBody>
      <CardFooter>
        {showDatailProduct && (
          <div className="w-full flex justify-between p-5  ">
            <Button
              color="success"
              variant="ghost"
              className="  w-[40%] mx-2 font-bold text-sm"
              onClick={() => handelShowListProduct(true)}
            >
              AGREGAR VENTA
            </Button>

            <Button
              color="danger"
              variant="ghost"
              className=" w-[40%] rounded-lg mx-2 font-bold text-sm"
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
    useState(null);

  const handelActualizarVenta = () => {
    if (cantidadVender > 0) {
      ActualizarVenta(productActualizar, cantidadVender, cobro, false);
      setErrorMessageCantidadVender(null);
    }else{
      setErrorMessageCantidadVender("Obligatorio");
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
      <Card className="mx-5">
        <CardHeader>
          <h2 className="w-full text-black text-2xl font-bold mb-2 text-center">
            ACTUALIZA TU VENTA
          </h2>
        </CardHeader>

        <CardBody className="min-w-full  flex items-center">
          <ProductDetail product={productActualizar} />
          <div className="flex justify-between items-center w-full">
            <div>
              <Input
                color="primary"
                size="lg"
                variant="bordered"
                labelPlacement="outside"
                label="Cantidad a vender KG"
                id="Cantidad a vender"
                type="number"
                placeholder="Cantidad a vender kg"
                value={cantidadVender}
                onChange={(e) => handelCantidadVender(e.target.value)}
                isInvalid={errorMessageCantidadVender ? true : false}
                errorMessage={errorMessageCantidadVender}
              />
            </div>

            <div className="">
              <Chip size="lg">Cobro : ${cobro ? cobro : 0} </Chip>
            </div>
          </div>
        </CardBody>

        <CardFooter className="w-full h-20">
          <div className="w-full h-11 flex justify-between">
            <Button
              size="lg"
              variant="ghost"
              className="font-bold"
              onClick={() => CancelarActualizacionVenta()}
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              color="success"
              variant="ghost"
              onClick={() => handelActualizarVenta()}
              className=" font-bold"
            >
              Actualizar
            </Button>
            <Button
              size="lg"
              variant="ghost"
              color="danger"
              onClick={() => EliminarVenta(productActualizar, null, null, true)}
            >
              ELIMINAR
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
