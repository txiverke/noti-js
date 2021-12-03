export const STYLES = {
  body: `.notijs_container{position:fixed;width:250px;height: auto;flex-direction:column;list-style:none;padding:5px 0;margin:0;display:flex;align-items:center;}.notijs_message{width:250px;height:auto;border:1px solid rgb(0 0 0 / 0.2);border-radius:3px;box-shadow:0 3px 10px rgb(0 0 0 / 0.2);background:white;padding:10px;margin:5px 0;font-size:13px;box-sizing:border-box;opacity:0;transform:translate(0,0);transition:transform ease-in-out 250ms, opacity ease-in-out 250ms;display:flex;align-items:center;}.notijs_txt{flex:1;margin:0 6px 0 0;}.notijs_icon{margin:0 8px 0 0;width:18px;height:auto;}`,
  progress: `.notijs_progress{position:absolute;bottom:1px;left:1px;width:0;height:1px;background:rgb(0 0 0 / 0.2)}`,
  btn: `.notijs_btn{background:transparent;border:none;cursor:pointer;padding:0 0 0 6px;display:flex;justify-content:center;align-items:center;}`,
  animation: `.notijs_rotate{animation: notijs_rotation .75s linear infinite;}@keyframes notijs_rotation {from{transform: rotate(0deg);}to{transform: rotate(359deg);}`,
};

export const OPTIONS = {
  id: 'render_message_container',
  duration: 3,
  position: 'top_right',
};

export const POSITIONS = ['top', 'top_left', 'top_right', 'bottom', 'bottom_left', 'bottom_right'];

export const ANIMATION_SIZE = 10;
