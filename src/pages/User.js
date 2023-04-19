import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/user.css"

const User = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user,setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadUser, setLoadUser] = useState(false);

    useEffect(()=>{
        if(parseInt(id) === parseInt(localStorage.getItem('user-id'))  ){
            navigate("/profile");
        }
    }, [id, navigate]);

    useEffect( ()=>{
        setIsLoading(true);
        setError(false);

        axios.get(`http://127.0.0.1:8000/api/user/${id}`)
        
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
    },[id, navigate, loadUser])

    const handleFollow = () => {

        axios.post(`http://localhost:8000/api/follow/${id}`,{},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }
        })
        .then(() => {
            setLoadUser(!loadUser);
        })
        .catch((err) => {
            alert(err.message);
            // setError(err);
        })
    }

    return(
        <section className="user">
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <h3>Error: {error}</h3>}
                { !error && (
                    <article className="user">
                        <h3>Ονομα: { user.name }</h3>
                        <p>Email: { user.email }</p>   

                        { user.image ? (
                                <img src={"http://127.0.0.1:8000/userImages/" + user.image }
                                    alt="" className="user-photo"
                                />
                            ) : (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                                    alt="" className="user-photo"
                                />
                            )
                        }

                        {localStorage.getItem('user-token') 
                            && <button className="friend-request-button" onClick={()=>{handleFollow()}}>
                                {user?.get_follow 
                                    && user.get_follow.some(follow => follow.do_follow_user_id === parseInt(localStorage.getItem('user-id'))) 
                                    ? (`ακολουθήτε τον/την ${user.name}`) 
                                    : (`ακολουθήστε τον/την ${user.name}`) 
                                }
                            </button>
                        
                        }
                        
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

export default User;
