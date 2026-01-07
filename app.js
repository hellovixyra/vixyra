function loadFabricJS() {
        const cdnUrls = [
          'https://cdn.jsdelivr.net/npm/fabric@4.6.0/dist/fabric.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.6.0/fabric.min.js',
          'https://unpkg.com/fabric@4.6.0/dist/fabric.min.js'
        ];
        
        function tryLoad(index) {
          if (index >= cdnUrls.length) {
            console.error('❌ All Fabric.js CDN attempts failed.');
            alert('Failed to load Fabric.js library. Please check your internet connection.');
            return;
          }
          
          const script = document.createElement('script');
          script.src = cdnUrls[index];
          script.onload = function() {
            console.log('✅ Fabric.js loaded successfully');
            setTimeout(function() {
              if (typeof window.initApp === 'function') {
                window.initApp();
              }
            }, 100);
          };
          script.onerror = function() {
            tryLoad(index + 1);
          };
          document.head.appendChild(script);
        }
        
        tryLoad(0);
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFabricJS);
      } else {
        loadFabricJS();
      }
    


// Vixyra - Create. Click. Wow. - Advanced Features
// Contact: hello.vixyra@gmail.com

// ==================== ERROR HANDLING UTILITIES ====================
const ErrorHandler = {
  showError: function(message, error = null) {
    console.error('❌ Error:', message, error);
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 100000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">⚠️</span>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">Error</div>
          <div style="font-size: 14px;">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  },
  
  showSuccess: function(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 100000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">✅</span>
        <div style="flex: 1; font-size: 14px;">${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  },
  
  safeExecute: function(fn, errorMessage = 'An error occurred') {
    try {
      return fn();
    } catch (error) {
      this.showError(errorMessage, error);
      return null;
    }
  },
  
  safeExecuteAsync: async function(fn, errorMessage = 'An error occurred') {
    try {
      return await fn();
    } catch (error) {
      this.showError(errorMessage, error);
      return null;
    }
  }
};

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==================== VERSION HISTORY & AUTO-SAVE ====================
let versionHistory = [];
let autoSaveInterval = null;
let lastSaveTime = null;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_VERSIONS = 50; // Maximum number of versions to keep

function saveVersion() {
  if (!canvas) return;
  
  try {
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      canvas: canvas.toJSON(),
      backgroundColor: backgroundColor,
      dimensions: { width: canvas.width, height: canvas.height },
      pages: JSON.parse(JSON.stringify(pages)),
      currentPage: currentPage
    };
    
    versionHistory.push(version);
    
    // Keep only last MAX_VERSIONS
    if (versionHistory.length > MAX_VERSIONS) {
      versionHistory.shift();
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('vixyra_versionHistory', JSON.stringify(versionHistory));
      lastSaveTime = new Date();
      updateAutoSaveIndicator();
    } catch (e) {
      console.warn('Could not save version history to localStorage:', e);
    }
  } catch (error) {
    ErrorHandler.showError('Failed to save version', error);
  }
}

function loadVersionHistory() {
  try {
    const stored = localStorage.getItem('vixyra_versionHistory');
    if (stored) {
      versionHistory = JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Could not load version history:', error);
    versionHistory = [];
  }
}

function startAutoSave() {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  
  autoSaveInterval = setInterval(() => {
    if (canvas) {
      saveVersion();
    }
  }, AUTO_SAVE_INTERVAL);
  
  // Save on page unload
  window.addEventListener('beforeunload', () => {
    if (canvas) {
      saveVersion();
    }
  });
}

function updateAutoSaveIndicator() {
  const indicator = document.getElementById('autoSaveIndicator');
  if (indicator && lastSaveTime) {
    const timeAgo = Math.floor((Date.now() - lastSaveTime.getTime()) / 1000);
    if (timeAgo < 60) {
      indicator.textContent = `Saved ${timeAgo}s ago`;
      indicator.style.color = '#4caf50';
    } else {
      indicator.textContent = `Saved ${Math.floor(timeAgo / 60)}m ago`;
      indicator.style.color = '#ff9800';
    }
  }
}

function restoreVersion(versionId) {
  const version = versionHistory.find(v => v.id === versionId);
  if (!version || !canvas) return;
  
  try {
    canvas.loadFromJSON(version.canvas, function() {
      canvas.renderAll();
      if (version.dimensions) {
        canvas.setWidth(version.dimensions.width);
        canvas.setHeight(version.dimensions.height);
      }
      if (version.backgroundColor) {
        backgroundColor = version.backgroundColor;
        canvas.backgroundColor = backgroundColor;
      }
      if (version.pages) {
        pages = version.pages;
        currentPage = version.currentPage || 0;
        updatePageDisplay();
      }
      updateLayersList();
      canvas.renderAll();
      ErrorHandler.showSuccess('Version restored successfully');
    });
  } catch (error) {
    ErrorHandler.showError('Failed to restore version', error);
  }
}

// ==================== CUSTOM FONTS SUPPORT ====================
let customFonts = [];
const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2';

// Popular Google Fonts
const availableGoogleFonts = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway',
  'Poppins', 'Playfair Display', 'Merriweather', 'Ubuntu', 'Dancing Script',
  'Pacifico', 'Bebas Neue', 'Crimson Text', 'Lora', 'Source Sans Pro'
];

