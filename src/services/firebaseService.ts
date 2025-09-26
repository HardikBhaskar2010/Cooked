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
import { db } from './firebase';

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
    try {
      const componentsCollection = collection(db, 'components');
      const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];
      
      if (category) {
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
    } catch (error) {
      console.error('Error getting components:', error);
      throw error;
    }
  }

  async createComponent(component: ComponentCreate): Promise<Component> {
    try {
      const componentsCollection = collection(db, 'components');
      const docRef = await addDoc(componentsCollection, {
        ...component,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      
      const docSnap = await getDoc(docRef);
      return { id: docRef.id, ...docSnap.data() } as Component;
    } catch (error) {
      console.error('Error creating component:', error);
      throw error;
    }
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
    // Since we don't have a backend AI service, we'll return some predefined project ideas
    // based on the components and categories selected
    const { components = [], categories = [], skill = 'beginner' } = request;
    
    const projectIdeas: ProjectIdea[] = [
      {
        id: '1',
        title: 'Smart LED Controller',
        description: 'Control LEDs with your smartphone using Bluetooth connectivity.',
        difficulty: 'beginner' as const,
        estimatedTime: '2-5h' as const,
        components: ['Arduino Uno', 'LEDs', 'Resistors', 'Bluetooth Module'],
        category: 'IoT',
        instructions: [
          'Connect LEDs to Arduino digital pins',
          'Add current-limiting resistors',
          'Connect Bluetooth module',
          'Upload Arduino code',
          'Create mobile app interface',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: '2',
        title: 'Temperature Monitoring System',
        description: 'Monitor room temperature and display on LCD with alerts.',
        difficulty: 'intermediate' as const,
        estimatedTime: '5-10h' as const,
        components: ['Arduino Uno', 'Temperature Sensor', 'LCD Display', 'Buzzer'],
        category: 'Monitoring',
        instructions: [
          'Connect temperature sensor to analog pin',
          'Wire LCD display to Arduino',
          'Add buzzer for alerts',
          'Program temperature thresholds',
          'Create data logging functionality',
        ],
        created_at: serverTimestamp(),
      },
      {
        id: '3',
        title: 'Automated Plant Watering',
        description: 'Automatically water plants based on soil moisture levels.',
        difficulty: 'advanced' as const,
        estimatedTime: '10h-plus' as const,
        components: ['Arduino Uno', 'Soil Moisture Sensor', 'Water Pump', 'Relay Module'],
        category: 'Automation',
        instructions: [
          'Install soil moisture sensor',
          'Connect water pump via relay',
          'Program moisture thresholds',
          'Add scheduling functionality',
          'Create user interface',
        ],
        created_at: serverTimestamp(),
      },
    ];

    // Filter based on skill level
    const filteredIdeas = projectIdeas.filter((idea) => {
      if (skill === 'beginner') return idea.difficulty === 'beginner';
      if (skill === 'intermediate') return ['beginner', 'intermediate'].includes(idea.difficulty);
      return true; // advanced gets all
    });

    return filteredIdeas;
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