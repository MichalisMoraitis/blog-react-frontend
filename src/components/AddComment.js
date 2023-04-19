import { useState } from "react";
import axios from "axios";
import "./addComment.css";

const AddComment = ({post_id, setLoadPosts, loadPosts}) => {
    const [comment,setComment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [commentError, setCommentError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
    
        console.log(post_id);

        if(name === "comment"){
            setComment(value)
            if(value.length < 1 )
                setCommentError("Το σχόλιο δεν είναι συμπληρωμενο");
            else
                setCommentError(null);
        }
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if(comment.length >= 1){
    
            e.preventDefault();
            setIsLoading(true);
            setError(null);
    
            axios.post(`http://localhost:8000/api/comment/new/${post_id}`, {
                comment: comment
            }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }})
            .then(()=>{
                setIsLoading(false);
                setComment("");
                setLoadPosts(!loadPosts);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    
        }else{
            setCommentError("Το σχόλιο δεν είναι συμπληρωμενο");
        }
      }

    return(
        <div className="new-comment">
            {isLoading && <p>Loading...</p>}
            {error && <h3>Error: {error}</h3>}
            <form onSubmit={handleSubmit} className="comment-form">
                <label>
                 <p>Νέο Σχόλιο</p>
                    <div className="comment-input">
                        <input type="text" value={comment} name="comment"
                            placeholder="Σχόλιο" onChange={(e)=>{handleChange(e)}}
                        />
                        <button> Σχολιάστε </button>
                    </div>
                    {commentError && <p className="error">{commentError}</p>}
                </label>
            </form>
        </div>
    );
}
export default AddComment;
