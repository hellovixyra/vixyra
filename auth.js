// Vixyra Authentication Service
// Handles user registration, login, logout, and session management

const AuthService = {
  // Get current user
  getCurrentUser: function() {
    try {
      const userStr = localStorage.getItem('vixyra_currentUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is logged in
  isAuthenticated: function() {
    return this.getCurrentUser() !== null;
  },

  // Sign up new user
  signup: async function(name, email, password) {
    try {
      // Check if user already exists
      const users = this.getAllUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        id: userId,
        name: name,
        email: email.toLowerCase(),
        password: this.hashPassword(password), // In production, use proper hashing
        createdAt: new Date().toISOString(),
        lastLogin: null,
        profile: {
          avatar: null,
          bio: '',
          preferences: {
            theme: 'light',
            autoSave: true
          }
        }
      };

      // Save user
      users.push(newUser);
      localStorage.setItem('vixyra_users', JSON.stringify(users));

      // Auto login
      this.setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Failed to create account' };
    }
  },

  // Login user
  login: async function(email, password) {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === this.hashPassword(password)
      );

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);

      // Set current user
      this.setCurrentUser(user);

      return { success: true, user: user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  // Logout user
  logout: function() {
    localStorage.removeItem('vixyra_currentUser');
    return { success: true };
  },

  // Set current user
  setCurrentUser: function(user) {
    // Don't store password in current user session
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('vixyra_currentUser', JSON.stringify(userWithoutPassword));
  },

  // Get all users (for internal use)
  getAllUsers: function() {
    try {
      const usersStr = localStorage.getItem('vixyra_users');
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Update user
  updateUser: function(user) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('vixyra_users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        this.setCurrentUser(user);
      }
    }
  },

  // Update user profile
  updateProfile: function(updates) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }

    const fullUser = this.getAllUsers().find(u => u.id === user.id);
    if (!fullUser) {
      return { success: false, message: 'User not found' };
    }

    // Update profile
    fullUser.profile = { ...fullUser.profile, ...updates };
    if (updates.name) fullUser.name = updates.name;
    if (updates.email) fullUser.email = updates.email.toLowerCase();

    this.updateUser(fullUser);
    return { success: true, user: fullUser };
  },

  // Change password
  changePassword: function(oldPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }

    const fullUser = this.getAllUsers().find(u => u.id === user.id);
    if (!fullUser) {
      return { success: false, message: 'User not found' };
    }

    // Verify old password
    if (fullUser.password !== this.hashPassword(oldPassword)) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Update password
    fullUser.password = this.hashPassword(newPassword);
    this.updateUser(fullUser);

    return { success: true };
  },

  // Get user projects
  getUserProjects: function() {
    const user = this.getCurrentUser();
    if (!user) return [];

    try {
      const projectsStr = localStorage.getItem(`vixyra_projects_${user.id}`);
      return projectsStr ? JSON.parse(projectsStr) : [];
    } catch (error) {
      console.error('Error getting user projects:', error);
      return [];
    }
  },

  // Save user project
  saveUserProject: function(projectData) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }

    try {
      const projects = this.getUserProjects();
      const project = {
        id: 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        name: projectData.name || 'Untitled Project',
        data: projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      projects.push(project);
      localStorage.setItem(`vixyra_projects_${user.id}`, JSON.stringify(projects));

      return { success: true, project: project };
    } catch (error) {
      console.error('Error saving project:', error);
      return { success: false, message: 'Failed to save project' };
    }
  },

  // Delete user project
  deleteUserProject: function(projectId) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }

    try {
      const projects = this.getUserProjects();
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem(`vixyra_projects_${user.id}`, JSON.stringify(filtered));

      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, message: 'Failed to delete project' };
    }
  },

  // Simple password hashing (for demo - use proper hashing in production)
  hashPassword: function(password) {
    // This is a simple hash for demo purposes
    // In production, use proper password hashing (bcrypt, etc.)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
};

// Auto-check authentication on page load
if (typeof window !== 'undefined') {
  window.AuthService = AuthService;
}

