import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

function Dashboard() {
    // get books
    const [books, setBooks] = useState([]);
    const [bookStatuses, setBookStatuses] = useState({});
    const userId = sessionStorage.getItem('userId');
    const [loading, setLoading] = useState(true);
    
    // Function to load user's active book requests
    const loadUserBookRequests = () => {
        // Reset the book statuses to an empty object (important!)
        setBookStatuses({});
        
        axios.get('http://localhost:8080/requests')
            .then(response => {
                console.log('All requests:', response.data);
                
                // Filter requests that belong to the current user AND are in REQUESTED status
                const userActiveRequests = response.data.filter(request => 
                    request.user && 
                    request.user.id === parseInt(userId) && 
                    request.status === 'REQUESTED'
                );
                
                console.log('User active requests:', userActiveRequests);
                
                // Create status dictionary only for user's own active requests
                const statusDict = {};
                userActiveRequests.forEach(request => {
                    statusDict[request.book.id] = request.status;
                });
                
                console.log('Book status dictionary:', statusDict);
                setBookStatuses(statusDict);
                
                // Update requested books count
                setRequestedBooks(userActiveRequests.length);
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
            });
    };
    
    useEffect(() => {
        setLoading(true);
        
        // Clear any existing book statuses
        setBookStatuses({});
        
        axios.get('http://localhost:8080/books')
            .then(response => {
                setBooks(response.data);
                loadUserBookRequests();
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setLoading(false);
            });
    }, [userId]);
    
    const [userName, setUserName] = useState("");

    // Stats data
    const [totalBooks, setTotalBooks] = useState(0);
    const [borrowedBooks, setBorrowedBooks] = useState(0);
    const [requestedBooks, setRequestedBooks] = useState(0);
    const [ratedBooks, setRatedBooks] = useState(0);

    // get user
    useEffect(() => {
        axios.get('http://localhost:8080/users/' + userId)
            .then(response => {
                setUserName(response.data.name);
            })
            .catch(error => {
                console.log(error);
            });

        // Get stats
        axios.get('http://localhost:8080/books')
            .then(response => {
                setTotalBooks(response.data.length);
            })
            .catch(error => {
                console.log(error);
            });

        // Get borrowed books count
        axios.get('http://localhost:8080/borrow')
            .then(response => {
                const userBorrows = response.data.filter(borrow => 
                    borrow.user && borrow.user.id === parseInt(userId)
                );
                setBorrowedBooks(userBorrows.length);
            })
            .catch(error => {
                console.log(error);
            });

        // Get rated books count
        axios.get('http://localhost:8080/ratings')
            .then(response => {
                const userRatings = response.data.filter(rating => 
                    rating.user && rating.user.id === parseInt(userId)
                );
                setRatedBooks(userRatings.length);
            })
            .catch(error => {
                console.log(error);
            });
    }, [userId]);

    // borrow book
    const handleBorrow = (id) => {
        // First check if we already have a request for this book
        if (bookStatuses[id] === 'REQUESTED') {
            toast.error("You have already requested this book");
            return;
        }
        
        // Show loading toast
        const loadingToast = toast.loading("Requesting book...");
        
        // First create a borrow request
        axios.post('http://localhost:8080/borrow', { user: { id: userId }, book: { id: id } })
            .then(borrowResponse => {
                console.log('Borrow response:', borrowResponse.data);
                
                // Then create a book request
                axios.post('http://localhost:8080/requests', { user: { id: userId }, book: { id: id } })
                    .then(requestResponse => {
                        console.log('Request response:', requestResponse.data);
                        
                        // Update the local state immediately
                        setBookStatuses(prev => ({
                            ...prev,
                            [id]: 'REQUESTED'
                        }));
                        
                        // Update the requestedBooks count
                        setRequestedBooks(prev => prev + 1);
                        
                        // Dismiss loading toast and show success
                        toast.dismiss(loadingToast);
                        toast.success("Book requested successfully");
                    })
                    .catch(error => {
                        console.error('Request creation error:', error);
                        toast.dismiss(loadingToast);
                        toast.error("Unable to create request");
                        
                        // Clean up the borrow record since the request failed
                        if (borrowResponse.data && borrowResponse.data.borrowId) {
                            axios.delete(`http://localhost:8080/borrow/${borrowResponse.data.borrowId}`)
                                .catch(err => console.error('Failed to clean up borrow record:', err));
                        }
                    });
            })
            .catch(error => {
                console.error('Borrow creation error:', error);
                toast.dismiss(loadingToast);
                toast.error("Failed, maximum of 2 requests allowed");
            });
    };

    // get rating
    const [averageRatings, setAverageRatings] = useState({});
    useEffect(() => {
        axios.get('http://localhost:8080/ratings')
            .then(response => {
                const ratingMap = {};
                for (let i = 0; i < response.data.length; i++) {
                    const bookId = response.data[i].book.id;
                    const rating = response.data[i].rating;
                    if (ratingMap[bookId]) {
                        ratingMap[bookId].totalRating += rating;
                        ratingMap[bookId].numRatings += 1;
                    } else {
                        ratingMap[bookId] = { totalRating: rating, numRatings: 1 };
                    }
                }
                const newAverageRatings = {};
                for (const [bookId, ratingInfo] of Object.entries(ratingMap)) {
                    const averageRating = ratingInfo.totalRating / ratingInfo.numRatings;
                    newAverageRatings[bookId] = averageRating.toFixed(1); // format to one decimal place
                }
                setAverageRatings(newAverageRatings);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // Define table columns
    const columns = [
        { header: 'Book ID', accessor: 'id' },
        { header: 'Book Name', accessor: 'bookTitle' },
        { header: 'Quantity', accessor: 'quantity' },
        { 
            header: 'Availability', 
            accessor: 'availability',
            cell: (row) => (
                <span className={row.availability > 0 ? 'text-success' : 'text-danger'}>
                    {row.availability}
                </span>
            )
        },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Ratings', 
            accessor: 'id',
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <strong>{averageRatings[row.id] ? averageRatings[row.id] : '0.0'}</strong>
                    <span className="ms-1">/ 5</span>
                </div>
            )
        },
        {
            header: 'Request Books',
            accessor: 'id',
            cell: (row) => {
                if (loading) {
                    return <span>Loading...</span>;
                }
                
                // Check if this specific book has been requested by the current user
                const isRequested = bookStatuses[row.id] === 'REQUESTED';
                
                console.log(`Book ${row.id} requested status:`, isRequested);
                
                return isRequested ? (
                    <span>Requested</span>
                ) : (
                    <Button
                        variant={row.availability > 0 ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleBorrow(row.id)}
                        disabled={row.availability === 0}
                    >
                        Request
                    </Button>
                );
            }
        }
    ];

    // Icons for stats cards
    const BookIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5.48999V20.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.75 8.48999H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 11.49H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const BorrowedIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5"/>
        </svg>
    );

    const RequestIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.37 8.87988H17.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.38 8.87988L7.13 9.62988L9.38 7.37988" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.37 15.8799H17.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.38 15.8799L7.13 16.6299L9.38 14.3799" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const RatingIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.73 3.51001L15.49 7.03001C15.73 7.52001 16.37 7.99001 16.91 8.08001L20.1 8.61001C22.14 8.95001 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95001 3.9 8.61001L7.09 8.08001C7.62 7.99001 8.26 7.52001 8.5 7.03001L10.26 3.51001C11.22 1.60001 12.78 1.60001 13.73 3.51001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="dashboard-content">
            <div className="mb-4">
                <div className="card-grid">
                    <StatCard 
                        icon={<BookIcon />}
                        value={totalBooks.toString()}
                        label="Total Books"
                        color="primary"
                    />
                    <StatCard 
                        icon={<BorrowedIcon />}
                        value={borrowedBooks.toString()}
                        label="Books Borrowed"
                        color="success"
                    />
                    <StatCard 
                        icon={<RequestIcon />}
                        value={requestedBooks.toString()}
                        label="Pending Requests"
                        color="warning"
                    />
                    <StatCard 
                        icon={<RatingIcon />}
                        value={ratedBooks.toString()}
                        label="Books Rated"
                        color="accent"
                    />
                </div>
            </div>
            
            <Card title="Available Books">
                {loading ? (
                    <div className="text-center py-5">Loading books...</div>
                ) : (
                    <Table 
                        columns={columns}
                        data={books}
                        striped
                        hover
                        emptyMessage="No books available"
                    />
                )}
            </Card>
        </div>
    );
}

export default Dashboard;