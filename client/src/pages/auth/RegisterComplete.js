import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { corupUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user } = useSelector((state) => ({ ...state }));
    let dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and password is required.');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            if (result.user.emailVerified) {
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;

                try {
                    await user.updatePassword(password);
                    try {
                        const idTokenResult = await user.getIdTokenResult();
                        console.log(user);
                        console.log(idTokenResult);
                        try {
                            const res = await corupUser(idTokenResult.token);
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: {
                                    name: res.data.name,
                                    email: res.data.email,
                                    token: idTokenResult.token,
                                    role: res.data.role,
                                    _id: res.data._id
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                        history.push('/');
                    } catch (err) {
                        console.log(err);
                        return toast.error(err.message);
                    }
                } catch (err) {
                    console.log(err);
                    return toast.error(err.message);
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error(err.message);
        }
    }

    const completeRegistrationForm = () => <form onSubmit={handleSubmit}>
        <input
            type='email'
            className='form-control'
            value={email}
            disabled
            autoFocus
        />

        <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            autoFocus
        />



        <button
            type='submit'
            className='btn btn-raised'
        >
            Complete registration
        </button>
    </form>

    return (
        <div className='container p-5'>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Registration complete</h4>
                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    );
}

export default RegisterComplete;