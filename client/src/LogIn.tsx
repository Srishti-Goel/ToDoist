import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios, { type AxiosResponse } from 'axios';
import AuthForm from './AuthForm';

const LogIn: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorStr, setErrorStr] = React.useState('');
    const [errorPresent, setErrorPresent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const fields = [
        { TBName: "Email", type: "email", id: "loginEmail", value: email, onChange: (v: string) => { setErrorPresent(false); setEmail(v); } },
        { TBName: "Password", type: "password", id: "loginPassword", value: password, onChange: (v: string) => { setErrorPresent(false); setPassword(v); } }
    ];

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!email || !password) {
            setErrorPresent(true);
            setErrorStr("Please fill in all fields");
            setLoading(false);
            return;
        }
        axios.post('http://localhost:3000/login', { email, password })
            .then((response: AxiosResponse) => {
                window.location.href = '/';
            })
            .catch((error) => {
                setErrorPresent(true);
                setErrorStr(error.response?.data?.message || "Error logging in");
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthForm
            title="Log In"
            description="Please enter your credentials to log in"
            fields={fields}
            errorStr={errorStr}
            errorPresent={errorPresent}
            loading={loading}
            onSubmit={handleSubmit}
            buttonText="Log In"
            alternateLink={{ text: "Don't have an account? Sign up", href: "/signup" }}
            sideTitle="Welcome Back!"
            sideText="Log in to access your tasks and stay productive with the To-Do App."
        />
    );
};

export default LogIn;