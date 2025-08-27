import React, { useEffect, useState } from 'react'
import { AdminPanel } from '../components/AdminPanel.tsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, Bar, Rectangle, LegendPayload } from "recharts";
import apiUrl from '../../scripts/API Calls/apiUrl.ts';
import { useSocket } from '../../scripts/socket.ts';
import { useNavigate } from 'react-router-dom';

const COLORS = ["#7E5DED", "#C65DED", "#9889F8", "#5D84ED", "#ED5DCC"]; // Green for available, Red for not available

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
    const [bookingStatusData, setBookingStatusData] = useState([
        { name: "Booked", count: 0 },
        { name: "Picked Up", count: 0 },
        { name: "Returned", count: 0 },
        { name: "Cancelled", count: 0 },
    ]);
    const [revenueData, setRevenueData] = useState<{ month: string, revenue: number }[]>([]);
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
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    valuesData.forEach((_, i) => {
                        valuesData[i] = { month: months[i], revenue: valuesData[i].revenue }
                    })
                    return valuesData
                })
                setBookingStatusData(values.statusCounts);
            }
            if (res.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        })
    }

    return (
        <>
            <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
                <AdminPanel />
                <div className='flex-grow-1' style={{ padding: '2rem', maxHeight: '100vh', overflowY: 'auto' }}>
                    <h2 className='mb-4'>Admin Dashboard</h2>
                    <div className='gap-2'>
                        <div className='card d-inline-flex p-2 px-3 me-2'>
                            <h5 className="text-xl font-semibold mb-4">Total Revenue</h5>
                            <ResponsiveContainer width={500} height={300}>
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
                                    <Legend content={<CustomLegend />} />
                                    <Bar dataKey="revenue" fill="#5D84ED" activeBar={<Rectangle fill="pink" stroke="blue" />} radius={[10, 10, 0, 0]} />
                                    {/* <Bar dataKey="month" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="card d-inline-flex p-2 px-3 me-2 mt-2">
                            <h5 className="text-xl font-semibold mb-4">Bike Availability</h5>
                            <ResponsiveContainer width={300} height={300}>
                                <PieChart>
                                    <Pie
                                        data={donutChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        cornerRadius={5}
                                        dataKey="value"
                                        startAngle={180}          // 🔥 Start at 180 degrees
                                        endAngle={0}
                                    >
                                        {donutChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend content={<CustomLegend />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card d-inline-flex p-2 px-3 me-2 mt-2">
                            <h5 className="text-xl font-semibold mb-4">Booking Status</h5>
                            <ResponsiveContainer width={300} height={300}>
                                <PieChart>
                                    <Pie
                                        data={bookingStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={0}
                                        cornerRadius={4}
                                        dataKey="count"
                                        startAngle={360}          // 🔥 Start at 180 degrees
                                        endAngle={0}
                                    >
                                        {bookingStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend content={<CustomLegend />} />
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


const CustomLegend = ({ payload }: { payload?: LegendPayload[] }) => {
    return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: 'center', gap: '10px' }}>
            {payload?.map((entry, index) => (
                <li
                    key={`item-${index}`}
                    style={{ display: "flex", alignItems: "center", marginBottom: 4, color: entry.color ?? "#ccc" }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: entry.color ?? "#ccc",
                            marginRight: 6,
                        }}
                    />
                    {(entry.value || '').charAt(0).toUpperCase() + entry.value?.slice(1)}
                </li>
            ))}
        </ul>
    );
};