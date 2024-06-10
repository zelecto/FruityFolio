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

    const misoptions = {
        scales: {
            y: {
                min: 0,
            },
            
        }
    };


    return <Line data={midata} options={misoptions} />
}