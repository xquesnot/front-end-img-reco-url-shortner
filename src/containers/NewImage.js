import React, {useEffect, useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import {API} from "aws-amplify";
import {useNavigate} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import {onError} from "../lib/errorLib";
import config from "../config";
import {s3Upload} from "../lib/awsLib";
import "@tensorflow/tfjs";
import * as mobileNet from "@tensorflow-models/mobilenet";
import TagsContainer from "../components/TagsContainers";
import "./NewImage.css";
export default function NewImage() {
    const file = useRef(null);
    const nav = useNavigate();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    const [model, setModel] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadModel = async () => {
            const model = await mobileNet.load();
            setModel(model);
        };
        loadModel();
    }, []);

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

    const drawImageOnCanvas = (image, canvas, ctx) => {
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const isLandscape = naturalWidth > naturalHeight;
        ctx.drawImage(
            image,
            isLandscape ? (naturalWidth - naturalHeight) / 2 : 0,
            isLandscape ? 0 : (naturalHeight - naturalWidth) / 2,
            isLandscape ? naturalHeight : naturalWidth,
            isLandscape ? naturalHeight : naturalWidth,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );
    };

    const onImageChange = async ({ target }) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        drawImageOnCanvas(target, canvas, ctx);

        const predictions = await model.classify(canvas, 5);
        console.log(predictions)
        setPredictions(predictions);
    };

    const renderPreview = () => (
        <Form.Group>
            <Form.Label>Preview</Form.Label>
            <div>
                <canvas className="classified-image" ref={canvasRef}>
                    <img alt="preview" onLoad={onImageChange} src={preview} />
                </canvas>
            </div>
        </Form.Group>

    );

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(e) {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

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

            await createImage({title : content, attachment: attachment, prediction: predictions});
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
                    <Form.Label>Title of your test recognition</Form.Label>
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
                {selectedFile && renderPreview()}
                {!!predictions.length && <TagsContainer predictions={predictions} />}
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