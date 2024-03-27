import React, {useEffect, useState } from 'react'
import createMap from './api/createMap';
import AvatarInfo from './frontend/AvatarInfo';
import ChatBox from './frontend/ChatBox';
import TipInfo from './frontend/TipInfo';
import "./App.css"

import { MapImageManager } from './api/mapImageManager'
import { NpcImgData } from './api/NpcImgData';
import * as turf from '@turf/turf'

class MyMap extends React.Component {
  constructor() {
    super();
    this.state = {
      //  把地图对象存在这里
      map: ()=>({}),
      data: null,
      showChatBox: false,
      showPointBox: false,
      timer: null,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  // 初始化
  componentDidMount() {
    let startPoint = [];
    let endPoint = []; 
    let coordinates = {}
    let urlData = ''
    // 使用封装的函数来创建地图
    const map = createMap(this.mapContainer);

      // 添加图片
      const mapImageManager = new MapImageManager(map);
      // mapImageManager.loadAndAddImages(NpcImgData);

      NpcImgData.forEach(image => {
        if (image.url.includes('T')) {
          urlData = image.url
        }
        map.on('click', `marker-${image.url}`, (e) => {
          const result = image.url.match(/\/([^/]+)\.png/)[1]
          if(result.includes("J")) {
            startPoint = [13.489336051441882, 10.70610882442054]
            endPoint = [14.3092277780572, 24.918872822222667]
            coordinates = e.point
          }else if(result.includes("D")) {
            startPoint = [15.470666233335862, 8.622568640085177]
            endPoint = [31.400595287497566, 4.928019584139264]
            coordinates = e.point
          }else {
            return
          }


          const route = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [startPoint, endPoint]
                    }
                }
            ]
          };

          const lineDistance = turf.length(route.features[0]);
          const arc = [];
          const steps = 500;
          for (let i = 0; i < lineDistance; i += lineDistance / steps) {
            const segment = turf.along(route.features[0], i);
            arc.push(segment.geometry.coordinates);
          }
          route.features[0].geometry.coordinates = arc;
          let currentIndex = 0;

          if (map.getSource('route')) {
            map.getSource('route').setData(route);
          } else {
            map.addSource('route', {
                'type': 'geojson',
                'data': route
            });
          }
        
          let running = false;
          const animate = () => {
            running = true;
            currentIndex++
            const start =
                route.features[0].geometry.coordinates[
                  currentIndex >= steps ? currentIndex - 1 : currentIndex
                ];
            const end =
                route.features[0].geometry.coordinates[
                  currentIndex >= steps ? currentIndex : currentIndex + 1
                ];
            if(!start || !end) {
                running = false;
                const point = map.project(map.getCenter());
                this.setState(prevState => ({
                  showChatBox: !prevState.showChatBox,
                  coordinates: point,  
                  clickedName: result.includes("J") ? 1 : result.includes("D")? 2 : 0,
                }));
                return;
            }

            map.flyTo(
              {
                center:  route.features[0].geometry.coordinates[currentIndex],
                zoom: 3.9,
                duration: 1000,
              },
              { moveend: "FLY_END" }
            );
      

            mapImageManager.moveImage( urlData , route.features[0].geometry.coordinates[currentIndex]);

            
            
            if (currentIndex < steps) {
              requestAnimationFrame(animate);
            }

            currentIndex = currentIndex + 1;

          }
          animate();
        })
      })
 
    

    map.on('click', 'animatedPoint', (e) => {
      const title = e.features[0].properties.title;
      const description = e.features[0].properties.description;
      this.setState(prevState => ({
        showPointBox: !prevState.showPointBox,
        title: title,  
        description: description,
      }));

      // 设置定时器，在 5 秒后隐藏 TipInfo 组件
      this.setState({
        timer: setTimeout(() => {
          this.setState({ showPointBox: false });
        }, 5000),
      });
    })

    // 把地图对象传入state
    this.setState({map: map});
  }

  componentWillUnmount() {
    // 清除定时器
    clearTimeout(this.state.timer);
  }

  // 事件
  fn(){
    //  在这里可以访问到地图对象
    console.log(this.state.map)
  }

  handleClick(name) {
    this.setState({ clickedName: name }); 
  }

  toggleChatBox = () => {
    this.setState(prevState => ({
      showChatBox: !prevState.showChatBox
    }));
  }

  render() { 
    return ( 
      <div>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css' rel='stylesheet' />
        
        <div ref={el => this.mapContainer = el}  className='mapContainer'  />

        <AvatarInfo handleClick={this.handleClick} clickedName={this.state.clickedName}/>

        {this.state.showPointBox && <TipInfo title={this.state.title} description={this.state.description}/>}  

        {this.state.showChatBox && <ChatBox clickedName={this.state.clickedName} coordinates={this.state.coordinates} toggleChatBox={this.toggleChatBox}/>}  
      </div>
    );
  }
}

export default MyMap;