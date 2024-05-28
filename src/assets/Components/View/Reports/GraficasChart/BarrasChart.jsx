import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

//var midata = {
//    labels: meses,
//    datasets: [
//        {
//            label: 'Beneficios',
//            data: beneficios,
//            backgroundColor: 'rgba(0, 220, 195, 0.5)'
//        }
//    ]
//};

export default function GraficaBarra({ data = {
    labels: [],
    valores: [],
    nombre: "",
    color: "",
} }) {
    


    const midata = {
        labels: data.labels,
        datasets: [
            {
                label: data.nombre,
                data: data.valores,
                backgroundColor: data.color
            }
        ]
    };

    
    const maxValue = data.valores.length > 0 ? Math.max(...data.valores) : 0;

    
    const maxWithIncrement = Math.round(maxValue * 1.10);

    var misoptions = {
        responsive: true,
        animation: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                min: 0,
                max: maxWithIncrement
            },
            x: {
                ticks: { color: 'rgba(0, 0, 0)' }
            }
        }
    };



    return <Bar data={midata} options={misoptions} />;
}

