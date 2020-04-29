import {Table} from 'antd';
import {isEmpty} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {DeleteButton} from 'Core/components/DeleteButton';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';

interface IState {
    selectedRowKeys: string[];
}

interface IStateProps {
    items: IAsyncData<any[]>;
}

interface IDispatchProps {
    actions: any;
}

interface IOwnProps {
    getConfig: (actions) => any[];
    storePath: string;
    action: any;
    service: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class BlankList extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        props.actions.getAll();
        this.state = {
            selectedRowKeys: [],
        };
    }

    renderFooter = () => {
        const {selectedRowKeys} = this.state;

        return isEmpty(selectedRowKeys) ? null : (
            <DeleteButton
                actions={this.props.actions}
                layout="button"
                ids={selectedRowKeys}
                placement="right"
                afterDelete={this.handleAfterDelete}
            />
        );
    };

    handleTableCheck = (selectedRowKeys: string[]) => {
        this.setState({
            selectedRowKeys,
        });
    };

    handleAfterDelete = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    render() {
        const {
            items: {status, data},
            getConfig,
            actions,
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;

        return (
            <Table
                rowSelection={{
                    onChange: this.handleTableCheck,
                }}
                columns={getConfig(actions)}
                dataSource={data}
                pagination={false}
                rowKey="_id"
                loading={isLoading}
                footer={this.renderFooter}
                className="admin-table"
            />
        );
    }
}

const mapStateToProps = (
    state: TAppStore,
    ownProps: IOwnProps,
): IStateProps => {
    return {
        items: state[ownProps.storePath],
    };
};

const mapDispatchToProps = (dispatch, ownProps: IOwnProps): IDispatchProps => ({
    actions: new ownProps.action(new ownProps.service(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(BlankList);

export {connected as BlankList};
