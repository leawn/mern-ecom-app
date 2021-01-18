import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import {GoogleOutlined, MailOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';

const corupUser = async (authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/corup-user`,
        {},
        {
            headers: {
                authtoken
            }
    });
}

const Login = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push('/');
        }
    }, [user]);

    let dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            try {
                const res = await corupUser(idTokenResult.token);
            } catch (err) {
                console.log(err);
            }

            /*dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token
                }
            });
            history.push('/');*/
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error(err.message);
        }
    }

    const googleLogin = async () => {
        try {
            const result = await auth.signInWithPopup(googleAuthProvider);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token
                }
            });
            history.push('/');
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error(err.message);
        }
    }

    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
                type='email'
                className='form-control'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Your email'
                autoFocus
            />
        </div>

        <div className="form-group">
            <input
                type='password'
                className='form-control'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Your email'
            />
        </div>

        <br/>

        <Button
            onClick={handleSubmit}
            type='primary'
            className='mb-3'
            block
            shape='round'
            icon={<MailOutlined/>}
            size='large'
            disable={!email || password < 6}
        >
            Login with Email & Password
        </Button>
    </form>

    return (
        <div className='container p-5'>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Login</h4>}
                    {loginForm()}

                    <Button
                        onClick={googleLogin}
                        type='danger'
                        className='mb-3'
                        block
                        shape='round'
                        icon={<GoogleOutlined />}
                        size='large'
                        disable={!email || password < 6}
                    >
                        Login with Email & Password
                    </Button>

                    <Link to='/forgot-password' className='float-right text-danger'>
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;