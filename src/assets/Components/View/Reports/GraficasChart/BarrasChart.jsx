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


export default function GraficaBarra({data}) {
    console.log(data);
    //const maxValue = data.valores.length > 0 ? Math.max(...data.valores) : 0;

    
    //const maxWithIncrement = Math.round(maxValue * 1.10);

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
                //max: maxWithIncrement
            },
            x: {
                ticks: { color: 'rgba(0, 0, 0)' }
            }
        }
    };



    return <Bar data={data} options={misoptions} />;
}

