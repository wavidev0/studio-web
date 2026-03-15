import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";
import { createContent, updateContent } from "@/store/contentSlice";


import { ExInput } from "@/extra/Input";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Button from "@/extra/Button";
import { Box, Modal } from '@mui/material';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ErrorState {
    name: string;
    title: string;
    icon: string;
    description: string;
}

const ContentDialogModal = () => {
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const dispatch = useAppDispatch();

    const [cName, setCName] = useState<string>("");
    const [cTitle, setCTitle] = useState<string>("");
    const [cIconFile, setCIconFile] = useState<File | null>(null);
    const [cIconPreview, setCIconPreview] = useState<string>("");
    const [cDesc, setCDesc] = useState<string>("");
    const [quillKey, setQuillKey] = useState<string>("new");

    const [errors, setErrors] = useState<ErrorState>({
        name: "",
        title: "",
        icon: "",
        description: "",
    });

    // Populate fields when editing / reset when adding
    useEffect(() => {
        if (dialogueData) {
            setCName(dialogueData?.name || "");
            setCTitle(dialogueData?.title || "");
            setCDesc(dialogueData?.description || "");
            setCIconPreview(dialogueData?.icon || "");
            setCIconFile(null);
            setQuillKey(dialogueData?._id || "edit");
        } else {
            setCName("");
            setCTitle("");
            setCDesc("");
            setCIconFile(null);
            setCIconPreview("");
            setQuillKey("new-" + Date.now());
        }
        setErrors({ name: "", title: "", icon: "", description: "" });
    }, [dialogueData]);

    const validateForm = () => {
        const next: ErrorState = { name: "", title: "", icon: "", description: "" };
        const nameRegex = /^[a-zA-Z0-9_-]+$/;

        if (!cName) next.name = "Name is required";
        else if (!nameRegex.test(cName))
            next.name = "Name must not contain spaces or special characters";

        if (!cTitle) next.title = "Title is required";
        if (!cDesc || cDesc === "<p><br></p>") next.description = "Description is required";
        if (!dialogueData && !cIconFile) next.icon = "Icon is required";

        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const formData = new FormData();
        if (!dialogueData) formData.append("name", cName);
        formData.append("title", cTitle);
        if (cIconFile) formData.append("icon", cIconFile);
        formData.append("description", cDesc);

        if (dialogueData) {
            // If your API doesn't allow "name" to change on edit, remove the line above that appends name
            dispatch(updateContent({ contentId: dialogueData._id, data: formData }));
        } else {
            dispatch(createContent(formData));
        }

        dispatch(closeDialog());
    };

    // 🔑 IMPORTANT: keep the dialog content interactive no matter your global CSS
    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // ensure keyboard/mouse events are allowed on the overlay
        pointerEvents: "auto",
    };

    const boxStyle: React.CSSProperties = {
        width: "min(900px, 92vw)",
        maxHeight: "88vh",
        overflow: "auto",
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        pointerEvents: "auto",
    };

    return (
        <Modal
            open={true}
            onClose={() => dispatch(closeDialog())}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="model-style">
                <div className="model-header">
                    <p className='m-0'>{dialogueData ? "Edit Content" : "Add Content"}</p>
                </div>
                <div className="model-body">
                    <div className="row align-items-start formBody">
                        <div className="col-md-6">
                            <ExInput
                                type="text"
                                label="Name"
                                placeholder="Name (no spaces; use _ or -)"
                                value={cName}
                                errorMessage={errors.name}
                                disabled={!!dialogueData}
                                onChange={(e: any) => setCName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <ExInput
                                type="text"
                                label="Title"
                                placeholder="Title"
                                value={cTitle}
                                errorMessage={errors.title}
                                onChange={(e: any) => setCTitle(e.target.value)}
                            />
                        </div>

                        <div className="col-md-12">
                            <ExInput
                                type="file"
                                label="Icon"
                                accept="image/png, image/jpeg"
                                errorMessage={errors.icon}
                                onChange={(e: any) => {
                                    const file = e.target.files?.[0] || null;
                                    setCIconFile(file);
                                    setCIconPreview(file ? URL.createObjectURL(file) : "");
                                }}
                            />
                            {cIconPreview && (
                                <img
                                    src={cIconPreview}
                                    alt="preview"
                                    className="mt-2"
                                    style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8 }}
                                />
                            )}
                        </div>

                        <div className="col-12">
                            <label className="form-label">Description</label>
                            <ReactQuill
                                key={quillKey}            // ensures a fresh, editable instance
                                value={cDesc}
                                onChange={setCDesc}
                                theme="snow"
                                placeholder="Write something amazing..."
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        ["bold", "italic", "underline", "strike", "blockquote"],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["link", "image"],
                                        ["clean"],
                                    ],
                                }}
                                style={{ maxHeight: '350px', overflow: 'scroll' }}
                            />
                            {errors.description && (
                                <div className="text-danger small mt-2">{errors.description}</div>
                            )}
                        </div>
                    </div>

                    <div className="model-footer">
                        <div className="m-3 d-flex justify-content-end gap-2">
                            <Button className="close-model-btn" text="Cancel" type="button" onClick={() => dispatch(closeDialog())} />
                            <Button
                                type="submit"
                                text="Submit"
                                onClick={(e: any) => handleSubmit()}
                            />
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ContentDialogModal;
