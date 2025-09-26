import { firebaseService, Component, Project, ComponentCreate, GenerateProjectRequest, ProjectIdea } from './firebaseService';
import { localStorageService } from './localStorageService';
import { checkFirebaseConnection } from './firebase';

// Hybrid service that tries Firebase first, then falls back to local storage
class HybridService {
  private isOnline: boolean = true;
  private lastConnectionCheck: number = 0;
  private readonly CONNECTION_CHECK_INTERVAL = 60000; // 1 minute

  private async checkConnection(): Promise<boolean> {
    const now = Date.now();
    
    // Only check connection every minute to avoid constant checks
    if (now - this.lastConnectionCheck < this.CONNECTION_CHECK_INTERVAL) {
      return this.isOnline;
    }
    
    this.lastConnectionCheck = now;
    
    try {
      this.isOnline = await checkFirebaseConnection();
      console.log(`🔥 Firebase connection status: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      return this.isOnline;
    } catch (error) {
      console.warn('Firebase connection check failed:', error);
      this.isOnline = false;
      return false;
    }
  }

  // Components
  async getComponents(category?: string, search?: string): Promise<Component[]> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        const components = await firebaseService.getComponents(category, search);
        console.log(`📦 Loaded ${components.length} components from Firebase`);
        return components;
      } catch (error) {
        console.warn('Firebase getComponents failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    console.log('📱 Using local storage for components');
    return localStorageService.getComponents(category, search);
  }

  async createComponent(component: ComponentCreate): Promise<Component> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        const result = await firebaseService.createComponent(component);
        console.log('✅ Component created in Firebase');
        return result;
      } catch (error) {
        console.warn('Firebase createComponent failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    console.log('📱 Creating component in local storage');
    return localStorageService.createComponent(component);
  }

  async getComponent(id: string): Promise<Component> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.getComponent(id);
      } catch (error) {
        console.warn('Firebase getComponent failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.getComponent(id);
  }

  async updateComponent(id: string, component: ComponentCreate): Promise<Component> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.updateComponent(id, component);
      } catch (error) {
        console.warn('Firebase updateComponent failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.updateComponent(id, component);
  }

  async deleteComponent(id: string): Promise<void> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.deleteComponent(id);
      } catch (error) {
        console.warn('Firebase deleteComponent failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.deleteComponent(id);
  }

  // Projects
  async generateProjectIdeas(request: GenerateProjectRequest): Promise<ProjectIdea[]> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.generateProjectIdeas(request);
      } catch (error) {
        console.warn('Firebase generateProjectIdeas failed, using local fallback:', error);
        this.isOnline = false;
      }
    }
    
    // Local fallback for project generation
    return this.generateLocalProjectIdeas(request);
  }

  async getProjects(userId?: string): Promise<Project[]> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.getProjects(userId);
      } catch (error) {
        console.warn('Firebase getProjects failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.getProjects(userId);
  }

  async saveProject(project: Project): Promise<Project> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.saveProject(project);
      } catch (error) {
        console.warn('Firebase saveProject failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.saveProject(project);
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.updateProject(id, project);
      } catch (error) {
        console.warn('Firebase updateProject failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.updateProject(id, project);
  }

  async deleteProject(id: string): Promise<void> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        return await firebaseService.deleteProject(id);
      } catch (error) {
        console.warn('Firebase deleteProject failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    return localStorageService.deleteProject(id);
  }

  // Local project idea generation
  private generateLocalProjectIdeas(request: GenerateProjectRequest): ProjectIdea[] {
    const { skill = 'beginner', time = '2-5h' } = request;
    
    const ideas: ProjectIdea[] = [
      {
        id: 'local-blink-led',
        title: 'LED Blink Pattern Controller',
        description: 'Create different blinking patterns with LEDs using push buttons.',
        difficulty: 'beginner' as const,
        estimatedTime: 'lt-2h' as const,
        components: ['Arduino Uno', 'LEDs', 'Resistors', 'Push Buttons'],
        category: 'Learning',
        instructions: [
          'Connect LEDs to digital pins with resistors',
          'Add push buttons for pattern selection',
          'Program different blinking sequences',
          'Test all patterns and button interactions'
        ],
        created_at: new Date().toISOString()
      },
      {
        id: 'local-temp-monitor',
        title: 'Temperature Display System',
        description: 'Monitor and display temperature readings with visual alerts.',
        difficulty: 'beginner' as const,
        estimatedTime: '2-5h' as const,
        components: ['Arduino Uno', 'DHT22', 'OLED Display', 'LEDs'],
        category: 'Monitoring',
        instructions: [
          'Wire DHT22 sensor to Arduino',
          'Connect OLED display via I2C',
          'Program temperature reading and display',
          'Add LED alerts for high/low temperatures'
        ],
        created_at: new Date().toISOString()
      }
    ];

    // Filter by skill level
    return ideas.filter(idea => {
      if (skill === 'beginner') return idea.difficulty === 'beginner';
      return true;
    });
  }

  // Connection status
  getConnectionStatus(): { isOnline: boolean; lastChecked: Date } {
    return {
      isOnline: this.isOnline,
      lastChecked: new Date(this.lastConnectionCheck)
    };
  }

  // Force connection recheck
  async forceConnectionCheck(): Promise<boolean> {
    this.lastConnectionCheck = 0;
    return this.checkConnection();
  }

  // Initialize data
  async initializeDefaultData(): Promise<boolean> {
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      try {
        // Try Firebase initialization from the existing service
        const { initializeDefaultData } = await import('./dataInitializer');
        return await initializeDefaultData();
      } catch (error) {
        console.warn('Firebase initialization failed, using local storage:', error);
        this.isOnline = false;
      }
    }
    
    console.log('📱 Initializing data in local storage');
    return localStorageService.initializeDefaultData();
  }
}

export const hybridService = new HybridService();
export default hybridService;