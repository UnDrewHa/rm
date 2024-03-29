import {ConfigProvider} from 'antd';
import 'antd/dist/antd.css';
import ru_RU from 'antd/es/locale/ru_RU';
import {LoadingOverlay} from 'core/components/LoadingOverlay';
import {ModalListener} from 'core/components/ModalListener';
import moment from 'moment';
import 'moment/locale/ru';
import React from 'react';
import {Provider} from 'react-redux';
import {RouterData} from './router';
import {store} from './store';
import {i18nInit} from './translation';

moment.locale('ru-ru');

class App extends React.Component<{}, {isLoading: boolean}> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };

        i18nInit().then(() => {
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingOverlay />;
        }

        return (
            <Provider store={store}>
                <ModalListener />
                <ConfigProvider locale={ru_RU}>
                    <RouterData />
                </ConfigProvider>
            </Provider>
        );
    }
}

export default App;
