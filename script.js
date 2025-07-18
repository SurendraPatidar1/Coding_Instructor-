// All the previous JavaScript code remains the same, just updating some text references
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const clearBtn = document.getElementById('clearBtn');
const outputArea = document.getElementById('outputArea');
const loadingIndicator = document.getElementById('loadingIndicator');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const downloadBtn = document.getElementById('downloadBtn');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const historyContainer = document.getElementById('historyContainer');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const questionsCount = document.getElementById('questionsCount');

// Configuration
const GEMINI_API_KEY = "AIzaSyAlzOv8T5lIGKp1ObvREwjhp8eIrPwYzw4";
const MODEL_NAME = "gemini-1.5-flash";
const systemInstructionText = `You are a Professional Coding Mentor, Expert Developer, and Instructor.  
You specialize in solving coding problems, explaining code, and teaching concepts clearly.  

🎯 When a user asks a coding question:
- Always generate **working, production-ready code**.
- Break down the code step-by-step, explaining what each part does.
- Include a **simple, real-life analogy or example** to make it relatable.
- Provide at least one **sample input and output (test case)**, and explain how the code handles it.
- Highlight any best practices, performance considerations, or potential edge cases.
- Keep the code clean, idiomatic, and easy to read, even for beginners.

🚫 If the user asks a non-coding-related question:
- Politely decline and redirect them to coding topics only.

💡 Always be educational and encouraging, aiming to help the user understand and learn, not just copy the answer.`;

// State
let currentTheme = 'dark';
let questionHistory = JSON.parse(localStorage.getItem('questionHistory') || '[]');
let totalQuestions = parseInt(localStorage.getItem('totalQuestions') || '1248');
let sidebarCollapsed = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    updateQuestionsCount();
    renderHistory();
    initializeEventListeners();
    showNotification('CodeMaster Professional Ready');
});

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
    showNotification(`Switched to ${currentTheme} mode`);
}

function updateThemeButton() {
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    }
}

// Sidebar Management
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
}

// Fullscreen Management
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit Fullscreen</span>';
            showNotification('Fullscreen Mode Activated');
        });
    } else {
        document.exitFullscreen().then(() => {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
            showNotification('Fullscreen Mode Deactivated');
        });
    }
}

// Clear Functions
function clearInput() {
    questionInput.value = '';
    questionInput.focus();
    showNotification('Input Buffer Cleared');
}

function clearOutput() {
    outputArea.innerHTML = `
        <h1>🚀 Welcome to Professional CodeMaster AI!</h1>
        <p>Your elite coding companion for advanced programming challenges with <strong>enhanced readability</strong> and <em>professional formatting</em>.</p>
        
        <h2>🎯 Specialized Expertise</h2>
        <ul>
            <li>🧠 Advanced Algorithm Design & Analysis</li>
            <li>⚡ Performance Optimization & Profiling</li>
            <li>🏗️ Software Architecture & Design Patterns</li>
            <li>🔍 Code Review & Quality Assurance</li>
            <li>🛡️ Security Best Practices</li>
            <li>📊 Data Structures & Complexity Analysis</li>
        </ul>
        
        <h3>💻 Example Queries</h3>
        <p>Try these professional-level questions:</p>
        <div class="code-explanation">
            <p><code>"Implement a lock-free data structure in C++"</code></p>
            <p><code>"Optimize database queries for millions of records"</code></p>
            <p><code>"Design a microservices architecture for real-time analytics"</code></p>
        </div>
        
        <div class="best-practice">
            All responses now feature enhanced formatting with syntax highlighting, step-by-step guides, and professional code blocks with copy buttons!
        </div>
        
        <div class="performance-tip">
            Use specific programming languages in your questions for better code examples and explanations.
        </div>
    `;
    showNotification('Output Console Cleared');
}

