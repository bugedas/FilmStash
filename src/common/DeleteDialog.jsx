import React from 'react';
import './DeleteDialog.css';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";

export default function DeleteDialog(props) {
    const { onClose, open } = props;

    const handleClose = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={() => handleClose(false)} open={open}>
            <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
            <DialogContent>
                <div className={'dialog-content'}>
                    <div className={'dialog-button'} onClick={() => handleClose(true)}>YES</div>
                    <div className={'dialog-button'} onClick={() => handleClose(false)}>NO</div>
                </div>
            </DialogContent>
        </Dialog>
    );
}