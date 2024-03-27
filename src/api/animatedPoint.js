export class AnimatedPoint {
    constructor(map) {
        this.map = map;
        const mapInstance = this.map;
        const size = 70;
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4), 
                                     
            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * 0.3;
                const outerRadius = (size / 2) * 0.7 * t + radius;
                const context = this.context;

                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                context.fill();

                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;

                mapInstance.triggerRepaint();

                return true;
            }
        }
        this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 1 });
    }

    // 绘制点
    drawPoint(features) {
        if ( this.map.getSource('animatedPoint')) {
            this.map.getSource('animatedPoint').setData({
                type: "FeatureCollection",
                features: features,
            });
        } else {
            this.map.addSource('animatedPoint', {
                type: "geojson",
                data: features
            })
            this.map.addLayer({
                'id': 'animatedPoint', //图层ID
                'type': 'symbol', //图层类型
                'source': 'animatedPoint', //数据源
                layout: {
                    'icon-image': 'pulsing-dot',
                    'icon-anchor': 'center',
                },
            })
        }
    }

    // 移除点图层
    clearPoint() {
        if (this.map.getSource('animatedPoint')) {
            this.map.removeLayer('animatedPoint')
            this.map.removeSource('animatedPoint')
        }
    }
}