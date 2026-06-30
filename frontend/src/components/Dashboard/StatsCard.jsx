import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ icon, title, value, bgColor = 'primary', subtitle }) => {
    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className={`bg-${bgColor} bg-opacity-10 p-3 rounded me-3`}>
                        <span className={`text-${bgColor} fs-3`}>{icon}</span>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="text-muted mb-1">{title}</h6>
                        <h3 className="fw-bold mb-0">{value}</h3>
                        {subtitle && <small className="text-muted">{subtitle}</small>}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatsCard;