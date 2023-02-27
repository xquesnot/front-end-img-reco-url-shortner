import React, {useEffect, useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import {API} from "aws-amplify";
import {useNavigate} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import {onError} from "../lib/errorLib";
import config from "../config";
import {s3Upload} from "../lib/awsLib";

export default function NewImage() {
    const file = useRef(null);
    const nav = useNavigate();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(e) {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])

        file.current = e.target.files[0];
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
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createImage({content, attachment});
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createImage(data) {
        return API.post("images", "/images", {
            body: data,
        });
    }

    return (
        <div className="NewNote">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        value={content}
                        as="input"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>Attachment (.png, .jpg, .jpeg )</Form.Label>
                    <Form.Control accept='.png, .jpg, .jpeg' onChange={handleFileChange} type="file"/>
                </Form.Group>
                {selectedFile &&
                    <Form.Group>
                        <Form.Label>Preview</Form.Label>
                        <div>
                            <img src={preview} alt="preview" height={200}/>
                        </div>
                    </Form.Group>
                }
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}