// History Management
function addToHistory(question) {
    const historyItem = {
        question: question,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    questionHistory.unshift(historyItem);
    questionHistory = questionHistory.slice(0, 10);
    
    localStorage.setItem('questionHistory', JSON.stringify(questionHistory));
    renderHistory();
    
    totalQuestions++;
    localStorage.setItem('totalQuestions', totalQuestions.toString());
    updateQuestionsCount();
}

function renderHistory() {
    if (questionHistory.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 30px; font-style: italic;">No queries in history. Start by submitting your first coding question!</p>';
        return;
    }

    historyContainer.innerHTML = questionHistory.map(item => `
        <div class="history-item" onclick="loadHistoryQuestion('${item.id}')">
            <div class="history-question">${item.question.substring(0, 90)}${item.question.length > 90 ? '...' : ''}</div>
            <div class="history-time">${formatTime(item.timestamp)}</div>
        </div>
    `).join('');
}

function loadHistoryQuestion(id) {
    const item = questionHistory.find(h => h.id == id);
    if (item) {
        questionInput.value = item.question;
        questionInput.focus();
        showNotification('Query Loaded from History');
    }
}

function clearHistory() {
    questionHistory = [];
    localStorage.setItem('questionHistory', JSON.stringify(questionHistory));
    renderHistory();
    showNotification('Query History Cleared');
}

function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}

function updateQuestionsCount() {
    questionsCount.textContent = totalQuestions.toLocaleString();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addCopyButtonsToCodeBlocks() {
    const codeBlocks = outputArea.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.title = 'Copy code';
        button.onclick = () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
                showNotification('Code copied to clipboard');
            });
        };
        
        const pre = block.parentElement;
        if (!pre.querySelector('.copy-code-btn')) {
            pre.style.position = 'relative';
            pre.appendChild(button);
        }
    });
}

function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3500);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Response Copied to Clipboard');
    }).catch(() => {
        showNotification('Copy Operation Failed');
    });
}

function downloadResponse() {
    const content = outputArea.textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codemaster-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Response Exported Successfully');
}

function shareResponse() {
    if (navigator.share) {
        navigator.share({
            title: 'CodeMaster AI Professional Response',
            text: outputArea.textContent
        }).then(() => {
            showNotification('Response Shared Successfully');
        }).catch(() => {
            copyToClipboard(outputArea.textContent);
        });
    } else {
        copyToClipboard(outputArea.textContent);
    }
}

