// Vixyra UI Helpers - Better Error Messages, Loading States, and Animations

// ==================== ENHANCED ERROR MESSAGES ====================
const ErrorMessages = {
  // User-friendly error messages
  messages: {
    // Authentication errors
    'EMAIL_EXISTS': 'This email is already registered. Please sign in or use a different email.',
    'INVALID_EMAIL': 'Please enter a valid email address.',
    'EMAIL_NOT_VERIFIED': 'Please verify your email address first.',
    'INVALID_PASSWORD': 'Password must be at least 6 characters long.',
    'PASSWORDS_DONT_MATCH': 'Passwords do not match. Please try again.',
    'INVALID_CREDENTIALS': 'Invalid email or password. Please check and try again.',
    'ACCOUNT_NOT_FOUND': 'No account found with this email address.',
    'VERIFICATION_EXPIRED': 'Verification code has expired. Please request a new one.',
    'INVALID_CODE': 'Invalid verification code. Please check and try again.',
    'TOO_MANY_ATTEMPTS': 'Too many attempts. Please request a new verification code.',
    
    // Network errors
    'NETWORK_ERROR': 'Network error. Please check your internet connection and try again.',
    'SERVER_ERROR': 'Server error. Please try again in a moment.',
    'TIMEOUT': 'Request timed out. Please try again.',
    
    // Project errors
    'PROJECT_NOT_FOUND': 'Project not found.',
    'PROJECT_SAVE_FAILED': 'Failed to save project. Please try again.',
    'PROJECT_LOAD_FAILED': 'Failed to load project. Please try again.',
    'PROJECT_DELETE_FAILED': 'Failed to delete project. Please try again.',
    
    // General errors
    'REQUIRED_FIELD': 'This field is required.',
    'GENERIC_ERROR': 'Something went wrong. Please try again.',
    'UNAUTHORIZED': 'You need to be logged in to perform this action.',
    'FORBIDDEN': 'You don\'t have permission to perform this action.'
  },
  
  // Get user-friendly error message
  getMessage: function(errorKey, defaultMessage = null) {
    return this.messages[errorKey] || defaultMessage || 'An error occurred. Please try again.';
  },
  
  // Parse error and return user-friendly message
  parse: function(error) {
    if (!error) return this.getMessage('GENERIC_ERROR');
    
    const errorStr = error.toString().toLowerCase();
    const errorMessage = error.message || error.toString();
    
    // Check for specific error patterns
    if (errorStr.includes('email') && errorStr.includes('already') || errorStr.includes('exists')) {
      return this.getMessage('EMAIL_EXISTS');
    }
    if (errorStr.includes('network') || errorStr.includes('fetch')) {
      return this.getMessage('NETWORK_ERROR');
    }
    if (errorStr.includes('timeout')) {
      return this.getMessage('TIMEOUT');
    }
    if (errorStr.includes('unauthorized') || errorStr.includes('401')) {
      return this.getMessage('UNAUTHORIZED');
    }
    if (errorStr.includes('forbidden') || errorStr.includes('403')) {
      return this.getMessage('FORBIDDEN');
    }
    if (errorStr.includes('500') || errorStr.includes('server error')) {
      return this.getMessage('SERVER_ERROR');
    }
    
    // Return the error message if it's already user-friendly
    if (errorMessage.length < 100 && !errorMessage.includes('Error:') && !errorMessage.includes('at ')) {
      return errorMessage;
    }
    
    // Default to generic error
    return this.getMessage('GENERIC_ERROR');
  }
};

