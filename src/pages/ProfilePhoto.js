import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/profilePhoto.css"

const ProfilePhoto = () => {
    
  const [image, setImage] = useState(null);
  const [imageErr, setImageErr] = useState(null);
  const [axiosErr, setAxiosErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageOld,setImageOld] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem('user-name'))
      navigate("/");
  }, [navigate]);

  useEffect(()=>{
    setIsLoading(true);

    axios.get(`http://127.0.0.1:8000/api/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`
        }
    })
    .then((getData) => {
        setImageOld(getData.data.user.image);
        setIsLoading(false);
        setAxiosErr(null);
    })
    .catch((error) => {
        setIsLoading(false);
        setAxiosErr(error);
        navigate("/");
    });
    
}, [ navigate]);

    const handleChange = (e) => {
        const file = e.target.files[0]

        setImage(file)
        setImageErr(null);
        if(!file){
            setImage(null);
        }
        if(file && !file.type.includes('image/')){
            setImageErr("Πρέπει να επιλέξετε μια εικόνα σε μορφή JPG, JPEG ή PNG");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!imageErr && image !== null ){

            e.preventDefault();
            setIsLoading(true);
            setAxiosErr(null);

            const formData = new FormData();
            formData.append('image', image);

            axios.post(`http://localhost:8000/api/profile/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('user-token')}`
            }})
            .then(()=>{
            setIsLoading(false);
            navigate(`/profile`);
            })
            .catch((error) => {
            setAxiosErr(error.message);
            setIsLoading(false);
            });

        }
    }

    return (
        <section className="profilePhoto">
            <h1>Photo Profile</h1>

            <form onSubmit={handleSubmit}>

                {imageOld !== null &&<label className="img">
                    Υπαρχουσα Είκονα
                    <img src={"http://127.0.0.1:8000/userImages/" + imageOld } alt=""></img>
                </label>}

                <label>
                    {imageOld === null && "Εικονα"}
                    {imageOld !== null && "Nεα Εικονα"}
                    <br />
                    <input type="file" name="image" onChange={(e)=>{handleChange(e)}} />
                    {imageErr && <p className="error">{imageErr}</p>}
                </label>

                <br/>
                {!isLoading && <button>Add Image</button>}
                {isLoading && <h3>Loading....</h3>}
                {axiosErr && <h3 style={{color:"red"}}>Error {axiosErr}</h3>}
            </form>
        </section>
    );
}
export default ProfilePhoto;
