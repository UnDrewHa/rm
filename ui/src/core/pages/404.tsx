import {Button, Result} from 'antd';
import {ResultStatusType} from 'antd/lib/result';
import {memoize} from 'lodash-es';
import React from 'react';
import {Link} from 'react-router-dom';

const text = {
    404: 'Извините, страница не найдена',
    403: 'Извините, у вас нет доступа для просмотра данной страницы',
    500: 'Внутренняя ошибка сервера',
};

export const getErrorPage = memoize(
    (homePath: string, status: ResultStatusType) => () => (
        <Result
            status={status}
            title={status}
            subTitle={text[status]}
            extra={
                homePath ? (
                    <Button type="primary">
                        <Link to={homePath}>На главную</Link>
                    </Button>
                ) : null
            }
        />
    ),
    (a, b) => a + b,
);
