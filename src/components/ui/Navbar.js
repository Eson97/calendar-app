import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startLogout } from '../../actions/auth';

export const Navbar = () => {

    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(startLogout());
    }

    return (
        <div className="navbar navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <span className="navbar-brand"><i className="fas fa-user-circle"></i> {name} </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span> Logout</span>
                </button>
            </div>
        </div>
    )
}
