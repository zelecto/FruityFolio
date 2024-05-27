import { Card, CardBody, CardHeader, DateRangePicker, Listbox, ListboxItem } from "@nextui-org/react";
import Header from "../Header";
import { Apple, Package, ReceiptText } from "lucide-react";
import React, { useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export const ReportView = () => {

    return (
        <div className="min-h-screen w-screen bg-[#F5F5F5]">
            <Header
                title={"Reportes"}
                subtitle={"Reportes del dia"}
            ></Header>

            <div className="w-screen bg-[#F5F5F5] flex">
                <div className="w-1/6 m-5">
                    <Card>
                        <CardHeader>
                            <h2 >Seleciona el repote</h2>
                        </CardHeader>
                        <CardBody>
                            <Listbox
                                variant="faded"
                                color="primary"
                                selectionMode="single"
                            >
                                <ListboxItem description={"Número de unidades vendidas"}
                                    startContent={<Apple></Apple>}
                                    className="my-2"
                                >
                                    Productos
                                </ListboxItem>

                                <ListboxItem description={"Resumen de actividad mensual"}
                                    startContent={<ReceiptText></ReceiptText>}
                                    className="my-2"
                                >
                                    Facturación
                                </ListboxItem>

                                <ListboxItem description={"Lista de pedidos recientes"}
                                    startContent={<Package></Package>}
                                    className="my-2"
                                >
                                    Órdenes
                                </ListboxItem>

                            </Listbox>
                        </CardBody>

                    </Card>
                    
                </div>

                <div className="w-full p-5">
                    <ViewReportPruduct></ViewReportPruduct>
                </div>


            </div>
        </div>
    );
}


const ViewReportPruduct=()=>{
    const [value, setValue] = useState({
        start: parseDate("2024-04-01"),
        end: parseDate("2024-04-08"),
    });

    let formatter = useDateFormatter({ dateStyle: "long" });
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-1/3 flex flex-col gap-y-2">
                <DateRangePicker
                    variant="faded"
                    size="lg"
                    label="Seleciona la fecha"
                    color="primary"
                    value={value}
                    onChange={setValue}
                />
                <p className="text-default-500 text-sm">
                    Selected date:{" "}
                    {value
                        ? formatter.formatRange(
                            value.start.toDate(getLocalTimeZone()),
                            value.end.toDate(getLocalTimeZone()),
                        )
                        : "--"}
                </p>
            </div>
        </div>
    );
}

function App() {
    

    

    return (
        <div className="flex flex-row gap-2">
            
        </div>
    );
}