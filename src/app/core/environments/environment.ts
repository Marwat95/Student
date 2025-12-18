// Function to generate a unique device ID
function generateDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

export const environment = {
  production: false,
  // pointing to production backend to bypass Vercel file replacement issues
  apiUrl: 'https://mahd2.runasp.net/api', 
  deviceId: generateDeviceId()
};
