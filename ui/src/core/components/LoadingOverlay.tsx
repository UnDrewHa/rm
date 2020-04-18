import React from 'react';
import {Backdrop, CircularProgress} from '@material-ui/core';

interface IProps {
    open: boolean;
}

/**
 * Оверлей на весь экран.
 *
 * @param {IProps} props Свойства компонента.
 */
export const LoadingOverlay = (props: IProps) => {
    return (
        <Backdrop open={props.open}>
            <CircularProgress />
        </Backdrop>
    );
};
