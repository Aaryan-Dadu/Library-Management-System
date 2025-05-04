import "../../styles/BorrowedBooks.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import FormGroup from "../../components/ui/FormGroup";
import logo from '../../styles/images/user.png';

function MyBorrowedBook() {
    const [bookTitle, setBookTitle] = useState({});
    const [borrow, setBorrow] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = parseInt(sessionStorage.getItem('userId'));
    // console.log(userId);

    useEffect(() => {
        fetchBorrowedBooks();
    }, [userId]);

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/borrow/user/${userId}`);
            setBorrow(response.data);
            
            const bookIds = response.data.map(br => br.book.id);
            const uniqueBookIds = [...new Set(bookIds)];
            const books = await Promise.all(uniqueBookIds.map(getBook));
            
            const updatedBookTitles = {};
            books.forEach(book => {
                if (book) updatedBookTitles[book.id] = book.title;
            });
            setBookTitle(updatedBookTitles);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
            toast.error('Failed to load borrowed books');
            setLoading(false);
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
    }

    // return book
    const handleReturn = async (borrowId, bookId, userId) => {
        try {
            setBookId(bookId);
            await axios.put('http://localhost:8080/borrow/return', { 
                borrowId: borrowId, 
                bookId: bookId, 
                userId: userId 
            });
            
            // change return status
            const requestsResponse = await axios.get('http://localhost:8080/requests');
            const requests = requestsResponse.data;
            let returnId = null;
            
            for (let i = 0; i < requests.length; i++) {
                const req = requests[i];
                if (req.user.id === userId && req.book.id === bookId) {
                    returnId = req.id;
                    break;
                }
            }
            
            if (returnId !== null) {
                await axios.put(`http://localhost:8080/requests_return/${returnId}`, { 
                    user: { id: userId }, 
                    book: { id: bookId } 
                });
                
                toast.success("Book returned successfully");
                setTimeout(() => {
                    setShowRatingForm(true);
                }, 500);
            }
        } catch (error) {
            console.error('Error returning book:', error);
            toast.error("Failed to return book");
        }
    };

    const [showRatingForm, setShowRatingForm] = useState(false);
    const [rating, setRating] = useState('');
    const [review, setReview] = useState("");
    const [bookId, setBookId] = useState(null);

    const submitReview = async (event) => {
        event.preventDefault();

        if (!rating || !review) {
            toast.error("Please rate the book and write a review.");
            return;
        }

        if (rating > 5 || rating < 0) {
            toast.error("Please rate the book between 0 and 5.");
            return;
        }

        try {
            // Check if the user has already reviewed the book
            const response = await axios.get("http://localhost:8080/ratings", {
                params: {
                    user: userId,
                    book: bookId,
                },
            });
            
            let existingRating = null;
            for (let i = 0; i < response.data.length; i++) {
                const ratingItem = response.data[i];
                if (ratingItem.book.id === bookId && ratingItem.user.id === userId) {
                    existingRating = ratingItem;
                    break;
                }
            }
            
            if (existingRating) {
                // Update existing rating
                await axios.put(`http://localhost:8080/ratings/${existingRating.id}`, {
                    rating: rating,
                    review: review,
                    user: { id: userId },
                    book: { id: bookId },
                });
                
                toast.success("Book review updated successfully");
            } else {
                // Create new rating
                await axios.post("http://localhost:8080/ratings", {
                    rating: rating,
                    review: review,
                    user: { id: userId },
                    book: { id: bookId },
                });
                
                toast.success("Book review submitted successfully");
            }
            
            setShowRatingForm(false);
            fetchBorrowedBooks();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error("Failed to submit review");
        }
    };

    const closeRatingForm = () => {
        setShowRatingForm(false);
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
        { header: 'Borrow Date', accessor: 'borrowDate' },
        { header: 'Due Date', accessor: 'dueDate' },
        { header: 'Return Date', accessor: 'returnDate' },
        { 
            header: 'Status/Actions',
            cell: (row) => (
                row.status === 'ACCEPTED' ? (
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleReturn(row.borrowId, row.book.id, userId)}
                    >
                        Return
                    </Button>
                ) : (
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                        {row.status}
                    </span>
                )
            )
        }
    ];

    return (
        <div className="dashboard-content">
            <Card 
                title="My Borrowed Books"
                className="borrowed-books-card"
            >
                {loading ? (
                    <div className="text-center py-5">Loading borrowed books...</div>
                ) : borrow.length === 0 ? (
                    <div className="text-center py-5">You haven't borrowed any books yet.</div>
                ) : (
                    <Table 
                        columns={columns} 
                        data={borrow}
                        striped
                        hover
                    />
                )}
            </Card>
            
            {showRatingForm && (
                <div className="modal-overlay">
                    <Card className="rating-modal">
                        <div className="modal-header">
                            <h3>Rate & Review Book</h3>
                            <button className="close-btn" onClick={closeRatingForm}>×</button>
                        </div>
                        <form onSubmit={submitReview}>
                            <FormGroup label="Rating (0-5)" htmlFor="rating">
                                <input
                                    type="number"
                                    id="rating"
                                    className="form-control"
                                    min="0"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup label="Review" htmlFor="review">
                                <textarea
                                    id="review"
                                    className="form-control"
                                    rows="4"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    required
                                ></textarea>
                            </FormGroup>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={closeRatingForm}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default MyBorrowedBook;