import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUserGraduate } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-primary bg-opacity-10">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={5} xl={4}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                    <FaUserGraduate size={40} className="text-primary" />
                                </div>
                                <h2 className="fw-bold text-primary">Inventory Dashboard</h2>
                                <p className="text-muted">Sign in to manage your inventory</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <div className="position-relative">
                                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                            <FaEnvelope className="text-muted" />
                                        </div>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            className="ps-5 py-2"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <div className="position-relative">
                                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                            <FaLock className="text-muted" />
                                        </div>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            className="ps-5 py-2"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 py-2 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p className="text-muted small">
                                    <strong>Demo Credentials:</strong><br />
                                    admin@example.com / admin123
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;