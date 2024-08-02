const express = require('express');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Prometheus metric collection
promClient.collectDefaultMetrics();

// Create a custom metric
const customMetric = new promClient.Gauge({
  name: 'custom_metric',
  help: 'A custom metric',
  labelNames: ['environment'],
});

const DCGM_FI_DEV_SM_CLOCK = new promClient.Gauge({
  name: 'DCGM_FI_DEV_SM_CLOCK', help: 'DCGM_FI_DEV_SM_CLOCK', labelNames: ['environment','gpu'],
});
const DCGM_FI_DEV_MEM_CLOCK = new promClient.Gauge({
  name: 'DCGM_FI_DEV_MEM_CLOCK', help: 'DCGM_FI_DEV_MEM_CLOCK', labelNames: ['environment','gpu'],
});
const DCGM_FI_DEV_MEMORY_TEMP = new promClient.Gauge({
  name: 'DCGM_FI_DEV_MEMORY_TEMP', help: 'DCGM_FI_DEV_MEMORY_TEMP', labelNames: ['environment','gpu'],
});
const DCGM_FI_DEV_GPU_TEMP = new promClient.Gauge({
  name: 'DCGM_FI_DEV_GPU_TEMP', help: 'DCGM_FI_DEV_GPU_TEMP', labelNames: ['environment','gpu'],
});
const DCGM_FI_DEV_POWER_USAGE = new promClient.Gauge({
  name: 'DCGM_FI_DEV_POWER_USAGE', help: 'DCGM_FI_DEV_POWER_USAGE', labelNames: ['environment','gpu'],
});
const DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION = new promClient.Counter({
  name: 'DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION', help: 'DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION', labelNames: ['environment','gpu'],
});

app.get('/update-metric', (req, res) => {
  
  backgroundTask();
  //new Promise(() => runEvery30Seconds());

  res.send('Metric updated!');
});

function backgroundTask() {
  setInterval(() => {
    try {
      DCGM_FI_DEV_SM_CLOCK.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
      DCGM_FI_DEV_SM_CLOCK.set({ environment: 'production', gpu: 1 }, Math.random() * 100);

      DCGM_FI_DEV_MEM_CLOCK.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
      DCGM_FI_DEV_MEM_CLOCK.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
      
      DCGM_FI_DEV_MEMORY_TEMP.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
      DCGM_FI_DEV_MEMORY_TEMP.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
      
      DCGM_FI_DEV_GPU_TEMP.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
      DCGM_FI_DEV_GPU_TEMP.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
      
      DCGM_FI_DEV_POWER_USAGE.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
      DCGM_FI_DEV_POWER_USAGE.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
      
      DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION.inc({ environment: 'production', gpu: 0 });
      DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION.inc({ environment: 'production', gpu: 1 });
      
      const currentTime = new Date().toLocaleTimeString();
      console.log(`Running now: ${currentTime}`);
    } catch (error) {
      console.error('Error in background task:', error.message);
    }
  }, 15000);
}

async function runEvery30Seconds() {
  while (true) {

    DCGM_FI_DEV_SM_CLOCK.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
    DCGM_FI_DEV_SM_CLOCK.set({ environment: 'production', gpu: 1 }, Math.random() * 100);

    DCGM_FI_DEV_MEM_CLOCK.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
    DCGM_FI_DEV_MEM_CLOCK.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
    
    DCGM_FI_DEV_MEMORY_TEMP.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
    DCGM_FI_DEV_MEMORY_TEMP.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
    
    DCGM_FI_DEV_GPU_TEMP.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
    DCGM_FI_DEV_GPU_TEMP.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
    
    DCGM_FI_DEV_POWER_USAGE.set({ environment: 'production', gpu: 0 }, Math.random() * 100);
    DCGM_FI_DEV_POWER_USAGE.set({ environment: 'production', gpu: 1 }, Math.random() * 100);
    
    DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION.inc({ environment: 'production', gpu: 0 });
    DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION.inc({ environment: 'production', gpu: 1 });
    
    await new Promise(resolve => setTimeout(resolve, 15000));
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Running now: ${currentTime}`);
  }
}

// Endpoint to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
