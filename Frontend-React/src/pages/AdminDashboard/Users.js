import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    const generatePdf = () => {
        const newWindow = window.open('http://localhost:8080/pdf/users', '_blank');
        if (newWindow) {
            toast.success('Generating PDF');
        } else {
            toast.error('Failed generating PDF');
        }
    };

    // Define columns for the Table component
    const columns = [
        { header: 'User ID', accessor: 'id' },
        { header: 'User Name', accessor: 'name' },
        { header: 'Email Address', accessor: 'email' },
        { header: 'Contact', accessor: 'phoneNumber' },
        { 
            header: 'Books Borrowed', 
            accessor: 'numBookBorrowed',
            cell: (row) => (
                <span className={row.numBookBorrowed > 0 ? 'text-primary fw-medium' : ''}>
                    {row.numBookBorrowed}
                </span>
            )
        }
    ];

    return (
        <div className="dashboard-content">
            <Card 
                title="User Management"
                className="users-card"
                footer={
                    <div className="d-flex justify-content-end">
                        <Button 
                            variant="accent" 
                            onClick={generatePdf}
                        >
                            Generate PDF
                        </Button>
                    </div>
                }
            >
                {loading ? (
                    <div className="text-center py-5">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-5">No users found.</div>
                ) : (
                    <Table 
                        columns={columns} 
                        data={users}
                        striped
                        hover
                    />
                )}
            </Card>
        </div>
    );
}

export default Users;