import "../../styles/AddBooks.css";
import { IonIcon } from '@ionic/react';
import { menuOutline } from "ionicons/icons";
import logo from '../../styles/images/admin.png';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormGroup from "../../components/ui/FormGroup";

function AddBooks() {
    // useEffect(() => {
    //     showAddForm();
    // }, []);

    // add books
    const [bookTitle, setBookTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const navigate = useNavigate();

    // add new book
    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentDate = new Date();
        const selectedDate = new Date(publishedDate);

        if (selectedDate > currentDate) {
            toast.error('Date cannot be in the future');
            return;
        }

        // Check if any input fields are empty
        if (!bookTitle || !author || !category || !description || !quantity || !publishedDate) {
            toast.error('Fill out all fields.');
            return;
        }

        const requestBody = {
            "bookTitle": bookTitle,
            "author": author,
            "category": category,
            "description": description,
            "quantity": quantity,
            "availability": quantity,
            "publishedDate": publishedDate
        };

        try {
            await axios.post("http://localhost:8080/books", requestBody);
            toast.success("Book added successfully");
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add book");
        }
    };

    const resetForm = () => {
        setBookTitle("");
        setAuthor("");
        setCategory("");
        setDescription("");
        setQuantity("");
        setPublishedDate("");
    };

    return (
        <div className="dashboard-content">
            <Card 
                title="Add New Book"
                className="add-book-card"
            >
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup label="Book Title" htmlFor="bookTitle">
                                <input
                                    type="text"
                                    id="bookTitle"
                                    className="form-control"
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.target.value)}
                                    placeholder="Enter book title"
                                    required
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="Author Name" htmlFor="authorName">
                                <input
                                    type="text"
                                    id="authorName"
                                    className="form-control"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Enter author name"
                                    required
                                />
                            </FormGroup>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup label="Category" htmlFor="category">
                                <input
                                    type="text"
                                    id="category"
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Enter book category"
                                    required
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="Quantity" htmlFor="quantity">
                                <input
                                    type="number"
                                    id="quantity"
                                    className="form-control"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter quantity"
                                    min="1"
                                    required
                                />
                            </FormGroup>
                        </div>
                    </div>

                    <FormGroup label="Book Description" htmlFor="bookDesc">
                        <textarea
                            id="bookDesc"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter book description"
                            rows="4"
                            required
                        ></textarea>
                    </FormGroup>

                    <FormGroup label="Published Date" htmlFor="bookPublished">
                        <input
                            type="date"
                            id="bookPublished"
                            className="form-control"
                            value={publishedDate}
                            onChange={(e) => setPublishedDate(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={resetForm}>
                            Reset
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Book
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}


// function showAddForm() {
//     document.getElementById("addForm").style.display = "block";
//     document.getElementById("editForm").style.display = "none";
//     document.getElementById("deleteForm").style.display = "none";
// }

// function showEditForm() {
//     document.getElementById("editForm").style.display = "block";
//     document.getElementById("addForm").style.display = "none";
//     document.getElementById("deleteForm").style.display = "none";
// }

// function showdeleteForm() {
//     document.getElementById("addForm").style.display = "none";
//     document.getElementById("editForm").style.display = "none";
//     document.getElementById("deleteForm").style.display = "block";
// }

export default AddBooks;
