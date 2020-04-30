import {Form, Skeleton} from 'antd';
import React from 'react';

interface IProps {
    fields: number;
}

export const FormSkeleton = ({fields}: IProps) => (
    <React.Fragment>
        {new Array(fields).map((_) => (
            <Form.Item
                label={
                    <Skeleton.Input size="small" style={{width: 230}} active />
                }
            >
                <Skeleton.Input active />
            </Form.Item>
        ))}
        <Skeleton.Button active />
    </React.Fragment>
);
