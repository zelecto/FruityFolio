import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  DateRangePicker,
  Image,
  Listbox,
  ListboxItem,
  Spinner,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import Header from "../Header";
import { Apple, InfoIcon, Package, ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import LinesChart from "./GraficasChart/lineaChart";
import GraficaBarra from "./GraficasChart/BarrasChart";
import {
  getCantidadOrdenesMeses,
  getIngresoFacturaDia,
  getNumeroVentaProducto,
} from "../../Base/BdReportes";
import IconoGrafica from "../../Icons/IconoGrafica.png";
import toast from "react-hot-toast/headless";

export const ReportView = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const opcionMenu = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  return (
    <div className="min-h-screen w-screen bg-[#F5F5F5]">
      <Header
        title={"Reportes"}
        subtitle={"Reportes del dia"}
        link={"/PaginaPrincipal"}
      ></Header>

      <div className="w-screen min-h-[750px] flex">
        <div className="min-w-96 min-h-full bg-white shadow-lg p-5">
          <h2 className="text-center text-lg font-bold">Seleciona el repote</h2>
          <Listbox
            variant="faded"
            color="primary"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <ListboxItem
              key="Producto"
              description={"Número de unidades vendidas"}
              startContent={<Apple></Apple>}
              className="my-2"
            >
              Productos
            </ListboxItem>

            <ListboxItem
              key="Factura"
              description={"Resumen de actividad mensual"}
              startContent={<ReceiptText></ReceiptText>}
              className="my-2"
            >
              Facturación
            </ListboxItem>

            <ListboxItem
              key="Pedido"
              description={"Lista de pedidos recientes"}
              startContent={<Package></Package>}
              className="my-2"
            >
              Órdenes
            </ListboxItem>
          </Listbox>
        </div>

        {opcionMenu == "text" && (
          <div className="w-full min-h-full flex justify-center items-center">
            <div className="w-1/2 h-1/2 flex flex-col justify-center items-center">
              <Image
                alt="Fondo graficas"
                src={IconoGrafica}
                width={400}
                height={200}
              ></Image>
              <h2 className="font-bold text-lg">
                Seleciona los reportes y graficas que quieras ver
              </h2>
            </div>
          </div>
        )}

        {opcionMenu == "Producto" && (
          <div className="w-full h-full my-4">
            <ViewReportPruduct></ViewReportPruduct>
          </div>
        )}

        {opcionMenu == "Factura" && (
          <div className="w-full h-full my-4">
            <ViewReportFactura></ViewReportFactura>
          </div>
        )}

        {opcionMenu == "Pedido" && (
          <div className="w-full h-full my-4">
            <ViewReportOrder></ViewReportOrder>
          </div>
        )}
      </div>
    </div>
  );
};

