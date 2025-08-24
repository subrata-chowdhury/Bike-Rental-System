import React, { useEffect, useState } from 'react'
import { AdminPanel } from '../components/AdminPanel.tsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, Bar, Rectangle } from "recharts";
import apiUrl from '../../scripts/API Calls/apiUrl.ts';
import { useSocket } from '../../scripts/socket.ts';
import { useNavigate } from 'react-router-dom';

const COLORS = ["#50b454ff", "#F44336"]; // Green for available, Red for not available

export type Tabs = {
    name: string;
    icon: React.ReactNode;
    component: React.JSX.Element;
}

interface AdminPageProp {

}

const AdminPage: React.FC<AdminPageProp> = ({ }): React.JSX.Element => {
    const [donutChartData, setDonutChartData] = useState([
        { name: "Available Bikes", value: 0 },
        { name: "Not Available", value: 0 },
    ]);
    const [revenueData, setRevenueData] = useState<{ month: number, revenue: number }[]>([]);
    const socketRef = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('bike_details_changed', () => {
            getStatisticsDetails()
        });

        return () => {
            socketRef.current?.off('bike_details_changed');
        };
    }, [socketRef]);

    useEffect(() => {
        getStatisticsDetails();
    }, [])

    async function getStatisticsDetails() {
        const token = localStorage.getItem('adminToken');
        fetch(apiUrl + "/api/statistics?year=" + new Date().getFullYear(), {
            headers: {
                'authorization': `${token}`
            }
        }).then(async res => {
            if (res.status === 200) {
                const values = await res.json();
                setDonutChartData([
                    { name: "Available Bikes", value: values.counts.available },
                    { name: "Not Available", value: values.counts.notAvailable },
                ])
                setRevenueData(() => {
                    const valuesData = [...values.totalRevenue];
                    valuesData.forEach((e, i) => {
                        if (e === null) {
                            valuesData[i] = { month: i, revenue: 0 }
                        }
                    })
                    return valuesData
                })
            }
            if(res.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        })
    }

    return (
        <>
            <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
                <AdminPanel />
                <div className='flex-grow-1' style={{ padding: '2rem' }}>
                    <h2 className='mb-4'>Admin Dashboard</h2>
                    <div className='d-flex gap-2'>
                        <div className='card p-2 px-3'>
                            <h5 className="text-xl font-semibold mb-4">Total Revenue</h5>
                            <ResponsiveContainer width={400} height="100%">
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={revenueData || []}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                                    {/* <Bar dataKey="month" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="card p-2 px-3">
                            <h5 className="text-xl font-semibold mb-4">Available vs Not Available Bikes</h5>
                            <ResponsiveContainer width={300} height={300}>
                                <PieChart>
                                    <Pie
                                        data={donutChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        cornerRadius={10}
                                        dataKey="value"
                                    >
                                        {donutChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPage;