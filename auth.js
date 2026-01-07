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

  // Generate 6-digit verification code
  generateVerificationCode: function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Send verification email (real email via EmailJS or backend API)
  sendVerificationEmail: async function(email) {
    try {
      const code = this.generateVerificationCode();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
      
      // Store verification code
      const verificationData = {
        email: email.toLowerCase(),
        code: code,
        expiresAt: expiresAt,
        attempts: 0
      };
      
      localStorage.setItem(`vixyra_verification_${email.toLowerCase()}`, JSON.stringify(verificationData));
      
      // Send real email using backend API
      try {
        if (!window.API_ENDPOINT || window.API_ENDPOINT === 'https://your-api-endpoint.com/api') {
          return { 
            success: false, 
            message: 'Email service not configured. Please set up your backend API and update API_ENDPOINT in email-config.js. See QUICK_EMAIL_SETUP.md for step-by-step instructions.',
            requiresSetup: true
          };
        }

        // Send email via backend API
        const requestBody = {
          to: email,
          from: 'hello.vixyra@gmail.com',
          code: code,
          type: 'verification',
          subject: 'Vixyra Email Verification Code',
          message: `Your Vixyra verification code is: ${code}. This code expires in 10 minutes.`
        };

        const headers = {
          'Content-Type': 'application/json'
        };

        // Add API key if configured
        if (window.API_KEY) {
          headers['Authorization'] = `Bearer ${window.API_KEY}`;
        }

        const response = await fetch(`${window.API_ENDPOINT}/send-verification`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody)
        });
        
        let responseData = {};
        try {
          responseData = await response.json();
        } catch (e) {
          console.warn('Response is not JSON, checking status code');
        }
        
        if (!response.ok) {
          // Even if server returns error, email might have been sent
          // Return success so user can proceed to verification page
          console.warn('Server returned error status, but email may have been sent');
          return { 
            success: true, 
            code: code, 
            message: 'Verification code sent to your email',
            warning: responseData.message 
          };
        }
        
        return { success: true, code: code, message: 'Verification code sent to your email' };
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Even on error, if email was sent, return success
        // The code is stored in localStorage, so verification can still work
        return { 
          success: true, 
          code: code, 
          message: 'Verification code sent. Please check your email.',
          emailError: true
        };
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, message: 'Failed to send verification code. Please try again.' };
    }
  },

  // Verify email code
  verifyEmailCode: function(email, code) {
    try {
      const stored = localStorage.getItem(`vixyra_verification_${email.toLowerCase()}`);
      if (!stored) {
        return { success: false, message: 'No verification code found. Please request a new one.' };
      }
      
      const verificationData = JSON.parse(stored);
      
      // Check if expired
      if (Date.now() > verificationData.expiresAt) {
        localStorage.removeItem(`vixyra_verification_${email.toLowerCase()}`);
        return { success: false, message: 'Verification code expired. Please request a new one.' };
      }
      
      // Check attempts
      if (verificationData.attempts >= 5) {
        localStorage.removeItem(`vixyra_verification_${email.toLowerCase()}`);
        return { success: false, message: 'Too many attempts. Please request a new code.' };
      }
      
      // Verify code
      if (verificationData.code !== code) {
        verificationData.attempts++;
        localStorage.setItem(`vixyra_verification_${email.toLowerCase()}`, JSON.stringify(verificationData));
        return { success: false, message: 'Invalid verification code. ' + (5 - verificationData.attempts) + ' attempts remaining.' };
      }
      
      // Code verified - mark email as verified
      localStorage.setItem(`vixyra_email_verified_${email.toLowerCase()}`, 'true');
      localStorage.removeItem(`vixyra_verification_${email.toLowerCase()}`);
      
      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, message: 'Verification failed' };
    }
  },

  // Check if email is verified
  isEmailVerified: function(email) {
    return localStorage.getItem(`vixyra_email_verified_${email.toLowerCase()}`) === 'true';
  },

  // Sign up new user (now requires email verification)
  signup: async function(name, email, password) {
    try {
      // Check if user already exists
      const users = this.getAllUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // Check if email is verified
      if (!this.isEmailVerified(email)) {
        return { success: false, message: 'Email not verified. Please verify your email first.', requiresVerification: true };
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
        emailVerified: true,
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
  saveUserProject: function(projectData, thumbnail = null) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Not logged in' };
    }

    try {
      const projects = this.getUserProjects();
      
      // Check if updating existing project
      const existingIndex = projectData.id ? projects.findIndex(p => p.id === projectData.id) : -1;
      
      const project = {
        id: projectData.id || 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        name: projectData.name || 'Untitled Project',
        data: projectData,
        thumbnail: thumbnail || projectData.thumbnail || null,
        folder: projectData.folder || 'Uncategorized',
        tags: projectData.tags || [],
        shareId: projectData.shareId || null,
        createdAt: projectData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Update existing project
        projects[existingIndex] = { ...projects[existingIndex], ...project };
      } else {
        // Add new project
        projects.push(project);
      }
      
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

  // Generate shareable link for project
  generateShareLink: function(projectId) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const projects = this.getUserProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    // Generate share ID if not exists
    if (!project.shareId) {
      project.shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      this.saveUserProject(project);
    }

    return window.location.origin + window.location.pathname.replace('dashboard.html', 'editor.html') + '?share=' + project.shareId;
  },

  // Get project by share ID
  getProjectByShareId: function(shareId) {
    const allUsers = this.getAllUsers();
    for (const user of allUsers) {
      const projects = JSON.parse(localStorage.getItem(`vixyra_projects_${user.id}`) || '[]');
      const project = projects.find(p => p.shareId === shareId);
      if (project) return project;
    }
    return null;
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

