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
import {Link} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';
import {IEventModel} from 'Modules/events/models';
import {calculateTimeString} from 'Modules/events/utils';

interface IOwnProps {
    events: IEventModel[];
}

export const EventsTable = ({events}: IOwnProps) => {
    return !isEmpty(events) ? (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{i18n.t('Events:common.id')}</TableCell>
                        <TableCell>{i18n.t('Events:common.time')}</TableCell>
                        <TableCell>{i18n.t('Events:common.name')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event._id}>
                            <TableCell component="th" scope="row">
                                <Link
                                    to={
                                        ROUTER.MAIN.EVENTS.DETAILS.PATH +
                                        event._id
                                    }
                                >
                                    {event._id}
                                </Link>
                            </TableCell>
                            <TableCell>{calculateTimeString(event)}</TableCell>
                            <TableCell>{event.title}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : null;
};
