import { Button, Card, CardBody, CardFooter, CardHeader, Chip, DateRangePicker, Image, Listbox, ListboxItem, Radio, RadioGroup, Spacer, Spinner, Switch } from "@nextui-org/react";
import Header from "../Header";
import { Apple, Package, ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import LinesChart from "./GraficasChart/lineaChart";
import GraficaBarra from "./GraficasChart/BarrasChart";
import { getCantidadOrdenesMeses, getIngresoFacturaDia, getNumeroVentaProducto } from "../../Base/BdReportes";
import IconoGrafica from "../../Icons/IconoGrafica.png";

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

                {opcionMenu == "text" &&

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
                }

                {opcionMenu == "Producto" &&

                    <div className="w-full h-full my-4">
                        <ViewReportPruduct></ViewReportPruduct>
                    </div>
                }

                {opcionMenu == "Factura" &&

                    <div className="w-full h-full my-4">
                        <ViewReportFactura></ViewReportFactura>
                    </div>
                }

                {opcionMenu == "Pedido" &&

                    <div className="w-full h-full my-4">
                        <ViewReportOrder></ViewReportOrder>
                    </div>
                }
                

            </div>
        </div>
    );
}


const ViewReportPruduct = () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const [rangoFecha, setValue] = useState({
        start: parseDate("2024-05-01"),
        end: parseDate(formatearFecha(new Date())),
    });

    const [datosOriginales, setDatosOriginales] = useState([]);
    const [dataReporteProductos, setDataReporteProductos] = useState({
        labels: [],
        valores: [],
        nombre: "",
        color: "",
    });

    const [selecionGrilla, setSelecionGrilla] = useState("cantidad");

    //Loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let fechaInicio = new Date();
        fechaInicio.setDate(1);

        setValue({
            start: parseDate(formatearFecha(fechaInicio)),
            end: parseDate(formatearFecha(new Date())),
        });
    }, []);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day}`;
            const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day}`;
            
            
            const respuesta = await getNumeroVentaProducto(fechaInicio, fechaFinal, usuario.username);
            
            if (respuesta.datos) {
                setDatosOriginales(respuesta.datos);
                updateDataReporteProductos(respuesta.datos, selecionGrilla);
            }
            setIsLoading(false)
        }
        fetchData();
    }, [rangoFecha]);

    useEffect(() => {
        if (datosOriginales.length > 0) {
            updateDataReporteProductos(datosOriginales, selecionGrilla);
        }
    }, [selecionGrilla]);

    const updateDataReporteProductos = (datos, tipo) => {
        if (tipo === "cantidad") {
            setDataReporteProductos({
                labels: datos.map(item => item.nombreProducto),
                valores: datos.map(item => item.cantidadVendida),
                nombre: "Cantidad vendida",
                color: "#267bbc",
            });
        } else {
            setDataReporteProductos({
                labels: datos.map(item => item.nombreProducto),
                valores: datos.map(item => item.ingresoTotal),
                nombre: "Total ingresos",
                color: "#95eb5e",
            });
        }
    }

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
                    onChange={setValue}
                    maxValue={today(getLocalTimeZone())}
                />
                <p className="text-default-500 text-sm text-center">
                    Fecha seleccionada:{" "}
                    {rangoFecha
                        ? formatter.formatRange(
                            rangoFecha.start.toDate(getLocalTimeZone()),
                            rangoFecha.end.toDate(getLocalTimeZone()),
                        )
                        : " - "}
                </p>
            </div>

            
                <Card className="h-[615px] w-4/5 my-4 flex items-center">
                    <CardBody className="w-4/5 h-1/2 flex justify-center">
                        {
                            isLoading ? (<Spinner label="Loading..." size="lg" color="primary" labelColor="primary"></Spinner>)
                            :
                                (<GraficaBarra data={dataReporteProductos}></GraficaBarra>)
                        }
                        
                    </CardBody>
                    <CardFooter className="flex justify-end p-5">
                        <RadioGroup
                            label="Selecciona los datos a visualizar"
                            orientation="horizontal"
                            defaultValue="cantidad"
                            value={selecionGrilla}
                            onValueChange={setSelecionGrilla}
                        >
                            <Radio value="cantidad">Cantidad Vendida</Radio>
                            <Radio value="ingreso">Ingreso Total</Radio>
                        </RadioGroup>
                    </CardFooter>
                </Card>
            
        </div>
    );
}



