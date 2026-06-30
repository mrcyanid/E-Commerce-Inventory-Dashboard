import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button } from 'react-bootstrap';  // ← Added Button
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import StatsCard from './StatsCard';
import api from '../../services/api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/dashboard/stats');
            console.log('Dashboard Stats Response:', response.data);
            setStats(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError(error.response?.data?.message || 'Failed to load dashboard data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();

        const handleProductUpdate = () => {
            fetchDashboardStats();
        };

        window.addEventListener('productUpdated', handleProductUpdate);

        return () => {
            window.removeEventListener('productUpdated', handleProductUpdate);
        };
    }, []);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading dashboard...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <div className="alert alert-danger">
                    <h5>❌ Error Loading Dashboard</h5>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={fetchDashboardStats}>
                        Retry
                    </button>
                </div>
            </Container>
        );
    }

    const monthlyData = stats?.monthlySales || [];
    const hasData = monthlyData.some(item => item.total > 0);

    const chartData = {
        labels: monthlyData.map(item => {
            const [year, month] = item.month.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[parseInt(month) - 1]} ${year}`;
        }) || ['No Data'],
        datasets: [
            {
                label: 'Monthly Revenue ($)',
                data: monthlyData.map(item => parseFloat(item.total) || 0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `$${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toFixed(2);
                    }
                }
            }
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'danger'
        };
        return variants[status] || 'secondary';
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">📊 Dashboard Overview</h2>
                <span className="text-muted">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>

            <Row className="g-4 mb-4">
                <Col xs={12} sm={6} lg={3}>
                    <StatsCard
                        icon={<FaBox />}
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        bgColor="primary"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatsCard
                        icon={<FaShoppingCart />}
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        bgColor="success"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatsCard
                        icon={<FaUsers />}
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        bgColor="info"
                    />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatsCard
                        icon={<FaDollarSign />}
                        title="Total Revenue"
                        value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
                        bgColor="warning"
                    />
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                <Col xs={12} lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">📈 Revenue Trend</h5>
                                {!hasData && (
                                    <Badge bg="info">No sales data yet</Badge>
                                )}
                            </div>
                            {hasData ? (
                                <div style={{ height: '300px' }}>
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="display-1 mb-3">📊</div>
                                    <h5 className="text-muted">No Revenue Data Available</h5>
                                    <p className="text-muted">
                                        Complete some orders to see revenue trends here.
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">📦 Orders by Status</h5>
                            {stats?.ordersByStatus?.length > 0 ? (
                                stats.ordersByStatus.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded bg-light">
                                        <span className="text-capitalize fw-semibold">{item.status}</span>
                                        <Badge bg={getStatusBadge(item.status)} pill>
                                            {item.count}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center">No orders found</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">🕐 Recent Orders</h5>
                            <Table responsive hover>
                                <thead className="bg-light">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentOrders?.length > 0 ? (
                                        stats.recentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="fw-bold">#{order.orderNumber}</td>
                                                <td>{order.User?.name || 'Unknown'}</td>
                                                <td>${order.totalAmount}</td>
                                                <td>
                                                    <Badge bg={getStatusBadge(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                                No recent orders
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;