import { Outlet, Link } from "react-router-dom";
import "./../styles/nav.css";
import "./../styles/footer.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Layout = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [showNav,setShowNav] = useState(false);

  return (
    <>
        <nav>
            <div className={showNav ? " topnav responsive" : " topnav"}>
                <Link className="logo" to="/" onClick={()=>{setShowNav(false)}}>
                    Blog
                </Link>

                <Link onClick={()=>{setShowNav(false)}} to="/">Αρχικη</Link>

                {localStorage.getItem('user-name') &&
                    <Link onClick={()=>{setShowNav(false)}} to="/create">Νεα Αναρτηση</Link>
                }

                <Link to="/search" onClick={()=>{setShowNav(false)}} >
                    Αναζήτηση {" "} <i className="fa fa-search " aria-hidden="true"></i>
                </Link>

                {!localStorage.getItem('user-name') ? (
                    <>
                        <Link className="right" to="/login" onClick={()=>{setShowNav(false)}} >
                            login
                        </Link>
                        <Link className="right" to="/register" onClick={()=>{setShowNav(false)}} >
                            Register
                        </Link>
                    </>
                ) : ( 
                    <div className="dropdown right">
                        <button className="dropbtn">
                            {localStorage.getItem('user-name')} 
                            { " " }
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link to="/profile" onClick={()=>{setShowNav(false)}}>
                                <i className="fa fa-user" aria-hidden="true"></i> {" "} profile
                            </Link>
                            
                            <button className="logout"
                                onClick={() => {localStorage.removeItem('user-name'); 
                                localStorage.removeItem('user-token'); 
                                localStorage.removeItem('user-id'); 
                                navigate(location.pathname)}}
                            >
                                <i className="fa fa-sign-out"></i> {" "} Logout
                            </button>

                        </div>
                    </div> 
                )}
                
                <button className="icon" onClick={()=>{setShowNav(!showNav)}} >
                    Menu
                    { " " }
                    <i className={showNav ? 'fa fa-minus' : 'fa fa-plus'} style={{color:"#444"}} aria-hidden="true"></i>
                </button>
            </div>
        </nav>
        

      <Outlet />

        <footer>
            <div className="social-media">
                <i className="fa fa-facebook" aria-hidden="true"></i>
                <i className="fa fa-instagram" aria-hidden="true"></i>
                <i className="fa fa-youtube"></i>
                <i className="fa fa-linkedin"></i>
                <i className="fa fa-github"></i>
            </div>
            <h5>© 2023 Blog</h5>
        </footer>

    </>
  )
};

export default Layout;
