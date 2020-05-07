import {Button} from 'antd';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {find, isEmpty, memoize} from 'lodash-es';
import {IFloorData} from 'modules/buildings/models';
import {RoomDetailsModal} from 'modules/rooms/components/RoomDetailsModal';
import {IRoomModel} from 'modules/rooms/models';
import React from 'react';
import {Link} from 'react-router-dom';
import '../../admin/pages/buildings/floorMap.scss';
require('leaflet/dist/leaflet.css');
require('leaflet');

declare let L: any;

const yx = L.latLng;
const xy = function (x, y) {
    if (L.Util.isArray(x)) {
        // When doing xy([x, y]);
        return yx(x[1], x[0]);
    }
    return yx(y, x); // When doing xy(x, y);
};

let map = null;
let drawnItems = null;

interface IOwnProps {
    enabledRooms: IRoomModel[];
    data: IFloorData;
    buildingId: string;
    formValues: any;
}

interface IState {
    roomDetailsModalVisible: boolean;
    layerRoomMap: any;
    selectedLayer: any;
    selectedRoomId: string;
}

export class FloorPlanView extends React.Component<IOwnProps, IState> {
    state = {
        selectedLayer: null,
        layerRoomMap: {},
        roomDetailsModalVisible: false,
        selectedRoomId: null,
    };

    componentDidMount() {
        const {
            data: {floorPlan, width, height},
        } = this.props;
        const bounds = [
            [0, 0],
            [height, width],
        ];

        map = L.map('floor-map', {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 1,
        });

        L.imageOverlay(floorPlan, bounds).addTo(map);

        drawnItems = L.featureGroup().addTo(map);

        map.setView(xy(width / 2, height / 2), 0);

        this.renderPolygonsFromDB();
    }

    handleHideRoomModal = () => {
        this.setState({
            roomDetailsModalVisible: false,
            selectedRoomId: null,
        });
    };

    createClickHandler = memoize((roomId) => () => {
        this.setState({
            roomDetailsModalVisible: true,
            selectedRoomId: roomId,
        });
    });

    renderPolygonsFromDB = () => {
        const {
            data: {roomsData},
            enabledRooms,
        } = this.props;

        if (Array.isArray(roomsData) && !isEmpty(roomsData)) {
            roomsData.forEach((item) => {
                const enabled = find(
                    enabledRooms,
                    (room) => room._id === item.room,
                );
                const enabledColor = '#52c41a';
                const disabledColor = '#ff4d4f';
                const poly = L.polygon(item.coords);

                poly.setStyle({
                    color: enabled ? enabledColor : disabledColor,
                    fillColor: enabled ? enabledColor : disabledColor,
                });

                drawnItems.addLayer(poly);
                poly.on('click', this.createClickHandler(item.room));
            });
        }
    };

    render() {
        const {roomDetailsModalVisible, selectedRoomId} = this.state;
        const {formValues} = this.props;

        return (
            <React.Fragment>
                <div id="floor-map" />
                {selectedRoomId && (
                    <RoomDetailsModal
                        visible={roomDetailsModalVisible}
                        onCancel={this.handleHideRoomModal}
                        roomId={selectedRoomId}
                        footer={[
                            <Button key="schedule">
                                <Link
                                    to={
                                        ROUTER.MAIN.ROOMS.DETAILS.PATH +
                                        selectedRoomId
                                    }
                                >
                                    {i18n.t('Rooms:common.schedule')}
                                </Link>
                            </Button>,
                            <Button key="reserve" type="primary">
                                <Link
                                    to={{
                                        pathname:
                                            ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
                                        state: {
                                            date: formValues?.date || null,
                                            from: formValues?.from || null,
                                            to: formValues?.to || null,
                                        },
                                        search: `?room=${selectedRoomId}`,
                                    }}
                                >
                                    {i18n.t('Rooms:common.reserve')}
                                </Link>
                            </Button>,
                        ]}
                    />
                )}
            </React.Fragment>
        );
    }
}
