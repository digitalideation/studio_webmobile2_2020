const requestPermission = () => {
  DeviceMotionEvent.requestPermission()
    .then((permissionState) => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', (event) => {
          animate(event);
        });
      }
    }).catch((error) => {
      console.log('Permission denied');
    });
};

const animate = (event) => {
  const el = document.getElementById('background');
  el.style.backgroundColor = `rgb(${event.alpha}, ${event.beta}, ${event.gamma})`;
};

const sensorHandler = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    requestPermission();
  } else {
    window.addEventListener('deviceorientation', (event) => {
      animate(event);
    });
  }
};

export default sensorHandler;