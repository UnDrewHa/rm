import React from 'react';
import '../styles/buttons.scss';

interface IOwnProps {
    children: any;
    className?: string;
}

type TProps = IOwnProps;

export const ButtonsRow = (props: TProps) => {
    return (
        <div className={`buttons-row ${props.className || ''}`}>
            {props.children}
        </div>
    );
};
