import React from 'react';
import Form from '../utils/Form';

interface Field {
    TBName: string;
    type: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
}

interface AuthFormProps {
    title: string;
    description: string;
    fields: Field[];
    errorStr: string;
    errorPresent: boolean;
    loading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    buttonText: string;
    alternateLink: { text: string; href: string };
    sideTitle: string;
    sideText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
    title,
    description,
    fields,
    errorStr,
    errorPresent,
    loading,
    onSubmit,
    buttonText,
    alternateLink,
    sideTitle,
    sideText
}) => {
    // Adapt fields for the reusable Form component
    const formFields = fields.map(field => ({
        name: field.id,
        label: field.TBName,
        type: field.type,
        placeholder: field.TBName,
        value: field.value,
        onChange: field.onChange,
    }));

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
                                            <h1 className="mb-4">{title}</h1>
                                        </div>
                                        <p className="mb-4">{description}</p>
                                        <Form
                                            fields={formFields}
                                            onSubmit={onSubmit}
                                            submitButtonName={buttonText}
                                            loading={loading}
                                            errorStr={errorStr}
                                            errorPresent={errorPresent}
                                        />
                                        <div className="text-center pt-1 mb-5 pb-1">
                                            <a className="text-muted" href={alternateLink.href}>{alternateLink.text}</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2 rounded-end">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">{sideTitle}</h4>
                                        <p className="small mb-0">{sideText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;