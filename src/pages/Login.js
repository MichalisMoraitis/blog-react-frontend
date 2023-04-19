import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/login.css"

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('user-name'))
      navigate("/");
  }, [navigate]);

  const handlechange = (e) => {
    const {name, value} = e.target;
    switch (name) {
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
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //email
    if (email === "")
        setEmailErr('Το email είναι υποχρεωτικό');

    //password
    if(password === "")
        setPasswordErr("Ο κωδικος είναι υποχρεωτικός");

    if(emailErr === false && passwordErr === false){
      setError(null);
        
      axios.post(`http://127.0.0.1:8000/api/auth/login`, {
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
          if(error.response.request.status === 401){
            setError("το email δεν αντιστοιχεί με τον κωδικο");
          }
          console.log(error.message);
          // alert(error.message);
        });

    }
  };

  return (
    <section className="login">
      
      <form onSubmit={handleSubmit}>
      <h1>Login</h1>
            
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
          <input
            type={showPassword ? "text" : "password"} value={password}
            placeholder="Κωδικός" name="password" autoComplete="on"
            onChange={(e) => { setPassword(e.target.value); handlechange(e);}}
            onBlur={(e) => { handlechange(e);}}
          />
          {passwordErr && <p className="error">{passwordErr}</p>}
          {!passwordErr && <p className="error">&nbsp;</p>}
        </label>

        <p>
          εμφάνιση κωδικού
          <input type="checkbox" value={showPassword} onClick={()=> setShowPassword(!showPassword)}/>
        </p>

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </section>
  );
};
  
  export default Login;
  