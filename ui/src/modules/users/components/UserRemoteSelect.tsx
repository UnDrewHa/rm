import {Select, Spin} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import debounce from 'lodash/debounce';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';
import React from 'react';
import {connect} from 'react-redux';

interface IOwnProps {
    onSelect?: (value, option) => void;
}

interface IStateProps {
    users: IAsyncData<IUserModel[]>;
}

interface IDispatchProps {
    usersActions: UsersActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

interface IState {
    selectedUsers: {key: string; value: string; label: string}[];
}

class UserRemoteSelect extends React.Component<TProps, IState> {
    state: IState = {
        selectedUsers: [],
    };

    fetchUser = debounce((text) => {
        this.props.usersActions.find({
            text,
        });
    }, 600);

    handleChange = (options) => {
        this.setState({
            selectedUsers: options,
        });
    };

    render() {
        const {users} = this.props;
        const {selectedUsers} = this.state;
        const isLoading = users.status === EStatusCodes.PENDING;

        return (
            <Select
                mode="multiple"
                labelInValue
                value={selectedUsers}
                placeholder="Select users"
                notFoundContent={isLoading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={{width: '100%'}}
            >
                {users.data.map((user) => (
                    <Select.Option key={user._id} value={user._id}>
                        {user.fullName || user.email}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    users: state.users.list,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    usersActions: new UsersActions(new UsersService(), dispatch),
});

/**
 * Компонент выборы пользователей.
 */
const connected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserRemoteSelect);

export {connected as UserRemoteSelect};
