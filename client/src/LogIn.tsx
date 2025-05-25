import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios, { type AxiosResponse } from 'axios';

const LogIn: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorStr, setErrorStr] = React.useState('');
    const [errorPresent, setErrorPresent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const fields = [
        { TBName: "Email", type: "email", id: "loginEmail", fnOnChange: setEmail },
        { TBName: "Password", type: "password", id: "loginPassword", fnOnChange: setPassword }
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
        axios.post('http://localhost:3000/login', {
            email: email,
            password: password
        })
        .then((response: AxiosResponse) => {
            setErrorPresent(false);
            setErrorStr('');
            console.log("User logged in successfully:", response.data);
            // Redirect to home page or dashboard
            window.location.href = '/';
        })
        .catch((error) => {
            setErrorPresent(true);
            setErrorStr(error.response?.data?.message || "Error logging in");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="h-100 gradient-form d-flex justify-content-center align-items-center">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="text-center">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                                style={{ width: '185px' }} alt="logo" className="mb-3" />
                                            <h1 className="mb-4">Log In</h1>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <p className="mb-4">Please enter your credentials to log in</p>
                                            {errorPresent && <div className="alert alert-danger" role="alert">
                                                {errorStr}
                                            </div>}
                                            {fields.map(field => (
                                                <div className="form-outline mb-4" key={field.id}>
                                                    <input
                                                        type={field.type}
                                                        id={field.id}
                                                        className="form-control"
                                                        placeholder={field.TBName}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setErrorPresent(false);
                                                            field.fnOnChange(e.target.value);
                                                        }}
                                                        value={
                                                            field.id === "loginEmail" ? email : password
                                                        }
                                                    />
                                                </div>
                                            ))}
                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit" disabled={loading}>
                                                    {loading ? "Logging In..." : "Log In"}
                                                </button>
                                                <br />
                                                <a className="text-muted" href="/signup">Don't have an account? Sign up</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2 rounded-end">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">Welcome Back!</h4>
                                        <p className="small mb-0">
                                            Log in to access your tasks and stay productive with the To-Do App.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;