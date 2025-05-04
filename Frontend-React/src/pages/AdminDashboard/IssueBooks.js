import "../../AdminDashboardcss/Issuebooks.css";
import { IonIcon } from '@ionic/react';
import { menuOutline } from "ionicons/icons";
import logo from '../../styles/images/admin.png';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormGroup from "../../components/ui/FormGroup";

function IssuedBooks() {
    const [userId, setUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!userId || !bookId) {
            toast.error("Please enter both User ID and Book ID");
            return;
        }
        
        try {
            setLoading(true);
            const requestBody = { 
                "user": { "id": userId }, 
                "book": { "id": bookId } 
            };
            
            await axios.post("http://localhost:8080/borrow", requestBody);
            toast.success("Book issued successfully");
            
            // Reset form
            setUserId("");
            setBookId("");
        } catch (error) {
            console.error("Error issuing book:", error);
            toast.error("Failed to issue book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content">
            <Card title="Issue Book" className="issue-book-card">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup label="Book ID" htmlFor="bookId">
                                <input
                                    type="text"
                                    id="bookId"
                                    className="form-control"
                                    placeholder="Enter Book ID"
                                    value={bookId}
                                    onChange={(e) => setBookId(e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="User ID" htmlFor="userId">
                                <input
                                    type="text"
                                    id="userId"
                                    className="form-control"
                                    placeholder="Enter User ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                setUserId("");
                                setBookId("");
                            }}
                        >
                            Reset
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "Issuing..." : "Issue Book"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default IssuedBooks;