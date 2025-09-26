import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db, retryFirebaseOperation } from './firebase';

// Types
export interface ComponentSpec {
  [key: string]: string;
}

export interface Component {
  id?: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  availability: string;
  specifications?: ComponentSpec;
  created_at?: any;
  updated_at?: any;
}

export interface ComponentCreate {
  name: string;
  description: string;
  category: string;
  price_range: string;
  specifications?: {[key: string]: string};
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: 'lt-2h' | '2-5h' | '5-10h' | '10h-plus';
  components: string[];
  category: string;
  instructions: string[];
  created_at?: any;
}

export interface GenerateProjectRequest {
  skill?: string;
  categories?: string[];
  components?: string[];
  time?: string;
  notes?: string;
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  status: 'saved' | 'in-progress' | 'completed';
  dateSaved: any;
  instructions: string;
  requirements: string[];
  notes?: string;
  user_id?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: any;
}

// Helper function to convert Firestore document to object
const docToObject = (doc: QueryDocumentSnapshot<DocumentData>) => ({
  id: doc.id,
  ...doc.data(),
});

// Firebase Service Class
class FirebaseService {
  // Components
  async getComponents(category?: string, search?: string): Promise<Component[]> {
    return retryFirebaseOperation(async () => {
      const componentsCollection = collection(db, 'components');
      const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];
      
      if (category && category.toLowerCase() !== 'all') {
        constraints.push(where('category', '==', category));
      }
      
      const q = query(componentsCollection, ...constraints);
      const querySnapshot = await getDocs(q);
      
      let components = querySnapshot.docs.map(docToObject) as Component[];
      
      // Client-side search filtering (since Firestore doesn't have full-text search)
      if (search) {
        const searchLower = search.toLowerCase();
        components = components.filter(
          (component) =>
            component.name.toLowerCase().includes(searchLower) ||
            component.description.toLowerCase().includes(searchLower)
        );
      }
      
      return components;
    });
  }

  async createComponent(component: ComponentCreate): Promise<Component> {
    return retryFirebaseOperation(async () => {
      const componentsCollection = collection(db, 'components');
      const docRef = await addDoc(componentsCollection, {
        ...component,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      return { id: docRef.id, ...docSnap.data() } as Component;
    });
  }

  async getComponent(id: string): Promise<Component> {
    try {
      const docRef = doc(db, 'components', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Component;
      } else {
        throw new Error('Component not found');
      }
    } catch (error) {
      console.error('Error getting component:', error);
      throw error;
    }
  }

  async updateComponent(id: string, component: ComponentCreate): Promise<Component> {
    try {
      const docRef = doc(db, 'components', id);
      await updateDoc(docRef, {
        ...component,
        updated_at: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() } as Component;
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  }

  async deleteComponent(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'components', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  }

  // Projects
  async generateProjectIdeas(request: GenerateProjectRequest): Promise<ProjectIdea[]> {
    const { components = [], categories = [], skill = 'beginner', time = '2-5h', notes = '' } = request;
    
    // Enhanced AI-like project generation based on inputs
    const allProjectTemplates: ProjectIdea[] = [
      {
        id: 'smart-home-monitor',
        title: 'Smart Home Air Quality Monitor',
        description: 'Build a connected monitor that tracks temperature, humidity, and air quality with real-time alerts.',
        difficulty: 'beginner' as const,
        estimatedTime: '2-5h' as const,
        components: ['ESP32', 'DHT22', 'OLED Display', 'Buzzer'],
        category: 'IoT',
        instructions: [
          'Wire DHT22 sensor to ESP32 and verify readings',
          'Connect OLED display and show live temperature/humidity',
          'Set up Wi-Fi connectivity for data logging',
          'Add buzzer alerts for threshold violations',
          'Create mobile dashboard for remote monitoring',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'led-controller',
        title: 'Smart RGB LED Controller',
        description: 'Control colorful LED strips with your smartphone using Bluetooth connectivity.',
        difficulty: 'beginner' as const,
        estimatedTime: 'lt-2h' as const,
        components: ['Arduino Uno', 'RGB LED Strip', 'Bluetooth Module', 'Resistors'],
        category: 'IoT',
        instructions: [
          'Connect RGB LED strip to Arduino PWM pins',
          'Add current-limiting resistors for protection',
          'Wire HC-05 Bluetooth module for communication',
          'Upload Arduino code for color control',
          'Create mobile app interface with color picker',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'plant-monitor',
        title: 'Automated Plant Watering System',
        description: 'Automatically water plants based on soil moisture with smart scheduling.',
        difficulty: 'intermediate' as const,
        estimatedTime: '5-10h' as const,
        components: ['ESP32', 'Soil Moisture Sensor', 'Water Pump', 'Relay Module', 'OLED Display'],
        category: 'Automation',
        instructions: [
          'Install soil moisture sensor and calibrate readings',
          'Connect water pump through relay for safe control',
          'Program moisture thresholds and watering schedules',
          'Add OLED display for system status',
          'Implement Wi-Fi notifications and remote control',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'obstacle-robot',
        title: 'Obstacle-Avoiding Robot',
        description: 'Build an autonomous robot that navigates and avoids obstacles using ultrasonic sensors.',
        difficulty: 'intermediate' as const,
        estimatedTime: '5-10h' as const,
        components: ['Arduino Uno', 'HC-SR04', 'Servo Motor', 'DC Motors', 'Motor Driver'],
        category: 'Robotics',
        instructions: [
          'Assemble robot chassis with DC motors',
          'Mount HC-SR04 sensor on servo for scanning',
          'Connect motor driver for wheel control',
          'Program obstacle detection and avoidance logic',
          'Fine-tune movement patterns and sensor sensitivity',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'security-system',
        title: 'Smart Security System',
        description: 'Create a motion-activated security system with camera and smartphone alerts.',
        difficulty: 'advanced' as const,
        estimatedTime: '10h-plus' as const,
        components: ['ESP32', 'PIR Sensor', 'Camera Module', 'Buzzer', 'LED'],
        category: 'Security',
        instructions: [
          'Connect PIR sensor for motion detection',
          'Integrate camera module for image capture',
          'Set up Wi-Fi for cloud storage and notifications',
          'Add local buzzer and LED alerts',
          'Create web interface for system monitoring',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'weather-station',
        title: 'Personal Weather Station',
        description: 'Monitor local weather conditions and upload data to cloud services.',
        difficulty: 'intermediate' as const,
        estimatedTime: '5-10h' as const,
        components: ['ESP32', 'DHT22', 'Pressure Sensor', 'OLED Display', 'Solar Panel'],
        category: 'Monitoring',
        instructions: [
          'Connect multiple sensors for comprehensive readings',
          'Display real-time data on OLED screen',
          'Set up cloud data logging and visualization',
          'Add solar panel for autonomous operation',
          'Create weather prediction algorithms',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'smart-doorbell',
        title: 'Smart Video Doorbell',
        description: 'Build a Wi-Fi enabled doorbell with video streaming and remote notifications.',
        difficulty: 'advanced' as const,
        estimatedTime: '10h-plus' as const,
        components: ['ESP32', 'Camera Module', 'PIR Sensor', 'Speaker', 'Button'],
        category: 'IoT',
        instructions: [
          'Install camera module for video capture',
          'Add PIR sensor for motion detection',
          'Connect speaker and button for doorbell function',
          'Implement Wi-Fi streaming and notifications',
          'Create mobile app for remote monitoring',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: 'voice-assistant',
        title: 'Voice-Controlled Home Assistant',
        description: 'Create a voice-activated system to control home devices and get information.',
        difficulty: 'advanced' as const,
        estimatedTime: '10h-plus' as const,
        components: ['ESP32', 'Microphone', 'Speaker', 'Relay Module', 'OLED Display'],
        category: 'AI',
        instructions: [
          'Connect microphone for voice input capture',
          'Set up speaker for audio responses',
          'Implement voice recognition and processing',
          'Add relay controls for home devices',
          'Create custom voice commands and responses',
        ],
        created_at: serverTimestamp(),
      }
    ];

    // Smart filtering based on user inputs
    let filteredIdeas = allProjectTemplates;

    // Filter by skill level
    if (skill === 'beginner') {
      filteredIdeas = filteredIdeas.filter(idea => idea.difficulty === 'beginner');
    } else if (skill === 'intermediate') {
      filteredIdeas = filteredIdeas.filter(idea => 
        idea.difficulty === 'beginner' || idea.difficulty === 'intermediate'
      );
    }

    // Filter by time commitment
    if (time && time !== 'any') {
      filteredIdeas = filteredIdeas.filter(idea => idea.estimatedTime === time);
    }

    // Filter by categories if specified
    if (categories.length > 0 && !categories.includes('all')) {
      filteredIdeas = filteredIdeas.filter(idea => 
        categories.some(cat => idea.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Smart component matching - prefer projects that use selected components
    if (components.length > 0) {
      filteredIdeas = filteredIdeas.sort((a, b) => {
        const aMatches = a.components.filter(comp => 
          components.some(selected => 
            comp.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(comp.toLowerCase())
          )
        ).length;
        
        const bMatches = b.components.filter(comp => 
          components.some(selected => 
            comp.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(comp.toLowerCase())
          )
        ).length;
        
        return bMatches - aMatches; // Sort by most matches first
      });
    }

    // Ensure we return at least 3 ideas, add more creative variations if needed
    if (filteredIdeas.length < 3) {
      // Add some universal beginner-friendly projects
      const universalProjects: ProjectIdea[] = [
        {
          id: 'blink-led',
          title: 'Interactive LED Patterns',
          description: 'Create mesmerizing LED light patterns with button controls.',
          difficulty: 'beginner' as const,
          estimatedTime: 'lt-2h' as const,
          components: ['Arduino Uno', 'LEDs', 'Resistors', 'Push Buttons'],
          category: 'Learning',
          instructions: [
            'Connect multiple LEDs with resistors',
            'Add push buttons for pattern selection',
            'Program different blinking patterns',
            'Create interactive light show',
            'Add sound effects with buzzer',
          ],
          created_at: serverTimestamp(),
        }
      ];
      
      filteredIdeas = [...filteredIdeas, ...universalProjects];
    }

    // Return top 3-5 most relevant ideas
    return filteredIdeas.slice(0, Math.max(3, Math.min(5, filteredIdeas.length)));
  }

  async getProjects(userId?: string): Promise<Project[]> {
    try {
      const projectsCollection = collection(db, 'projects');
      const constraints: QueryConstraint[] = [orderBy('dateSaved', 'desc')];
      
      if (userId) {
        constraints.push(where('user_id', '==', userId));
      }
      
      const q = query(projectsCollection, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docToObject) as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async saveProject(project: Project): Promise<Project> {
    try {
      const projectsCollection = collection(db, 'projects');
      const docRef = await addDoc(projectsCollection, {
        ...project,
        dateSaved: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      return { id: docRef.id, ...docSnap.data() } as Project;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, project);
      
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() } as Project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Users
  async createUser(user: User): Promise<User> {
    try {
      const usersCollection = collection(db, 'users');
      const docRef = await addDoc(usersCollection, {
        ...user,
        created_at: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      return { id: docRef.id, ...docSnap.data() } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, user);
      
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();
export default firebaseService;