/* eslint-disable react/prop-types */
import React,{useState, useRef} from 'react';
import D from "../assets/D.png"
import J from "../assets/J.png"
import T from "../assets/T.png"

function AvatarInfo(props) {
  const [isPlaying, setIsPlaying] = useState(true); // 添加一个状态变量来控制音乐的播放和暂停
  const audioRef = useRef();

  const handleClick = (id) => {
    props.handleClick(id);
 };

 const handleMusic = () => { // 当点击按钮时，改变音乐的播放和暂停状态
  setIsPlaying(!isPlaying);
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }
};
  return (
    <div className='map-overlay-container'>
      <div className='map-avater'>
        <img className='map-avatar-right' src={T} alt='avater' />
        <span className='map-text-right'>Tyrion Lannister</span>
      </div>

      <div className='map-avater-info-box'>
      <audio src="https://music.163.com/song/media/outer/url?id=32526653.mp3" autoPlay loop ref={audioRef} />
        <div className="title" >
          NPC
          <span onClick={handleMusic}>{isPlaying ? 'Pause' : 'Play'}</span> 
        </div>
        <div className="npc" onClick={() => handleClick(1)}>
          <img src={J} alt='avater' />
          <span style={{ color: props.clickedName === 1 ? '#FFDB9E' : '#D3DCE5' }}>Jon Snow</span>
        </div>
        <div className="npc"  onClick={() => handleClick(2)}>
          <img  src={D} alt='avater' />
          <span style={{ color: props.clickedName === 2 ? '#FFDB9E' : '#D3DCE5' }}>Daenerys Targaryen</span>
        </div>
      </div>

    </div>
  );
}

export default AvatarInfo;