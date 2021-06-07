import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken } from "../helpers/fetch"
import { types } from "../types/types";
import { eventCleanLogout } from "./events";

export const startLogin = (email, password) => {
    return async (dispach) => {
        const res = await fetchSinToken('auth', { email, password }, 'POST');
        const body = await res.json();

        if (body.ok) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispach(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            Swal.fire('Error', body.msg, "error");
        }
    }
}

export const startRegister = (email, password, name) => {
    return async (dispach) => {
        const res = await fetchSinToken('auth/register', { email, password, name }, 'POST');
        const body = await res.json();

        if (body.ok) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispach(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            Swal.fire('Error', body.msg, "error");
        }
    }
}

export const startChecking = () => {
    return async (dispach) => {
        const res = await fetchConToken('auth/renew');
        const body = await res.json();

        if (body.ok) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispach(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            dispach(checkingFinish());
        }
    }
}

const checkingFinish = () => ({
    type: types.authCheckingFinish
})

const login = (user) => ({
    type: types.authLogin,
    payload: user
})

export const startLogout = () => {
    return (dispach) => {
        localStorage.clear();
        dispach(logout());
        dispach(eventCleanLogout());
    }
}

const logout = () => ({
    type: types.authLogout
})