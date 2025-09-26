import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, retryFirebaseOperation } from './firebase';

// Enhanced default components data
const DEFAULT_COMPONENTS = [
  {
    name: 'Arduino Uno R3',
    description: 'A microcontroller board based on the ATmega328P. Perfect for beginners and prototyping projects.',
    category: 'Microcontrollers',
    price_range: '$20-30',
    availability: 'Available',
    specifications: {
      microcontroller: 'ATmega328P',
      operating_voltage: '5V',
      input_voltage: '7-12V',
      digital_io_pins: '14',
      analog_input_pins: '6',
      flash_memory: '32KB',
      sram: '2KB',
      eeprom: '1KB'
    }
  },
  {
    name: 'ESP32 DevKit',
    description: 'Wi-Fi and Bluetooth enabled microcontroller with dual-core processor for IoT projects.',
    category: 'Microcontrollers',
    price_range: '$15-25',
    availability: 'Available',
    specifications: {
      processor: 'Dual-core Tensilica LX6',
      frequency: '240MHz',
      flash_memory: '4MB',
      sram: '520KB',
      wifi: '802.11 b/g/n',
      bluetooth: 'v4.2 BR/EDR and BLE',
      operating_voltage: '3.3V',
      gpio_pins: '30'
    }
  },
  {
    name: 'Raspberry Pi 4 Model B',
    description: 'Single-board computer with quad-core processor, perfect for advanced projects.',
    category: 'Microcontrollers',
    price_range: '$50-80',
    availability: 'Available',
    specifications: {
      processor: 'Quad-core Cortex-A72',
      frequency: '1.5GHz',
      ram: '4GB LPDDR4',
      connectivity: 'Wi-Fi, Bluetooth, Ethernet',
      usb_ports: '4x USB 3.0',
      hdmi: '2x micro HDMI',
      operating_voltage: '5V'
    }
  },
  {
    name: 'HC-SR04 Ultrasonic Sensor',
    description: 'Ultrasonic distance sensor with 2-400cm measurement range for obstacle detection.',
    category: 'Sensors',
    price_range: '$2-5',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      measuring_range: '2cm - 4m',
      measuring_angle: '15°',
      trigger_pulse: '10µs TTL pulse',
      echo_pulse: 'Proportional to distance',
      frequency: '40KHz'
    }
  },
  {
    name: 'DHT22 Temperature & Humidity Sensor',
    description: 'Digital sensor for measuring temperature and humidity with high accuracy.',
    category: 'Sensors',
    price_range: '$5-10',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.3-6V',
      temperature_range: '-40°C to 80°C',
      humidity_range: '0-100% RH',
      accuracy_temperature: '±0.5°C',
      accuracy_humidity: '±2-5% RH',
      response_time: '2s'
    }
  },
  {
    name: 'PIR Motion Sensor',
    description: 'Passive infrared sensor for detecting motion and human presence.',
    category: 'Sensors',
    price_range: '$3-8',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.3-5V',
      detection_range: '3-7m',
      detection_angle: '120°',
      delay_time: '0.3-18s',
      block_time: '0.2-25s',
      current: '<50µA'
    }
  },
  {
    name: 'SG90 Servo Motor',
    description: 'Micro servo motor with 180° rotation for precise positioning control.',
    category: 'Actuators',
    price_range: '$3-7',
    availability: 'Available',
    specifications: {
      operating_voltage: '4.8-6V',
      torque: '1.8kg/cm',
      speed: '0.1s/60°',
      rotation: '180°',
      weight: '9g',
      control_signal: 'PWM'
    }
  },
  {
    name: 'Buzzer Module',
    description: 'Active buzzer for audio alerts and sound feedback in projects.',
    category: 'Actuators',
    price_range: '$1-3',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.3-5V',
      sound_level: '85dB',
      frequency: '2.3KHz',
      current: '30mA',
      size: '12mm diameter'
    }
  },
  {
    name: '28BYJ-48 Stepper Motor',
    description: 'Unipolar stepper motor with precise step control for automation projects.',
    category: 'Actuators',
    price_range: '$8-12',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      step_angle: '5.625°',
      steps_per_revolution: '64',
      gear_ratio: '1:64',
      frequency: '100Hz max',
      torque: '>34.3mN.m'
    }
  },
  {
    name: 'LDR Light Sensor',
    description: 'Light-dependent resistor for detecting ambient light levels.',
    category: 'Sensors',
    price_range: '$1-3',
    availability: 'Available',
    specifications: {
      resistance_light: '8-20KΩ',
      resistance_dark: '1MΩ',
      peak_wavelength: '540nm',
      operating_voltage: '3.3-5V',
      response_time: '20-30ms'
    }
  },
  {
    name: '16x2 LCD Display',
    description: 'Character LCD display for showing text and basic graphics.',
    category: 'Display',
    price_range: '$5-10',
    availability: 'Available',
    specifications: {
      resolution: '16x2 characters',
      operating_voltage: '5V',
      interface: 'Parallel (4-bit/8-bit)',
      colors: 'Blue backlight',
      size: '80x36mm'
    }
  },
  {
    name: 'OLED Display 0.96"',
    description: 'Small OLED display with high contrast and low power consumption.',
    category: 'Display',
    price_range: '$8-15',
    availability: 'Available',
    specifications: {
      resolution: '128x64 pixels',
      size: '0.96 inches',
      interface: 'I2C/SPI',
      operating_voltage: '3.3-5V',
      colors: 'Monochrome (Blue/White/Yellow)',
      power_consumption: '20mA'
    }
  },
  {
    name: 'DS18B20 Temperature Sensor',
    description: 'Waterproof digital temperature sensor with high accuracy.',
    category: 'Sensors',
    price_range: '$4-8',
    availability: 'Available',
    specifications: {
      temperature_range: '-55°C to 125°C',
      accuracy: '±0.5°C',
      resolution: '9-12 bits',
      interface: 'One-Wire',
      probe_length: '1m cable',
      operating_voltage: '3-5V'
    }
  },
  {
    name: 'Relay Module 1-Channel',
    description: 'Relay module for controlling high-power devices safely.',
    category: 'Actuators',
    price_range: '$3-6',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      trigger_current: '15-20mA',
      contact_voltage: '250VAC/30VDC',
      contact_current: '10A',
      contact_type: 'NO/NC',
      response_time: '10ms'
    }
  },
  {
    name: 'ESP32-CAM',
    description: 'ESP32 with built-in camera for computer vision and streaming projects.',
    category: 'Microcontrollers',
    price_range: '$10-18',
    availability: 'Available',
    specifications: {
      processor: 'Dual-core 240MHz',
      flash_memory: '4MB',
      camera: '2MP OV2640',
      wifi: '802.11 b/g/n',
      bluetooth: 'v4.2',
      microsd: 'Up to 4GB',
      operating_voltage: '5V'
    }
  }
];

export const initializeDefaultData = async (): Promise<boolean> => {
  try {
    console.log('Checking if default components need to be initialized...');
    
    // Check if components collection has any data
    const componentsRef = collection(db, 'components');
    const snapshot = await getDocs(componentsRef);
    
    if (snapshot.empty) {
      console.log('No components found, initializing default components...');
      
      // Add all default components
      const promises = DEFAULT_COMPONENTS.map(async (component) => {
        const componentData = {
          ...component,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        };
        
        return addDoc(componentsRef, componentData);
      });
      
      await Promise.all(promises);
      console.log(`✅ Successfully added ${DEFAULT_COMPONENTS.length} default components to Firebase!`);
      return true;
    } else {
      console.log(`ℹ️ Components already exist (${snapshot.size} components found), skipping initialization.`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
    throw error;
  }
};

export default initializeDefaultData;