function loadGoogleFont(fontFamily) {
  if (!availableGoogleFonts.includes(fontFamily)) return;
  
  const linkId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return; // Already loaded
  
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `${GOOGLE_FONTS_API}?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
  
  if (!customFonts.includes(fontFamily)) {
    customFonts.push(fontFamily);
  }
}

function loadAllGoogleFonts() {
  availableGoogleFonts.forEach(font => {
    loadGoogleFont(font);
  });
}

// Initialize
loadVersionHistory();
loadAllGoogleFonts();

// ==================== MAIN APPLICATION VARIABLES ====================
let canvas = null;
let backgroundColor = "#FDEFEF";
let fontSize = 24;
let color = "#000000";
let canvasScale = 1;
let backgroundImage = "";
let currentPage = 0;
let pages = []; // Array to store multiple pages
let history = []; // For undo/redo
let historyIndex = -1;
let shapeColor = "#667eea";
let strokeWidth = 2;
let isCropping = false;
let cropObject = null;
let shareableLink = null;

// Template Library with Categories
const templateLibrary = [
  {
    id: 1,
    name: "Business Card",
    category: "business",
    objects: [
      {
        type: "StaticText",
        text: "John Doe",
        left: 100,
        top: 100,
        fontSize: 32,
        fill: "#000000"
      },
      {
        type: "StaticText",
        text: "CEO, Company Name",
        left: 100,
        top: 150,
        fontSize: 18,
        fill: "#666666"
      }
    ],
    background: { value: "#ffffff" },
    dimensions: { width: 800, height: 450 }
  },
  {
    id: 2,
    name: "Social Media Post",
    category: "social",
    objects: [
      {
        type: "StaticText",
        text: "Amazing Offer!",
        left: 200,
        top: 150,
        fontSize: 48,
        fill: "#ffffff",
        fontWeight: "bold"
      }
    ],
    background: { value: "#667eea" },
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: 3,
    name: "Presentation Slide",
    category: "presentation",
    objects: [
      {
        type: "StaticText",
        text: "Title",
        left: 200,
        top: 100,
        fontSize: 56,
        fill: "#000000"
      },
      {
        type: "StaticText",
        text: "Subtitle",
        left: 200,
        top: 200,
        fontSize: 32,
        fill: "#666666"
      }
    ],
    background: { value: "#ffffff" },
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: 4,
    name: "Marketing Flyer",
    category: "marketing",
    objects: [
      {
        type: "StaticText",
        text: "SALE",
        left: 200,
        top: 150,
        fontSize: 72,
        fill: "#ff0000",
        fontWeight: "bold"
      },
      {
        type: "StaticText",
        text: "50% OFF",
        left: 200,
        top: 250,
        fontSize: 48,
        fill: "#000000"
      }
    ],
    background: { value: "#ffff00" },
    dimensions: { width: 800, height: 1200 }
  },
  {
    id: 5,
    name: "Instagram Story",
    category: "social",
    objects: [
      {
        type: "StaticText",
        text: "New Product Launch",
        left: 200,
        top: 200,
        fontSize: 36,
        fill: "#ffffff",
        fontWeight: "bold"
      }
    ],
    background: { value: "#667eea" },
    dimensions: { width: 1080, height: 1920 }
  }
];

// User-created templates (stored in localStorage)
let userTemplates = [];
function loadUserTemplates() {
  const stored = localStorage.getItem('vixyra_userTemplates');
  if (stored) {
    try {
      userTemplates = JSON.parse(stored);
    } catch (e) {
      userTemplates = [];
    }
  }
}
function saveUserTemplates() {
  localStorage.setItem('vixyra_userTemplates', JSON.stringify(userTemplates));
}
loadUserTemplates();

// Stock Images (using placeholder URLs - replace with actual API)
const stockImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300"
];

function initializeFabricClasses() {
  if (typeof fabric === 'undefined') return;
  if (fabric.StaticText) return;
  
  try {
    const StaticTextObject = fabric.util.createClass(fabric.Textbox, {
      type: 'StaticText',
      initialize: function(options) {
        const text = options.text || 'Default Text';
        const textOptions = {};
        for (let key in options) {
          if (key !== 'text') {
            textOptions[key] = options[key];
          }
        }
        this.callSuper('initialize', text, textOptions);
        return this;
      }
    });
    
    fabric.StaticText = StaticTextObject;
    fabric.StaticText.fromObject = function(object, callback) {
      return callback && callback(new fabric.StaticText(object));
    };
  } catch (error) {
    console.error('Error initializing StaticText:', error);
  }
  
  if (!fabric.StaticImage) {
    try {
      const StaticImageObject = fabric.util.createClass(fabric.Image, {
        type: 'StaticImage',
        initialize: function(element, options) {
          this.callSuper('initialize', element, options);
          return this;
        }
      });
      
      fabric.StaticImage = StaticImageObject;
      fabric.StaticImage.fromObject = function(object, callback) {
        fabric.util.loadImage(
          object.metadata.src,
          function(img) {
            return callback && callback(new fabric.StaticImage(img, object));
          },
          null,
          { crossOrigin: 'anonymous' }
        );
      };
    } catch (error) {
      console.error('Error initializing StaticImage:', error);
    }
  }
}

function loadImageFromURL(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = "Anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
  });
}

function saveToHistory() {
  if (!canvas) return;
  const json = JSON.stringify(canvas.toJSON());
  history = history.slice(0, historyIndex + 1);
  history.push(json);
  historyIndex = history.length - 1;
  if (history.length > 50) {
    history.shift();
    historyIndex--;
  }
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    canvas.loadFromJSON(history[historyIndex], function() {
      canvas.renderAll();
      updateLayersList();
    });
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    canvas.loadFromJSON(history[historyIndex], function() {
      canvas.renderAll();
      updateLayersList();
    });
  }
}

window.initApp = function initApp() {
  if (typeof fabric === 'undefined') {
    console.log('Waiting for Fabric.js...');
    setTimeout(initApp, 200);
    return;
  }
  
  const canvasElement = document.getElementById('canvas');
  if (!canvasElement) {
    console.error('Canvas element not found');
    setTimeout(initApp, 200);
    return;
  }

  const container = document.querySelector('.canvas-area');
  if (!container) {
    console.error('Canvas container not found');
    setTimeout(initApp, 200);
    return;
  }
  
  const containerHeight = container.clientHeight || 600;
  const containerWidth = container.clientWidth || 800;

  try {
    initializeFabricClasses();
  } catch (error) {
    console.error('Error initializing Fabric classes:', error);
  }

  try {
    canvas = new fabric.Canvas('canvas', {
      backgroundColor: backgroundColor,
      height: containerHeight * 0.8,
      width: containerWidth * 0.8,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      stateful: true,
      imageSmoothingEnabled: true
    });
    
    // Performance optimizations for large canvases
    canvas.skipTargetFind = false;
    canvas.allowTouchScrolling = true;

    // Initialize pages array
    pages = [canvas.toJSON()];
    currentPage = 0;

    // Save initial state
    saveToHistory();

    // Optimized event handlers with debouncing
    let updateTimeout;
    function debouncedUpdate() {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        updateLayersList();
      }, 100);
    }

    // Listen to canvas changes
    canvas.on('object:added', function() {
      ErrorHandler.safeExecute(() => {
        saveToHistory();
        debouncedUpdate();
      }, 'Error handling object addition');
    });
    canvas.on('object:removed', function() {
      ErrorHandler.safeExecute(() => {
        saveToHistory();
        debouncedUpdate();
      }, 'Error handling object removal');
    });
    canvas.on('object:modified', function() {
      ErrorHandler.safeExecute(() => {
        saveToHistory();
        debouncedUpdate();
        // Auto-save on modification
        saveVersion();
      }, 'Error handling object modification');
    });
    canvas.on('selection:created', debouncedUpdate);
    canvas.on('selection:updated', debouncedUpdate);
    canvas.on('selection:cleared', debouncedUpdate);

    // Setup event listeners with error handling
    try {
      // Use event delegation for better reliability
      setupEventDelegation();
      setupEventListeners();
      setupSidebarNavigation();
      loadStockImages();
      loadTemplates();
      
      // Start auto-save
      startAutoSave();
      
      // Save initial version
      saveVersion();
      
      console.log('✅ Canvas initialized successfully');
      ErrorHandler.showSuccess('Vixyra ready! Create. Click. Wow.');
    } catch (error) {
      ErrorHandler.showError('Error setting up event listeners', error);
      // Try again with delegation only
      setTimeout(() => {
        ErrorHandler.safeExecute(() => setupEventDelegation(), 'Failed to setup event delegation');
      }, 500);
    }
  } catch (error) {
    ErrorHandler.showError('Error initializing canvas', error);
  }
};

// Event delegation - more reliable
function setupEventDelegation() {
  console.log('Setting up event delegation...');
  
  // Use document-level event delegation
  document.addEventListener('click', function(e) {
    const target = e.target;
    const id = target.id;
    const className = target.className;
    
    // Handle buttons by ID
    if (id === 'addTextBtn') {
      e.preventDefault();
      e.stopPropagation();
      console.log('Add text clicked');
      addText();
      return;
    }
    
    if (id === 'fileBtn') {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('fileModal')?.classList.add('active');
      return;
    }
    
    if (id === 'exportBtn') {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('exportModal')?.classList.add('active');
      return;
    }
    
    if (id === 'shareBtn') {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('shareModal')?.classList.add('active');
      return;
    }
    
    if (id === 'printBtn') {
      e.preventDefault();
      e.stopPropagation();
      showPrintPreview();
      return;
    }
    
    if (id === 'undoBtn') {
      e.preventDefault();
      e.stopPropagation();
      undo();
      return;
    }
    
    if (id === 'redoBtn') {
      e.preventDefault();
      e.stopPropagation();
      redo();
      return;
    }
    
    if (id === 'duplicateBtn') {
      e.preventDefault();
      e.stopPropagation();
      duplicateObject();
      return;
    }
    
    if (id === 'flipHorizontalBtn') {
      e.preventDefault();
      e.stopPropagation();
      flipHorizontal();
      return;
    }
    
    if (id === 'flipVerticalBtn') {
      e.preventDefault();
      e.stopPropagation();
      flipVertical();
      return;
    }
    
    if (id === 'cropBtn') {
      e.preventDefault();
      e.stopPropagation();
      startCrop();
      return;
    }
    
    // Handle shape buttons
    if (target.classList.contains('shape-button')) {
      e.preventDefault();
      e.stopPropagation();
      const shape = target.getAttribute('data-shape');
      if (shape) {
        console.log('Shape clicked:', shape);
        addShape(shape);
      }
      return;
    }
    
    // Handle animation presets
    if (target.classList.contains('animation-preset')) {
      e.preventDefault();
      e.stopPropagation();
      const animation = target.getAttribute('data-animation');
      if (animation) {
        applyAnimation(animation);
      }
      return;
    }
    
    // Handle sidebar items
    if (target.closest('.sidebar-item')) {
      const sidebarItem = target.closest('.sidebar-item');
      const panelId = sidebarItem.getAttribute('data-panel') + 'Panel';
      
      document.querySelectorAll('.sidebar-item').forEach(si => si.classList.remove('active'));
      sidebarItem.classList.add('active');
      
      document.querySelectorAll('.panel-area').forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      return;
    }
    
    // Handle modal closes
    if (target.classList.contains('modal-close') || target.id.includes('close')) {
      e.preventDefault();
      e.stopPropagation();
      const modal = target.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
      return;
    }
  });
  
  console.log('✅ Event delegation set up');
  
  // Test function - call from console to verify
  window.testClick = function() {
    console.log('Testing click functionality...');
    const btn = document.getElementById('addTextBtn');
    if (btn) {
      console.log('Button found:', btn);
      btn.click();
      console.log('Button clicked programmatically');
    } else {
      console.error('Button not found!');
    }
  };
}

function setupSidebarNavigation() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.panel-area');
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const panelId = this.getAttribute('data-panel') + 'Panel';
      
      sidebarItems.forEach(si => si.classList.remove('active'));
      this.classList.add('active');
      
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function loadStockImages() {
  const grid = document.getElementById('stockImagesGrid');
  if (!grid) return;
  
  stockImages.forEach((url, index) => {
    const item = document.createElement('div');
    item.className = 'stock-image-item';
    item.innerHTML = `<img src="${url}" alt="Stock ${index + 1}" loading="lazy" />`;
    item.addEventListener('click', () => {
      addStockImage(url);
    });
    grid.appendChild(item);
  });
}

function loadTemplates() {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const category = document.getElementById('templateCategory')?.value || 'all';
  const allTemplates = [...templateLibrary, ...userTemplates];
  const filtered = category === 'all' ? allTemplates : allTemplates.filter(t => t.category === category);
  
  filtered.forEach(template => {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.innerHTML = `
      <div class="template-preview">${template.name}</div>
      <div class="template-name">${template.name}</div>
      ${template.category === 'custom' ? '<div style="font-size: 10px; color: #888;">Custom</div>' : ''}
    `;
    item.addEventListener('click', () => {
      loadTemplate(template);
    });
    grid.appendChild(item);
  });
}

function updateLayersList() {
  if (!canvas) return;
  const layersList = document.getElementById('layersList');
  if (!layersList) return;
  
  layersList.innerHTML = '';
  const objects = canvas.getObjects();
  
  objects.reverse().forEach((obj, index) => {
    const actualIndex = objects.length - 1 - index;
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    if (canvas.getActiveObject() === obj) {
      layerItem.classList.add('active');
    }
    
    const type = obj.type || 'Object';
    const name = obj.text || obj.type || `Layer ${actualIndex + 1}`;
    
    layerItem.innerHTML = `
      <input type="checkbox" checked data-index="${actualIndex}" class="layer-visibility" />
      <span class="layer-item-name">${name.substring(0, 20)}</span>
      <div class="layer-controls">
        <button class="layer-up" data-index="${actualIndex}">↑</button>
        <button class="layer-down" data-index="${actualIndex}">↓</button>
        <button class="layer-delete" data-index="${actualIndex}">×</button>
      </div>
    `;
    
    layerItem.querySelector('.layer-visibility').addEventListener('change', function(e) {
      const idx = parseInt(this.getAttribute('data-index'));
      objects[idx].visible = e.target.checked;
      canvas.renderAll();
    });
    
    layerItem.querySelector('.layer-up').addEventListener('click', function(e) {
      e.stopPropagation();
      const idx = parseInt(this.getAttribute('data-index'));
      if (idx < objects.length - 1) {
        canvas.bringForward(objects[idx]);
        canvas.renderAll();
        updateLayersList();
      }
    });
    
    layerItem.querySelector('.layer-down').addEventListener('click', function(e) {
      e.stopPropagation();
      const idx = parseInt(this.getAttribute('data-index'));
      if (idx > 0) {
        canvas.sendBackwards(objects[idx]);
        canvas.renderAll();
        updateLayersList();
      }
    });
    
    layerItem.querySelector('.layer-delete').addEventListener('click', function(e) {
      e.stopPropagation();
      const idx = parseInt(this.getAttribute('data-index'));
      canvas.remove(objects[idx]);
      canvas.renderAll();
      updateLayersList();
    });
    
    layerItem.addEventListener('click', function() {
      canvas.setActiveObject(objects[actualIndex]);
      canvas.renderAll();
      updateLayersList();
    });
    
    layersList.appendChild(layerItem);
  });
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Text
  const addTextBtn = document.getElementById('addTextBtn');
  if (addTextBtn) {
    addTextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      addText();
    });
  } else {
    console.warn('addTextBtn not found');
  }
  document.getElementById('textColor')?.addEventListener('change', textColorChange);
  document.getElementById('textBgColor')?.addEventListener('change', textBgColorChange);
  document.getElementById('fontFamily')?.addEventListener('change', function(e) {
    ErrorHandler.safeExecute(() => {
      const fontFamily = e.target.value;
      loadGoogleFont(fontFamily);
      onFontFamilyChange(e);
    }, 'Failed to change font family');
  });
  document.getElementById('fontSize')?.addEventListener('input', onFontSize);
  document.getElementById('boldCheck')?.addEventListener('change', onBold);
  document.getElementById('italicCheck')?.addEventListener('change', onItalic);
  document.getElementById('underlineCheck')?.addEventListener('change', onUnderline);
  document.getElementById('linethroughCheck')?.addEventListener('change', onLinethrough);
  
  // Shapes
  document.querySelectorAll('.shape-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const shape = this.getAttribute('data-shape');
      if (shape) addShape(shape);
    });
  });
  document.getElementById('shapeColor')?.addEventListener('change', function(e) {
    shapeColor = e.target.value;
  });
  document.getElementById('strokeWidth')?.addEventListener('input', function(e) {
    strokeWidth = parseInt(e.target.value);
    document.getElementById('strokeWidthValue').textContent = strokeWidth;
  });
  
  // Elements
  const duplicateBtn = document.getElementById('duplicateBtn');
  if (duplicateBtn) {
    duplicateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      duplicateObject();
    });
  }
  
  const flipHorizontalBtn = document.getElementById('flipHorizontalBtn');
  if (flipHorizontalBtn) {
    flipHorizontalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      flipHorizontal();
    });
  }
  
  const flipVerticalBtn = document.getElementById('flipVerticalBtn');
  if (flipVerticalBtn) {
    flipVerticalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      flipVertical();
    });
  }
  
  const cropBtn = document.getElementById('cropBtn');
  if (cropBtn) {
    cropBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startCrop();
    });
  }
  document.getElementById('applyCropBtn')?.addEventListener('click', applyCrop);
  document.getElementById('cancelCropBtn')?.addEventListener('click', cancelCrop);
  
  // Image Filters
  document.getElementById('filterBlur')?.addEventListener('input', function(e) {
    document.getElementById('filterBlurValue').textContent = e.target.value;
    applyImageFilter('blur', parseFloat(e.target.value));
  });
  document.getElementById('filterBrightness')?.addEventListener('input', function(e) {
    document.getElementById('filterBrightnessValue').textContent = e.target.value + '%';
    applyImageFilter('brightness', parseInt(e.target.value) / 100);
  });
  document.getElementById('filterContrast')?.addEventListener('input', function(e) {
    document.getElementById('filterContrastValue').textContent = e.target.value + '%';
    applyImageFilter('contrast', parseInt(e.target.value) / 100);
  });
  document.getElementById('filterSaturation')?.addEventListener('input', function(e) {
    document.getElementById('filterSaturationValue').textContent = e.target.value + '%';
    applyImageFilter('saturation', parseInt(e.target.value) / 100);
  });
  document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);
  document.getElementById('removeBgBtn2')?.addEventListener('click', removeImageBackground);
  
  // Templates
  document.getElementById('templateCategory')?.addEventListener('change', loadTemplates);
  document.getElementById('saveAsTemplateBtn')?.addEventListener('click', saveAsTemplate);
  
  // Background
  document.getElementById('addBgImageBtn')?.addEventListener('click', () => {
    addBackground('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg');
  });
  document.getElementById('removeBgBtn')?.addEventListener('click', removeBackground);
  
  // Uploads
  document.getElementById('imageUpload')?.addEventListener('change', onImageChange);
  
  // Tools
  document.getElementById('zoomSelect')?.addEventListener('change', zoomToPercent);
  document.getElementById('zoomSelectBottom')?.addEventListener('change', zoomToPercent);
  document.getElementById('zoomInBtn')?.addEventListener('click', zoomIn);
  document.getElementById('zoomOutBtn')?.addEventListener('click', zoomOut);
  document.getElementById('applyDimensionsBtn')?.addEventListener('click', applyDimensions);
  
  // Animation
  document.querySelectorAll('.animation-preset').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const animation = this.getAttribute('data-animation');
      if (animation) applyAnimation(animation);
    });
  });
  
  console.log('✅ Event listeners set up');
  
  // Top bar
  const fileBtn = document.getElementById('fileBtn');
  if (fileBtn) {
    fileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('fileModal');
      if (modal) modal.classList.add('active');
    });
  }
  
  const resizeBtn = document.getElementById('resizeBtn');
  if (resizeBtn) {
    resizeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const toolsPanel = document.getElementById('toolsPanel');
      const toolsSidebar = document.querySelector('[data-panel="tools"]');
      if (toolsPanel) toolsPanel.classList.add('active');
      if (toolsSidebar) toolsSidebar.classList.add('active');
    });
  }
  
  const undoBtn = document.getElementById('undoBtn');
  if (undoBtn) {
    undoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      undo();
    });
  }
  
  const redoBtn = document.getElementById('redoBtn');
  if (redoBtn) {
    redoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      redo();
    });
  }
  
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('exportModal');
      if (modal) modal.classList.add('active');
    });
  }
  
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('shareModal');
      if (modal) modal.classList.add('active');
    });
  }
  
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showPrintPreview();
    });
  }
  document.getElementById('printConfirmBtn')?.addEventListener('click', printDesign);
  document.getElementById('printCancelBtn')?.addEventListener('click', () => {
    document.getElementById('printModal').classList.remove('active');
  });
  document.getElementById('closePrintModal')?.addEventListener('click', () => {
    document.getElementById('printModal').classList.remove('active');
  });
  
  // Share modal
  document.getElementById('closeShareModal')?.addEventListener('click', () => {
    document.getElementById('shareModal').classList.remove('active');
  });
  document.getElementById('generateLinkBtn')?.addEventListener('click', generateShareableLink);
  document.getElementById('copyLinkBtn')?.addEventListener('click', copyShareableLink);
  document.getElementById('saveToCloudBtn')?.addEventListener('click', saveToCloud);
  document.getElementById('loadFromCloudBtn')?.addEventListener('click', loadFromCloud);
  
  // Export enhancements
  document.getElementById('exportToCloudBtn')?.addEventListener('click', exportToCloud);
  
  // Modals - close on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });
  
  // Modals
  const closeExportModal = document.getElementById('closeExportModal');
  if (closeExportModal) {
    closeExportModal.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('exportModal')?.classList.remove('active');
    });
  }
  
  const closeFileModal = document.getElementById('closeFileModal');
  if (closeFileModal) {
    closeFileModal.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('fileModal')?.classList.remove('active');
    });
  }
  
  const closeCropModal = document.getElementById('closeCropModal');
  if (closeCropModal) {
    closeCropModal.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('cropModal')?.classList.remove('active');
      cancelCrop();
    });
  }
  document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
    ErrorHandler.safeExecute(() => saveProject(), 'Failed to save project');
  });
  document.getElementById('loadProjectBtn')?.addEventListener('click', () => {
    document.getElementById('loadProjectInput').click();
  });
  document.getElementById('loadProjectInput')?.addEventListener('change', (e) => {
    ErrorHandler.safeExecute(() => loadProject(e), 'Failed to load project');
  });
  document.getElementById('confirmExportBtn')?.addEventListener('click', () => {
    ErrorHandler.safeExecute(() => exportDesign(), 'Failed to export design');
  });
  document.getElementById('versionHistoryBtn')?.addEventListener('click', () => {
    showVersionHistory();
  });
  document.getElementById('closeVersionHistoryModal')?.addEventListener('click', () => {
    document.getElementById('versionHistoryModal')?.classList.remove('active');
  });
  
  // Pages
  document.getElementById('addPageBtn')?.addEventListener('click', addPage);
  document.getElementById('prevPageBtn')?.addEventListener('click', prevPage);
  document.getElementById('nextPageBtn')?.addEventListener('click', nextPage);
  
  // Canvas background color
  const canvasBgColorInput = document.createElement('input');
  canvasBgColorInput.type = 'color';
  canvasBgColorInput.value = backgroundColor;
  canvasBgColorInput.addEventListener('change', function(e) {
    onColorChange({ hex: e.target.value });
  });
  const colorPickerDiv = document.getElementById('colorPicker');
  if (colorPickerDiv) {
    colorPickerDiv.appendChild(canvasBgColorInput);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete' || event.keyCode === 46) {
      deleteActiveObject();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    }
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      redo();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      duplicateObject();
    }
  });
}

function addText() {
  return ErrorHandler.safeExecute(() => {
    if (!canvas) {
      ErrorHandler.showError('Canvas is not ready. Please wait...');
      return;
    }
    const fontFamily = document.getElementById('fontFamily')?.value || 'Arial';
    loadGoogleFont(fontFamily);
    const text = new fabric.IText('Tap and Type', {
      fontFamily: fontFamily,
      fill: color,
      fontSize: fontSize,
      padding: 5,
      left: 100,
      top: 100
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    updateLayersList();
  }, 'Failed to add text');
}

function addShape(shapeType) {
  return ErrorHandler.safeExecute(() => {
    if (!canvas) {
      ErrorHandler.showError('Canvas is not ready');
      return;
    }
    let shape;
    const left = 200;
    const top = 200;
    
    switch(shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: left,
          top: top,
          width: 150,
          height: 100,
          fill: shapeColor,
          stroke: shapeColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: left,
          top: top,
          radius: 50,
          fill: shapeColor,
          stroke: shapeColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'line':
        shape = new fabric.Line([left, top, left + 100, top], {
          stroke: shapeColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'arrow':
        const arrowPath = 'M 0 0 L 80 0 L 70 -10 M 80 0 L 70 10';
        shape = new fabric.Path(arrowPath, {
          left: left,
          top: top,
          stroke: shapeColor,
          strokeWidth: strokeWidth,
          fill: ''
        });
        break;
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      updateLayersList();
    }
  }, 'Failed to add shape');
}

function duplicateObject() {
  return ErrorHandler.safeExecute(() => {
    if (!canvas) {
      ErrorHandler.showError('Canvas is not ready');
      return;
    }
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.clone(function(cloned) {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        updateLayersList();
      });
    } else {
      ErrorHandler.showError('Please select an object to duplicate');
    }
  }, 'Failed to duplicate object');
}

function addStockImage(url) {
  if (!canvas) return;
  fabric.Image.fromURL(url, function(img) {
    img.set({
      left: 200,
      top: 200,
      scaleX: 0.3,
      scaleY: 0.3
    });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
    updateLayersList();
  }, { crossOrigin: 'anonymous' });
}

function loadTemplate(template) {
  if (!canvas) return;
  canvas.clear();
  
  if (template.dimensions) {
    canvas.setWidth(template.dimensions.width);
    canvas.setHeight(template.dimensions.height);
  }
  
  if (template.background) {
    canvas.backgroundColor = template.background.value;
  }
  
  template.objects.forEach(obj => {
    if (obj.type === 'StaticText') {
      const text = new fabric.IText(obj.text || 'Text', {
        left: obj.left || 100,
        top: obj.top || 100,
        fontSize: obj.fontSize || 24,
        fill: obj.fill || '#000000',
        fontWeight: obj.fontWeight || 'normal',
        fontFamily: obj.fontFamily || 'arial'
      });
      canvas.add(text);
    }
  });
  
  canvas.renderAll();
  updateLayersList();
}

function textColorChange(e) {
  if (!canvas) return;
  color = e.target.value;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fill', color);
    canvas.renderAll();
  }
}

function textBgColorChange(e) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('backgroundColor', e.target.value);
    canvas.renderAll();
  }
}

function onFontSize(e) {
  if (!canvas) return;
  fontSize = parseInt(e.target.value);
  document.getElementById('fontSizeValue').textContent = fontSize;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fontSize', fontSize);
    canvas.renderAll();
  }
}

function onBold(e) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fontWeight', e.target.checked ? 'bold' : '');
    canvas.renderAll();
  }
}

function onItalic(e) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fontStyle', e.target.checked ? 'italic' : '');
    canvas.renderAll();
  }
}

function onUnderline(e) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('underline', e.target.checked);
    canvas.renderAll();
  }
}

function onLinethrough(e) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('linethrough', e.target.checked);
    canvas.renderAll();
  }
}

function onFontFamilyChange(e) {
  if (!canvas) return;
  const fontFamily = e.target.value;
  loadGoogleFont(fontFamily);
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fontFamily', fontFamily);
    canvas.renderAll();
  }
}

function showVersionHistory() {
  const modal = document.getElementById('versionHistoryModal');
  const list = document.getElementById('versionHistoryList');
  if (!modal || !list) return;
  
  list.innerHTML = '';
  
  if (versionHistory.length === 0) {
    list.innerHTML = '<p style="color: #b3b3b3; text-align: center; padding: 20px;">No version history available yet.</p>';
    modal.classList.add('active');
    return;
  }
  
  // Sort by timestamp (newest first)
  const sortedVersions = [...versionHistory].sort((a, b) => b.id - a.id);
  
  sortedVersions.forEach(version => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px;
      background: #3d3d3d;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    item.onmouseover = () => item.style.background = '#4d4d4d';
    item.onmouseout = () => item.style.background = '#3d3d3d';
    
    const date = new Date(version.timestamp);
    const timeStr = date.toLocaleString();
    
    item.innerHTML = `
      <div>
        <div style="font-size: 14px; font-weight: 500;">Version ${sortedVersions.indexOf(version) + 1}</div>
        <div style="font-size: 12px; color: #b3b3b3; margin-top: 4px;">${timeStr}</div>
      </div>
      <button class="panel-button secondary" style="padding: 6px 12px; margin: 0;">Restore</button>
    `;
    
    item.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      restoreVersion(version.id);
      modal.classList.remove('active');
    });
    
    item.addEventListener('click', () => {
      restoreVersion(version.id);
      modal.classList.remove('active');
    });
    
    list.appendChild(item);
  });
  
  modal.classList.add('active');
}

function onFontFamilyChange(e) {
  if (!canvas) return;
  const fontFamily = e.target.value;
  loadGoogleFont(fontFamily);
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type && activeObject.type.includes('text')) {
    activeObject.set('fontFamily', fontFamily);
    canvas.renderAll();
  }
}

function flipHorizontal() {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set('flipX', !activeObject.flipX);
    canvas.renderAll();
  }
}

function flipVertical() {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set('flipY', !activeObject.flipY);
    canvas.renderAll();
  }
}

function startCrop() {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    isCropping = true;
    cropObject = activeObject;
    document.getElementById('cropModal').classList.add('active');
    // Enable crop mode (Fabric.js has built-in crop functionality)
    canvas.setActiveObject(activeObject);
    canvas.renderAll();
  } else {
    alert('Please select an image to crop.');
  }
}

function applyCrop() {
  if (!canvas || !cropObject) return;
  // Fabric.js doesn't have built-in crop, so we'll use a workaround
  // For a full implementation, you'd need to use canvas clipping or image manipulation
  isCropping = false;
  cropObject = null;
  document.getElementById('cropModal').classList.remove('active');
  canvas.renderAll();
}

function cancelCrop() {
  isCropping = false;
  cropObject = null;
  document.getElementById('cropModal').classList.remove('active');
}

function applyImageFilter(filterType, value) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== 'image') return;
  
  // Apply CSS filters (basic implementation)
  const filters = activeObject.filters || [];
  let filter = null;
  
  switch(filterType) {
    case 'blur':
      filter = new fabric.Image.filters.Blur({ blur: value });
      break;
    case 'brightness':
      filter = new fabric.Image.filters.Brightness({ brightness: value - 1 });
      break;
    case 'contrast':
      filter = new fabric.Image.filters.Contrast({ contrast: value - 1 });
      break;
    case 'saturation':
      filter = new fabric.Image.filters.Saturation({ saturation: value - 1 });
      break;
  }
  
  if (filter) {
    // Remove existing filter of same type
    activeObject.filters = filters.filter(f => f.type !== filterType);
    activeObject.filters.push(filter);
    activeObject.applyFilters();
    canvas.renderAll();
  }
}

function resetFilters() {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    activeObject.filters = [];
    activeObject.applyFilters();
    canvas.renderAll();
    
    // Reset UI
    document.getElementById('filterBlur').value = 0;
    document.getElementById('filterBlurValue').textContent = '0';
    document.getElementById('filterBrightness').value = 100;
    document.getElementById('filterBrightnessValue').textContent = '100%';
    document.getElementById('filterContrast').value = 100;
    document.getElementById('filterContrastValue').textContent = '100%';
    document.getElementById('filterSaturation').value = 100;
    document.getElementById('filterSaturationValue').textContent = '100%';
  }
}

function removeImageBackground() {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    // Basic background removal using chroma key (simplified)
    // For production, use a proper background removal API or library
    alert('Background removal requires advanced image processing. This is a placeholder for the feature.');
  } else {
    alert('Please select an image to remove background.');
  }
}

function saveAsTemplate() {
  if (!canvas) return;
  const name = prompt('Enter template name:');
  if (!name) return;
  
  const template = {
    id: Date.now(),
    name: name,
    category: 'custom',
    objects: canvas.toJSON().objects,
    background: { value: canvas.backgroundColor || backgroundColor },
    dimensions: { width: canvas.width, height: canvas.height }
  };
  
  userTemplates.push(template);
  saveUserTemplates();
  loadTemplates();
  alert('Template saved!');
}

function generateShareableLink() {
  if (!canvas) return;
  const projectData = {
    canvas: canvas.toJSON(),
    backgroundColor: backgroundColor,
    dimensions: { width: canvas.width, height: canvas.height }
  };
  
  // Encode data as base64 URL parameter
  const encoded = btoa(JSON.stringify(projectData));
  shareableLink = window.location.origin + window.location.pathname + '?share=' + encoded;
  
  document.getElementById('shareLink').value = shareableLink;
  alert('Shareable link generated!');
}

function copyShareableLink() {
  const linkInput = document.getElementById('shareLink');
  if (linkInput && linkInput.value) {
    linkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
  }
}

function saveToCloud() {
  if (!canvas) return;
  // Simulate cloud storage (in production, use actual cloud storage API)
  const projectData = {
    canvas: canvas.toJSON(),
    backgroundColor: backgroundColor,
    dimensions: { width: canvas.width, height: canvas.height },
    timestamp: new Date().toISOString()
  };
  
  // Store in localStorage as "cloud" storage
  const cloudProjects = JSON.parse(localStorage.getItem('vixyra_cloudProjects') || '[]');
  cloudProjects.push(projectData);
  localStorage.setItem('vixyra_cloudProjects', JSON.stringify(cloudProjects));
  
  alert('Project saved to cloud!');
}

function loadFromCloud() {
  const cloudProjects = JSON.parse(localStorage.getItem('vixyra_cloudProjects') || '[]');
  if (cloudProjects.length === 0) {
    alert('No projects in cloud storage.');
    return;
  }
  
  // Show list of projects (simplified - in production, show a proper UI)
  const projectList = cloudProjects.map((p, i) => `${i + 1}. ${new Date(p.timestamp).toLocaleString()}`).join('\n');
  const index = prompt(`Select project (1-${cloudProjects.length}):\n${projectList}`);
  const projectIndex = parseInt(index) - 1;
  
  if (projectIndex >= 0 && projectIndex < cloudProjects.length) {
    const projectData = cloudProjects[projectIndex];
    if (projectData.canvas && canvas) {
      canvas.loadFromJSON(projectData.canvas, function() {
        canvas.renderAll();
        if (projectData.dimensions) {
          canvas.setWidth(projectData.dimensions.width);
          canvas.setHeight(projectData.dimensions.height);
        }
        if (projectData.backgroundColor) {
          backgroundColor = projectData.backgroundColor;
          canvas.backgroundColor = backgroundColor;
        }
        updateLayersList();
        canvas.renderAll();
      });
    }
  }
}

function exportToCloud() {
  exportDesign();
  saveToCloud();
}

function showPrintPreview() {
  if (!canvas) return;
  const preview = document.getElementById('printPreview');
  if (!preview) return;
  
  const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
  preview.innerHTML = `<img src="${dataURL}" style="max-width: 100%; height: auto;" />`;
  document.getElementById('printModal').classList.add('active');
}

function printDesign() {
  const preview = document.getElementById('printPreview');
  if (!preview) return;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = '<html><head><title>Vixyra - Print Design</title><link rel="icon" href="logo.svg" type="image/svg+xml" /><style>body { margin: 0; padding: 20px; } img { max-width: 100%; height: auto; }</style></head><body>' + preview.innerHTML + '</body></html>';
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
  document.getElementById('printModal').classList.remove('active');
}

function addBackground(url) {
  if (!canvas) return;
  removeBackground();
  fabric.Image.fromURL(url, function(img) {
    if (canvas) {
      canvas.setBackgroundImage(img, function() {
        canvas.renderAll();
      }, {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
    }
  }, { crossOrigin: 'anonymous' });
  backgroundImage = url;
}

function removeBackground() {
  if (!canvas) return;
  backgroundImage = '';
  if (canvas.backgroundImage) {
    canvas.setBackgroundImage(null);
    canvas.renderAll();
  }
}

function onColorChange(colorObj) {
  if (!canvas) return;
  removeBackground();
  backgroundColor = colorObj.hex;
  canvas.backgroundColor = backgroundColor;
  canvas.renderAll();
} // End of onColorChange function

function onImageChange(e) {
  if (!canvas) return;
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  fabric.Image.fromURL(url, function(img) {
    canvas.add(img);
    canvas.renderAll();
    updateLayersList();
  }, { scaleX: 0.15, scaleY: 0.15 });
}

function deleteActiveObject() {
  if (!canvas) return;
  const activeObjects = canvas.getActiveObjects();
  activeObjects.forEach(function(object) {
    canvas.remove(object);
  });
  canvas.renderAll();
  updateLayersList();
}

function applyDimensions() {
  if (!canvas) return;
  const width = parseInt(document.getElementById('canvasWidth').value);
  const height = parseInt(document.getElementById('canvasHeight').value);
  
  if (width && height && width > 0 && height > 0) {
    const scaleX = width / canvas.width;
    const scaleY = height / canvas.height;
    
    canvas.setWidth(width);
    canvas.setHeight(height);
    
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      obj.scaleX = obj.scaleX * scaleX;
      obj.scaleY = obj.scaleY * scaleY;
      obj.left = obj.left * scaleX;
      obj.top = obj.top * scaleY;
      obj.setCoords();
    });
    
    canvas.renderAll();
    updateLayersList();
  }
}

function exportDesign() {
  if (!canvas) return;
  
  const exportType = document.getElementById('exportType')?.value || 'single';
  const format = document.getElementById('exportFormat').value;
  const quality = parseFloat(document.getElementById('exportQuality').value);
  const exportWidth = document.getElementById('exportWidth').value;
  const exportHeight = document.getElementById('exportHeight').value;
  const transparentBg = document.getElementById('transparentBg')?.checked || false;
  
  if (exportType === 'all' || exportType === 'zip') {
    exportAllPages(format, quality, exportWidth, exportHeight, transparentBg, exportType === 'zip');
    return;
  }
  
  let dataURL;
  let filename;
  let mimeType;
  
  // Handle transparent background for PNG
  const originalBg = canvas.backgroundColor;
  if (transparentBg && format === 'png') {
    canvas.backgroundColor = null;
  }
  
  if (format === 'svg') {
    dataURL = canvas.toSVG();
    filename = 'canvas-image.svg';
    mimeType = 'image/svg+xml';
  } else if (format === 'pdf') {
    // PDF export requires additional library, using canvas data URL as fallback
    dataURL = canvas.toDataURL({ format: 'png', quality: quality });
    filename = 'canvas-image.pdf';
    mimeType = 'application/pdf';
    alert('PDF export requires additional library. Exporting as PNG instead.');
  } else {
    const options = { format: format, quality: quality };
    if (exportWidth && exportHeight) {
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      canvas.setWidth(parseInt(exportWidth));
      canvas.setHeight(parseInt(exportHeight));
      dataURL = canvas.toDataURL(options);
      canvas.setWidth(originalWidth);
      canvas.setHeight(originalHeight);
      canvas.renderAll();
    } else {
      dataURL = canvas.toDataURL(options);
    }
    filename = `canvas-image.${format}`;
    mimeType = `image/${format}`;
  }
  
  // Restore background
  if (transparentBg && format === 'png') {
    canvas.backgroundColor = originalBg;
    canvas.renderAll();
  }
  
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  if (format !== 'svg') {
    link.href = dataURL;
  } else {
    const blob = new Blob([dataURL], { type: mimeType });
    link.href = URL.createObjectURL(blob);
  }
  link.click();
  
  document.getElementById('exportModal').classList.remove('active');
}

function exportAllPages(format, quality, width, height, transparentBg, asZip) {
  if (!canvas || pages.length === 0) return;
  
  const originalPage = currentPage;
  const originalBg = canvas.backgroundColor;
  const exports = [];
  let completed = 0;
  
  // Export each page
  pages.forEach((pageData, index) => {
    canvas.loadFromJSON(pageData, function() {
      canvas.renderAll();
      
      if (transparentBg && format === 'png') {
        canvas.backgroundColor = null;
      }
      
      let dataURL;
      if (format === 'svg') {
        dataURL = canvas.toSVG();
      } else {
        const options = { format: format, quality: quality };
        if (width && height) {
          const originalWidth = canvas.width;
          const originalHeight = canvas.height;
          canvas.setWidth(parseInt(width));
          canvas.setHeight(parseInt(height));
          dataURL = canvas.toDataURL(options);
          canvas.setWidth(originalWidth);
          canvas.setHeight(originalHeight);
        } else {
          dataURL = canvas.toDataURL(options);
        }
      }
      
      exports.push({
        dataURL: dataURL,
        filename: `page-${index + 1}.${format === 'svg' ? 'svg' : format}`
      });
      
      // Restore background
      if (transparentBg && format === 'png') {
        canvas.backgroundColor = originalBg;
      }
      
      completed++;
      
      // If all pages exported, create ZIP or download individually
      if (completed === pages.length) {
        if (asZip) {
          createZipExport(exports);
        } else {
          exports.forEach((exp, i) => {
            setTimeout(() => {
              const link = document.createElement('a');
              link.href = exp.dataURL;
              link.download = exp.filename;
              if (format === 'svg') {
                const blob = new Blob([exp.dataURL], { type: 'image/svg+xml' });
                link.href = URL.createObjectURL(blob);
              }
              link.click();
            }, i * 100);
          });
        }
        
        // Restore original page
        loadPage(originalPage);
        document.getElementById('exportModal').classList.remove('active');
      }
    });
  });
}

function createZipExport(exports) {
  // Use JSZip library if available, otherwise download individually
  if (typeof JSZip === 'undefined') {
    alert('ZIP export requires JSZip library. Downloading files individually.');
    exports.forEach((exp, i) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = exp.dataURL;
        link.download = exp.filename;
        link.click();
      }, i * 100);
    });
    return;
  }
  
  const zip = new JSZip();
  exports.forEach(exp => {
    if (exp.filename.endsWith('.svg')) {
      zip.file(exp.filename, exp.dataURL);
    } else {
      zip.file(exp.filename, exp.dataURL.split(',')[1], { base64: true });
    }
  });
  
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'canvas-export.zip';
    link.click();
  });
}

function saveProject() {
  if (!canvas) return;
  const projectData = {
    canvas: canvas.toJSON(),
    backgroundColor: backgroundColor,
    dimensions: {
      width: canvas.width,
      height: canvas.height
    },
    pages: pages,
    currentPage: currentPage,
    timestamp: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(projectData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'canvas-project.json';
  link.click();
  URL.revokeObjectURL(url);
  
  // Also save to localStorage
  localStorage.setItem('vixyra_lastProject', dataStr);
  document.getElementById('fileModal').classList.remove('active');
}

function loadProject() {
  const fileInput = document.getElementById('loadProjectInput');
  const file = fileInput.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const projectData = JSON.parse(e.target.result);
      if (projectData.canvas) {
        canvas.loadFromJSON(projectData.canvas, function() {
          canvas.renderAll();
          if (projectData.dimensions) {
            canvas.setWidth(projectData.dimensions.width);
            canvas.setHeight(projectData.dimensions.height);
          }
          if (projectData.backgroundColor) {
            backgroundColor = projectData.backgroundColor;
            canvas.backgroundColor = backgroundColor;
          }
          if (projectData.pages) {
            pages = projectData.pages;
            currentPage = projectData.currentPage || 0;
            updatePageDisplay();
          }
          saveToHistory();
          updateLayersList();
          canvas.renderAll();
        });
      }
    } catch (error) {
      alert('Error loading project: ' + error.message);
    }
  };
  reader.readAsText(file);
  document.getElementById('fileModal').classList.remove('active');
}

// Try to load last project from localStorage
function loadLastProject() {
  const lastProject = localStorage.getItem('vixyra_lastProject');
  if (lastProject) {
    try {
      const projectData = JSON.parse(lastProject);
      if (projectData.canvas && canvas) {
        canvas.loadFromJSON(projectData.canvas, function() {
          canvas.renderAll();
          updateLayersList();
        });
      }
    } catch (error) {
      console.error('Error loading last project:', error);
    }
  }
}

function addPage() {
  if (!canvas) return;
  // Save current page
  pages[currentPage] = canvas.toJSON();
  // Create new page
  const newPage = {
    objects: [],
    background: backgroundColor
  };
  pages.push(newPage);
  currentPage = pages.length - 1;
  // Load new page
  canvas.clear();
  canvas.backgroundColor = backgroundColor;
  canvas.renderAll();
  updatePageDisplay();
  saveToHistory();
}

function prevPage() {
  if (currentPage > 0) {
    pages[currentPage] = canvas.toJSON();
    currentPage--;
    loadPage(currentPage);
  }
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    pages[currentPage] = canvas.toJSON();
    currentPage++;
    loadPage(currentPage);
  }
}

function loadPage(pageIndex) {
  if (!canvas || pageIndex < 0 || pageIndex >= pages.length) return;
  const pageData = pages[pageIndex];
  if (pageData && pageData.objects) {
    canvas.loadFromJSON(pageData, function() {
      canvas.renderAll();
      updateLayersList();
    });
  } else {
    canvas.clear();
    canvas.backgroundColor = backgroundColor;
    canvas.renderAll();
  }
  updatePageDisplay();
}

function updatePageDisplay() {
  document.getElementById('currentPageDisplay').textContent = currentPage + 1;
  document.getElementById('pageCount').textContent = `Pages ${currentPage + 1}/${pages.length}`;
}

function applyAnimation(animationType) {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  
  // Remove existing animation
  if (activeObject.animate) {
    activeObject.animate = null;
  }
  
  switch(animationType) {
    case 'fade':
      activeObject.set('opacity', 0);
      canvas.renderAll();
      activeObject.animate('opacity', 1, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas)
      });
      break;
    case 'slide':
      const originalLeft = activeObject.left;
      activeObject.set('left', originalLeft - 100);
      canvas.renderAll();
      activeObject.animate('left', originalLeft, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas)
      });
      break;
    case 'bounce':
      const originalTop = activeObject.top;
      activeObject.set('top', originalTop - 50);
      canvas.renderAll();
      activeObject.animate('top', originalTop, {
        duration: 1000,
        easing: fabric.util.ease.easeOutBounce,
        onChange: canvas.renderAll.bind(canvas)
      });
      break;
    case 'none':
      activeObject.set('opacity', 1);
      canvas.renderAll();
      break;
  }
}

function zoomToPercent(event) {
  const percentage = Number(event.target.value) / 100;
  setCanvasSize(percentage);
}

function zoomIn() {
  if (canvasScale < 4) {
    const percentage = canvasScale + 0.25;
    setCanvasSize(percentage);
  }
}

function zoomOut() {
  if (canvasScale > 0.25) {
    const percentage = canvasScale - 0.25;
    setCanvasSize(percentage);
  }
}

function setCanvasSize(percentage) {
  if (!canvas) return;
  const oldHeight = canvas.getHeight();
  const oldWidth = canvas.getWidth();
  canvas.setHeight(oldHeight * (percentage / canvasScale));
  canvas.setWidth(oldWidth * (percentage / canvasScale));
  const objects = canvas.getObjects();
  for (let i = 0; i < objects.length; i++) {
    const scaleX = objects[i].scaleX;
    const scaleY = objects[i].scaleY;
    const left = objects[i].left;
    const top = objects[i].top;
    const tempScaleX = scaleX * (percentage / canvasScale);
    const tempScaleY = scaleY * (percentage / canvasScale);
    const tempLeft = left * (percentage / canvasScale);
    const tempTop = top * (percentage / canvasScale);
    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;
    objects[i].setCoords();
  }
  if (backgroundImage) {
    addBackground(backgroundImage);
  }
  canvasScale = percentage;
  const zoomSelect = document.getElementById('zoomSelect');
  const zoomSelectBottom = document.getElementById('zoomSelectBottom');
  if (zoomSelect) zoomSelect.value = Math.round(canvasScale * 100);
  if (zoomSelectBottom) zoomSelectBottom.value = Math.round(canvasScale * 100);
  canvas.renderAll();
}

// Load last project after initialization
setTimeout(loadLastProject, 500);

// Update auto-save indicator every 5 seconds
setInterval(() => {
  updateAutoSaveIndicator();
}, 5000);

// Check for shareable link in URL
function checkShareableLink() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareData = urlParams.get('share');
  if (shareData && canvas) {
    try {
      const projectData = JSON.parse(atob(shareData));
      if (projectData.canvas) {
        canvas.loadFromJSON(projectData.canvas, function() {
          canvas.renderAll();
          if (projectData.dimensions) {
            canvas.setWidth(projectData.dimensions.width);
            canvas.setHeight(projectData.dimensions.height);
          }
          if (projectData.backgroundColor) {
            backgroundColor = projectData.backgroundColor;
            canvas.backgroundColor = backgroundColor;
          }
          updateLayersList();
          canvas.renderAll();
        });
      }
    } catch (error) {
      console.error('Error loading shareable link:', error);
    }
  }
}

// Check for shareable link after canvas is ready
setTimeout(checkShareableLink, 1000);

// Debug: Check if canvas is ready
setInterval(function() {
  if (!canvas) {
    console.warn('Canvas not initialized yet...');
  }
}, 5000);

// Ensure all buttons are clickable on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking buttons...');
  const buttons = document.querySelectorAll('button, .panel-button, .sidebar-item, .shape-button, .animation-preset');
  console.log('Found', buttons.length, 'buttons');
  buttons.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    // Remove any inline styles that might block clicks
    btn.style.userSelect = 'none';
  });
  
  // Test click on body to ensure events work
  document.body.addEventListener('click', function(e) {
    console.log('Body click detected on:', e.target);
  }, true);
  
  // Force enable pointer events on all interactive elements
  const interactiveElements = document.querySelectorAll('button, a, input, select, .panel-button, .sidebar-item, .shape-button');
  interactiveElements.forEach(el => {
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
  });
  
  console.log('✅ All buttons enabled for clicks');
});

// Final validation check
window.addEventListener('load', function() {
  console.log('Page fully loaded');
  console.log('Canvas initialized:', !!canvas);
  console.log('Fabric.js available:', typeof fabric !== 'undefined');
  
  // Verify critical functions exist
  if (typeof addText === 'function') {
    console.log('✅ addText function available');
  } else {
    console.error('❌ addText function missing!');
  }
  
  if (typeof setupEventDelegation === 'function') {
    console.log('✅ setupEventDelegation function available');
  } else {
    console.error('❌ setupEventDelegation function missing!');
  }
});