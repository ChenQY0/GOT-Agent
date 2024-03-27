import mapboxgl from 'mapbox-gl';
// import * as turf from '@turf/turf'
import { AnimatedPoint } from './animatedPoint'
import { sampleData } from './sampleData';
import { MapImageManager } from './mapImageManager'
import { NpcImgData } from './NpcImgData';
import { animatedLine } from './animatedLine';

// let counterIndex = 0;
// const geojson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       geometry: {
//         type: "LineString",
//         coordinates: [],
//       },
//     },
//   ],
// };

// function addSourcesAndLayers(map) {
//   animatedLine.length > 0 &&
//     map.flyTo(
//       {
//         center: animatedLine[0],
//         zoom: 3.9,
//         duration: 1000,
//       },
//       { moveend: "FLY_END" }
//     );

//   map.addSource("pathSourceDone", {
//     type: "geojson",
//     lineMetrics: true,
//     data: {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: animatedLine,
//           },
//         },
//       ],
//     },
//   });

//   map.addSource("pathSource", {
//     type: "geojson",
//     lineMetrics: true,
//     data: geojson,
//   });

//   //完整路径
//   map.addLayer({
//     id: "pathLayerDone",
//     type: "line",
//     source: "pathSourceDone",
//     layout: {
//       "line-join": "round",
//       "line-cap": "round",
//     },
//     paint: {
//       "line-width": 5,
//       "line-color": "#009688",
//     },
//   });

//   //动态路径
//   map.addLayer({
//     id: "pathLayer",
//     type: "line",
//     source: "pathSource",
//     layout: {
//       "line-join": "round",
//       "line-cap": "round",
//     },
//     paint: {
//       "line-width": 5,
//       "line-color": "blue",
//     },
//   });

//   //添加起点，终点
//   let startEndGeojson = {
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         properties: {
//           typeColor: 'start'
//         },
//         geometry: {
//           type: "Point",
//           coordinates: animatedLine[0],
//         },
//       },
//       {
//         type: "Feature",
//         properties: {
//           typeColor: 'end'
//         },
//         geometry: {
//           type: "Point",
//           coordinates: animatedLine[animatedLine.length - 1],
//         },
//       },
//     ],
//   }

//   map.addSource("startEndSource", {
//     type: "geojson",
//     data: startEndGeojson,
//   });

//   //起点和终点
//   map.addLayer({
//     id: "startEnd-layer",
//     type: "circle",
//     source: "startEndSource",
//     paint: {
//       "circle-radius": 10,
//       "circle-color": ["match", ["get", "typeColor"], "start", "green", "end", "red", "#cccccc"]
//     },
//   });

//   animate(map)
// }


// function animate(map) {
//   if (counterIndex > animatedLine.length) {
//     return
//   }

//   if (!animatedLine || counterIndex >= animatedLine.length) {
//     return;
//   }

//   geojson.features[0].geometry.coordinates.push(animatedLine[counterIndex]);
//   map.getSource("pathSource").setData(geojson);
//   counterIndex += 1;
  
//   requestAnimationFrame(() => animate(map));
// }

function createMap(container) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiemhhbmdqaW5neXVhbiIsImEiOiJja2R5cHhoNXYycGVtMnlteXkwZGViZDc2In0.UhckH-74AgPwMsDhPjparQ';

  const map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/huangyixiu/cjuo5ww3v1n711eqgmniofos5',
    center: [33.28, 12.72],
    zoom: 3.9,
    pitch: 20,
    hash: true,
    scrollZoom: true,
  });

  map.on('load', function () {
    // addSourcesAndLayers(map)
    
    // 闪烁点
    const animatedPoint = new AnimatedPoint(map);
    animatedPoint.drawPoint(sampleData);

    // 添加图片
    const mapImageManager = new MapImageManager(map);
    mapImageManager.loadAndAddImages(NpcImgData);

    // setTimeout(() => {
    //   mapImageManager.removeImage("https://via.placeholder.com/50");
    // }, 5000);
  })
  return map;
}





export default createMap;