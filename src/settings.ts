export default {
  id: 'render_message_container',
  options: {
    mode: 'auto',
    duration: 3000,
    position: 'top_right',
  },
  styles: {
    container: {
      position: 'fixed',
      width: '250px',
      height: 'auto',
      flexDirection: 'column',
      listStyle: 'none',
      padding: '5px 0',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      
    },
    message: {
      width: '250px',
      height: 'auto',
      border: '1px solid gray',
      borderRadius: '3px',
      boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
      background: 'white',
      padding: '10px',
      margin: '5px 0',
      fontSize: '13px',
      boxSizing: 'border-box',
      opacity: 0,
      transform: 'translate(0, 0)',
      transition: 'transform ease-in-out 250ms, opacity ease-in-out 250ms',
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      fontSize: '13px',
      padding: '3px 6px',
      background: 'none',
      border: '1px solid gray',
      borderRadius: '25px',
      cursor: 'pointer'
    },
    progress: {
      position: 'absolute',
      bottom: '1px',
      left: '1px',
      width: '0',
      height: '1px',
      background: 'blue',
    },
    centered: {
      width: '100%',
    },
  },
};
