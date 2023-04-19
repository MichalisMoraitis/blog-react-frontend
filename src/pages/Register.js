import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/register.css"

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameErr, setNameErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [confPasswordErr, setConfPasswordErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('user-name'))
      navigate("/");
  }, [navigate]);

  const handlechange = (e) => {
    const {name, value} = e.target;
    switch (name) {
      case "name":
        if(value === "")
            setNameErr("Το όνομα είναι υποχρεωτικό");
        else
            setNameErr(false);
        break;
      case "email":
        if (value === "")
            setEmailErr('Το email είναι υποχρεωτικό');
        else if (!/\S+@\S+\.\S+/.test(email))
            setEmailErr('Το email δεν είναι έγκυρο');
        else
            setEmailErr(false);
        break;
      case "password":
        if(value === "")
            setPasswordErr("Ο κωδικος είναι υποχρεωτικός");
        else if(value.length < 8)
            setPasswordErr("Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες");
        else
            setPasswordErr(false);
        break;
      case "confirm_password":
        if(value === "")
            setConfPasswordErr("Η επαληθευση του κωδικου είναι υποχρεωτικη");
        else if(value !== password)
          setConfPasswordErr("μη επαληθευμένος κωδικός");
        else
          setConfPasswordErr(false)
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // name
    if(name === "")
        setNameErr("Το όνομα είναι υποχρεωτικό");
        
    //email
    if (email === "")
        setEmailErr('Το email είναι υποχρεωτικό');
        
    //password
    if(password === "")
        setPasswordErr("Ο κωδικος είναι υποχρεωτικός")
        
    //confirm_password
    if(confirmPassword === "")
        setConfPasswordErr("Η επαληθευση του κωδικου είναι υποχρεωτικη")
        

    if(nameErr === false && emailErr === false && passwordErr === false && confPasswordErr === false){
        
        axios.post(`http://127.0.0.1:8000/api/auth/register`, {
            name,
            email,
            password
          })
          .then((getData)=>{
              localStorage.setItem('user-token', getData.data.token)
              localStorage.setItem('user-name', getData.data.username)
              localStorage.setItem('user-id', getData.data.userid)
              navigate('/');
          })
          .catch((error) => {
            console.log(error.message);
          });

    }
  };

  return (
    <section className="register">
      
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>

        <label>
          Ονομα<br />
          <input type="text" value={name}
            placeholder="Ονομα" name="name"
            onChange={(e) => { setName(e.target.value); handlechange(e);}}
            onBlur={(e) => { handlechange(e);}}
          />
          {nameErr && <p className="error">{nameErr}</p>}
          {!nameErr && <p className="error">&nbsp;</p>}
        </label>

        <label>
          Εmail<br />
          <input type="text" value={email}
            placeholder="Εmail" name="email"
            onChange={(e) => { setEmail(e.target.value); handlechange(e);}}
            onBlur={(e) => { handlechange(e);}}
          />
          {emailErr && <p className="error">{emailErr}</p>}
          {!emailErr && <p className="error">&nbsp;</p>}
        </label>

        <label>
          Κωδικός<br/>
          <input type={showPassword ? "text" : "password"}
            value={password} placeholder="Κωδικός"
            name="password" autoComplete="on"
            onChange={(e) => { setPassword(e.target.value); handlechange(e);}}
            onBlur={(e) => { handlechange(e);}}
          />
          {passwordErr && <p className="error">{passwordErr}</p>}
          {!passwordErr && <p className="error">&nbsp;</p>}
        </label>

        <label>
          Επιβεβαίωση Κωδικού<br />
          <input type={showPassword ? "text" : "password"}
            value={confirmPassword} placeholder="Επιβεβαίωση Κωδικού"
            name="confirm_password" autoComplete="on"
            onChange={(e) => { setConfirmPassword(e.target.value); handlechange(e);}}
            onBlur={(e) => { handlechange(e);}}
          />
          {confPasswordErr && <p className="error">{confPasswordErr}</p>}
          {!confPasswordErr && <p className="error">&nbsp;</p>}
        </label>
        <p>
          εμφάνιση κωδικού
          <input type="checkbox" value={showPassword} onClick={()=> setShowPassword(!showPassword)}/>
        </p>

        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default Register;