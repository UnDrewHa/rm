import React from 'react';
import {Link} from 'react-router-dom';
import {ITableConfig} from 'Core/components/models';
import {ROUTER} from 'Core/router/consts';
import {IEventModel} from 'Modules/events/models';
import {calculateTimeString} from 'Modules/events/utils';

export const basicTableConfig: ITableConfig = {
    keys: ['id', 'time', 'name'],
    getItems: function (items: IEventModel[]) {
        return items.map((item) => ({
            id: (
                <Link to={ROUTER.MAIN.EVENTS.DETAILS.PATH + item._id}>
                    {item._id}
                </Link>
            ),
            time: calculateTimeString(item),
            name: item.title,
        }));
    },
};
