import {isEmpty} from 'lodash-es';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@material-ui/core';
import i18n from 'i18next';
import React from 'react';
import {ROUTER} from 'src/core/router/consts';
import {IEventModel} from 'src/modules/events/models';
import {calculateTimeString} from 'src/modules/events/utils';
import {Link} from 'react-router-dom';

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
