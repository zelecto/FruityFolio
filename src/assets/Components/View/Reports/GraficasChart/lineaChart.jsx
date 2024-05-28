import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

var beneficios = [0, 1000, 20000, 360000, 80000, 40000, 300000, -20, 25, 30, 12, 60];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

var midata = {
    labels: meses,
    datasets: [ // Cada una de las líneas del gráfico
        {
            label: 'Beneficios',
            data: beneficios,
            tension: 0.5,
            fill: true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 5,
            pointBorderColor: 'rgba(255, 99, 132)',
            pointBackgroundColor: 'rgba(255, 99, 132)',
        },
        {
            label: 'Otra línea',
            data: [20, 25, 60, 65, 45, 10, 0, 25, 35, 7, 20, 25]
        },
    ],
};



export default function LinesChart({datos={
    nombreEjeX: [],
    nombreLinea: "",
    datos: [],
    datosComparacion: [],
    nombreLineaComparada: ""
        
    }}) {
    
    const midata={
        labels: datos.nombreEjeX,
            datasets: [
                {
                    label: datos.nombreLinea,
                    data: datos.datos,
                    tension: 0.5,
                    fill: true,
                    borderColor: 'rgb(54, 162, 235)', // Azul
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Azul con transparencia
                    pointRadius: 5,
                    pointBorderColor: 'rgb(54, 162, 235)', // Azul
                    pointBackgroundColor: 'rgb(54, 162, 235)', // Azul
                },
                {
                    label: datos.nombreLineaComparada,
                    data: datos.datosComparacion,
                    tension: 0.5,
                    fill: true,
                    borderColor: 'rgb(255, 99, 132)', // Rojo
                    backgroundColor: 'rgba(255, 99, 132, 0.5)', // Rojo con transparencia
                    pointRadius: 5,
                    pointBorderColor: 'rgb(255, 99, 132)', // Rojo
                    pointBackgroundColor: 'rgb(255, 99, 132)', // Rojo
                }

            ],
    }

    //const maxValue = datos.datos.length > 0 ? Math.max(...datos.datos) : 0;
    //const maxWithIncrement = Math.round(maxValue * 1.10);
    var misoptions = {
        scales: {
            y: {
                min: 0,
                //max: maxWithIncrement

            },
            
        }
    };


    return <Line data={midata} options={misoptions} />
}