const ViewReportFactura = () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    
    const [rangoFecha, setRangoFecha] = useState({
        start: parseDate("2024-05-01"),
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
        nombreEjeX:[],
        nombreLinea:"",
        datos:[],
        datosComparacion:[],
        nombreLineaComparada:""
    })
    
    useEffect(() => {
        
        let fechaActual = new Date();
        let fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

        // Establecer el rango de fechas del mes actual
        setRangoFecha({
            start: parseDate(formatearFecha(fechaInicio)),
            end: parseDate(formatearFecha(fechaActual)),
        });

        // Ajustar fechaInicio al primer día del mes anterior
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);

        // Establecer el rango de fechas del mes anterior
        setRangoFechaComparacion({
            start: parseDate(formatearFecha(new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1))),
            end: parseDate(formatearFecha(new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0))),
        });

    }, []);

    useEffect(() => {

        async function fetchData() {
            setIsLoading(true);
            const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day} `
            const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day} `

            const respuesta = await getIngresoFacturaDia(fechaInicio, fechaFinal, usuario.username);

            if (respuesta.datos) {
                let fecha = new Date();
                setDataBase({
                    nombreEjeX: respuesta.datos.map(item => item.dia),
                    nombreLinea: `${fecha.toLocaleString('es-ES', { month: 'long' })}`,
                    datos: respuesta.datos.map(item => item.totalIngresos),
                    datosComparacion: isSelected ? dataBase.datosComparacion: [],
                    nombreLineaComparada: isSelected ? dataBase.nombreLinea : "Sin comparacion"
                });
                
            }
            setIsLoading(false);
        }
        fetchData()

    }, [rangoFecha]);


    useEffect(() => {
    async function fetchData() {
        setIsLoading(true)
        const fechaInicio = `${rangoFechaComparacion.start.year}-${rangoFechaComparacion.start.month}-${rangoFechaComparacion.start.day}`;
        const fechaFinal = `${rangoFechaComparacion.end.year}-${rangoFechaComparacion.end.month}-${rangoFechaComparacion.end.day}`;

        const respuesta = await getIngresoFacturaDia(fechaInicio, fechaFinal, usuario.username);

        if (respuesta.datos) {
            // Crear un objeto que mapee los días a sus ingresos
            const ingresosPorDia = {};
            respuesta.datos.forEach(item => {
                ingresosPorDia[item.dia] = item.totalIngresos;
            });

            // Obtener los nombres de eje X actuales
            const nombresEjeXActuales = new Set(dataBase.nombreEjeX);
            // Crear una lista de ingresos con ceros para los días que faltan
            const datosComparacionActualizados = Array.from(nombresEjeXActuales, dia => ingresosPorDia[dia] || 0);

            // Actualizar los datos con los nuevos nombres de eje X y la lista de ingresos actualizada
            setDataBase(prevData => ({
                ...prevData,
                nombreEjeX: [...nombresEjeXActuales], // Copiar los nombres de eje X actuales
                datosComparacion: datosComparacionActualizados,
                nombreLineaComparada: "Mes de comparacion"
            }));

            
            setIsLoading(false)
        }
    }
    if (isSelected) {
        fetchData();
    }
    else{
        setDataBase(prevData => ({
            ...prevData,
            datosComparacion: [],
            nombreLineaComparada: "Sin comparacion"
        }));
    }
}, [rangoFechaComparacion,isSelected]);

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
                                rangoFecha.end.toDate(getLocalTimeZone()),
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
                                rangoFechaComparacion.end.toDate(getLocalTimeZone()),
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

            {dataBase &&
                <Card className="h-[615px] w-4/5 my-4 flex items-center">
                    
                    <CardBody className=" w-4/5 h-1/2 flex justify-center ">
                        {
                            isLoading ? (<Spinner label="Loading..." size="lg" color="primary" labelColor="primary"></Spinner>) 
                                : 
                            (<LinesChart datos={dataBase}></LinesChart>)
                        }
                            
                    </CardBody>

                    <CardFooter className="flex items-center justify-center font-bold text-xl">
                        <div className="flex w-10/12 justify-between px-4">
                            <Chip color="primary" size="lg" className="mx-5">
                                Ingreso total : {dataBase.datos.reduce((total, current) => total + current, 0)}
                            </Chip>
                            {isSelected > 0 && (
                                <Chip color="danger" size="lg">
                                    Ingreso total : {dataBase.datosComparacion.reduce((total, current) => total + current, 0)}
                                </Chip>
                            )}
                        </div>  
                    </CardFooter>

                </Card>
            }


        </div>
    );
}

