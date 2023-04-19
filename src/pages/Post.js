import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/post.css"
import AddComment from '../components/AddComment';
import ModalDelete from '../components/ModalDelete';

const Post = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post,setPost] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddComment,setShowAddComment] = useState(false);
    const [loadPosts, setLoadPosts] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);


    useEffect( ()=>{
        setIsLoading(true);
        setError(false);

        axios.get(`http://127.0.0.1:8000/api/post/${id}`)
        .then((getData) => {
            setPost(getData.data.post[0]);
            console.log(getData.data.post[0]);
            if(getData.data.post[0] === undefined){
                navigate("/");
            }
            setIsLoading(false);
            setError(null);
        })
        .catch((error) => {
            setIsLoading(false);
            setError(error);
            navigate("/");
        });
    },[id, navigate, loadPosts])

    const handlePostDelete = () => {
        
        axios.delete(`http://localhost:8000/api/post/delete/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }
        })
        .then(() => {
            navigate("/");
        })
        .catch((err) => {
            alert(err.message);
            // setError(err);
        })
    }

    const handleCommentDelete = (comment_id) => {
        // if (window.confirm("θέλετε να διαγράψετε αυτo τo σχολιο: ")){

            axios.delete(`http://localhost:8000/api/comment/delete/${comment_id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user-token')}`
                }
            })
            .then(() => {
                setLoadPosts(!loadPosts);
            })
            .catch((err) => {
                alert(err.message);
            })
        // }
    }

    const handleLike = () => {
        axios.post(`http://localhost:8000/api/post/like/${id}`,{},{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user-token')}`
                }
            })
            .then(() => {
                setLoadPosts(!loadPosts);
            })
            .catch((err) => {
                alert(err.message);
            })
    }

    return(
        <section className="post-details">
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <h3>Error: {error}</h3>}
                { !error && (
                    <article>
                        <h2>{ post.title }</h2>
                        <p>{ post.body }</p>
                        { post.image && <img src={"http://127.0.0.1:8000/postImages/" + post.image } alt=""></img>}
                        <div>
                            {post && post.user && ( <h4>Συγγραφέας: {post.user.name}</h4> )}

                            {post && post.user && <p>Αρέσει σε {post.likes.length}</p>}

                            {post.user && post.user.id === parseInt(localStorage.getItem('user-id')) 
                                && <Link to={`/update/${post.id}`}>
                                    <button className="update">
                                        <i class="fa fa-refresh" aria-hidden="true"></i>
                                        { " " }
                                        Update
                                    </button>
                                </Link>}

                            {post.user && post.user.id === parseInt(localStorage.getItem('user-id'))
                                    && <button className="delete" onClick={() => {setModalOpen(true);}}>
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                            { " " }
                                            Διαγραφή
                                        </button>}
                                        
                                    {modalOpen && <ModalDelete setOpenModal={setModalOpen} handlePostDelete={handlePostDelete} />}
                            
                            {localStorage.getItem('user-token') && 
                                <button className="like" onClick={handleLike}>
                                    <i class="fa fa-thumbs-up"></i> { "  " }
                                    {post?.likes && post.likes.some(like => like.user.id === parseInt(localStorage.getItem('user-id'))) 
                                        ? "Σας Αρέσει" : "Μου Αρέσει"
                                    }
                                </button>}

                            {localStorage.getItem('user-token') && 
                                <button className="comment" onClick={() => setShowAddComment(!showAddComment)}>
                                    <i class="fa fa-comments-o" aria-hidden="true"></i>
                                    { " " }
                                     Σχολιάστε 
                                    { " " }
                                    <i className={showAddComment ? 'fa fa-minus' : 'fa fa-plus'} style={{color:"#444"}} aria-hidden="true"></i>
                                </button>
                            }
                            
                            {showAddComment && 
                                <AddComment post_id={id} 
                                    setLoadPosts={setLoadPosts}
                                    loadPosts={loadPosts}
                                />}
                            </div>
                            <div className="comments">
                                {post && post.comments && post.comments.map(comment => {
                                    return(
                                        <div className="comment" key={comment.id} >
                                            <p>{ comment.comment }</p>
                                            <h4>συγγραφέας: { comment.user.name }</h4>
                                            {comment.user.id === parseInt(localStorage.getItem('user-id'))
                                            && <button className="delete" onClick={()=>{handleCommentDelete(comment.id)}}>
                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                    { " " }
                                                    διαγράφη σχολιασμου
                                                </button>}
                                        </div>
                                    )
                                })}
                            </div>
                    </article>
                )}
            </div>
        </section>
    );
}

export default Post;
