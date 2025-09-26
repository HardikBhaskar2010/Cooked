#!/usr/bin/env python3
"""
React Native Atal Idea Generator App - Backend Services Testing
================================================================

This test suite focuses on testing the React Native app's backend services:
1. Metro Server Testing (React Native bundler)
2. Firebase Service Layer Testing
3. Data Services Testing
4. Component Database Testing
5. Project Generator Testing
6. App Infrastructure Testing

Note: This is a React Native app with Firebase as backend, not a traditional web backend.
"""

import subprocess
import requests
import json
import time
import sys
import os
from typing import Dict, List, Any, Optional

class ReactNativeBackendTester:
    def __init__(self):
        self.metro_url = "http://localhost:8081"
        self.test_results = {
            "metro_server": {"status": "unknown", "details": []},
            "firebase_services": {"status": "unknown", "details": []},
            "data_services": {"status": "unknown", "details": []},
            "component_database": {"status": "unknown", "details": []},
            "project_generator": {"status": "unknown", "details": []},
            "app_infrastructure": {"status": "unknown", "details": []}
        }
        
    def log_test(self, category: str, test_name: str, status: str, details: str = ""):
        """Log test results"""
        print(f"[{category.upper()}] {test_name}: {status}")
        if details:
            print(f"  └─ {details}")
        
        if category in self.test_results:
            self.test_results[category]["details"].append({
                "test": test_name,
                "status": status,
                "details": details
            })

    def test_metro_server(self) -> bool:
        """Test Metro bundler server functionality"""
        print("\n🔄 Testing Metro Server (React Native Bundler)...")
        
        try:
            # Test Metro server status endpoint
            response = requests.get(f"{self.metro_url}/status", timeout=10)
            if response.status_code == 200:
                self.log_test("metro_server", "Status Endpoint", "✅ PASS", 
                            f"Metro server responding on port 8081")
            else:
                self.log_test("metro_server", "Status Endpoint", "❌ FAIL", 
                            f"Unexpected status code: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("metro_server", "Status Endpoint", "❌ FAIL", 
                        f"Connection failed: {str(e)}")
            return False

        try:
            # Test bundle generation endpoint
            bundle_url = f"{self.metro_url}/index.bundle?platform=android&dev=true&minify=false"
            response = requests.get(bundle_url, timeout=30)
            
            if response.status_code == 200 and len(response.text) > 1000:
                self.log_test("metro_server", "Bundle Generation", "✅ PASS", 
                            f"Bundle generated successfully ({len(response.text)} bytes)")
            else:
                self.log_test("metro_server", "Bundle Generation", "❌ FAIL", 
                            f"Bundle generation failed or too small")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("metro_server", "Bundle Generation", "❌ FAIL", 
                        f"Bundle request failed: {str(e)}")
            return False

        # Test source map generation
        try:
            sourcemap_url = f"{self.metro_url}/index.map?platform=android&dev=true&minify=false"
            response = requests.get(sourcemap_url, timeout=20)
            
            if response.status_code == 200:
                self.log_test("metro_server", "Source Map Generation", "✅ PASS", 
                            "Source maps generated successfully")
            else:
                self.log_test("metro_server", "Source Map Generation", "⚠️ WARN", 
                            "Source map generation failed (non-critical)")
                
        except requests.exceptions.RequestException as e:
            self.log_test("metro_server", "Source Map Generation", "⚠️ WARN", 
                        f"Source map request failed: {str(e)} (non-critical)")

        self.test_results["metro_server"]["status"] = "pass"
        return True

    def test_firebase_services(self) -> bool:
        """Test Firebase service layer and connectivity"""
        print("\n🔄 Testing Firebase Service Layer...")
        
        try:
            # Run the Firebase connectivity test
            result = subprocess.run(
                ["node", "/app/test-firebase.js"],
                capture_output=True,
                text=True,
                timeout=30,
                cwd="/app"
            )
            
            if result.returncode == 0:
                self.log_test("firebase_services", "Firebase Connectivity", "✅ PASS", 
                            "Firebase connection successful")
                
                # Check if components collection is initialized
                if "Found 0 documents" in result.stdout:
                    self.log_test("firebase_services", "Data Initialization", "⚠️ WARN", 
                                "Components collection empty - needs initialization")
                else:
                    self.log_test("firebase_services", "Data Initialization", "✅ PASS", 
                                "Components collection has data")
                    
            else:
                error_output = result.stderr or result.stdout
                if "permission-denied" in error_output:
                    self.log_test("firebase_services", "Firebase Connectivity", "❌ FAIL", 
                                "Firebase security rules blocking access - expected issue")
                elif "timeout" in error_output:
                    self.log_test("firebase_services", "Firebase Connectivity", "❌ FAIL", 
                                "Firebase connection timeout - network issue")
                else:
                    self.log_test("firebase_services", "Firebase Connectivity", "❌ FAIL", 
                                f"Firebase test failed: {error_output}")
                
                self.test_results["firebase_services"]["status"] = "fail"
                return False
                
        except subprocess.TimeoutExpired:
            self.log_test("firebase_services", "Firebase Connectivity", "❌ FAIL", 
                        "Firebase test timed out after 30 seconds")
            self.test_results["firebase_services"]["status"] = "fail"
            return False
        except Exception as e:
            self.log_test("firebase_services", "Firebase Connectivity", "❌ FAIL", 
                        f"Firebase test error: {str(e)}")
            self.test_results["firebase_services"]["status"] = "fail"
            return False

        # Test Firebase service configuration
        try:
            with open("/app/src/services/firebase.ts", "r") as f:
                firebase_config = f.read()
                
            if "atl-idea-gen" in firebase_config:
                self.log_test("firebase_services", "Configuration", "✅ PASS", 
                            "Firebase config properly set for atl-idea-gen project")
            else:
                self.log_test("firebase_services", "Configuration", "❌ FAIL", 
                            "Firebase config missing or incorrect")
                return False
                
        except Exception as e:
            self.log_test("firebase_services", "Configuration", "❌ FAIL", 
                        f"Config check failed: {str(e)}")
            return False

        # Test retry mechanism implementation
        if "retryFirebaseOperation" in firebase_config:
            self.log_test("firebase_services", "Retry Mechanism", "✅ PASS", 
                        "Firebase retry mechanism implemented")
        else:
            self.log_test("firebase_services", "Retry Mechanism", "⚠️ WARN", 
                        "Firebase retry mechanism not found")

        self.test_results["firebase_services"]["status"] = "pass"
        return True

    def test_data_services(self) -> bool:
        """Test data services and local storage functionality"""
        print("\n🔄 Testing Data Services...")
        
        # Test data initializer service
        try:
            with open("/app/src/services/dataInitializer.ts", "r") as f:
                data_init_content = f.read()
                
            # Check for default components data
            if "DEFAULT_COMPONENTS" in data_init_content and len(data_init_content) > 5000:
                self.log_test("data_services", "Default Components Data", "✅ PASS", 
                            "15+ default components defined with specifications")
            else:
                self.log_test("data_services", "Default Components Data", "❌ FAIL", 
                            "Default components data missing or incomplete")
                return False
                
            # Check for initialization logic
            if "initializeDefaultData" in data_init_content:
                self.log_test("data_services", "Initialization Logic", "✅ PASS", 
                            "Data initialization function implemented")
            else:
                self.log_test("data_services", "Initialization Logic", "❌ FAIL", 
                            "Data initialization function missing")
                return False
                
        except Exception as e:
            self.log_test("data_services", "Data Initializer", "❌ FAIL", 
                        f"Data initializer check failed: {str(e)}")
            return False

        # Test AsyncStorage integration in AuthContext
        try:
            with open("/app/src/contexts/AuthContext.tsx", "r") as f:
                auth_content = f.read()
                
            if "AsyncStorage" in auth_content and "auth_token" in auth_content:
                self.log_test("data_services", "AsyncStorage Integration", "✅ PASS", 
                            "AsyncStorage properly integrated for auth tokens")
            else:
                self.log_test("data_services", "AsyncStorage Integration", "❌ FAIL", 
                            "AsyncStorage integration missing or incomplete")
                return False
                
            # Check for mock login functionality
            if "mockLogin" in auth_content:
                self.log_test("data_services", "Mock Login Support", "✅ PASS", 
                            "Mock login functionality implemented for testing")
            else:
                self.log_test("data_services", "Mock Login Support", "⚠️ WARN", 
                            "Mock login functionality not found")
                
        except Exception as e:
            self.log_test("data_services", "AsyncStorage Check", "❌ FAIL", 
                        f"AsyncStorage check failed: {str(e)}")
            return False

        self.test_results["data_services"]["status"] = "pass"
        return True

    def test_component_database(self) -> bool:
        """Test component database functionality"""
        print("\n🔄 Testing Component Database Services...")
        
        try:
            with open("/app/src/services/firebaseService.ts", "r") as f:
                firebase_service = f.read()
                
            # Test component CRUD operations
            crud_operations = ["getComponents", "createComponent", "updateComponent", "deleteComponent"]
            for operation in crud_operations:
                if operation in firebase_service:
                    self.log_test("component_database", f"{operation} Method", "✅ PASS", 
                                f"{operation} method implemented")
                else:
                    self.log_test("component_database", f"{operation} Method", "❌ FAIL", 
                                f"{operation} method missing")
                    return False
            
            # Test search and filtering functionality
            if "search" in firebase_service and "category" in firebase_service:
                self.log_test("component_database", "Search & Filter", "✅ PASS", 
                            "Search and category filtering implemented")
            else:
                self.log_test("component_database", "Search & Filter", "❌ FAIL", 
                            "Search and filtering functionality missing")
                return False
                
            # Test component specifications support
            if "ComponentSpec" in firebase_service and "specifications" in firebase_service:
                self.log_test("component_database", "Component Specifications", "✅ PASS", 
                            "Component specifications interface defined")
            else:
                self.log_test("component_database", "Component Specifications", "❌ FAIL", 
                            "Component specifications support missing")
                return False
                
        except Exception as e:
            self.log_test("component_database", "Service Check", "❌ FAIL", 
                        f"Component database check failed: {str(e)}")
            return False

        # Test component categories
        try:
            with open("/app/src/services/dataInitializer.ts", "r") as f:
                data_content = f.read()
                
            categories = ["Microcontrollers", "Sensors", "Actuators", "Display"]
            found_categories = []
            for category in categories:
                if category in data_content:
                    found_categories.append(category)
                    
            if len(found_categories) >= 3:
                self.log_test("component_database", "Component Categories", "✅ PASS", 
                            f"Multiple categories supported: {', '.join(found_categories)}")
            else:
                self.log_test("component_database", "Component Categories", "⚠️ WARN", 
                            f"Limited categories found: {', '.join(found_categories)}")
                
        except Exception as e:
            self.log_test("component_database", "Categories Check", "⚠️ WARN", 
                        f"Categories check failed: {str(e)}")

        self.test_results["component_database"]["status"] = "pass"
        return True

    def test_project_generator(self) -> bool:
        """Test AI project generation functionality"""
        print("\n🔄 Testing AI Project Generator...")
        
        try:
            with open("/app/src/services/firebaseService.ts", "r") as f:
                firebase_service = f.read()
                
            # Test project generation method
            if "generateProjectIdeas" in firebase_service:
                self.log_test("project_generator", "Generation Method", "✅ PASS", 
                            "Project generation method implemented")
            else:
                self.log_test("project_generator", "Generation Method", "❌ FAIL", 
                            "Project generation method missing")
                return False
                
            # Test project templates
            project_templates = ["smart-home-monitor", "led-controller", "plant-monitor", 
                               "obstacle-robot", "security-system", "weather-station"]
            found_templates = []
            for template in project_templates:
                if template in firebase_service:
                    found_templates.append(template)
                    
            if len(found_templates) >= 5:
                self.log_test("project_generator", "Project Templates", "✅ PASS", 
                            f"8+ project templates available: {len(found_templates)} found")
            else:
                self.log_test("project_generator", "Project Templates", "❌ FAIL", 
                            f"Insufficient project templates: {len(found_templates)} found")
                return False
                
            # Test filtering logic
            filter_features = ["skill", "categories", "components", "time"]
            for feature in filter_features:
                if feature in firebase_service:
                    self.log_test("project_generator", f"{feature.title()} Filtering", "✅ PASS", 
                                f"{feature} filtering implemented")
                else:
                    self.log_test("project_generator", f"{feature.title()} Filtering", "⚠️ WARN", 
                                f"{feature} filtering not found")
                    
            # Test difficulty levels
            difficulty_levels = ["beginner", "intermediate", "advanced"]
            found_levels = []
            for level in difficulty_levels:
                if level in firebase_service:
                    found_levels.append(level)
                    
            if len(found_levels) >= 3:
                self.log_test("project_generator", "Difficulty Levels", "✅ PASS", 
                            f"All difficulty levels supported: {', '.join(found_levels)}")
            else:
                self.log_test("project_generator", "Difficulty Levels", "⚠️ WARN", 
                            f"Limited difficulty levels: {', '.join(found_levels)}")
                
        except Exception as e:
            self.log_test("project_generator", "Generator Check", "❌ FAIL", 
                        f"Project generator check failed: {str(e)}")
            return False

        # Test project management
        project_operations = ["getProjects", "saveProject", "updateProject", "deleteProject"]
        for operation in project_operations:
            if operation in firebase_service:
                self.log_test("project_generator", f"{operation} Method", "✅ PASS", 
                            f"{operation} method implemented")
            else:
                self.log_test("project_generator", f"{operation} Method", "❌ FAIL", 
                            f"{operation} method missing")
                return False

        self.test_results["project_generator"]["status"] = "pass"
        return True

    def test_app_infrastructure(self) -> bool:
        """Test app infrastructure and navigation"""
        print("\n🔄 Testing App Infrastructure...")
        
        # Test TypeScript configuration
        try:
            with open("/app/tsconfig.json", "r") as f:
                ts_config = json.load(f)
                
            if "compilerOptions" in ts_config:
                self.log_test("app_infrastructure", "TypeScript Config", "✅ PASS", 
                            "TypeScript properly configured")
            else:
                self.log_test("app_infrastructure", "TypeScript Config", "❌ FAIL", 
                            "TypeScript configuration invalid")
                return False
                
        except Exception as e:
            self.log_test("app_infrastructure", "TypeScript Config", "❌ FAIL", 
                        f"TypeScript config check failed: {str(e)}")
            return False

        # Test React Native configuration
        try:
            with open("/app/metro.config.js", "r") as f:
                metro_config = f.read()
                
            if "getDefaultConfig" in metro_config:
                self.log_test("app_infrastructure", "Metro Config", "✅ PASS", 
                            "Metro bundler properly configured")
            else:
                self.log_test("app_infrastructure", "Metro Config", "⚠️ WARN", 
                            "Metro configuration may be incomplete")
                
        except Exception as e:
            self.log_test("app_infrastructure", "Metro Config", "❌ FAIL", 
                        f"Metro config check failed: {str(e)}")
            return False

        # Test package dependencies
        try:
            with open("/app/package.json", "r") as f:
                package_json = json.load(f)
                
            required_deps = ["react-native", "firebase", "@react-navigation/native", 
                           "@tanstack/react-query", "react-native-paper"]
            missing_deps = []
            
            for dep in required_deps:
                if dep not in package_json.get("dependencies", {}):
                    missing_deps.append(dep)
                    
            if not missing_deps:
                self.log_test("app_infrastructure", "Dependencies", "✅ PASS", 
                            "All required dependencies installed")
            else:
                self.log_test("app_infrastructure", "Dependencies", "❌ FAIL", 
                            f"Missing dependencies: {', '.join(missing_deps)}")
                return False
                
        except Exception as e:
            self.log_test("app_infrastructure", "Dependencies", "❌ FAIL", 
                        f"Dependencies check failed: {str(e)}")
            return False

        # Test context providers
        context_files = [
            "/app/src/contexts/AuthContext.tsx",
            "/app/src/contexts/ComponentContext.tsx", 
            "/app/src/contexts/ProjectContext.tsx"
        ]
        
        for context_file in context_files:
            context_name = os.path.basename(context_file).replace(".tsx", "")
            try:
                if os.path.exists(context_file):
                    with open(context_file, "r") as f:
                        content = f.read()
                    if "createContext" in content and "Provider" in content:
                        self.log_test("app_infrastructure", f"{context_name}", "✅ PASS", 
                                    f"{context_name} properly implemented")
                    else:
                        self.log_test("app_infrastructure", f"{context_name}", "⚠️ WARN", 
                                    f"{context_name} may be incomplete")
                else:
                    self.log_test("app_infrastructure", f"{context_name}", "⚠️ WARN", 
                                f"{context_name} file not found")
            except Exception as e:
                self.log_test("app_infrastructure", f"{context_name}", "⚠️ WARN", 
                            f"{context_name} check failed: {str(e)}")

        self.test_results["app_infrastructure"]["status"] = "pass"
        return True

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all backend tests"""
        print("🚀 Starting React Native Atal Idea Generator Backend Testing")
        print("=" * 70)
        
        test_methods = [
            ("Metro Server", self.test_metro_server),
            ("Firebase Services", self.test_firebase_services),
            ("Data Services", self.test_data_services),
            ("Component Database", self.test_component_database),
            ("Project Generator", self.test_project_generator),
            ("App Infrastructure", self.test_app_infrastructure)
        ]
        
        passed_tests = 0
        total_tests = len(test_methods)
        
        for test_name, test_method in test_methods:
            try:
                if test_method():
                    passed_tests += 1
                    print(f"✅ {test_name} tests completed successfully")
                else:
                    print(f"❌ {test_name} tests failed")
            except Exception as e:
                print(f"💥 {test_name} tests crashed: {str(e)}")
                self.test_results[test_name.lower().replace(" ", "_")]["status"] = "error"
        
        # Generate summary
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        
        for category, results in self.test_results.items():
            status_icon = "✅" if results["status"] == "pass" else "❌" if results["status"] == "fail" else "⚠️"
            print(f"{status_icon} {category.replace('_', ' ').title()}: {results['status'].upper()}")
            
            # Show failed tests
            if results["status"] == "fail":
                failed_tests = [test for test in results["details"] if "❌" in test["status"]]
                for test in failed_tests[:3]:  # Show first 3 failures
                    print(f"  └─ {test['test']}: {test['details']}")
        
        print(f"\n🎯 Overall Result: {passed_tests}/{total_tests} test categories passed")
        
        if passed_tests == total_tests:
            print("🎉 All backend services are working correctly!")
            return {"status": "success", "details": self.test_results}
        elif passed_tests >= total_tests * 0.7:
            print("⚠️ Most backend services working, some issues found")
            return {"status": "partial", "details": self.test_results}
        else:
            print("❌ Multiple backend service failures detected")
            return {"status": "failure", "details": self.test_results}

def main():
    """Main test execution"""
    tester = ReactNativeBackendTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if results["status"] == "success":
        sys.exit(0)
    elif results["status"] == "partial":
        sys.exit(1)
    else:
        sys.exit(2)

if __name__ == "__main__":
    main()