const ViewReportPruduct = () => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  const [rangoFecha, setRangoFecha] = useState({
    start: parseDate("2024-06-01"),
    end: parseDate(formatearFecha(new Date())),
  });

  const [dataReporteProductos, setDataReporteProductos] = useState({
    labels: [],
    datasets: [
      {
        label: "Cantidad vendida",
        data: [],
        backgroundColor: "#267bbc",
      },
      {
        label: "Total ingresos",
        data: [],
        backgroundColor: "#95eb5e",
      },
    ],
  });

  const [formatoGanacia, setFormatoGanacia] = useState(null);

  //Loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let fechaInicio = new Date();
    fechaInicio.setDate(1);

    setRangoFecha({
      start: parseDate(formatearFecha(fechaInicio)),
      end: parseDate(formatearFecha(new Date())),
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day}`;
      const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day}`;

      const respuesta = await getNumeroVentaProducto(
        fechaInicio,
        fechaFinal,
        usuario.username
      );
      
      if (respuesta.datos) {
        updateDataReporteProductos(respuesta.datos);
      }else{
        toast.success("No hay ventas en esta fecha");
        console.log("No hay datos");
        setDataReporteProductos({
          labels: [],
          datasets: [
            {
              label: "Cantidad vendida",
              data: [],
              backgroundColor: "#267bbc",
            },
            {
              label: "Total ingresos",
              data: [],
              backgroundColor: "#95eb5e",
            },
          ],
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [rangoFecha]);

  const updateDataReporteProductos = (datos) => {
    const gananciaFormateada= formatNumbersWithMaxFormat(datos.map((item) => item.ingresoTotal));
    setFormatoGanacia(gananciaFormateada.format);
    const midata = {
      labels: datos.map((item) => item.nombreProducto),
      datasets: [
        {
          label: "Cantidad vendida",
          data: datos.map((item) => item.cantidadVendida),
          backgroundColor: "#006FEE",
        },
        {
          label: "Total ingresos",
          data: gananciaFormateada.formattedNumbers,
          backgroundColor: "#17C964",
        },
        {
          label: "Stock Actual",
          data: datos.map((item) => item.stockActual),
          backgroundColor: "#F31260",
        },
      ],
    };

    setDataReporteProductos(midata);
  };

  let formatter = useDateFormatter({ dateStyle: "long" });
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-1/3 flex flex-col gap-y-2">
        <DateRangePicker
          variant="flat"
          size="lg"
          label="Selecciona la fecha"
          color="primary"
          value={rangoFecha}
          onChange={setRangoFecha}
          maxValue={today(getLocalTimeZone())}
        />
        <p className="text-default-500 text-sm text-center">
          Fecha seleccionada:{" "}
          {rangoFecha
            ? formatter.formatRange(
                rangoFecha.start.toDate(getLocalTimeZone()),
                rangoFecha.end.toDate(getLocalTimeZone())
              )
            : " - "}
        </p>
      </div>

      <Card className="h-[615px] w-4/5 my-4 flex items-center">
        <CardBody className="w-4/5 h-1/2 flex justify-center">
          {isLoading ? (
            <Spinner
              label="Loading..."
              size="lg"
              color="primary"
              labelColor="primary"
            ></Spinner>
          ) : (
            <GraficaBarra data={dataReporteProductos}></GraficaBarra>
          )}
        </CardBody>
        <CardFooter>
          <div className="w-full flex justify-end">
            <Tooltip
              content={
                <p>
                  El ingreso se muestra en formato{" "}
                  <strong>{formatoGanacia}</strong>.<br />
                  <strong>K:</strong> Miles (miles de unidades monetarias).
                  <br />
                  <strong>M:</strong> Millones (millones de unidades
                  monetarias).
                  <br />
                  <strong>B:</strong> Miles de Millones (miles de millones de
                  unidades monetarias).
                </p>
              }
            >
              <Chip
                color="primary"
                size="lg"
                con
                endContent={<InfoIcon></InfoIcon>}
              >
                Nota
              </Chip>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const ViewReportFactura = () => {
  const usuario = JSON.parse(localStorage.getItem("user"));

  const [rangoFecha, setRangoFecha] = useState({
    start: parseDate("2024-06-01"),
    end: parseDate(formatearFecha(new Date())),
  });

  const [rangoFechaComparacion, setRangoFechaComparacion] = useState({
    start: parseDate("2024-05-01"),
    end: parseDate(formatearFecha(new Date())),
  });

  const [isSelected, setIsSelected] = useState(false);

  //Loadin

  const [isLoading, setIsLoading] = useState(true);

  const [dataBase, setDataBase] = useState({
    nombreEjeX: [],
    nombreLinea: "",
    datos: [],
    datosComparacion: [],
    nombreLineaComparada: "",
  });

  useEffect(() => {
    let fechaActual = new Date();
    let fechaInicio = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1
    );

    // Establecer el rango de fechas del mes actual
    setRangoFecha({
      start: parseDate(formatearFecha(fechaInicio)),
      end: parseDate(formatearFecha(fechaActual)),
    });

    // Ajustar fechaInicio al primer día del mes anterior
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);

    // Establecer el rango de fechas del mes anterior
    setRangoFechaComparacion({
      start: parseDate(
        formatearFecha(
          new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1)
        )
      ),
      end: parseDate(
        formatearFecha(
          new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0)
        )
      ),
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day} `;
      const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day} `;

      const respuesta = await getIngresoFacturaDia(
        fechaInicio,
        fechaFinal,
        usuario.username
      );

      if (respuesta.datos) {
        let fecha = new Date();
        setDataBase({
          nombreEjeX: respuesta.datos.map((item) => item.dia),
          nombreLinea: `${fecha.toLocaleString("es-ES", { month: "long" })}`,
          datos: respuesta.datos.map((item) => item.totalIngresos),
          datosComparacion: isSelected ? dataBase.datosComparacion : [],
          nombreLineaComparada: isSelected
            ? dataBase.nombreLinea
            : "Sin comparacion",
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [rangoFecha]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fechaInicio = `${rangoFechaComparacion.start.year}-${rangoFechaComparacion.start.month}-${rangoFechaComparacion.start.day}`;
      const fechaFinal = `${rangoFechaComparacion.end.year}-${rangoFechaComparacion.end.month}-${rangoFechaComparacion.end.day}`;

      const respuesta = await getIngresoFacturaDia(
        fechaInicio,
        fechaFinal,
        usuario.username
      );

      if (respuesta.datos) {
        // Crear un objeto que mapee los días a sus ingresos
        const ingresosPorDia = {};
        respuesta.datos.forEach((item) => {
          ingresosPorDia[item.dia] = item.totalIngresos;
        });

        // Obtener los nombres de eje X actuales
        const nombresEjeXActuales = new Set(dataBase.nombreEjeX);
        // Crear una lista de ingresos con ceros para los días que faltan
        const datosComparacionActualizados = Array.from(
          nombresEjeXActuales,
          (dia) => ingresosPorDia[dia] || 0
        );

        // Actualizar los datos con los nuevos nombres de eje X y la lista de ingresos actualizada
        setDataBase((prevData) => ({
          ...prevData,
          nombreEjeX: [...nombresEjeXActuales], // Copiar los nombres de eje X actuales
          datosComparacion: datosComparacionActualizados,
          nombreLineaComparada: "Mes de comparacion",
        }));

        setIsLoading(false);
      }
    }
    if (isSelected) {
      fetchData();
    } else {
      setDataBase((prevData) => ({
        ...prevData,
        datosComparacion: [],
        nombreLineaComparada: "Sin comparacion",
      }));
    }
  }, [rangoFechaComparacion, isSelected]);

  let formatter = useDateFormatter({ dateStyle: "long" });
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-4/5 flex justify-between">
        <div className="">
          <DateRangePicker
            variant="flat"
            size="lg"
            label="Seleciona la fecha"
            color="primary"
            value={rangoFecha}
            onChange={setRangoFecha}
            maxValue={today(getLocalTimeZone())}
          />
          <p className="text-default-500 text-sm text-center">
            {rangoFecha
              ? formatter.formatRange(
                  rangoFecha.start.toDate(getLocalTimeZone()),
                  rangoFecha.end.toDate(getLocalTimeZone())
                )
              : " - "}
          </p>
        </div>

        <div className="">
          <DateRangePicker
            variant="flat"
            size="lg"
            label="Seleciona la fecha"
            color="danger"
            value={rangoFechaComparacion}
            onChange={setRangoFechaComparacion}
            isDisabled={!isSelected}
            maxValue={rangoFecha.start}
          />
          <p className="text-default-500 text-sm text-center">
            {rangoFechaComparacion
              ? formatter.formatRange(
                  rangoFechaComparacion.start.toDate(getLocalTimeZone()),
                  rangoFechaComparacion.end.toDate(getLocalTimeZone())
                )
              : " - "}
          </p>
        </div>

        <div className=" flex justify-center items-center ">
          <Switch isSelected={isSelected} onValueChange={setIsSelected}>
            Comparación
          </Switch>
        </div>
      </div>

      {dataBase && (
        <Card className="h-[615px] w-4/5 my-4 flex items-center">
          <CardBody className=" w-4/5 h-1/2 flex justify-center ">
            {isLoading ? (
              <Spinner
                label="Loading..."
                size="lg"
                color="primary"
                labelColor="primary"
              ></Spinner>
            ) : (
              <LinesChart datos={dataBase}></LinesChart>
            )}
          </CardBody>

          <CardFooter className="flex items-center justify-center font-bold text-xl">
            <div className="flex w-10/12 justify-between px-4">
              <Chip color="primary" size="lg" className="mx-5">
                Ingreso total :{" "}
                {dataBase.datos.reduce((total, current) => total + current, 0)}
              </Chip>
              {isSelected > 0 && (
                <Chip color="danger" size="lg">
                  Ingreso total :{" "}
                  {dataBase.datosComparacion.reduce(
                    (total, current) => total + current,
                    0
                  )}
                </Chip>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const ViewReportOrder = () => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  const [rangoFecha, setRangoFecha] = useState({
    start: parseDate("2024-05-01"),
    end: parseDate(formatearFecha(new Date())),
  });
  const [fechasInicializadas, setFechasInicializadas] = useState(false);

  const [dataReporteProductos, setDataReporteProductos] = useState({
    labels: [],
    datasets: [
      {
        label: "Cantidad vendida",
        data: [],
        backgroundColor: "#267bbc",
      },
      {
        label: "Total ingresos",
        data: [],
        backgroundColor: "#95eb5e",
      },
    ],
  });

  // Loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fechaInicio = new Date();
    fechaInicio.setDate(1);
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);

    setRangoFecha({
      start: parseDate(formatearFecha(fechaInicio)),
      end: parseDate(formatearFecha(new Date())),
    });
    setFechasInicializadas(true);
  }, []);

  useEffect(() => {
    if (!fechasInicializadas) return; // Solo ejecuta fetchData si las fechas han sido inicializadas

    async function fetchData() {
      setIsLoading(true);
      const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day}`;
      const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day}`;

      const respuesta = await getCantidadOrdenesMeses(
        fechaInicio,
        fechaFinal,
        usuario.username
      );
      console.log(respuesta);
      if (respuesta.datos) {
        console.clear()
        console.log(respuesta.datos);
        updateDataReporteProductos(respuesta.datos);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [rangoFecha, fechasInicializadas]);

  const updateDataReporteProductos = (datos, tipo) => {
    const midata = {
      labels: datos.map((item) => item.mes),
      datasets: [
        {
          label: "Cantidad Vendida",
          data: datos.map((item) => item.cantidadPedidos),
          backgroundColor: "#267bbc",
        },
      ],
    };
    setDataReporteProductos(midata);
  };

  let formatter = useDateFormatter({ dateStyle: "long" });
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-1/3 flex flex-col gap-y-2">
        <DateRangePicker
          variant="flat"
          size="lg"
          label="Selecciona la fecha"
          color="primary"
          value={rangoFecha}
          onChange={setRangoFecha}
          maxValue={today(getLocalTimeZone())}
          visibleMonths={2}
        />
        <p className="text-default-500 text-sm text-center">
          Fecha seleccionada:{" "}
          {rangoFecha
            ? formatter.formatRange(
                rangoFecha.start.toDate(getLocalTimeZone()),
                rangoFecha.end.toDate(getLocalTimeZone())
              )
            : " - "}
        </p>
      </div>

      <Card className="h-[615px] w-4/5 my-4 flex items-center">
        <CardBody className="w-4/5 h-1/2 flex justify-center">
          {isLoading ? (
            <Spinner
              label="Loading..."
              size="lg"
              color="primary"
              labelColor="primary"
            />
          ) : (
            <GraficaBarra data={dataReporteProductos} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export function formatearFecha(fecha) {
  // Obtenemos los componentes de la fecha
  const year = fecha.getFullYear();
  // Los meses van de 0 a 11, así que sumamos 1 para obtener el mes correcto
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");

  // Devolvemos la fecha formateada
  return `${year}-${month}-${day}`;
}


function formatNumbersWithMaxFormat(numbers) {
    // Encuentra el valor máximo de la lista
    const maxNum = Math.max(...numbers);

    // Determina el formato adecuado basado en el valor máximo
    let format;
    if (maxNum >= 1.0e+9) {
        format = "B"; // Billions
    } else if (maxNum >= 1.0e+6) {
        format = "M"; // Millions
    } else if (maxNum >= 1.0e+3) {
        format = "K"; // Thousands
    } else {
        format = ""; // No formatting needed
    }

    // Aplica el formato adecuado a cada número
    const formattedNumbers = numbers.map(num => {
        let formattedNum;
        switch (format) {
            case "B":
                formattedNum = (num / 1.0e+9).toFixed(1);
                break;
            case "M":
                formattedNum = (num / 1.0e+6).toFixed(1);
                break;
            case "K":
                formattedNum = (num / 1.0e+3).toFixed(1);
                break;
            default:
                formattedNum = num.toString();
        }
        return formattedNum;
    });

    // Devuelve los números formateados y el formato utilizado
    return {
        formattedNumbers: formattedNumbers,
        format: format
    };
}