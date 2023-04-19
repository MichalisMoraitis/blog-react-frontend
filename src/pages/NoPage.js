import { Link } from "react-router-dom"

const NoPage = () => {
    return(
        <div className="content">
            <h2>Sorry</h2>
            <p>That page cannot be found</p>
            <Link to="/">Back to the home page</Link>
        </div>
    )
}

export default NoPage