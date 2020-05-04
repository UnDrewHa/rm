import {
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    message,
    Avatar,
    Button,
    Col,
    Form,
    Input,
    PageHeader,
    Row,
    Typography,
    Upload,
} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FormSkeleton} from 'core/components/FormSkeleton';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';

interface IState {
    building: IBuildingModel;
    photo: string;
}

interface IStateProps {
    userInfo: IAsyncData<IUserModel>;
    dataIsLoading: boolean;
}

interface IDispatchProps {
    usersActions: UsersActions;
}

interface IOwnProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const getInitial = (user: IUserModel) => ({
    login: user.login || '',
    email: user.email || '',
    building: (user.building as any).address || '',
    phone: user.phone || '',
    name: user.name || '',
    surname: user.surname || '',
    patronymic: user.patronymic || '',
    newPassword: '',
    password: '',
    passwordConfirm: '',
});

class ProfilePage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: (props.userInfo.data?.building as any) || null,
            photo: props.userInfo.data?.photo || '',
        };
    }

    /**
     * Обработчик отправки формы.
     */
    handleFinish = (values) => {
        const {userInfo, usersActions} = this.props;
        const building =
            this.state.building?._id || userInfo.data.building?._id;

        usersActions.updateMe({
            ...values,
            _id: userInfo.data._id,
            building,
            photo: this.state.photo,
        });
    };

    /**
     * Обработчик выбора здания.
     *
     * @param {IBuildingModel} building Выбранное здание.
     */
    handleBuildingSelect = (building: IBuildingModel) => {
        this.setState({
            building: building,
        });
    };

    handleBeforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Можно загрузить фото следующих форматов: JPG, PNG');
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            message.error('Размер загружаемого файла не должен превышать 1Мб');
        }

        return isJpgOrPng && isLt2M;
    };

    handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            this.setState(
                {
                    photo: info.file.response.data,
                },
                () => {
                    message.success(i18n.t('Users:upload.success'));
                },
            );
        } else if (info.file.status === 'error') {
            message.error(i18n.t('Users:upload.error'));
        }
    };

    render() {
        const {userInfo, dataIsLoading} = this.props;
        const isLoading = userInfo.status === EStatusCodes.PENDING;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Users:profile.title')}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={10} className="border-right">
                        {dataIsLoading ? (
                            <FormSkeleton fields={10} />
                        ) : (
                            <Form
                                validateMessages={defaultValidateMessages}
                                className="profile-form"
                                initialValues={{
                                    ...getInitial(userInfo.data),
                                }}
                                onFinish={this.handleFinish}
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                            >
                                <Form.Item
                                    name="login"
                                    rules={validationConsts.user.login}
                                    label={i18n.t(
                                        'Users:profile.loginPlaceholder',
                                    )}
                                >
                                    <Input
                                        prefix={
                                            <UserOutlined className="site-form-item-icon" />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    rules={validationConsts.user.email as any}
                                    label={i18n.t(
                                        'Users:profile.emailPlaceholder',
                                    )}
                                >
                                    <Input
                                        type="email"
                                        prefix={
                                            <MailOutlined className="site-form-item-icon" />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label={i18n.t(
                                        'Users:profile.phonePlaceholder',
                                    )}
                                >
                                    <Input
                                        minLength={11}
                                        maxLength={12}
                                        prefix={
                                            <PhoneOutlined className="site-form-item-icon" />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="building"
                                    rules={validationConsts.common.required}
                                    label={i18n.t(
                                        'Users:profile.buildingPlaceholder',
                                    )}
                                >
                                    <BuildingsAutocomplete
                                        onSelect={this.handleBuildingSelect}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label={i18n.t(
                                        'Users:profile.namePlaceholder',
                                    )}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="surname"
                                    label={i18n.t(
                                        'Users:profile.surnamePlaceholder',
                                    )}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="patronymic"
                                    label={i18n.t(
                                        'Users:profile.patronymicPlaceholder',
                                    )}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="newPassword"
                                    label={i18n.t(
                                        'Users:profile.newPasswordPlaceholder',
                                    )}
                                    rules={validationConsts.user.newPassword}
                                >
                                    <Input
                                        prefix={
                                            <LockOutlined className="site-form-item-icon" />
                                        }
                                        type="password"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={validationConsts.user.password}
                                    label={i18n.t(
                                        'Users:profile.passwordPlaceholder',
                                    )}
                                >
                                    <Input
                                        prefix={
                                            <LockOutlined className="site-form-item-icon" />
                                        }
                                        type="password"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="passwordConfirm"
                                    rules={
                                        validationConsts.user.passwordConfirm
                                    }
                                    label={i18n.t(
                                        'Users:profile.passwordConfirmPlaceholder',
                                    )}
                                >
                                    <Input
                                        prefix={
                                            <LockOutlined className="site-form-item-icon" />
                                        }
                                        type="password"
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={isLoading}
                                >
                                    {i18n.t('actions.save')}
                                </Button>
                            </Form>
                        )}
                    </Col>
                    <Col span={14}>
                        <Avatar
                            size={128}
                            icon={<UserOutlined />}
                            src={this.state.photo}
                            style={{marginBottom: 10}}
                        />
                        <Typography.Paragraph>
                            <Upload
                                action="users/upload"
                                withCredentials
                                name="photo"
                                beforeUpload={this.handleBeforeUpload}
                                onChange={this.handleUploadChange}
                                showUploadList={false}
                            >
                                <Button>
                                    <UploadOutlined />{' '}
                                    {i18n.t('Users:upload.button')}
                                </Button>
                            </Upload>
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    userInfo: state.users.profile,
    dataIsLoading: state.users.profile.status === EStatusCodes.PENDING,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    usersActions: new UsersActions(new UsersService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(ProfilePage),
);

export {connected as ProfilePage};
