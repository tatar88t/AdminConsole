import React from 'react';
import UIKit from "uikit";

const ConfirmModal = ({modal, target, method}) => {
    return (
        <div id={target} uk-modal = {modal.toString()}>
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Saving</h2>
                <p>Do you really want to save changes?</p>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close"
                            type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close"
                            onClick = {() => method(
                                () => {
                                    UIKit.notification({message: 'Saved Successfully', status: 'success'})
                                },
                                () => {
                                    UIKit.notification({message: 'Saving failure', status: 'danger'})
                                }
                            )}
                            type="button">Publish</button>
                </p>
            </div>
        </div>
    )
}
export default ConfirmModal;