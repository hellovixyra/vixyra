// Vixyra Onboarding Tutorial for New Users

const OnboardingTutorial = {
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Vixyra! 🎨',
      content: 'Create stunning designs with our powerful canvas editor. Let\'s get you started!',
      target: null,
      position: 'center'
    },
    {
      id: 'canvas',
      title: 'Your Canvas',
      content: 'This is your workspace. Click and drag to create shapes, add text, and design amazing graphics.',
      target: '#canvas-container',
      position: 'bottom'
    },
    {
      id: 'tools',
      title: 'Design Tools',
      content: 'Use the sidebar tools to add shapes, text, images, and more. Explore all the creative options!',
      target: '.sidebar',
      position: 'right'
    },
    {
      id: 'save',
      title: 'Save Your Work',
      content: 'Always save your projects! Click the save button to store your designs in your account.',
      target: '#saveToCloudBtn',
      position: 'left'
    },
    {
      id: 'export',
      title: 'Export & Share',
      content: 'Export your designs as PNG, JPG, or PDF. Share with others or download for printing.',
      target: '#exportBtn',
      position: 'left'
    }
  ],
  
  currentStep: 0,
  isActive: false,
  
  // Check if user needs onboarding
  shouldShow: function() {
    const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
    if (!user) return false;
    
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem(`vixyra_onboarding_${user.id}`);
    if (onboardingCompleted === 'true') return false;
    
    // Check if user is new (created account recently or has no projects)
    const projects = typeof AuthService !== 'undefined' ? AuthService.getUserProjects() : [];
    const isNewUser = projects.length === 0;
    
    return isNewUser;
  },
  
  // Start onboarding
  start: function() {
    if (this.isActive) return;
    if (this.currentStep >= this.steps.length) return;
    
    this.isActive = true;
    this.showStep(this.currentStep);
  },
  
  // Show specific step
  showStep: function(stepIndex) {
    if (stepIndex >= this.steps.length) {
      this.complete();
      return;
    }
    
    const step = this.steps[stepIndex];
    this.currentStep = stepIndex;
    
    // Remove existing overlay
    this.removeOverlay();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    overlay.id = 'onboarding-overlay';
    
    // Create highlight for target element
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'onboarding-highlight';
        highlight.style.cssText = `
          position: fixed;
          top: ${rect.top}px;
          left: ${rect.left}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          border: 3px solid #667eea;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(102, 126, 234, 0.5);
          z-index: 999998;
          pointer-events: none;
          animation: pulse-border 2s ease-in-out infinite;
        `;
        overlay.appendChild(highlight);
      }
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = `onboarding-tooltip onboarding-tooltip-${step.position || 'center'}`;
    
    let tooltipStyle = '';
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        
        switch(step.position) {
          case 'top':
            tooltipStyle = `top: ${rect.top + scrollY - 20}px; left: ${rect.left + scrollX + rect.width / 2}px; transform: translate(-50%, -100%);`;
            break;
          case 'bottom':
            tooltipStyle = `top: ${rect.bottom + scrollY + 20}px; left: ${rect.left + scrollX + rect.width / 2}px; transform: translateX(-50%);`;
            break;
          case 'left':
            tooltipStyle = `top: ${rect.top + scrollY + rect.height / 2}px; left: ${rect.left + scrollX - 20}px; transform: translate(-100%, -50%);`;
            break;
          case 'right':
            tooltipStyle = `top: ${rect.top + scrollY + rect.height / 2}px; left: ${rect.right + scrollX + 20}px; transform: translateY(-50%);`;
            break;
          default:
            tooltipStyle = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
        }
      } else {
        // Target not found, center it
        tooltipStyle = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
      }
    } else {
      tooltipStyle = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
    }
    
    tooltip.style.cssText = tooltipStyle;
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <h3>${step.title}</h3>
        <button class="tooltip-close" onclick="OnboardingTutorial.skip()">×</button>
      </div>
      <div class="tooltip-content">
        <p>${step.content}</p>
      </div>
      <div class="tooltip-footer">
        <div class="tooltip-progress">
          ${stepIndex + 1} / ${this.steps.length}
        </div>
        <div class="tooltip-actions">
          ${stepIndex > 0 ? '<button class="tooltip-btn tooltip-btn-secondary" onclick="OnboardingTutorial.previous()">Previous</button>' : ''}
          <button class="tooltip-btn tooltip-btn-primary" onclick="OnboardingTutorial.next()">
            ${stepIndex === this.steps.length - 1 ? 'Get Started!' : 'Next'}
          </button>
        </div>
      </div>
    `;
    
    overlay.appendChild(tooltip);
    document.body.appendChild(overlay);
    
    // Add CSS if not already added
    if (!document.getElementById('onboarding-styles')) {
      const style = document.createElement('style');
      style.id = 'onboarding-styles';
      style.textContent = `
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999997;
          pointer-events: none;
        }
        
        .onboarding-highlight {
          pointer-events: none;
        }
        
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(102, 126, 234, 0.5); }
          50% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px rgba(102, 126, 234, 0.8); }
        }
        
        .onboarding-tooltip {
          position: fixed;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          min-width: 300px;
          z-index: 999999;
          pointer-events: all;
          animation: fadeInTooltip 0.3s ease-out;
        }
        
        @keyframes fadeInTooltip {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        .tooltip-header {
          padding: 20px 20px 12px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .tooltip-header h3 {
          margin: 0;
          font-size: 20px;
          color: #333;
          font-weight: 600;
        }
        
        .tooltip-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .tooltip-close:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        .tooltip-content {
          padding: 20px;
        }
        
        .tooltip-content p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-size: 15px;
        }
        
        .tooltip-footer {
          padding: 12px 20px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .tooltip-progress {
          font-size: 13px;
          color: #999;
          font-weight: 500;
        }
        
        .tooltip-actions {
          display: flex;
          gap: 8px;
        }
        
        .tooltip-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .tooltip-btn-primary {
          background: #667eea;
          color: white;
        }
        
        .tooltip-btn-primary:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }
        
        .tooltip-btn-secondary {
          background: #f5f5f5;
          color: #666;
        }
        
        .tooltip-btn-secondary:hover {
          background: #e0e0e0;
        }
      `;
      document.head.appendChild(style);
    }
  },
  
  // Next step
  next: function() {
    this.currentStep++;
    this.showStep(this.currentStep);
  },
  
  // Previous step
  previous: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  },
  
  // Skip onboarding
  skip: function() {
    this.complete();
  },
  
  // Complete onboarding
  complete: function() {
    this.removeOverlay();
    this.isActive = false;
    
    const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
    if (user) {
      localStorage.setItem(`vixyra_onboarding_${user.id}`, 'true');
    }
    
    if (typeof Notifications !== 'undefined') {
      Notifications.success('Onboarding complete! Start creating amazing designs! 🎨');
    }
  },
  
  // Remove overlay
  removeOverlay: function() {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  },
  
  // Reset onboarding (for testing)
  reset: function() {
    const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
    if (user) {
      localStorage.removeItem(`vixyra_onboarding_${user.id}`);
    }
    this.currentStep = 0;
    this.isActive = false;
  }
};

// Export
if (typeof window !== 'undefined') {
  window.OnboardingTutorial = OnboardingTutorial;
}

