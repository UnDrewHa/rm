export default {
    Events: {
        common: {
            id: 'Идентификатор',
            time: 'Время проведения',
            name: 'Название',
        },
        status: {
            APPROVED: 'Согласовано',
            REFUSED: 'Отказано',
            NEED_APPROVE: 'На подтверждении',
        },
        userEvents: {
            title: 'Мои бронирования',
            ACTIVE: 'Активные',
            COMPLETED: 'Завершенные',
            CANCELED: 'Отмененные',
        },
        create: {
            success: 'Бронирование успешно завершено',
            title: 'Бронирование переговорной комнаты',
        },
        edit: {
            title: 'Редактирование бронирования переговорной комнаты',
            members: {
                title: 'Участники встречи',
                add: 'Добавить участника встречи',
                placeholder: 'Эл. почта',
                error: 'Укажите эл. почту или удалите данное поле ввода',
            },
            createSuccess: 'Бронирование успешно завершено',
            createError:
                'Ошибка бронирования переговорной комнаты. Попробуйте снова',
            updateSuccess: 'Бронирование успешно изменено',
            updateError: 'Ошибка изменения бронирования. Попробуйте снова',
        },
        table: {
            header: {
                id: 'Идентификатор',
                time: 'Время',
                title: 'Название',
                date: 'Дата',
                actions: 'Действия',
                owner: 'Владелец',
                description: 'Описание',
                members: 'Участники встречи',
                approveStatus: 'Статус согласования',
                room: 'Переговорная',
                dateTime: 'Дата/время',
            },
        },
        ownerModal: {
            title: 'Данные владельца события',
            name: 'ФИО: {{name}}',
            email: 'Эл. почта: {{email}}',
            phone: 'Телефон: {{phone}}',
        },
        cancel: {
            title: 'Вы действительно хотите отменить данную встречу?',
            titleN: 'Вы действительно хотите отменить выбранные встречи?',
            cancelSuccess: 'Выбранные встречи успешно отменены',
            cancelError:
                'Ошибка при попытке отменить выбранные встречи. Попробуйте снова',
        },
        details: {
            title: 'Событие - "{{title}}"',
            id: 'Идентификатор',
            date: 'Дата и время проведения',
            owner: 'Владелец',
            description: 'Описание',
            members: 'Участники встречи',
            room: 'Место проведения',
            approveStatus: 'Статус согласования',
        },
        approve: {
            title: 'Согласовать',
            success: 'Заявка на бронирование успешно согласована',
            error: 'Ошибка согласования заявки на бронирование',
        },
        refuse: {
            title: 'Отказать',
            success: 'Заявка на бронирование отклонена',
            error: 'Ошибка отклонения заявки на бронирование',
        },
    },
};