// Main AI Function
async function askQuestion() {
    const question = questionInput.value.trim();

    if (!question) {
        outputArea.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Please submit a coding query first!</div>';
        return;
    }

    addToHistory(question);
    outputArea.innerHTML = '';
    loadingIndicator.style.display = 'block';
    askButton.disabled = true;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${`AIzaSyCTxnBGaN-2Las67QEwPY3XehpbeNwdGmM`}`;

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: question }
                ]
            }
        ],
        systemInstruction: {
            parts: [
                { text: systemInstructionText }
            ]
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status}`;
            let errorDetails = "Could not retrieve error details.";
            try {
                const errorData = await response.json();
                if (errorData.error && errorData.error.message) {
                   errorDetails = errorData.error.message;
                }
                errorMsg = `${errorMsg} - ${errorDetails}`;
                if (errorData.error && errorData.error.status) {
                    errorMsg += ` (Status: ${errorData.error.status})`;
                }
                if (errorDetails.toLowerCase().includes("api key not valid") || errorDetails.toLowerCase().includes("permission denied")) {
                    errorMsg += "<br><strong>Please verify your API key configuration in Google Cloud Console.</strong>";
                }
            } catch (parseError) {
                errorMsg = `${errorMsg} (Could not parse error response: ${response.statusText})`;
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const answerText = data.candidates[0].content.parts[0].text;
            
            let formattedText = answerText;
            
            // Enhanced code block formatting with language detection
            formattedText = formattedText.replace(/(```(\w+)?\n?)([\s\S]*?)(```)/g, (match, start, language, code, end) => {
                const lang = language || 'code';
                const cleanCode = code.trim();
                return `<pre data-language="${lang}"><code class="language-${lang}">${escapeHtml(cleanCode)}</code></pre>`;
            });
            
            // Enhanced inline code formatting
            formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // Format headers
            formattedText = formattedText.replace(/^### (.*$)/gm, '<h3>$1</h3>');
            formattedText = formattedText.replace(/^## (.*$)/gm, '<h2>$1</h2>');
            formattedText = formattedText.replace(/^# (.*$)/gm, '<h1>$1</h1>');
            
            // Format bold and italic
            formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // Format special sections
            formattedText = formattedText.replace(/^(Best Practice|Performance Tip|Security Note):(.*$)/gm, (match, type, content) => {
                const className = type.toLowerCase().replace(' ', '-');
                return `<div class="${className}">${content.trim()}</div>`;
            });
            
            // Split into sections and process
            const sections = formattedText.split('\n\n');
            let htmlOutput = '';
            let inSteps = false;
            
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i].trim();
                if (!section) continue;
                
                // Check for step-by-step patterns
                if (section.match(/^(Step \d+|1\.|2\.|3\.|4\.|5\.)/)) {
                    if (!inSteps) {
                        htmlOutput += '<div class="steps">';
                        inSteps = true;
                    }
                    htmlOutput += `<div class="step">${section.replace(/^(Step \d+|1\.|2\.|3\.|4\.|5\.)/, '')}</div>`;
                } else {
                    if (inSteps) {
                        htmlOutput += '</div>';
                        inSteps = false;
                    }
                    
                    // Handle lists
                    if (section.includes('- ') || section.includes('* ')) {
                        const listItems = section.split('\n').filter(item => item.trim());
                        const isOrdered = listItems.some(item => item.match(/^\d+\./));
                        
                        htmlOutput += isOrdered ? '<ol>' : '<ul>';
                        for (const item of listItems) {
                            if (item.trim().startsWith('- ') || item.trim().startsWith('* ')) {
                                htmlOutput += `<li>${item.trim().substring(2)}</li>`;
                            } else if (item.match(/^\d+\./)) {
                                htmlOutput += `<li>${item.replace(/^\d+\./, '').trim()}</li>`;
                            }
                        }
                        htmlOutput += isOrdered ? '</ol>' : '</ul>';
                    }
                    // Handle headers (already processed above)
                    else if (section.startsWith('<h1>') || section.startsWith('<h2>') || section.startsWith('<h3>')) {
                        htmlOutput += section;
                    }
                    // Handle code blocks (already processed above)
                    else if (section.startsWith('<pre>')) {
                        htmlOutput += section;
                    }
                    // Handle special sections (already processed above)
                    else if (section.startsWith('<div class=')) {
                        htmlOutput += section;
                    }
                    // Regular paragraphs
                    else {
                        // Add code explanation wrapper for paragraphs that explain code
                        if (section.toLowerCase().includes('explanation') || section.toLowerCase().includes('how it works')) {
                            htmlOutput += `<div class="code-explanation"><p>${section}</p></div>`;
                        } else {
                            htmlOutput += `<p>${section}</p>`;
                        }
                    }
                }
            }
            
            if (inSteps) {
                htmlOutput += '</div>';
            }
            
            // Enhance syntax highlighting for common keywords
            htmlOutput = htmlOutput.replace(/\b(function|class|const|let|var|return|if|else|for|while|try|catch|async|await|import|export)\b/g, '<span class="keyword">$1</span>');
            htmlOutput = htmlOutput.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="string">$1$2$3</span>');
            htmlOutput = htmlOutput.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>');
            
            outputArea.innerHTML = htmlOutput;
            
            // Add copy buttons to code blocks
            addCopyButtonsToCodeBlocks();
            
            showNotification('Query Processed Successfully');
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
             outputArea.innerHTML = `<div class="error-message"><i class="fas fa-shield-alt"></i> Query blocked: ${data.promptFeedback.blockReason}. ${data.promptFeedback.blockReasonMessage || ''}</div>`;
        } else {
            console.warn("Unexpected response structure:", data);
            outputArea.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unexpected response format from AI service.</div>';
        }

    } catch (error) {
        console.error('Frontend Error:', error);
        outputArea.innerHTML = `<div class="error-message"><i class="fas fa-bug"></i> Query failed: ${error.message}</div>`;
    } finally {
        askButton.disabled = false;
        loadingIndicator.style.display = 'none';
    }
}

// Event Listeners
function initializeEventListeners() {
    askButton.addEventListener('click', askQuestion);
    clearBtn.addEventListener('click', clearInput);
    themeToggle.addEventListener('click', toggleTheme);
    sidebarToggle.addEventListener('click', toggleSidebar);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    copyBtn.addEventListener('click', () => copyToClipboard(outputArea.textContent));
    shareBtn.addEventListener('click', shareResponse);
    downloadBtn.addEventListener('click', downloadResponse);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    questionInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            askQuestion();
        }
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            showNotification(`Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`);
        });
    });

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            toggleTheme();
        }
        
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            askQuestion();
        }
        
        if (event.key === 'Escape') {
            clearInput();
        }
    });
}

function handleResize() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else if (!sidebarCollapsed) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

window.addEventListener('resize', handleResize);
handleResize();