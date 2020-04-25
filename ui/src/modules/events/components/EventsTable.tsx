import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import React from 'react';
import {ITableConfig} from 'Core/components/models';
import {IEventModel} from 'Modules/events/models';

interface IOwnProps {
    events: IEventModel[];
    config: ITableConfig;
}

export const EventsTable = ({events, config}: IOwnProps) => {
    return !isEmpty(events) ? (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {config.keys.map((key) => (
                            <TableCell key={key}>
                                {i18n.t('Events:table.header.' + key)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {config.getItems(events).map((event, index) => (
                        <TableRow key={index}>
                            {config.keys.map((key, index) => (
                                <TableCell key={index}>{event[key]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : null;
};
