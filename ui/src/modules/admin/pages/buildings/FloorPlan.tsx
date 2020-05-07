import {UploadOutlined} from '@ant-design/icons';
import {Button, Upload} from 'antd';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import {RoomModal} from 'modules/admin/pages/buildings/RoomModal';
import {BuildingsActions} from 'modules/buildings/actions/BuildingsActions';
import {IFloorData} from 'modules/buildings/models';
import {RoomDetailsModal} from 'modules/rooms/components/RoomDetailsModal';
import React from 'react';
import './floorMap.scss';
require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet');
require('leaflet-draw');

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
let drawControl = null;

interface IOwnProps {
    actions: BuildingsActions;
    data: IFloorData;
    buildingId: string;
    beforeUpload: (file: any) => boolean;
}

interface IState {
    roomSelectModalVisible: boolean;
    roomDetailsModalVisible: boolean;
    layerRoomMap: any;
    selectedLayer: any;
    selectedRoomId: string;
}

export class FloorPlan extends React.Component<IOwnProps, IState> {
    state = {
        roomSelectModalVisible: false,
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
        drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false,
                },
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                },
                polyline: false,
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false,
            },
            remove: {
                removeAllLayers: false,
            },
        });

        L.EditToolbar.Delete.include({
            removeAllLayers: false,
        });

        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, (event) => {
            drawnItems.addLayer(event.layer);
            this.handleCreated(event);
        });

        map.on(L.Draw.Event.DELETED, (event) => {
            drawnItems.removeLayer(event.layer);
            this.handleDeleted(event);
        });

        map.setView(xy(width / 2, height / 2), 0);

        this.renderPolygonsFromDB();
    }

    handleCreated = (event) => {
        const {layer} = event;

        layer.bindPopup(this.renderPopupContent(layer));

        layer.on('popupopen', this.handlePopupOpen);
        layer.on('popupclose', this.handlePopupClose);
    };

    handleDeleted = (event) => {
        const deletedId = Object.keys(event.layers._layers)[0];

        this.setState((prev) => {
            const newMap = {...prev.layerRoomMap};
            delete newMap[deletedId];

            return {
                layerRoomMap: newMap,
            };
        });
    };

    handlePopupOpen = (event) => {
        this.setState({
            selectedLayer: event.popup._source,
        });

        const popupEl = event.popup
            .setContent(this.renderPopupContent(event.popup._source))
            .getElement();

        const selectBtn = popupEl.querySelector('.js-select-room');
        const showBtn = popupEl.querySelector('.js-show-room');

        selectBtn?.addEventListener('click', this.handleShowSelectRoomModal);
        showBtn?.addEventListener('click', this.handleShowRoomDetailsModal);
    };

    handlePopupClose = (event) => {
        this.setState({
            selectedLayer: null,
        });

        const popupEl = event.popup
            .setContent(this.renderPopupContent(event.popup._source))
            .getElement();
        const selectBtn = popupEl.querySelector('.js-select-room');
        const showBtn = popupEl.querySelector('.js-show-room');

        selectBtn?.removeEventListener('click', this.handleShowSelectRoomModal);
        showBtn?.removeEventListener('click', this.handleShowRoomDetailsModal);
    };

    handleShowSelectRoomModal = () => {
        this.setState({
            roomSelectModalVisible: true,
        });
    };

    handleShowRoomDetailsModal = () => {
        this.setState((prev) => ({
            roomDetailsModalVisible: true,
            selectedRoomId: prev.layerRoomMap[prev.selectedLayer._leaflet_id],
        }));
    };

    handleRoomSelect = (roomId) => {
        this.setState(
            (prev) => ({
                layerRoomMap: {
                    ...prev.layerRoomMap,
                    [prev.selectedLayer._leaflet_id]: roomId,
                },
                roomSelectModalVisible: false,
            }),
            () => {
                const {selectedLayer} = this.state;
                selectedLayer
                    .bindTooltip('Переговорка привязана', {
                        opacity: 0.75,
                        direction: 'bottom',
                    })
                    .openTooltip()
                    .closePopup();
            },
        );
    };

    handleCancel = (e) => {
        this.setState(
            {
                roomSelectModalVisible: false,
            },
            () => {
                this.state.selectedLayer.closePopup();
            },
        );
    };

    handleSave = () => {
        const {layerRoomMap} = this.state;
        const {actions, buildingId, data} = this.props;

        let roomsData = [];

        Object.keys(layerRoomMap).forEach((key) => {
            roomsData.push({
                room: layerRoomMap[key],
                coords: drawnItems._layers[key]._latlngs[0],
            });
        });

        actions.updateFloorData({
            building: buildingId,
            _id: data._id,
            roomsData,
        });
    };

    handleHideRoomModal = () => {
        this.setState(
            {
                roomDetailsModalVisible: false,
                selectedRoomId: null,
            },
            () => {
                this.state.selectedLayer.closePopup();
            },
        );
    };

    renderPopupContent = (layer) => {
        const {layerRoomMap} = this.state;

        if (layerRoomMap[layer._leaflet_id]) {
            return `
                <div>
                    <h2>Действия:</h2>
                    <button class="js-select-room">Выбрать переговорку</button>
                    <br/><br/>
                    <button class="js-show-room">Показать выбранную переговорку</button>
                </div>
            `;
        }

        return `
                <div>
                    <h4>Действия:</h4>
                    <button class="js-select-room">Выбрать переговорку</button>
                </div>
            `;
    };

    renderPolygonsFromDB = () => {
        const {
            data: {roomsData},
        } = this.props;

        if (Array.isArray(roomsData) && !isEmpty(roomsData)) {
            roomsData.forEach((item) => {
                const poly = L.polygon(item.coords);

                poly.setStyle({
                    color: '#1890ff',
                    fillColor: '#1890ff',
                });

                poly.bindTooltip('Переговорка привязана', {
                    opacity: 0.75,
                    direction: 'bottom',
                }).openTooltip();

                drawnItems.addLayer(poly);

                this.setState(
                    (prev) => ({
                        layerRoomMap: {
                            ...prev.layerRoomMap,
                            [poly._leaflet_id]: item.room,
                        },
                    }),
                    () => {
                        poly.bindPopup(this.renderPopupContent(poly));

                        poly.on('popupopen', this.handlePopupOpen);
                        poly.on('popupclose', this.handlePopupClose);
                    },
                );
            });
        }
    };

    render() {
        const {
            roomSelectModalVisible,
            roomDetailsModalVisible,
            selectedRoomId,
        } = this.state;
        const {beforeUpload, buildingId, data} = this.props;

        return (
            <React.Fragment>
                <div id="floor-map" />
                <Upload
                    showUploadList={false}
                    className="floor-plan-upload"
                    beforeUpload={beforeUpload}
                >
                    <Button>
                        <UploadOutlined />{' '}
                        {i18n.t('Buildings:floorData.button')}
                    </Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleSave}
                    className="save-floor-plan"
                >
                    {i18n.t('actions.save')}
                </Button>
                <RoomModal
                    onCancel={this.handleCancel}
                    onRoomSelect={this.handleRoomSelect}
                    visible={roomSelectModalVisible}
                    building={buildingId}
                    floor={data.floorNumber}
                />
                {selectedRoomId && (
                    <RoomDetailsModal
                        visible={roomDetailsModalVisible}
                        onCancel={this.handleHideRoomModal}
                        roomId={selectedRoomId}
                    />
                )}
            </React.Fragment>
        );
    }
}
