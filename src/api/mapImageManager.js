export class MapImageManager {
    constructor(map) {
        this.map = map;
        this.markers = {}; 
    }
    loadAndAddImages(images) {
        const map = this.map;
        const markers = this.markers;

        images.forEach(image => {
            map.loadImage(image.url, function(error, img) {
                if (error) throw error;

                map.addImage(image.url, img);

                const markerId = `marker-${image.url}`;

                map.addLayer({
                    'id': markerId,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': image.coordinates
                                }
                            }]
                        }
                    },
                    'layout': {
                        'icon-image': image.url,
                        'icon-size': 0.45,
                        "icon-rotate": ["get", "bearing"],
                        "icon-rotation-alignment": "map",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                    }
                });
                markers[markerId] = true;
            });
        });
    }

    removeImage(imageUrl) {
        const map = this.map;
        const markers = this.markers;

        const markerId = `marker-${imageUrl}`;

        if (markers[markerId]) {
            map.removeLayer(markerId);
            delete markers[markerId]; // 从存储的标记图层记录中移除
        }
    }

    moveImage(imageUrl, newCoordinates) {
        const map = this.map;
        const markerId = `marker-${imageUrl}`;
    
        // 获取图片的数据源
        const source = map.getSource(markerId);
    
        // 更新图片的坐标
        source.setData({
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': newCoordinates
            }
        });
    }
}