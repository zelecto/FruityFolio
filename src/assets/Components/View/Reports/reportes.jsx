import { Button, Card, CardBody, CardFooter, CardHeader, DateRangePicker, Listbox, ListboxItem, Radio, RadioGroup, Spacer, Switch } from "@nextui-org/react";
import Header from "../Header";
import { Apple, Package, ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import LinesChart from "./GraficasChart/lineaChart";
import GraficaBarra from "./GraficasChart/BarrasChart";
import { getNumeroVentaProducto } from "../../Base/BdReportes";

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
            ></Header>

            <div className="w-screen min-h-[750px] flex">

                <div className="min-w-96 min-h-full bg-white shadow-lg p-5">
                    <h2 className="text-center text-lg font-bold">Seleciona el repote</h2>
                    <Listbox
                        variant="faded"
                        color="primary"
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
            const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day}`;
            const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day}`;

            const respuesta = await getNumeroVentaProducto(fechaInicio, fechaFinal, usuario.username);

            if (respuesta.datos) {
                setDatosOriginales(respuesta.datos);
                updateDataReporteProductos(respuesta.datos, selecionGrilla);
            }
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
                    variant="faded"
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

            {dataReporteProductos.labels.length > 0 &&
                <Card className="h-[615px] w-4/5 my-4 flex items-center">
                    <CardBody className="w-4/5 h-1/2 flex justify-center">
                        <GraficaBarra data={dataReporteProductos}></GraficaBarra>
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
            }
        </div>
    );
}



const ViewReportFactura = () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const [rangoFecha, setRangoFecha] = useState({
        start: parseDate("2024-05-01"),
        end: parseDate(formatearFecha(new Date())),
    });

    const [isSelected, setIsSelected] = React.useState(false);

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
            const fechaInicio = `${rangoFecha.start.year}-${rangoFecha.start.month}-${rangoFecha.start.day} `
            const fechaFinal = `${rangoFecha.end.year}-${rangoFecha.end.month}-${rangoFecha.end.day} `

            const respuesta = await getNumeroVentaProducto(fechaInicio, fechaFinal, usuario.username);

            if (respuesta.datos) {
                setData(respuesta.datos);
                console.log(respuesta.datos)
            }
        }
        fetchData()

    }, [rangoFecha]);

    let formatter = useDateFormatter({ dateStyle: "long" });

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-4/5 flex justify-between">
                
                <div className="">
                    <DateRangePicker
                        variant="faded"
                        size="lg"
                        label="Seleciona la fecha"
                        color="primary"
                        value={rangoFecha}
                        onChange={setRangoFecha}
                    />
                    <p className="text-default-500 text-sm text-center">
                        Fecha selecionada:{" "}
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
                        variant="faded"
                        size="lg"
                        label="Seleciona la fecha"
                        color="primary"
                        value={rangoFecha}
                        onChange={setRangoFecha}
                        isDisabled={!isSelected}
                    />
                    <p className="text-default-500 text-sm text-center">
                        Fecha selecionada:{" "}
                        {rangoFecha
                            ? formatter.formatRange(
                                rangoFecha.start.toDate(getLocalTimeZone()),
                                rangoFecha.end.toDate(getLocalTimeZone()),
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

            {rangoFecha &&
                <Card className="h-[615px] w-4/5 my-4 flex items-center">
                    <CardBody className=" w-4/5 h-1/2 flex justify-center ">

                    </CardBody>

                </Card>
            }


        </div>
    );
}



function formatearFecha(fecha) {
    // Obtenemos los componentes de la fecha
    const year = fecha.getFullYear();
    // Los meses van de 0 a 11, así que sumamos 1 para obtener el mes correcto
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    // Devolvemos la fecha formateada
    return `${year}-${month}-${day}`;
}