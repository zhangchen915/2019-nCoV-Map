import { h, app } from "hyperapp"
import {PointLayer, Popup, Scale, Scene, Zoom} from '@antv/l7';
import {GaodeMap} from '@antv/l7-maps';

const scene = new Scene({
    id: 'map',
    map: new GaodeMap({
        pitch: 48.62562,
        style: 'light',
        center: [104.026043, 31.847],
        rotation: -0.76,
        rotateEnable: false,
        maxZoom: 6,
        zoom: 4.48
    })
});

fetch('https://arena.360.cn/api/service/data/ncov-live-3')
    .then(res => res.json())
    .then(data => {
        const detail = data.data.detail;
        app({
            init: data.data.total,
            view: state =>
                h("main", {}, [
                    h("h1", {}, `确诊${state.diagnosed}`),
                    h("h1", {}, `疑似${state.suspected}`),
                    h("h1", {}, `治愈${state.cured}`),
                    h("h1", {}, `死亡💀${state.died}`),
                ]),
            node: document.getElementById("app")
        });

        detail.forEach(e => e.pos = e.pos.map(p => +p));

        const pointLayer = new PointLayer({})
            .source(detail, {
                parser: {
                    type: 'json',
                    coordinates: 'pos',
                }
            })
            .shape('cylinder')
            .size('diagnosed', d => [2, 2, d / 10])
            .active(true)
            .color('#a5c2e8')
            .style({
                opacity: 1.0
            });
        const pointLayerDied = new PointLayer({})
            .source(detail, {
                parser: {
                    type: 'json',
                    coordinates: 'pos',
                }
            })
            .shape('cylinder')
            .size('died', d => [2, 2, d / 10])
            .active(true)
            .color('red')
            .style({
                opacity: 1.0
            });
        pointLayer.on('mousemove', e => {
            const popup = new Popup({
                offsets: [0, 0],
                closeButton: false
            })
                .setLnglat(e.lngLat)
                .setHTML(`<div>${e.feature.city}</div><div>确诊：${e.feature.diagnosed} 人</div><div>死亡：${e.feature.died} 人</div><div>治愈：${e.feature.cured} 人</div>`);
            scene.addPopup(popup);
        });

        scene.addLayer(pointLayer);
        scene.addLayer(pointLayerDied);

        scene.addControl(new Zoom());
        scene.addControl(new Scale());
    });
