import React from "react";
import {Badge} from "react-bootstrap";

const TagsContainer = ({ predictions }) => (
    <div>
        {predictions.map(
            ({ className, probability }) =>
                probability.toFixed(3) > 0 && (
                    <Badge className="tag m-1" key={className} color="blue">
                        {className.split(",")[0]} {probability.toFixed(3)}
                    </Badge>
                )
        )}
    </div>
);

export default TagsContainer;