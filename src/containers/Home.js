import React, {useState, useEffect} from "react";
import ListGroup from "react-bootstrap/ListGroup";
import {useAppContext} from "../lib/contextLib";
import {onError} from "../lib/errorLib";
import "./Home.css";
import {API} from "aws-amplify";
import {LinkContainer} from "react-router-bootstrap";
import {BsPencilSquare} from "react-icons/bs";

export default function Home() {
    const [images, setImages] = useState([]);
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const images = await loadImages();
                setImages(images);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadImages() {
        return API.get("images", "/images");
    }

    function renderImagesList(images) {
        return (
            <>
                <LinkContainer to="/images/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17}/>
                        <span className="ml-2 font-weight-bold">Add a new image</span>
                    </ListGroup.Item>
                </LinkContainer>
                {images.map(({imageID, title, createdAt, attachment}) => (

                    <LinkContainer key={imageID} to={`/images/${imageID}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                              {title.trim().split("\n")[0]}
                            </span>
                            <br/>
                            <span className="text-muted">
              Created: {new Date(createdAt).toLocaleString()}
            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Imag.Reco</h1>
                <p className="text-muted">A simple image taking app</p>
            </div>
        );
    }

    function renderImages() {
        return (
            <div className="img">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Images</h2>
                <ListGroup>{!isLoading && renderImagesList(images)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderImages() : renderLander()}
        </div>
    );
}