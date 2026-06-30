import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const OrderList = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data.orders || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setLoading(false);
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

    const getPaymentBadge = (status) => {
        const variants = {
            pending: 'warning',
            completed: 'success',
            failed: 'danger'
        };
        return variants[status] || 'secondary';
    };

    const filteredOrders = statusFilter
        ? orders.filter(order => order.status === statusFilter)
        : orders;

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading orders...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">🛒 Orders</h2>
                <div>
                    <span className="text-muted me-3">Total: {orders.length} orders</span>
                    {!isAdmin && (
                        <Badge bg="secondary" className="p-2">
                            👁️ View Only (Staff)
                        </Badge>
                    )}
                </div>
            </div>

            {/* Filter */}
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                    <Button variant="outline-secondary" onClick={() => setStatusFilter('')}>
                        Clear Filter
                    </Button>
                </Col>
            </Row>

            {/* Orders Table */}
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table responsive hover>
                        <thead className="bg-light">
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="fw-bold">#{order.orderNumber}</td>
                                        <td>{order.User?.name || 'Unknown'}</td>
                                        <td>${order.totalAmount}</td>
                                        <td>
                                            <Badge bg={getStatusBadge(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={getPaymentBadge(order.paymentStatus)}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button variant="outline-primary" size="sm">
                                                <FaEye /> View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-4">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrderList;