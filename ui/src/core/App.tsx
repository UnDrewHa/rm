import {ConfigProvider} from 'antd';
import ru_RU from 'antd/es/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';
import React from 'react';
import {Provider} from 'react-redux';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {ModalListener} from 'Core/components/ModalListener';
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
