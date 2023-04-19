import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./../styles/search.css";

function Search() {
    const [search, setSearch] = useState("");
    const [posts,setPosts] = useState([]);
    const [users,setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(()=>{
        
        if (debouncedSearch === "") {
            setPosts([]);
            setUsers([]);
        }else{
            setIsLoading(true);
            setError(null);
  
            axios.get(`http://127.0.0.1:8000/api/search?q=${debouncedSearch}`)
            .then((getData) => {
                setPosts(getData.data.posts);
                setUsers(getData.data.users);
                console.log(getData);
                if (getData.data.posts.length === 0 && getData.data.users.length === 0 )
                    setError("No Data For This Credentials");
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
        }

    }, [debouncedSearch]);

    useEffect(()=>{
        const handle = setTimeout(()=>{
            setDebouncedSearch(search);
        }, 500);

        return ()=>{
            clearTimeout(handle)
        };
    }, [search]);

    return (
        <section className="search">
        
            <input type="text" 
                value={search} placeholder="Αναζήτηση"
                onChange={(e)=>{setSearch(e.target.value)}}
            /> 

            {error && <p className='error'>{error}</p>}

            {isLoading && <p>Loading...</p>}

            <div className="all-data">
                <div className='posts'>
                {posts.length !== 0 && <h1>Αναρτισεις</h1>}
                    {posts !== [] && posts.map(post => (
                        <div className="post" key={post.id} >
                            <Link to={`/post/${post.id}`}>
                                <h2>{ post.title }</h2>
                                <p>Συγγραφέας: { post.user.name }</p>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className='users'>
                    { users.length !== 0 && <h1>Ατομα</h1>}
                    {users !== [] && users.map(user => (
                        <div className="user" key={user.id} >
                            <Link to={`/user/${user.id}`}>
                                { user.image ? (
                                    <img src={"http://127.0.0.1:8000/userImages/" + user.image }
                                        alt="" className="user-photo"
                                    />
                                ) : (
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                                        alt="" className="user-photo"
                                    />
                                )}

                                <h2>{ user.name }</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}

export default Search;