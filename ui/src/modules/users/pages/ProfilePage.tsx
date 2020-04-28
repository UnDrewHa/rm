import {
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
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
import {InterfaceAction} from 'Core/actions/InterfaceActions';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {BuildingsAutocomplete} from 'Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'Modules/buildings/models';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {ProfileFormSkeleton} from 'Modules/users/components/ProfileFormSkeleton';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';

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

    handleBack = () => {
        window.history.back();
    };

    handleBeforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            InterfaceAction.notify(
                'Можно загрузить фото следующих форматов: JPG, PNG',
                'error',
            );
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            InterfaceAction.notify(
                'Размер загружаемого файла не должен превышать 1Мб',
                'error',
            );
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
                    InterfaceAction.notify(
                        i18n.t('Users:upload.success'),
                        'success',
                    );
                },
            );
        } else if (info.file.status === 'error') {
            InterfaceAction.notify(i18n.t('Users:upload.error'), 'error');
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
                    onBack={this.handleBack}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={10} className="border-right">
                        {dataIsLoading ? (
                            <ProfileFormSkeleton />
                        ) : (
                            <Form
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
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t(
                                                'forms.requiredText',
                                            ),
                                        },
                                    ]}
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
                                action="http://localhost:5000/users/upload"
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
    userInfo: state.user,
    dataIsLoading: state.user.status === EStatusCodes.PENDING,
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
