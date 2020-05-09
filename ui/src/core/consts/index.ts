import {EStatusCodes} from 'core/reducer/enums';

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const END_STATUSES = [EStatusCodes.SUCCESS, EStatusCodes.FAIL];

export const commonTableProps = {
    pagination: {
        hideOnSinglePage: true,
        pageSize: 25,
        pageSizeOptions: ['25', '50', '100', '200'],
    },
    rowKey: '_id',
    bordered: true,
};

export const rowGutters = {xs: 8, sm: 16, md: 24};
