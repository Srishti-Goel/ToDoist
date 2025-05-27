import React from 'react';

type Field = {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

type FormProps = {
    fields: Field[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitButtonName: string;
    loading?: boolean;
    errorStr?: string;
    errorPresent?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

const Form: React.FC<FormProps> = ({
    fields,
    onSubmit,
    submitButtonName,
    loading = false,
    errorStr,
    errorPresent,
    className,
    style,
}) => {
    return (
        <form onSubmit={onSubmit} className={className} style={style}>
            {fields.map((field) => (
                <div className="mb-3 d-flex align-items-center" key={field.name}>
                    <label htmlFor={field.name} className="form-label mb-0 me-2" style={{ minWidth: 90 }}>
                        {field.label}
                    </label>
                    <input
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className="form-control"
                        style={{ flex: 1 }}
                        {...field.inputProps}
                    />
                </div>
            ))}
            {errorPresent && errorStr && (
                <div className="alert alert-danger" role="alert">{errorStr}</div>
            )}
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn" style={{backgroundColor: 'var(--palette-4)', color: 'var(--palette-1)'}} disabled={loading}>
                    {loading ? submitButtonName + "..." : submitButtonName}
                </button>
            </div>
        </form>
    );
};

export default Form;