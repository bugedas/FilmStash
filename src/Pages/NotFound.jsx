import React from 'react';

export default function NotFound() {
    return (
        <div className="page-not-found">
            <h1 className="title">
                404
            </h1>
            <div className="desc">
                The Page you're looking for was not found.
            </div>
            <a href="/"><button className="go-back-btn btn btn-primary" type="button">Go Back</button></a>
        </div>
    );
}