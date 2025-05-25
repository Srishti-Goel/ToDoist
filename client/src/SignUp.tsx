import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios, { type AxiosResponse } from 'axios';
import AuthForm from './AuthForm';

const SignUp: React.FC = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorStr, setErrorStr] = React.useState('');
    const [errorPresent, setErrorPresent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const fields = [
        { TBName: "Name", type: "text", id: "signUpName", value: name, onChange: (v: string) => { setErrorPresent(false); setName(v); } },
        { TBName: "Email", type: "email", id: "signUpEmail", value: email, onChange: (v: string) => { setErrorPresent(false); setEmail(v); } },
        { TBName: "Password", type: "password", id: "signUpPassword", value: password, onChange: (v: string) => { setErrorPresent(false); setPassword(v); } },
        { TBName: "Confirm Password", type: "password", id: "signUpConfirmPassword", value: confirmPassword, onChange: (v: string) => { setErrorPresent(false); setConfirmPassword(v); } }
    ];

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!name || !email || !password) {
            setErrorPresent(true);
            setErrorStr("Please fill in all fields");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setErrorPresent(true);
            setErrorStr("Passwords do not match");
            setLoading(false);
            return;
        }
        axios.post('http://localhost:3000/register', { name, email, password })
            .then((response: AxiosResponse) => {
                window.location.href = '/';
            })
            .catch((error) => {
                setErrorPresent(true);
                setErrorStr(error.response?.data?.message || "Error registering user");
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthForm
            title="Sign Up"
            description="Please fill in the form to create an account"
            fields={fields}
            errorStr={errorStr}
            errorPresent={errorPresent}
            loading={loading}
            onSubmit={handleSubmit}
            buttonText="Sign Up"
            alternateLink={{ text: "Already have an account? Log in", href: "/login" }}
            sideTitle="Welcome to To-Do App!"
            sideText="Join us to organize your tasks, stay productive, and manage your day efficiently."
        />
    );
};

export default SignUp;