// ==================== LOADING STATES ====================
const LoadingStates = {
  // Show loading spinner
  show: function(element, text = 'Loading...') {
    if (!element) return;
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'vixyra-loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="vixyra-loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="vixyra-loading-text">${text}</div>
    `;
    
    // Store original content
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }
    element.dataset.loadingOverlay = 'true';
    
    // Add to element
    element.style.position = 'relative';
    element.appendChild(loadingOverlay);
    element.style.pointerEvents = 'none';
    element.style.opacity = '0.7';
  },
  
  // Hide loading spinner
  hide: function(element) {
    if (!element) return;
    
    const overlay = element.querySelector('.vixyra-loading-overlay');
    if (overlay) {
      overlay.remove();
    }
    element.style.pointerEvents = '';
    element.style.opacity = '1';
  },
  
  // Show button loading state
  setButtonLoading: function(button, loadingText = 'Loading...') {
    if (!button) return;
    
    button.dataset.originalText = button.textContent || button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
      <span class="button-spinner"></span>
      ${loadingText}
    `;
    button.classList.add('loading');
  },
  
  // Remove button loading state
  removeButtonLoading: function(button) {
    if (!button) return;
    
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Submit';
    button.classList.remove('loading');
  },
  
  // Show page loading
  showPageLoading: function(text = 'Loading...') {
    const loader = document.createElement('div');
    loader.id = 'vixyra-page-loader';
    loader.innerHTML = `
      <div class="page-loader-content">
        <div class="page-loader-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="page-loader-text">${text}</div>
      </div>
    `;
    document.body.appendChild(loader);
  },
  
  // Hide page loading
  hidePageLoading: function() {
    const loader = document.getElementById('vixyra-page-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }
};

// ==================== ENHANCED NOTIFICATION SYSTEM ====================
const Notifications = {
  show: function(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `vixyra-notification vixyra-notification-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    const colors = {
      success: '#4caf50',
      error: '#ff4444',
      warning: '#ff9800',
      info: '#2196f3'
    };
    
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    notification.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  },
  
  success: function(message, duration) {
    this.show(message, 'success', duration);
  },
  
  error: function(message, duration) {
    this.show(message, 'error', duration || 7000);
  },
  
  warning: function(message, duration) {
    this.show(message, 'warning', duration);
  },
  
  info: function(message, duration) {
    this.show(message, 'info', duration);
  }
};

// ==================== CSS FOR LOADING & NOTIFICATIONS ====================
const uiHelpersStyle = document.createElement('style');
uiHelpersStyle.textContent = `
  /* Loading Spinner */
  .vixyra-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: inherit;
  }
  
  .vixyra-loading-spinner {
    position: relative;
    width: 50px;
    height: 50px;
  }
  
  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .spinner-ring:nth-child(1) { animation-delay: 0s; }
  .spinner-ring:nth-child(2) { animation-delay: 0.2s; opacity: 0.8; }
  .spinner-ring:nth-child(3) { animation-delay: 0.4s; opacity: 0.6; }
  .spinner-ring:nth-child(4) { animation-delay: 0.6s; opacity: 0.4; }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .vixyra-loading-text {
    margin-top: 16px;
    color: white;
    font-size: 14px;
    font-weight: 500;
  }
  
  /* Button Loading */
  .button-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  button.loading {
    cursor: not-allowed;
    opacity: 0.8;
  }
  
  /* Page Loader */
  #vixyra-page-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(102, 126, 234, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    transition: opacity 0.3s;
  }
  
  .page-loader-content {
    text-align: center;
    color: white;
  }
  
  .page-loader-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
  }
  
  .page-loader-text {
    font-size: 16px;
    font-weight: 500;
  }
  
  /* Notifications */
  .vixyra-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 100000;
    max-width: 400px;
    min-width: 300px;
    transform: translateX(120%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .vixyra-notification.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .notification-icon {
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .notification-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .notification-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }
  
  .notification-close:hover {
    opacity: 1;
  }
  
  /* Pulse animation for important elements */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  /* Fade in animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  /* Shake animation for errors */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .shake {
    animation: shake 0.5s;
  }
`;

document.head.appendChild(uiHelpersStyle);

// Export for use in other files
if (typeof window !== 'undefined') {
  window.ErrorMessages = ErrorMessages;
  window.LoadingStates = LoadingStates;
  window.Notifications = Notifications;
}

