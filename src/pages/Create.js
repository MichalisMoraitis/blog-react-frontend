import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/create.css";

const Create = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [titleErr, setTitleErr] = useState(null);
    const [bodyErr, setBodyErr] = useState(null);
    const [imageErr, setImageErr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [axiosErr, setAxiosErr] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("user-name")) {
            navigate("/");
        }
    }, [navigate]);

  const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "title") {
            setTitle(value);
            if (value.length < 1) {
                setTitleErr("Ο τίτλος είναι υποχρεωτικός");
            } else if (value.length > 255) {
                setTitleErr("Ο τίλες πρέπει να έχει λιγότερους από 255 χαρακτήρες");
            } else {
                setTitleErr(null);
            }
        }

        if (name === "body") {
            setBody(value);
            if (value.length < 1) {
                setBodyErr("Το κείμενο είναι υποχρεωτικό");
            } else {
                setBodyErr(null);
            }
        }

        if (name === "image") {
            const file = files[0];
            setImage(file);
            setImageErr(null);
            if (!file) {
                setImage(null);
            }
            if (file && !file.type.includes("image/")) {
                setImageErr(
                    "Πρέπει να επιλέξετε μια εικόνα σε μορφή JPG, JPEG ή PNG"
                );
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            title.length >= 1 &&
            body.length >= 1 &&
            title.length < 255 &&
            !imageErr
        ) {
            setIsLoading(true);
            setAxiosErr(null);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", body);
            if (image) {
                formData.append("image", image);
            }

            axios.post(`http://localhost:8000/api/post/new`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            },
            })
            .then(() => {
                setIsLoading(false);
                navigate("/");
            })
            .catch((error) => {
                setAxiosErr(error.message);
                setIsLoading(false);
            });
        } else {
            if (title.length < 1) {
                setTitleErr("Ο τίτλος είναι υποχρεωτικός");
            }

            if (body.length < 1) {
                setBodyErr("Το κείμενο είναι υποχρεωτικό");
            }
        }
    };

    return (
        <section className="create">
            <h1>Create</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Τίτλος<br />
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        placeholder="Τίτλος"
                    />
                    {titleErr && <p className="error">{titleErr}</p>}
                </label>

                <label>
                    Κείμενο<br />
                    <textarea
                        type="text"
                        name="body"
                        value={body}
                        onChange={handleChange}
                        placeholder="Κείμενο"
                    />
                    {bodyErr && <p className="error">{bodyErr}</p>}
                </label>

                <label>
                    Εικόνα<br />
                    <input type="file" name="image" onChange={handleChange} />
                    {imageErr && <p className="error">{imageErr}</p>}
                </label>

                <br />
                {!isLoading ? (
                    <button>Add Blog</button>
                ) : (
                    <h3>Adding Blog....</h3>
                )}
                {axiosErr && <h3 style={{ color: "red" }}>Error {axiosErr}</h3>}
            </form>
        </section>
    );
};

export default Create;
    