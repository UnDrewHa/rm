export default {
    Buildings: {
        filter: {
            selectFloor: 'Выберите этаж',
        },
        floor: '{{n}} этаж',
        edit: {
            namePlaceholder: 'Название здания',
            addressPlaceholder: 'Адрес',
            floorsPlaceholder: 'Количество этажей',
            createSuccess: 'Здание создано',
            createError: 'Ошибка при создании здания',
            updateSuccess: 'Данные здания успешно обновлены',
            updateError: 'Ошибка при обновлении данных здания',
        },
        delete: {
            deleteSuccess: 'Выбранные записи успешно удалены',
            deleteError: 'Ошибка удаления выбранных записей',
        },
        floorData: {
            noData: {
                title: 'Нет данных',
                subtitle:
                    'По выбранному этажу отсутствуют какие-либо данные. Загрузите план этажа, чтобы начать добавлять/редактировать переговорные комнаты',
            },
            button: 'Загрузить план этажа',
        },
        upload: {
            success: 'План этажа успешно загружен',
            error: 'Ошибка при загрузке плана этажа',
        },
        updateFloor: {
            success: 'План этажа успешно обновлен',
            error: 'Ошибка при обновлении плана этажа',
        },
    },
};
