import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/update.css";

const Update = () => {
  
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [titleErr, setTitleErr] = useState(null);
    const [bodyErr, setBodyErr] = useState(null);
    const [imageErr, setImageErr] = useState(null);

   const [imageOld,  setImageOld] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [axiosErr, axiosSetErr] = useState(null);
    
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('user-name'))
            navigate("/");
    }, [navigate]);

    useEffect(()=>{
        setIsLoading(true);

        axios.get(`http://127.0.0.1:8000/api/post/${id}`)
        .then((getData) => {
            if(getData.data.post[0].user.id !== parseInt(localStorage.getItem('user-id'))){
                navigate("/");
            }
            setTitle(getData.data.post[0].title);
            setBody(getData.data.post[0].body);
            if(getData.data.post[0].image !== null){
                setImageOld(getData.data.post[0].image);
            }
            setIsLoading(false);
        })
        .catch((error) => {
            setIsLoading(false);
            navigate("/");
        });
        
    }, [id, navigate]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if(name === "title"){
            setTitle(value)
            if(value.length < 1 )
                setTitleErr("Ο τιτλος είναι υποχρεωτικός");
            else if(value.length > 255)
                setTitleErr("Ο τιλες πρέπει να εχει λιγότερους απο 255 χαρακτήρες");
            else
                setTitleErr(null);
        }
        if(name === "body"){
            setBody(value)
            if(value.length < 1 )
                setBodyErr("Το κειμενο είναι υποχρεωτικό");
            else
                setBodyErr(null);
        }
        if(name === "image"){
            const file = e.target.files[0]
            setImage(file);
            setImageErr(null);
            if(!file){
                setImage(null);
            }
            if(file && !file.type.includes('image/')){
                setImageErr("Πρέπει να επιλέξετε μια εικόνα σε μορφή JPG, JPEG ή PNG");
            }
        }
    }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(title.length > 1 && body.length > 1 && title.length < 255 && !imageErr ){
        console.log(title,body);

        e.preventDefault();
        setIsLoading(true);
        axiosSetErr(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if(image){
            formData.append('image', image);
        }

        axios.post(`http://localhost:8000/api/post/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }
        })
        .then(()=>{
        setIsLoading(false);
        navigate(`/post/${id}`);
        })
        .catch((error) => {
        axiosSetErr(error.message);
        setIsLoading(false);
        });

    }else{

        if(title.length < 1 )
            setTitleErr("Ο τιτλος είναι υποχρεωτικός");
        else if(title.length > 255)
            setTitleErr("Ο τιλες πρέπει να εχει λιγότερους απο 255 χαρακτήρες");
        else
            setTitleErr(null);

        if(body.length < 1 )
            setBodyErr("Το κειμενο είναι υποχρεωτικό");
        else
            setBodyErr(null);
    }
  }

  return (
    <section className="update">
        <h1>Update</h1>

        <form onSubmit={handleSubmit}>

            <label>
                Τίτλος<br/>    
                <input type="text" name="title" value={title} onChange={(e)=>{handleChange(e)}}/>
                {titleErr && <p className="error">{titleErr}</p>}
            </label>

            <label>
                Κείμενο<br/>  
                <textarea type="text" name="body" value={body} onChange={(e)=>{handleChange(e)}}/>
                {bodyErr && <p className="error">{bodyErr}</p>}
            </label>

            {imageOld !== null &&<label className="img">
                Υπαρχουσα Είκονα
                <img src={"http://127.0.0.1:8000/postImages/" + imageOld } alt=""></img>
            </label>}

            <label>
                Νεα Είκονα<br />
                <input type="file" name="image" onChange={(e)=>{handleChange(e)}} />
                {imageErr && <p className="error">{imageErr}</p>}
            </label>
            <br/>
            {!isLoading && <button>Update Post</button>}
            {isLoading && <h3>Updating....</h3>}
            {axiosErr && <h3 style={{color:"red"}}>Error {axiosErr}</h3>}
        </form>
    </section>
    
  );
  };
  
  export default Update;
  