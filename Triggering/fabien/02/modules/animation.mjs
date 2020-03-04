const requestPermission = () => {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', () => {
          animate();
        });
      }
    }).catch((error) => {
      console.log('Permission denied');
    });
};

const animate = () => {
  console.log('yes');
}

const sensorHandler = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    requestPermission();
  } else {
    window.addEventListener('deviceorientation', () => {
      animate();
    });
  }
}

export default sensorHandler;