const G2 = require("@antv/g2/lib/core");
require("@antv/g2/lib/geom/line");
require("@antv/g2/lib/geom/point");

export const renderLiner = () => {
    const chart = new G2.Chart({
        container: 'c1',
        width: 600,
        height: 300,
    });

    fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/cases_time/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Report_Date%20asc&outSR=102100&resultOffset=0&resultRecordCount=2000&cacheHint=true')
        .then(res => res.json())
        .then(res => {
            let data = [];
            res.features.map(e => {
                let {Total_Confirmed, Mainland_China, Other_Locations, Report_Date} = e.attributes;
                Report_Date = new Date(Report_Date).toLocaleDateString();
                if(!Total_Confirmed) return;
                data.push({type: '总数', value: Total_Confirmed, date: Report_Date});
                data.push({type: '国内', value: Mainland_China, date: Report_Date});
                data.push({type: '国外', value: Other_Locations, date: Report_Date});
            });

            chart.source(data, {
                data: {
                    type: 'linear'
                }
            });

            chart.tooltip({
                crosshairs: true
            });

            chart.axis('Mainland_China', {
                position: 'left',
            });
            chart.axis('Other_Locations', {
                position: 'left',
            });

            chart.line().position('date*value').shape('smooth').color('type');
            chart.line().position('date*value').shape('smooth').color('type');
            chart.line().position('date*value').shape('smooth').color('type');

            chart.point().position('date*value');
            chart.point().position('date*value');
            chart.point().position('date*value');

            chart.render();
        })
};
