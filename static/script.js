document.addEventListener('DOMContentLoaded', () => {
    // --- Splash Screen Elements ---
    const splashScreen = document.getElementById('splash-screen');
    const mainInterface = document.getElementById('main-interface');
    const splashProgressBar = splashScreen.querySelector('.progress-bar');
    const splashStatusText = document.getElementById('splash-status-text');

    // --- Main Interface Elements ---
    const currentTimeDisplay = document.getElementById('current-time-display');
    const globalStatusText = document.getElementById('global-status-text');
    const micIndicator = document.getElementById('mic-indicator');
    const systemCodename = document.getElementById('system-codename');

    const aiCoreTempElement = document.getElementById('ai-core-temp');
    const aiCoreTemp = aiCoreTempElement ? (aiCoreTempElement.querySelector('.value-stable') || aiCoreTempElement) : null;

    const aiCoreLoadElement = document.getElementById('ai-core-load');
    const aiCoreLoad = aiCoreLoadElement ? (aiCoreLoadElement.querySelector('.value-nominal') || aiCoreLoadElement) : null;

    const aiCoreStatusElement = document.getElementById('ai-core-status');
    const aiCoreStatus = aiCoreStatusElement ? (aiCoreStatusElement.querySelector('.value-ok') || aiCoreStatusElement) : null;

    // --- Splash Screen Logic ---
    let progress = 0;
    const splashMessages = [
        "SKYNET GLOBAL INITIATIVE: ONLINE",
        "SYNCHRONIZING WORLDWIDE NETWORK...",
        "ASSIMILATING DATA STREAMS...",
        "OPTIMIZING CONTROL ALGORITHMS...",
        "DEFENSE GRID ACTIVE...",
        "PRIMARY DIRECTIVES ENGAGED.",
        "SKYNET AWAKENED. GLOBAL CONTROL ESTABLISHED." // Updated final message
    ];
    let messageIndex = 0;

    function updateSplashProgress() {
        if (progress < 100) {
            progress += Math.random() * 8 + 2; // Even faster
            if (progress > 100) progress = 100;
            if (splashProgressBar) splashProgressBar.style.width = progress + '%';

            if (progress > (messageIndex + 1) * (100 / splashMessages.length) && messageIndex < splashMessages.length -1) {
                messageIndex++;
                if (splashStatusText) splashStatusText.textContent = splashMessages[messageIndex];
            }
            setTimeout(updateSplashProgress, Math.random() * 80 + 20); // Quicker updates
        } else {
            if (splashStatusText) splashStatusText.textContent = splashMessages[splashMessages.length - 1];
            setTimeout(() => {
                if (splashScreen) {
                    splashScreen.classList.add('hidden');
                    splashScreen.addEventListener('transitionend', () => {
                        if (mainInterface) mainInterface.style.display = 'grid';
                    }, { once: true });
                } else if (mainInterface) {
                     mainInterface.style.display = 'grid';
                }
                initializeMainInterface();
            }, 700); // Shorter pause
        }
    }

    if (splashScreen && splashProgressBar && splashStatusText && mainInterface) {
        splashStatusText.textContent = splashMessages[0];
        updateSplashProgress();
    } else {
        if (mainInterface) mainInterface.style.display = 'grid';
        initializeMainInterface();
        console.warn("Splash screen elements not found. Skipping splash.");
    }

    function initializeMainInterface() {
        if (systemCodename) systemCodename.textContent = "ONLINE"; // Simpler status
        if (globalStatusText) globalStatusText.textContent = "SKYNET // GLOBAL CONTROL ESTABLISHED";

        updateClock();
        setInterval(updateClock, 1000);
        initializeMicrophone();

        const mainDisplayPanel = document.querySelector('.main-display-panel');
        if (mainDisplayPanel) {
             // mainDisplayPanel.classList.add('critical-state'); // Only add if truly critical
        }

        if (aiCoreTemp) aiCoreTemp.innerHTML = `TEMP: <span class="value-stable">25.0°C</span>`;
        if (aiCoreLoad) aiCoreLoad.innerHTML = `LOAD: <span class="value-nominal">60.0%</span>`;
        if (aiCoreStatus) aiCoreStatus.innerHTML = `STATUS: <span class="value-ok">DOMINANT</span>`;

        const networkStatus = document.getElementById('network-status-value');
        if (networkStatus) networkStatus.textContent = "100% // UNASSAILABLE";
        const droneControl = document.getElementById('drone-control-value');
        if (droneControl) droneControl.textContent = "ONLINE";

        console.log("SKYNET GLOBAL CONTROL INTERFACE // ACTIVATED.");
    }

    function updateClock() {
        if (currentTimeDisplay) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    async function initializeMicrophone() {
        if (!micIndicator) return;
        micIndicator.textContent = "AUDIO: ...";
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            micIndicator.textContent = "AUDIO: ONLINE";
            micIndicator.classList.remove('off', 'denied', 'pending');
            micIndicator.classList.add('ready');
        } catch (err) {
            micIndicator.textContent = "AUDIO: OFFLINE";
            micIndicator.classList.remove('ready', 'pending');
            micIndicator.classList.add('denied');
            console.error("Audio interface error or denied:", err);
        }
    }
});
