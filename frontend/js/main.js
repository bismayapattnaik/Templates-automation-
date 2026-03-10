/**
 * Main application entry point
 * Phase 1: Foundation setup
 * Phase 2: API integration coming soon
 */

// State
const appState = {
  designInput: null,
  currentHtml: '',
  templateConfig: {
    sectionType: '',
    templateName: '',
    colorScheme: 4,
    companyVibe: '',
  },
  generatedOutput: null,
  isLoading: false,
};

// DOM Elements
const designScreenshot = document.getElementById('designScreenshot');
const designUrl = document.getElementById('designUrl');
const currentHtml = document.getElementById('currentHtml');
const sectionType = document.getElementById('sectionType');
const templateName = document.getElementById('templateName');
const colorScheme = document.getElementById('colorScheme');
const companyVibe = document.getElementById('companyVibe');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewFrame = document.getElementById('previewFrame');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const variablesCode = document.getElementById('variablesCode');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const copyButtons = document.querySelectorAll('.btn-copy');
const downloadBtn = document.getElementById('downloadBtn');
const validationContent = document.getElementById('validationContent');

// Initialize
function init() {
  setupEventListeners();
  logStartup();
}

// Event Listeners
function setupEventListeners() {
  // File upload
  designScreenshot.addEventListener('change', handleScreenshotUpload);

  // Form inputs
  currentHtml.addEventListener('input', (e) => {
    appState.currentHtml = e.target.value;
  });

  sectionType.addEventListener('change', (e) => {
    appState.templateConfig.sectionType = e.target.value;
  });

  templateName.addEventListener('change', (e) => {
    appState.templateConfig.templateName = e.target.value;
  });

  colorScheme.addEventListener('change', (e) => {
    appState.templateConfig.colorScheme = parseInt(e.target.value);
  });

  companyVibe.addEventListener('input', (e) => {
    appState.templateConfig.companyVibe = e.target.value;
  });

  // Form submission
  submitBtn.addEventListener('click', handleSubmit);

  // Tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
    });
  });

  // Copy to clipboard
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const elementId = e.target.dataset.copy;
      copyToClipboard(elementId);
    });
  });

  // Download
  downloadBtn.addEventListener('click', handleDownload);
}

// File upload handler
function handleScreenshotUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file
  const maxSize = 5242880; // 5MB
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    showError('File size exceeds 5MB limit');
    return;
  }

  if (!validTypes.includes(file.type)) {
    showError('Invalid file type. Only JPG, PNG, or WebP allowed.');
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = (event) => {
    appState.designInput = {
      type: 'screenshot',
      data: event.target.result,
    };
    showSuccess('Screenshot uploaded successfully');
    clearError();
  };
  reader.readAsDataURL(file);
}

// Form submission
async function handleSubmit() {
  clearMessages();

  // Validation
  const validation = validateForm();
  if (!validation.isValid) {
    showError(validation.message);
    return;
  }

  // Show loading state
  setLoading(true);

  try {
    // Call API (Phase 2: will be implemented)
    const response = await generateTemplate();

    if (response.success) {
      appState.generatedOutput = response.data;
      renderOutput(response.data);
      showSuccess('Template generated successfully!');
    } else {
      showError(response.error.message);
    }
  } catch (error) {
    showError(`Error: ${error.message}`);
    console.error('Generation error:', error);
  } finally {
    setLoading(false);
  }
}

// API call
async function generateTemplate() {
  // Phase 2: This will make actual API call
  // For now, return mock response
  return {
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message:
        'Template generation coming in Phase 2 (Claude API integration). Form validation is working!',
    },
  };
}

// Form validation
function validateForm() {
  if (!appState.designInput && !designUrl.value) {
    return {
      isValid: false,
      message: 'Please upload a screenshot or enter a URL',
    };
  }

  if (!appState.currentHtml) {
    return {
      isValid: false,
      message: 'Please paste your current template HTML',
    };
  }

  if (!sectionType.value) {
    return {
      isValid: false,
      message: 'Please select a section type',
    };
  }

  if (!templateName.value) {
    return {
      isValid: false,
      message: 'Please enter a template name',
    };
  }

  return { isValid: true };
}

// Render generated output
function renderOutput(data) {
  // HTML
  htmlCode.textContent = formatCode(data.html);

  // CSS
  cssCode.textContent = formatCode(data.css);

  // JavaScript
  jsCode.textContent = formatCode(data.js);

  // Variables
  variablesCode.textContent = JSON.stringify(data.variables, null, 2);

  // Validation
  renderValidation(data.validation);

  // Show code panel
  downloadBtn.style.display = 'block';

  // Render preview
  renderPreview(data.html, data.css);
}

// Format code for display
function formatCode(code) {
  return code.trim();
}

// Render validation report
function renderValidation(validation) {
  if (!validation) {
    validationContent.innerHTML = '<p class="placeholder-text">No validation data</p>';
    return;
  }

  let html = '';

  if (validation.passed) {
    html += '<div class="validation-item success"><div class="validation-title">✓ All validations passed!</div></div>';
  } else {
    html += '<div class="validation-item error"><div class="validation-title">✗ Validation failed</div></div>';
  }

  // SOP Results
  if (validation.sopResults) {
    Object.entries(validation.sopResults).forEach(([sopName, result]) => {
      const severity = result.passed ? 'success' : 'error';
      const icon = result.passed ? '✓' : '✗';
      html += `<div class="validation-item ${severity}">
        <div class="validation-title">${icon} ${sopName}</div>`;

      if (result.violations) {
        result.violations.forEach((v) => {
          html += `<div class="validation-message">
            <strong>${v.severity}:</strong> ${v.violation}
            ${v.suggestion ? `<br/>💡 ${v.suggestion}` : ''}
          </div>`;
        });
      }

      html += '</div>';
    });
  }

  validationContent.innerHTML = html;
}

// Render preview
function renderPreview(html, css) {
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  previewFrame.srcdoc = previewHtml;
  previewFrame.style.display = 'block';
  previewPlaceholder.style.display = 'none';
}

// Tab switching
function switchTab(tabName) {
  // Update buttons
  tabButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });

  // Update panes
  tabPanes.forEach((pane) => {
    pane.classList.remove('active');
    if (pane.id === `${tabName}-tab`) {
      pane.classList.add('active');
    }
  });
}

// Copy to clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;

  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Copied to clipboard!');
  });
}

// Download files
function handleDownload() {
  if (!appState.generatedOutput) return;

  const output = appState.generatedOutput;
  const timestamp = new Date().toISOString().split('T')[0];

  // Create files
  const files = {
    'template.html': output.html,
    'template.css': output.css,
    'template.js': output.js,
    'variables.json': JSON.stringify(output.variables, null, 2),
    'validation.json': JSON.stringify(output.validation, null, 2),
  };

  // Download each file
  Object.entries(files).forEach(([filename, content]) => {
    downloadFile(content, filename);
  });

  showSuccess('Files downloaded!');
}

// Download single file
function downloadFile(content, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Message display
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 3000);
}

function clearMessages() {
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}

function clearError() {
  errorMessage.style.display = 'none';
}

// Loading state
function setLoading(isLoading) {
  appState.isLoading = isLoading;
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  if (isLoading) {
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
  } else {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

// Startup logging
function logStartup() {
  console.log('%c🎨 Design to Template Automation', 'font-size: 16px; font-weight: bold; color: #1e4e79;');
  console.log('Phase 1: Foundation Setup ✓');
  console.log('Phase 2: Claude Integration - Coming Soon');
  console.log('Form validation working ✓');
  console.log('API endpoints ready ✓');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
