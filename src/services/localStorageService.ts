import AsyncStorage from '@react-native-async-storage/async-storage';
import { Component, Project, User, ComponentCreate } from './firebaseService';

// Local storage keys
const COMPONENTS_KEY = 'atal_components';
const PROJECTS_KEY = 'atal_projects';
const USERS_KEY = 'atal_users';

// Default components data for offline mode
const DEFAULT_COMPONENTS: Component[] = [
  {
    id: 'arduino-uno',
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
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'esp32',
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
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'hc-sr04',
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
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dht22',
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
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Local Storage Service for offline functionality
class LocalStorageService {
  // Components
  async getComponents(category?: string, search?: string): Promise<Component[]> {
    try {
      let components = await this.getStoredComponents();
      
      // Filter by category
      if (category && category.toLowerCase() !== 'all') {
        components = components.filter(comp => comp.category === category);
      }
      
      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        components = components.filter(
          (component) =>
            component.name.toLowerCase().includes(searchLower) ||
            component.description.toLowerCase().includes(searchLower)
        );
      }
      
      return components;
    } catch (error) {
      console.error('Error getting components from local storage:', error);
      return DEFAULT_COMPONENTS;
    }
  }

  async createComponent(component: ComponentCreate): Promise<Component> {
    try {
      const components = await this.getStoredComponents();
      const newComponent: Component = {
        id: Date.now().toString(),
        ...component,
        availability: 'Available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      components.push(newComponent);
      await AsyncStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
      
      return newComponent;
    } catch (error) {
      console.error('Error creating component in local storage:', error);
      throw error;
    }
  }

  async getComponent(id: string): Promise<Component> {
    const components = await this.getStoredComponents();
    const component = components.find(comp => comp.id === id);
    
    if (!component) {
      throw new Error('Component not found');
    }
    
    return component;
  }

  async updateComponent(id: string, component: ComponentCreate): Promise<Component> {
    try {
      const components = await this.getStoredComponents();
      const index = components.findIndex(comp => comp.id === id);
      
      if (index === -1) {
        throw new Error('Component not found');
      }
      
      const updatedComponent = {
        ...components[index],
        ...component,
        updated_at: new Date().toISOString()
      };
      
      components[index] = updatedComponent;
      await AsyncStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
      
      return updatedComponent;
    } catch (error) {
      console.error('Error updating component in local storage:', error);
      throw error;
    }
  }

  async deleteComponent(id: string): Promise<void> {
    try {
      const components = await this.getStoredComponents();
      const filteredComponents = components.filter(comp => comp.id !== id);
      await AsyncStorage.setItem(COMPONENTS_KEY, JSON.stringify(filteredComponents));
    } catch (error) {
      console.error('Error deleting component from local storage:', error);
      throw error;
    }
  }

  // Projects
  async getProjects(userId?: string): Promise<Project[]> {
    try {
      const stored = await AsyncStorage.getItem(PROJECTS_KEY);
      let projects: Project[] = stored ? JSON.parse(stored) : [];
      
      if (userId) {
        projects = projects.filter(project => project.user_id === userId);
      }
      
      return projects.sort((a, b) => new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime());
    } catch (error) {
      console.error('Error getting projects from local storage:', error);
      return [];
    }
  }

  async saveProject(project: Project): Promise<Project> {
    try {
      const projects = await this.getProjects();
      const newProject: Project = {
        id: Date.now().toString(),
        ...project,
        dateSaved: new Date().toISOString()
      };
      
      projects.push(newProject);
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      
      return newProject;
    } catch (error) {
      console.error('Error saving project to local storage:', error);
      throw error;
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    try {
      const projects = await this.getProjects();
      const index = projects.findIndex(proj => proj.id === id);
      
      if (index === -1) {
        throw new Error('Project not found');
      }
      
      const updatedProject = { ...projects[index], ...project };
      projects[index] = updatedProject;
      
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project in local storage:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(proj => proj.id !== id);
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));
    } catch (error) {
      console.error('Error deleting project from local storage:', error);
      throw error;
    }
  }

  // Helper methods
  private async getStoredComponents(): Promise<Component[]> {
    try {
      const stored = await AsyncStorage.getItem(COMPONENTS_KEY);
      let components: Component[] = stored ? JSON.parse(stored) : [];
      
      // Initialize with default components if empty
      if (components.length === 0) {
        components = [...DEFAULT_COMPONENTS];
        await AsyncStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
      }
      
      return components;
    } catch (error) {
      console.error('Error getting stored components:', error);
      return DEFAULT_COMPONENTS;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([COMPONENTS_KEY, PROJECTS_KEY, USERS_KEY]);
    } catch (error) {
      console.error('Error clearing local storage:', error);
      throw error;
    }
  }

  async initializeDefaultData(): Promise<boolean> {
    try {
      const components = await this.getStoredComponents();
      return components.length > 0;
    } catch (error) {
      console.error('Error initializing default data:', error);
      return false;
    }
  }
}

export const localStorageService = new LocalStorageService();
export default localStorageService;