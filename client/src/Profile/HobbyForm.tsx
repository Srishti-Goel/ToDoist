import React from "react";
import { FaCheck, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

interface Field {
    label: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
}

interface hobbyFormDets {
    fields: Field[];
    extrafield?: any;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleClose?: () => void;
    handleDelete?: any;
    className?: string;
    style?: React.CSSProperties;
    formError: string | null;
    loading: boolean;
}

const HobbyForm : React.FC<hobbyFormDets> = ({
  handleSubmit, handleClose, handleDelete, className, style, fields, extrafield, formError, loading
}) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="mb-3 p-3 rounded position-relative"
            style={{
                background: "var(--palette-1)",
                border: "1px solid var(--palette-3)"
            }}
        >
            {handleClose && (
                <button
                    type="button"
                    onClick={handleClose}
                    title="Close"
                    className="btn position-absolute top-0 end-0 m-2 p-0 text-muted" // <- Added 'position-absolute'
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--palette-4)"
                    }}
                >
                    <FaTimes size={16} />
                </button>
            )}
            {
                fields.map((field) => (
                    <div className="mb-2">
                        <label className="form-label"
                            style={{
                                color: "var(--palette-4)"
                            }}
                        >
                            {field.label}
                        </label>
                        <input
                            id={field.label}
                            name={field.label}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            style={
                                field.style || {
                                    color: "var(--palette-4)",
                                    background: "var(--palette-1)",
                                    borderColor: "var(--palette-3)",
                                }
                            }
                            className="form-control"
                            required
                        />
                    </div>
                ))
            }
            {formError && <div className="text-danger mb-2">{formError}</div>}

            <div className="d-flex justify-content-end mt-3">
                <button
                    type="submit"
                    className="btn btn-sm"
                    style={{ background: "var(--palette-4)", color: "var(--palette-1)" }}
                    disabled={loading}
                >
                    <FaCheck size={16} />
                </button>
                {handleDelete && 
                    <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={handleDelete}
                        title="Delete Task"
                        style={{
                            height: "32px",
                            width: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: "80%"
                        }}
                    >
                        <FaTrash size={16} />
                    </button>
                }
            </div>
        </form>
    )
}

export default HobbyForm;