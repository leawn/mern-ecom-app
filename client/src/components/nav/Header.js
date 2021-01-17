import React, { useState } from 'react';
import { Menu } from 'antd';
import {AppstoreOutlined, LogoutOutlined, SettingOutlined, UserAddOutlined, UserOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from "firebase";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom';

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');

    let history = useHistory();
    let dispatch = useDispatch();
    let { user } = useSelector((state) => ({ ...state }));

    const handleClick = (e) => {
        setCurrent(e.key)
    }

    const logout = async () => {
        try {
            await firebase.auth().signOut();
            dispatch({
                type: 'LOGOUT',
                payload: null
            });
            history.push('/login');
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    }


    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to='/'>Home</Link>
            </Item>

            {!user && (
                <Item key="register" icon={<UserAddOutlined />} className='float-right'>
                    <Link to='/register'>Register</Link>
                </Item>
            )}

            {!user && (
                <Item key="login" icon={<UserOutlined />} className='float-right'>
                    <Link to='/login'>Login</Link>
                </Item>
            )}

            {user && (
                <SubMenu
                    key="SubMenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className='float-right'
                >
                    <Item key="setting:1">Option 1</Item>
                    <Item key="setting:2">Option 2</Item>
                    <Item icon={<LogoutOutlined />} onClick={logout} key="logout">Logout</Item>
                </SubMenu>
            )}
        </Menu>
    );
}

export default Header;