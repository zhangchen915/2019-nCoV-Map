import {h, app} from "hyperapp"
import {PointLayer, Popup, Scale, Scene, Zoom} from '@antv/l7';
import {GaodeMap} from '@antv/l7-maps';

import cityGeo from './cityGeo'

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
    });

fetch('http://api.tianapi.com/txapi/ncovcity/index?key=ad031245a5518179cd62d16e5c18eea0')
    .then(res => res.json())
    .then(res => {
        let data = [];

        res.newslist.forEach(e => {
            try {
                if (Array.isArray(e.cities)) e.cities.forEach(info => {
                    data.push(Object.assign(info, cityGeo[info.cityName]))
                })
            } catch (e) {
                console.error(e)
            }
        });

        const pointLayer = new PointLayer({})
            .source(data, {
                parser: {
                    type: 'json',
                    x: 'lng',
                    y: 'lat'
                }
            })
            .shape('cylinder')
            .size('confirmedCount', d => [3, 3, d / 2])
            .active(true)
            .color('#a5c2e8')
            .style({
                opacity: 1.0
            });
        const pointLayerDied = new PointLayer({})
            .source(data, {
                parser: {
                    type: 'json',
                    x: 'lng',
                    y: 'lat'
                }
            })
            .shape('cylinder')
            .size('deadCount', d => [3, 3, d / 2])
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
                .setHTML(`<div>${e.feature.cityName}</div><div>确诊：${e.feature.confirmedCount} 人</div><div>死亡：${e.feature.deadCount} 人</div><div>治愈：${e.feature.curedCount} 人</div>`);
            scene.addPopup(popup);
        });

        scene.addLayer(pointLayer);
        scene.addLayer(pointLayerDied);

        scene.addControl(new Zoom());
        scene.addControl(new Scale());
    });
