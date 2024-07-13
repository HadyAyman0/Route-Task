import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Fade, Slide } from 'react-awesome-reveal';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const TransactionGraph = ({ transactions, selectedCustomer }) => {
    useEffect(() => {
    }, [transactions, selectedCustomer]);

    const filteredTransactions = transactions.filter(
        transaction => transaction.customer_id === Number(selectedCustomer.id)
    );
    console.log(filteredTransactions);
    const data = {
        labels: filteredTransactions.map(transaction => transaction.date),
        datasets: [
            {
                label: 'Transaction Amount',
                data: filteredTransactions.map(transaction => transaction.amount),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Total Transaction Amount per Day for ${selectedCustomer.name}`,
            },
        },
    };

    return  <Slide direction='down'><Line data={data} options={options} /></Slide>;
};

export default TransactionGraph;
