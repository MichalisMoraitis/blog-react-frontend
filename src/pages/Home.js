import axios from 'axios'
import { Link } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import "./../styles/home.css";

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect( ()=>{
    setIsLoading(true);
    setError(null);
  
    axios.get('http://127.0.0.1:8000/api/posts', {
        params: {
          page: currentPage
        },
      })
    .then((getData) => {
      // setPosts((prevPosts) => {
      //   return [...prevPosts, ...getData.data.posts.data];
      // });
      setPosts(getData.data.posts.data)
      setNumberOfPages(getData.data.posts.last_page);
      setIsLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setIsLoading(false);
    });
  },[currentPage])
  
  
  return (
    <section className='home'>
      <div className='left'>
        <h1>Αναρτησεις</h1>
        {error && <p className='error'>{error}</p>}
        {isLoading && <p>Loading...</p>}
        <div className='posts'>
          {posts.map(post => (
            <div className="post" key={post.id} >
              <Link to={`/post/${post.id}`}>
                  <h2>{ post.title }</h2>
                  <div className='post-main'>
                    { post.image && <img src={"http://127.0.0.1:8000/postImages/" + post.image } alt=""></img>}
                    <p>{ post.body }</p>
                  </div>
                  
                  <h4>συγγραφέας: { post.user.name }</h4>
              </Link>
            </div>
          ))}
        </div>
        <div className='pagination'>
          <button onClick={() => {currentPage > 1 && setCurrentPage(currentPage-1) }}>
            <span className="material-symbols-outlined">arrow_Back_ios</span>
          </button>
          {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          <button onClick={() => {currentPage !== numberOfPages && setCurrentPage(currentPage+1); }}>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      <div className='right'>
        
            <div className='empty-div'>
            </div>
            
            <div className='socials'>
              <h1>Social Media</h1>
              <div className='row1'>
                <i className="fa fa-facebook"></i>
                <i className="fa fa-instagram"></i>
                <i className="fa fa-youtube"></i>
              </div>
              <div className='row2'>
                <i className="fa fa-tiktok"></i>
                <i className="fa fa-linkedin"></i>
                <i className="fa fa-github"></i>
              </div>
            </div>
      </div>
    </section>
  );
  
}
 
export default Home;
