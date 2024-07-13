import React, { useEffect, useState } from 'react';
import { SidePar } from '../../Components/SidePar/SidePar';
import { Input } from '@material-tailwind/react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import TransactionGraph from '../../Components/TransactionGraph/TransactionGraph';
import { Fade, Slide } from 'react-awesome-reveal';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
    const [customerData, setCustomerData] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [filterName, SetFilterName] = useState("");
    const [filterAmount, SetFilterAmount] = useState("");
    const [selectedCustomer , setSelectedCustomer] = useState(null)
    async function getData(path, setState) {
        try {
            const options = {
                url: `http://localhost:5001/${path}`,
    
                method: "GET",
            }
            const { data } = await axios.request(options);
            console.log(data);
            setState(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData("customers", setCustomerData);
        getData("transactions", setTransactionData)

    }, []);

    function getCustomerInfo(customer_id) {
        let customerInfo = {}
        for (let i = 0; i < customerData.length; i++) {
            if (customerData[i].id === String(customer_id)) {
                return customerData[i] ? customerInfo = { name: customerData[i].name, picture: customerData[i].picture , id: customerData[i].id } : "UNKNOWN";
            }
        }
    }
    const filteredTransactions = transactionData.filter((transaction) => {
        const customerName = getCustomerInfo(transaction.customer_id).name.toLowerCase();
        const filterNameLower = filterName.toLowerCase();
        return (
            (filterName === "" || customerName.includes(filterNameLower)) &&
            (filterAmount === "" || transaction.amount === Number(filterAmount))
        );
    });

    return (
        <>
          
            <section className='min-h-screen bg-[#EEEDEB] '>
            <Slide>
            <div className="grid grid-cols-12 gap-2">
                    <div className='md:col-span-4 lg:col-span-3 hidden md:block h-full'>
                        <SidePar />
                    </div>
                    <div className='min-h-screen col-span-12 md:col-span-8 lg:col-span-9 bg-[#EEEDEB]'>
                        <div className="container grid grid-cols-12">
                            <div className='col-span-12 p-5'>
                            {selectedCustomer ? selectedCustomer && (
                                    <TransactionGraph transactions={filteredTransactions} selectedCustomer={selectedCustomer} />
                                ) : <><h1 className='text-center text-2xl font-body'>"Please Click in any user to git the grpah"</h1></>}
                            </div>
                          
                            <div className='col-span-12 p-5'>
                                <div>
                                    <form className=' md:flex justify-center items-center  gap-3'>
                                        <div className='md:w-1/2 my-3'>
                                            <Input label='Search by customer' type='search' value={filterName}
                                                onChange={(e) => {
                                                    SetFilterName(e.target.value)
                                                }} />
                                        </div>
                                        <div className='md:w-1/2'>
                                            <Input label='Search by Amount' type='number'
                                                onChange={(e) => {
                                                    SetFilterAmount(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="flex overflow-x-auto flex-col items-center mt-8">
                                    <table className="min-w-full  shadow-md">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Customer Info
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Transaction Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {filteredTransactions ? filteredTransactions.map((transaction) => (
                                                <tr className='cursor-pointer' key={transaction.id} onClick={()=>{setSelectedCustomer(getCustomerInfo(transaction.customer_id))}} >
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                                        <div className='flex items-center gap-3 justify-center'>
                                                            <picture>
                                                                <img src={getCustomerInfo(transaction.customer_id).picture} className='w-[30px] object-cover h-[30px] hidden lg:block rounded-full' alt="" />
                                                            </picture>
                                                            {getCustomerInfo(transaction.customer_id).name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">{transaction.amount} L.E</td>
                                                </tr>
                                            )) : "loading"}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>
            </section>
            
        </>
    )
}
