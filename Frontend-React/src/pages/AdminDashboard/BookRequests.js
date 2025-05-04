import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

function BookRequests() {
    const [borrow, setBorrow] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [bookTitle, setBookTitle] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookRequests();
    }, []);

    const fetchBookRequests = async () => {
        try {
            setLoading(true);
            // Get all borrow requests
            const borrowResponse = await axios.get('http://localhost:8080/borrow');
            console.log('All borrow requests:', borrowResponse.data);
            
            // Set borrow data
            setBorrow(borrowResponse.data);
            
            // Get user names
            const userIds = borrowResponse.data.map(br => br.user.id);
            const uniqueUserIds = [...new Set(userIds)];
            const users = await Promise.all(uniqueUserIds.map(getUser));
            
            const updatedUserNames = {};
            users.forEach(user => {
                if (user) updatedUserNames[user.id] = user.name;
            });
            setUserNames(updatedUserNames);
            
            // Get book titles
            const bookIds = borrowResponse.data.map(br => br.book.id);
            const uniqueBookIds = [...new Set(bookIds)];
            const books = await Promise.all(uniqueBookIds.map(getBook));
            
            const updatedBookTitles = {};
            books.forEach(book => {
                if (book) updatedBookTitles[book.id] = book.title;
            });
            setBookTitle(updatedBookTitles);
            
            // Also check book requests endpoint to debug
            const requestsResponse = await axios.get('http://localhost:8080/requests');
            console.log('Book requests data:', requestsResponse.data);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching book requests:', error);
            toast.error('Failed to load book requests');
            setLoading(false);
        }
    };

    const getUser = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${id}`);
            return { id, name: response.data.name };
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
        }
    };

    const getBook = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/books/${id}`);
            return { id, title: response.data.bookTitle };
        } catch (error) {
            console.error(`Error fetching book ${id}:`, error);
            return null;
        }
    };

    const adminId = parseInt(sessionStorage.getItem("adminId"));
    
    const handleAccept = async (borrowId) => {
        try {
            console.log(`Accepting borrow request with ID: ${borrowId}`);
            await axios.put('http://localhost:8080/borrow/accept', { borrowId });
            const borrowResponse = await axios.get(`http://localhost:8080/borrow/${borrowId}`);
            
            const bookId = borrowResponse.data.book.id;
            const userId = borrowResponse.data.user.id;
            
            // Find the corresponding book request
            const requestsResponse = await axios.get('http://localhost:8080/requests');
            let requestId = null;
            
            for (let i = 0; i < requestsResponse.data.length; i++) {
                const request = requestsResponse.data[i];
                if (request.user.id === userId && request.book.id === bookId) {
                    requestId = request.id;
                    console.log(`Found matching book request with ID: ${requestId}`);
                    break;
                }
            }
            
            if (requestId) {
                await axios.put(`http://localhost:8080/requests/${requestId}`, 
                    { user: { id: userId }, book: { id: bookId } },
                    { params: { admin: adminId } }
                );
                
                toast.success("Request accepted");
                fetchBookRequests();
            } else {
                console.warn(`No matching book request found for user ${userId} and book ${bookId}`);
                toast.success("Request accepted, but no matching book request found");
                fetchBookRequests();
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            toast.error("Failed to accept request");
        }
    };

    const handleReject = async (borrowId) => {
        try {
            console.log(`Rejecting borrow request with ID: ${borrowId}`);
            await axios.put('http://localhost:8080/borrow/reject', { borrowId });
            const borrowResponse = await axios.get(`http://localhost:8080/borrow/${borrowId}`);
            
            const bookId = borrowResponse.data.book.id;
            const userId = borrowResponse.data.user.id;
            
            // Find the corresponding book request
            const requestsResponse = await axios.get('http://localhost:8080/requests');
            let requestId = null;
            
            for (let i = 0; i < requestsResponse.data.length; i++) {
                const request = requestsResponse.data[i];
                if (request.user.id === userId && request.book.id === bookId) {
                    requestId = request.id;
                    console.log(`Found matching book request with ID: ${requestId}`);
                    break;
                }
            }
            
            if (requestId) {
                await axios.put(`http://localhost:8080/requests/${requestId}`, 
                    { user: { id: userId }, book: { id: bookId } },
                    { params: { admin: adminId } }
                );
                
                toast.error("Request rejected");
                fetchBookRequests();
            } else {
                console.warn(`No matching book request found for user ${userId} and book ${bookId}`);
                toast.error("Request rejected, but no matching book request found");
                fetchBookRequests();
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error("Failed to reject request");
        }
    };

    // Define columns for the Table component
    const columns = [
        { header: 'Borrow ID', accessor: 'borrowId' },
        { header: 'Book ID', accessor: 'book.id' },
        { 
            header: 'Book Title', 
            accessor: 'book.id',
            cell: (row) => bookTitle[row.book.id] || 'Loading...'
        },
        { header: 'User ID', accessor: 'user.id' },
        { 
            header: 'Username', 
            accessor: 'user.id',
            cell: (row) => userNames[row.user.id] || 'Loading...'
        },
        { header: 'Borrow Date', accessor: 'borrowDate' },
        { header: 'Due Date', accessor: 'dueDate' },
        { header: 'Return Date', accessor: 'returnDate' },
        { 
            header: 'Status',
            accessor: 'status',
            cell: (row) => <span className={`status-badge ${row.status.toLowerCase()}`}>{row.status}</span>
        },
        { 
            header: 'Actions',
            cell: (row) => (
                row.status === 'PENDING' && (
                    <div className="d-flex gap-2">
                        <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => handleAccept(row.borrowId)}
                        >
                            Accept
                        </Button>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleReject(row.borrowId)}
                        >
                            Reject
                        </Button>
                    </div>
                )
            )
        }
    ];

    // Filter pending requests
    const pendingRequests = borrow.filter(br => br.status === 'PENDING');
    console.log('Pending requests:', pendingRequests);

    return (
        <div className="dashboard-content">
            <Card 
                title="Book Requests"
                className="book-requests-card"
            >
                {loading ? (
                    <div className="text-center py-5">Loading book requests...</div>
                ) : borrow.length === 0 ? (
                    <div className="text-center py-5">No book requests found.</div>
                ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-5">No pending book requests found.</div>
                ) : (
                    <Table 
                        columns={columns} 
                        data={pendingRequests}
                        striped
                        hover
                    />
                )}
            </Card>
            
            {/* Also show all book requests for debugging */}
            {borrow.length > 0 && (
                <Card 
                    title="All Book Requests"
                    className="mt-4"
                >
                    <Table 
                        columns={columns.filter(col => col.header !== 'Actions')}
                        data={borrow}
                        striped
                        hover
                    />
                </Card>
            )}
        </div>
    );
}

export default BookRequests;