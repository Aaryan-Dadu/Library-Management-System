import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

function AdminDashboard() {
    const adminId = sessionStorage.getItem('adminId');

    const [books, setBooks] = useState([]);
    const [editID, setEditID] = useState(-1);
    const [author, setauthor] = useState('');
    const [category, setcategory] = useState('');
    const [publishedDate, setpublishedDate] = useState('');

    const [uBookTitle, usetbookTitle] = useState('');
    const [uQuantity, usetquantity] = useState('');
    const [uAvailability, usetAvailability] = useState('');
    const [uDescription, usetdescription] = useState('');
    const [totalmenmbers, settotalmenmbers] = useState('');
    const [totalbooks, settotalbooks] = useState('');
    const [totalAvailibility, setTotalAvailibility] = useState("");
    const [totalIssued, setTotalIssue] = useState("");

    // for Hello, admin name
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8080/admin/' + adminId)
            .then(response => {
                setAdminName(response.data.name);
            })
            .catch(error => {
                console.log(error);
            });
    }, [adminId]);

    // dynamic data to get in Admin Dashboard
    useEffect(() => {
        axios.get('http://localhost:8080/users')
            .then(response => {
                // get total user count
                settotalmenmbers(response.data.length)
                // get total number of borrowed book count
                let count = 0;
                for (let i = 0; i < response.data.length; i++) {
                    count += response.data[i].numBookBorrowed;
                }
                setTotalIssue(count);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    // get books and the total availibility count
    useEffect(() => {
        axios.get('http://localhost:8080/books')
            .then(response => {
                // console.log(response.data);
                setBooks(response.data);
                settotalbooks(response.data.length);
                let count = 0;
                for (let i = 0; i < response.data.length; i++) {
                    count += response.data[i].availability;
                }
                setTotalAvailibility(count);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    // edit book
    const handleEdit = (id) => {
        axios.get('http://localhost:8080/books/' + id)
            .then(res => {
                usetbookTitle(res.data.bookTitle);
                usetquantity(res.data.quantity);
                usetAvailability(res.data.availability);
                usetdescription(res.data.description);
                setauthor(res.data.author);
                setpublishedDate(res.data.publishedDate);
                setcategory(res.data.category);
            })
            .catch(error => {
                console.log(error);
            });
        setEditID(id)
    }

    // updated edited book
    const handleUpdate = () => {
        if (uQuantity < 0 || uAvailability < 0) {
            toast.error("Invalid negative value");
            return;
        }

        axios.put('http://localhost:8080/books/' + editID, { 
            id: editID, 
            bookTitle: uBookTitle, 
            author: author, 
            category: category, 
            quantity: uQuantity, 
            availability: uAvailability, 
            description: uDescription, 
            publishedDate: publishedDate 
        })
            .then(res => {
                console.log(res);
                toast.success("Book updated successfully");
                window.location.reload(false);
            }).catch(err => {
                console.log(err);
                toast.error("Failed to update book");
            });
    }

    // delete book
    const handleDelete = (id) => {
        axios.delete('http://localhost:8080/books/' + id)
            .then(res => {
                toast.success("Book deleted successfully");
                window.location.reload(false);
            }).catch(err => {
                console.log(err);
                toast.error("Failed to delete book");
            });
    }

    //generate book pdf
    const generatePdf = () => {
        const newWindow = window.open('http://localhost:8080/pdf/books', '_blank');
        if (newWindow) {
            toast.success('Generating PDF');
        } else {
            toast.error('Failed generating PDF');
        }
    }

    // Icons for stats cards
    const BooksIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5.48999V20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const AvailableIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.75 12.0001L10.58 14.8301L16.25 9.17007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const IssuedIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5"/>
        </svg>
    );

    const UsersIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.9999 14.44C5.6299 14.67 4.1199 14.43 3.0599 13.72C1.6499 12.78 1.6499 11.24 3.0599 10.3C4.1299 9.59004 5.6599 9.35003 7.0299 9.59003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    // Define table columns
    const columns = [
        { header: 'Book ID', accessor: 'id' },
        { 
            header: 'Book Name', 
            accessor: 'bookTitle',
            cell: (row) => (
                editID === row.id ? (
                    <input 
                        type="text" 
                        className="form-control"
                        value={uBookTitle} 
                        onChange={(e) => usetbookTitle(e.target.value)} 
                    />
                ) : row.bookTitle
            )
        },
        { 
            header: 'Quantity', 
            accessor: 'quantity',
            cell: (row) => (
                editID === row.id ? (
                    <input 
                        type="number" 
                        className="form-control"
                        value={uQuantity} 
                        onChange={(e) => usetquantity(e.target.value)} 
                    />
                ) : row.quantity
            )
        },
        { 
            header: 'Availability', 
            accessor: 'availability',
            cell: (row) => (
                editID === row.id ? (
                    <input 
                        type="number" 
                        className="form-control"
                        value={uAvailability} 
                        onChange={(e) => usetAvailability(e.target.value)} 
                    />
                ) : (
                    <span className={row.availability > 0 ? 'text-success' : 'text-danger'}>
                        {row.availability}
                    </span>
                )
            )
        },
        { 
            header: 'Description', 
            accessor: 'description',
            cell: (row) => (
                editID === row.id ? (
                    <textarea 
                        className="form-control"
                        value={uDescription} 
                        onChange={(e) => usetdescription(e.target.value)} 
                    />
                ) : row.description
            )
        },
        { 
            header: 'Action',
            cell: (row) => (
                editID === row.id ? (
                    <Button 
                        variant="success" 
                        size="sm"
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                ) : (
                    <div className="table-actions">
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleEdit(row.id)}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            )
        },
    ];

    return (
        <div className="dashboard-content">
            <div className="mb-4">
                <div className="card-grid">
                    <StatCard 
                        icon={<BooksIcon />}
                        value={totalbooks.toString()}
                        label="Total Books"
                        color="primary"
                    />
                    <StatCard 
                        icon={<AvailableIcon />}
                        value={totalAvailibility.toString()}
                        label="Available Books"
                        color="success"
                    />
                    <StatCard 
                        icon={<IssuedIcon />}
                        value={totalIssued.toString()}
                        label="Issued Books"
                        color="warning"
                    />
                    <StatCard 
                        icon={<UsersIcon />}
                        value={totalmenmbers.toString()}
                        label="Total Members"
                        color="accent"
                    />
                </div>
            </div>
            
            <Card 
                title="Book Management"
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
                <Table 
                    columns={columns}
                    data={books}
                    striped
                    hover
                    emptyMessage="No books available"
                />
            </Card>
        </div>
    );
}

export default AdminDashboard;