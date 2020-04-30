import {SearchOutlined} from '@ant-design/icons';
import {Button, Input, Space, Table} from 'antd';
import i18n from 'i18next';
import {get, isEmpty} from 'lodash-es';
import React from 'react';
import Highlighter from 'react-highlight-words';
import {connect} from 'react-redux';
import {DeleteButton} from 'Core/components/DeleteButton';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';

interface IState {
    selectedRowKeys: string[];
    searchText: string;
    searchedColumn: string;
}

interface IStateProps {
    items: IAsyncData<any[]>;
}

interface IDispatchProps {
    actions: any;
}

interface IOwnProps {
    getConfig: (actions, getColumnSearchProps) => any[];
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
            searchText: '',
            searchedColumn: '',
        };
    }

    searchInput = null;

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{padding: 8}}>
                <Input
                    ref={(node) => {
                        this.searchInput = node;
                    }}
                    placeholder={i18n.t('forms.searchPlaceholder')}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        this.handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            this.handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{width: 90}}
                    >
                        {i18n.t('actions.search')}
                    </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        {i18n.t('actions.reset')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({searchText: ''});
    };

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
                columns={getConfig(actions, this.getColumnSearchProps)}
                dataSource={data}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: 25,
                    pageSizeOptions: ['25', '50', '100', '200'],
                }}
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
        items: get(state, ownProps.storePath, []),
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
