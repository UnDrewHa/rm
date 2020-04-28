import {Form, Skeleton} from 'antd';
import React from 'react';

export const ProfileFormSkeleton = () => (
    <React.Fragment>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Form.Item
            label={<Skeleton.Input size="small" style={{width: 230}} active />}
        >
            <Skeleton.Input active />
        </Form.Item>
        <Skeleton.Button active />
    </React.Fragment>
);
