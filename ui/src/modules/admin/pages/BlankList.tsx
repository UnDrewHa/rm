import {SearchOutlined} from '@ant-design/icons';
import {Button, Input, Space, Table} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {commonTableProps} from 'core/consts';
import i18n from 'i18next';
import {isEmpty, isFunction} from 'lodash-es';
import React from 'react';
import Highlighter from 'react-highlight-words';

interface IState {
    selectedRowKeys: string[];
    searchText: string;
    searchedColumn: string;
}

interface IOwnProps {
    getConfig: (actions, getColumnSearchProps) => any[];
    actions: any;
    items: any[];
    isLoading: boolean;
    title?: () => any;
    renderFooter?: (actions, ids, afterDelete) => any;
}

export class BlankList extends React.Component<IOwnProps, IState> {
    constructor(props: IOwnProps) {
        super(props);

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
        const {actions, renderFooter} = this.props;

        if (isFunction(renderFooter)) {
            return renderFooter(actions, selectedRowKeys, this.handleAfterDelete);
        }

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
        const {items, getConfig, actions, isLoading, title} = this.props;

        return (
            <Table
                {...commonTableProps}
                rowSelection={{
                    onChange: this.handleTableCheck,
                }}
                columns={getConfig(actions, this.getColumnSearchProps)}
                dataSource={items}
                loading={isLoading}
                title={title}
                footer={this.renderFooter}
                className="admin-table"
            />
        );
    }
}
