import { Bar } from 'react-chartjs-2';
import PropTypes from "prop-types";
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

    const misoptions = {
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
            },
            x: {
                ticks: { color: 'rgba(0, 0, 0)' }
            }
        }
    };



    return <Bar data={data} options={misoptions} />;
}

GraficaBarra.propTypes = {
  data: PropTypes.object.isRequired,
};