const ViewReportOrder = () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const [rangoFecha, setRangoFecha] = useState({
        start: parseDate("2024-05-01"),
        end: parseDate(formatearFecha(new Date())),
    });
    const [fechasInicializadas, setFechasInicializadas] = useState(false);

    const [datosOriginales, setDatosOriginales] = useState([]);
    const [dataReporteProductos, setDataReporteProductos] = useState({
        labels: [],
        valores: [],
        nombre: "",
        color: "",
    });

    const [seleccionGrilla, setSeleccionGrilla] = useState("cantidad");

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

            const respuesta = await getCantidadOrdenesMeses(fechaInicio, fechaFinal, usuario.username);
            console.log(respuesta);
            if (respuesta.datos) {
                setDatosOriginales(respuesta.datos);
                updateDataReporteProductos(respuesta.datos, seleccionGrilla);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [rangoFecha, seleccionGrilla, fechasInicializadas]);

    const updateDataReporteProductos = (datos, tipo) => {
        if (tipo === "cantidad") {
            setDataReporteProductos({
                labels: datos.map(item => item.mes),
                valores: datos.map(item => item.cantidadPedidos),
                nombre: "Cantidad Vendida",
                color: "#267bbc",
            });
        } else {
            setDataReporteProductos({
                labels: datos.map(item => item.mes),
                valores: datos.map(item => item.cantidadPedidos),
                nombre: "Ingreso Total",
                color: "#95eb5e",
            });
        }
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
                    {
                        isLoading ? (<Spinner label="Loading..." size="lg" color="primary" labelColor="primary" />)
                            :
                            (<GraficaBarra data={dataReporteProductos} />)
                    }
                </CardBody>
                {   //</Card><CardFooter className="flex justify-end p-5">
                    //</Card><RadioGroup
                    //</Card>    label="Selecciona los datos a visualizar"
                    //</Card>    orientation="horizontal"
                    //</Card>    defaultValue="cantidad"
                    //</Card>    value={seleccionGrilla}
                    //</Card>    onValueChange={setSeleccionGrilla}
                    //</Card>>
                    //</Card>    <Radio value="cantidad">Cantidad Vendida</Radio>
                    //</Card>    <Radio value="ingreso">Ingreso Total</Radio>
                    //</Card></RadioGroup>
                    //</Card></CardFooter>
                }
            </Card>
        </div>
    );
};


export function formatearFecha(fecha) {
    // Obtenemos los componentes de la fecha
    const year = fecha.getFullYear();
    // Los meses van de 0 a 11, así que sumamos 1 para obtener el mes correcto
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    // Devolvemos la fecha formateada
    return `${year}-${month}-${day}`;
}