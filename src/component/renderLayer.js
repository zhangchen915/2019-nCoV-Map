import {PointLayer, Popup, Scale, Scene, Zoom} from '@antv/l7';
import {GaodeMap} from '@antv/l7-maps';

import cityGeo from '../data/cityGeo'
import countryGeo from '../data/country'

export const renderLayer = () => {
    const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
            pitch: 48.62562,
            style: 'light',
            center: [104.026043, 31.847],
            rotation: -0.76,
            rotateEnable: false,
            maxZoom: 6,
            minZoom: 4,
            zoom: 4.48
        })
    });

    fetch('https://service-n9zsbooc-1252957949.gz.apigw.tencentcs.com/release/qq')
        .then(res => res.json())
        .then(res => {
            let data = [];
            let cacheCity = {};

            res.data.wuwei_ww_area_counts.forEach(e => {
                const {country, area, city} = e;

                try {
                    if (cityGeo[city] || cityGeo[area]) {
                        if (cityGeo[city] || !city) {
                            data.push(Object.assign(e, cityGeo[city || area]))
                        } else if (cityGeo[area]) {
                            if (cacheCity[area]) {
                                const {confirm, dead, heal} = e;
                                cacheCity[area].confirm += confirm;
                                cacheCity[area].dead += dead;
                                cacheCity[area].heal += heal
                            } else {
                                e.city = '';
                                cacheCity[area] = Object.assign(e, cityGeo[area])
                            }
                        }
                    } else if (countryGeo[country]) {
                        const [lng, lat] = countryGeo[country];
                        data.push(Object.assign(e, {lng, lat}))
                    }
                } catch (e) {
                    console.error(e)
                }
            });

            data = data.concat(Object.values(cacheCity))

            const pointLayer = new PointLayer({})
                .source(data, {
                    parser: {
                        type: 'json',
                        x: 'lng',
                        y: 'lat'
                    }
                })
                .shape('cylinder')
                .size('confirm', d => [2, 2, d / 2])
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
                .size('dead', d => [2, 2, d / 2])
                .active(true)
                .color('red')
                .style({
                    opacity: 1.0
                });
            pointLayer.on('mousemove', e => {
                const {country, area, city, confirm, dead, heal} = e.feature;
                const popup = new Popup({
                    offsets: [0, 0],
                    closeButton: false
                })
                    .setLnglat(e.lngLat)
                    .setHTML(`<div>${city || area || country}</div><div>确诊：${confirm} 人</div><div>死亡：${dead} 人</div><div>治愈：${heal} 人</div>`);
                scene.addPopup(popup);
            });

            scene.addLayer(pointLayer);
            scene.addLayer(pointLayerDied);

            scene.addControl(new Zoom());
            scene.addControl(new Scale());
        })
};
