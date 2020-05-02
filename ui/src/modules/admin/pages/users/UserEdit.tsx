import {Button, Checkbox, Form, Input, Select} from 'antd';
import {FormInstance} from 'antd/lib/form';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FormSkeleton} from 'Core/components/FormSkeleton';
import {EPageMode} from 'Core/enums';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {BuildingsAutocomplete} from 'Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'Modules/buildings/models';
import {ERoles} from 'Modules/permissions/enums';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';

interface IState {
    pageMode: EPageMode;
    building: IBuildingModel;
}

interface IStateProps {
    item: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    actions: UsersActions;
}

interface IOwnProps {
    location: any;
    match: any;
    history: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class UserEdit extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {location} = props;
        const queryParams = queryParser.parse(location.search);
        let pageMode = EPageMode.CREATE;

        if (queryParams.id) {
            pageMode = EPageMode.EDIT;
            props.actions.getById(queryParams.id as string);
        }

        this.state = {
            pageMode,
            building: null,
        };
    }

    formRef = React.createRef<FormInstance>();

    resetForm = () => {
        isFunction(this?.formRef?.current?.resetFields) &&
            this.formRef.current.resetFields();
    };

    getInitialFormData = (item) => {
        const data = this.state.pageMode === EPageMode.EDIT ? item : null;

        return {
            login: data?.login || '',
            email: data?.email || '',
            role: data?.role || ERoles.USER,
            active: data?.active || true,
            building: data?.building?.address || '',
        };
    };

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleFinish = (values) => {
        const {location, actions, item} = this.props;
        const queryParams = queryParser.parse(location.search);
        const method =
            this.state.pageMode === EPageMode.CREATE
                ? actions.create
                : actions.update;

        method({
            _id: queryParams.id as string,
            ...values,
            building: this.state?.building?._id || item.data.building._id,
        }).then(this.resetForm);
    };

    render() {
        const {pageMode} = this.state;
        const {
            item: {status, data},
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;

        if (isLoading) {
            return <FormSkeleton fields={5} />;
        }

        return (
            <Form
                ref={this.formRef}
                className="admin-form"
                initialValues={{
                    ...this.getInitialFormData(data),
                }}
                onFinish={this.handleFinish}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                layout="vertical"
            >
                <Form.Item
                    name="login"
                    label={i18n.t('Users:edit.loginPlaceholder')}
                    rules={[
                        {
                            required: true,
                            message: i18n.t('forms.requiredText'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={i18n.t('Users:edit.emailPlaceholder')}
                    rules={[
                        {
                            required: true,
                            message: i18n.t('forms.requiredText'),
                        },
                    ]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    name="building"
                    rules={[
                        {
                            required: true,
                            message: i18n.t('forms.requiredText'),
                        },
                    ]}
                >
                    <BuildingsAutocomplete
                        onSelect={this.handleBuildingSelect}
                    />
                </Form.Item>
                <Form.Item
                    name="role"
                    label={i18n.t('Users:edit.rolePlaceholder')}
                >
                    <Select defaultValue={ERoles.USER} style={{width: 120}}>
                        <Select.Option value={ERoles.USER}>
                            {ERoles.USER}
                        </Select.Option>
                        <Select.Option value={ERoles.ADMIN}>
                            {ERoles.ADMIN}
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="active" valuePropName="checked">
                    <Checkbox>
                        {i18n.t('Users:edit.activePlaceholder')}
                    </Checkbox>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {pageMode === EPageMode.CREATE
                        ? i18n.t('actions.create')
                        : i18n.t('actions.save')}
                </Button>
            </Form>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        item: state.users.details,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new UsersActions(new UsersService(), dispatch),
});

const connected = withRouter(
    connect<IStateProps, IDispatchProps, IOwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(UserEdit),
);

export {connected as UserEdit};