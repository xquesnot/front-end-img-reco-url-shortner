import React, {useRef, useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {API, Storage} from "aws-amplify";
import {onError} from "../lib/errorLib";
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form";
import config from "../config";
import "./Images.css";

export default function Images() {
    const file = useRef(null);
    const {id} = useParams();
    const nav = useNavigate();
    const [image, setImage] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadImage() {
            return API.get("images", `/images/${id}`);
        }

        async function onLoad() {
            try {
                const image = await loadImage();
                const {title, attachment} = image;

                if (attachment) {
                    image.attachmentURL = await Storage.vault.get(attachment);
                }

                setContent(title);
                setImage(image);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function deleteImage() {
        return API.del("images", `/images/${id}`);
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteImage();
            nav("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function saveImage(note) {
        return API.put("images", `/images/${id}`, {
            body: note,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${
                    config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            await saveImage({
                title: content,
                attachment: image.attachment,
            });
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="Images">
            {image && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="content">
                        <Form.Control
                            as="input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Attachment</Form.Label>
                        {image.attachment && (
                            <p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={image.attachmentURL}
                                >
                                    {formatFilename(image.attachment)}
                                </a>
                                <div>
                                    <img src={image.attachmentURL} alt="preview" height={200}/>
                                </div>

                            </p>
                        )}

                    </Form.Group>
                    <LoaderButton
                        block="true"
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Save
                    </LoaderButton>
                    <LoaderButton
                        block="true"
                        size="lg"
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </LoaderButton>
                </Form>
            )}
        </div>
    );
}