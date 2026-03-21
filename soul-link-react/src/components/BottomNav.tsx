import { NavLink } from "react-router-dom";

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/world">World</NavLink>
            <NavLink to="inbox">Inbox</NavLink>
            <NavLink to="/sanctum">Sanctum</NavLink>
            <NavLink to="/soul-links">Soul Link</NavLink>
        </nav>
    );
}

export default BottomNav;