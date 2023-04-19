import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        setIsLoading(true);
        setError(false);

        axios.get(`http://127.0.0.1:8000/api/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }
        })
        .then((getData) => {
            setUser(getData.data.user);
            setIsLoading(false);
            setError(null);
        })
        .catch((error) => {
            setIsLoading(false);
            setError(error);
            navigate("/");
        });
    },[navigate])


    return(
        <section className="profile">
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <h3>Error: {error}</h3>}
                { !error && (
                    <article className="user">
                        <h3>Ονομα: { user.name }</h3>
                        <p>Email: { user.email }</p>   

                        { user.image && 
                            <img src={"http://127.0.0.1:8000/userImages/" + user.image }
                                alt="" className="profile-photo"
                            />
                        }

                        <Link to={`/profile-photo`} className="profile-photo-link">
                            <button>
                                {user.image ? "Αλλαξε φωτογραφια προφιλ" : "Ανεβαστε φωτογραφια προφιλ" }
                            </button>
                        </Link>
                        
                        <hr/>
                        <h1>Αναρτήσεις  του { user.name }</h1>
                        <div className="posts">
                            {user.posts && user.posts.map((post, index) => {
                                return(
                                    <Link to={`/post/${post.id}`} key={index}>
                                        <article key={index} className="post">
                                            <h2>{post.title}</h2>
                                            <p>{post.body}</p>
                                            {/* { post.image && <img src={"http://127.0.0.1:8000/postImages/" + post.image } alt=""></img>} */}
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
}

export default Profile;
