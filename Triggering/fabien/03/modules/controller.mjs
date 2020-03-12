const requestPermission = () => {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', (event) => {
          return event;
        });
      }
    }).catch((error) => {
      console.log('Permission denied');
    });
};

const sensorHandler = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    requestPermission();
  } else {
    window.addEventListener('deviceorientation', (event) => {
      return event;
    });
  }
};

export default sensorHandler;