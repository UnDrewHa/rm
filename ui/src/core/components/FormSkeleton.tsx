import {Form, Skeleton} from 'antd';
import React from 'react';

interface IProps {
    fields: number;
}

export const FormSkeleton = ({fields}: IProps) => {
    let arr = [];

    for (let i = 0; i < fields; i++) {
        arr.push(i);
    }

    return (
        <div>
            {arr.map((_, i) => (
                <Form.Item key={i}>
                    <Skeleton.Input size="small" active />
                </Form.Item>
            ))}
            <Skeleton.Button active />
        </div>
    );
};
