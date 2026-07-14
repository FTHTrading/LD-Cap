// Initialize Lucide Icons on load
if (window.lucide) {
  window.lucide.createIcons();
}

// Global App States
let isWalletConnected = false;
let isDrawExecuted = false;
let activeVoice = null;
let synthesisSpeech = null;
let currentBlockIndex = 0;

// Element references
const navCustody = document.getElementById('nav-custody');
const navMint = document.getElementById('nav-mint');
const navHedge = document.getElementById('nav-hedge');
const navLedger = document.getElementById('nav-ledger');

const custodyView = document.getElementById('custody-view');
const mintView = document.getElementById('mint-view');
const hedgeView = document.getElementById('hedge-view');
const ledgerView = document.getElementById('ledger-view');

const connectWalletBtn = document.getElementById('connect-wallet-btn');
const walletModal = document.getElementById('wallet-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalSignBtn = document.getElementById('modal-sign-btn');
const modalStatusLog = document.getElementById('modal-status-log');
const topStatusIndicator = document.getElementById('top-status-indicator');

const executeDrawBtn = document.getElementById('execute-draw-btn');
const hookConsoleLog = document.getElementById('hook-console-log');
const drawChildBal = document.getElementById('draw-child-bal');
const pStep2 = document.getElementById('p-step-2');
const pStep3 = document.getElementById('p-step-3');

const sofrLeverage = document.getElementById('sofr-leverage');
const leverageValLabel = document.getElementById('leverage-val-label');
const sofrCollateral = document.getElementById('sofr-collateral');
const dailyStakingYield = document.getElementById('daily-staking-yield');
const placeHedgeBtn = document.getElementById('place-hedge-btn');

const auditBlocksContainer = document.getElementById('audit-blocks-container');
const ledgerStatusBadge = document.getElementById('ledger-status-badge');

const toastNotif = document.getElementById('toast-notif');

// Guided Audio elements
const audioPlayBtn = document.getElementById('audio-play-btn');
const audioStopBtn = document.getElementById('audio-stop-btn');
const voiceSelect = document.getElementById('voice-select');
const speedSelect = document.getElementById('speed-select');
const equalizerBars = document.getElementById('equalizer-bars');

// 1. Tab Navigation Functionality
const tabs = [
  { btn: navCustody, view: custodyView },
  { btn: navMint, view: mintView },
  { btn: navHedge, view: hedgeView },
  { btn: navLedger, view: ledgerView }
];

tabs.forEach(tab => {
  tab.btn.addEventListener('click', () => {
    tabs.forEach(t => {
      t.btn.classList.remove('active');
      t.view.style.display = 'none';
    });
    tab.btn.classList.add('active');
    tab.view.style.display = 'flex';
    
    // Refresh lucide icons in the view
    if (window.lucide) window.lucide.createIcons();
  });
});

// 2. Toast Notification Helper
function showToast(message, type = 'success') {
  toastNotif.textContent = message;
  toastNotif.style.borderColor = type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)';
  toastNotif.style.boxShadow = type === 'success' ? '0 10px 30px rgba(16, 185, 129, 0.15)' : '0 10px 30px rgba(239, 68, 68, 0.15)';
  toastNotif.classList.add('show');
  setTimeout(() => {
    toastNotif.classList.remove('show');
  }, 3500);
}

// 3. BitGo Multi-Sig Signature Modal simulation
connectWalletBtn.addEventListener('click', () => {
  if (isWalletConnected) {
    showToast('Vault already connected.', 'success');
    return;
  }
  walletModal.classList.add('show');
  modalStatusLog.innerHTML = `<div style="color: var(--text-muted);">Awaiting handshake trigger...</div>`;
});

modalCloseBtn.addEventListener('click', () => {
  walletModal.classList.remove('show');
});

modalSignBtn.addEventListener('click', () => {
  modalSignBtn.disabled = true;
  modalSignBtn.textContent = 'Processing Handshake...';
  
  const logSteps = [
    { text: '[INFO] Initializing BitGo Gateway API v2...', color: 'var(--text-secondary)' },
    { text: '[INFO] Mapping sub-vault: "M Helen Hotel LLC Escrow Pool"...', color: 'var(--text-secondary)' },
    { text: '[POLICY] Scanning active rules for "Helen_Escrow_Pool"...', color: 'var(--accent-cyan)' },
    { text: '[POLICY] Whitelist Check: 0x4E574939D460d284B5D990646D4aeaEF2D49Fa13 (Vetted)', color: 'var(--accent-green)' },
    { text: '[SIG] Awaiting signature from Key 2 (SafeGuard Custodian)...', color: 'var(--gold)' },
    { text: '[SUCCESS] Handshake verified. Connected as Unykorn Parent Vault.', color: 'var(--accent-green)' }
  ];

  modalStatusLog.innerHTML = '';
  let delay = 0;
  logSteps.forEach((step, idx) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.color = step.color;
      el.textContent = `${new Date().toLocaleTimeString()} ${step.text}`;
      modalStatusLog.appendChild(el);
      modalStatusLog.scrollTop = modalStatusLog.scrollHeight;
      
      if (idx === logSteps.length - 1) {
        // Complete Wallet Connection
        isWalletConnected = true;
        connectWalletBtn.innerHTML = `<i data-lucide="check-circle" style="width: 13px; height: 13px; color: var(--accent-green);"></i> Connected (0x4E57...)`;
        connectWalletBtn.style.color = 'var(--accent-green)';
        connectWalletBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        connectWalletBtn.style.background = 'rgba(16, 185, 129, 0.05)';
        
        if (window.lucide) window.lucide.createIcons();
        
        setTimeout(() => {
          walletModal.classList.remove('show');
          modalSignBtn.disabled = false;
          modalSignBtn.textContent = 'Initiate Signature Request';
          showToast('BitGo multi-sig vault successfully linked!');
        }, 1000);
      }
    }, delay);
    delay += 500;
  });
});

// 4. Stablecoin Minting & G703 Draw 1 Execution Simulation (Port 8888)
executeDrawBtn.addEventListener('click', () => {
  if (!isWalletConnected) {
    showToast('Signature error: Connect your BitGo wallet first.', 'error');
    return;
  }
  if (isDrawExecuted) {
    showToast('Draw 1 is already executed.', 'error');
    return;
  }
  
  executeDrawBtn.disabled = true;
  executeDrawBtn.textContent = 'Verifying Draw 1...';
  
  const mintLogs = [
    { text: '--- INCOMING PORT 8888 TRANSACTION DETECTED ---', color: 'var(--text-muted)' },
    { text: 'POST /v2/wallet/0x4E57...Fa13/mint HTTP/1.1', color: 'var(--text-secondary)' },
    { text: 'Headers: X-HMAC-Signature-SHA256, Content-Type: application/json', color: 'var(--text-secondary)' },
    { text: '[HMAC] Verifying signature against parent secret key...', color: 'var(--accent-cyan)' },
    { text: '[HMAC] Payload: {"drawCode":"DRAW_1","amount":961021.51,"coin":"USDF"}', color: 'var(--text-secondary)' },
    { text: '[HMAC] Signature Hash: e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918f0a0', color: 'var(--accent-cyan)' },
    { text: '[POLICY] Reconciling Draw 1 amount ($961,021.51) against G703 Code schedules...', color: 'var(--gold)' },
    { text: '  - G703-01 (Mobilization): $250,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-02 (General Site): $310,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-03 (Dirt/Drainage): $85,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-04 (Architectural): $196,021.51 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-05 (Closing Cost): $120,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '[MINT] Minting 961,021.51 USDF directly to child wallet...', color: 'var(--accent-cyan)' },
    { text: '[BitGo] Co-signers approved. Broadmitting transaction to Sovereign Clearing...', color: 'var(--accent-cyan)' },
    { text: '[LEDGER] Appending new transaction block to SHA-256 chain...', color: 'var(--accent-green)' },
    { text: '--- TRANSACTION CONFIRMED: Block #27492019 ---', color: 'var(--accent-green)' }
  ];

  hookConsoleLog.innerHTML = '';
  let delay = 0;
  
  mintLogs.forEach((log, idx) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.style.color = log.color;
      line.textContent = log.text;
      hookConsoleLog.appendChild(line);
      hookConsoleLog.scrollTop = hookConsoleLog.scrollHeight;
      
      if (idx === mintLogs.length - 1) {
        // Complete Draw 1 Execution
        isDrawExecuted = true;
        executeDrawBtn.textContent = 'Draw 1 Executed';
        executeDrawBtn.disabled = true;
        drawChildBal.textContent = '$961,021.51 USDF';
        topStatusIndicator.textContent = 'Draw 1: Executed & Minted';
        topStatusIndicator.style.background = 'rgba(16, 185, 129, 0.05)';
        topStatusIndicator.style.color = 'var(--accent-green)';
        topStatusIndicator.style.borderColor = 'var(--accent-green)';
        
        // Update timeline status
        pStep2.className = 'timeline-step completed';
        pStep3.className = 'timeline-step active';
        
        showToast('G703 Draw 1 successfully executed and minted!');
        
        // Add blocks to audit ledger
        addAuditBlock({
          draw: 'G703 Draw 1: Mobilization & Site Prep',
          amount: '$961,021.51 USDF',
          prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
          hash: 'c6f5a34e8d2e3c0429f6p9fxa45d2d41a772da12b918f0a0e8c6a51d8b2e3c04',
          details: 'Verified G703 reconciliation. Mobilization ($250k), Site Prep ($310k), Dirt Study ($85k), A&E ($196k), Loan Cost ($120k). Whitelisted child wallet destination: 0x4E57...Fa13.'
        });
      }
    }, delay);
    delay += 250;
  });
});

// 5. Hedging Desk calculations
sofrLeverage.addEventListener('input', () => {
  const lev = sofrLeverage.value;
  leverageValLabel.textContent = `${lev}x Leverage`;
  updateYieldMath();
});

sofrCollateral.addEventListener('input', updateYieldMath);

function updateYieldMath() {
  const col = parseFloat(sofrCollateral.value) || 0;
  // Dynamic offset model: Staking Yield offset = Collateral * 4.5% / 365
  const daily = (col * 0.045) / 365;
  dailyStakingYield.textContent = `$${daily.toFixed(2)} USDF / day`;
}

placeHedgeBtn.addEventListener('click', () => {
  const col = sofrCollateral.value;
  const lev = sofrLeverage.value;
  showToast(`Bilateral SOFR swap orders placed for $${col} at ${lev}x leverage!`, 'success');
});

// 6. Guided Audio Presentation (Web Speech API)
let tourUtterance = null;
let currentNarrativeIndex = 0;
const narratives = [
  document.getElementById('narrative-1').textContent.trim(),
  document.getElementById('narrative-2').textContent.trim(),
  document.getElementById('narrative-3').textContent.trim()
];

function populateVoices() {
  if (typeof speechSynthesis === 'undefined') return;
  
  // Clean robotic voices like Microsoft David/Zira/Hazel or Espeak
  let list = speechSynthesis.getVoices();
  const naturalVoices = list.filter(voice => {
    const name = voice.name.toLowerCase();
    return !name.includes('david') && 
           !name.includes('zira') && 
           !name.includes('hazel') && 
           !name.includes('espeak') && 
           !name.includes('robotic') && 
           !name.includes('desktop');
  });

  // Sort alphabetically
  naturalVoices.sort((a, b) => a.name.localeCompare(b.name));

  voiceSelect.innerHTML = '<option value="">Default Voice</option>';
  naturalVoices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

audioPlayBtn.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  
  playNextNarrative();
});

audioStopBtn.addEventListener('click', () => {
  speechSynthesis.cancel();
  stopVisualizer();
});

function playNextNarrative() {
  if (currentNarrativeIndex >= narratives.length) {
    currentNarrativeIndex = 0;
    stopVisualizer();
    showToast('Audio presentation tour complete.');
    return;
  }

  const text = narratives[currentNarrativeIndex];
  tourUtterance = new SpeechSynthesisUtterance(text);
  
  // Apply selected voice
  const selectedVoiceName = voiceSelect.value;
  if (selectedVoiceName) {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) tourUtterance.voice = voice;
  }

  // Apply selected speed
  tourUtterance.rate = parseFloat(speedSelect.value) || 1.0;

  tourUtterance.onstart = () => {
    startVisualizer();
    highlightNarrativeBlock(currentNarrativeIndex);
  };

  tourUtterance.onend = () => {
    currentNarrativeIndex++;
    playNextNarrative();
  };

  tourUtterance.onerror = () => {
    stopVisualizer();
  };

  speechSynthesis.speak(tourUtterance);
}

function startVisualizer() {
  equalizerBars.classList.add('playing');
  audioPlayBtn.disabled = true;
  audioStopBtn.disabled = false;
  audioStopBtn.style.color = 'var(--accent-red)';
  audioStopBtn.style.borderColor = 'var(--accent-red)';
  audioStopBtn.style.background = 'rgba(239, 68, 68, 0.05)';
  audioStopBtn.style.cursor = 'pointer';
}

function stopVisualizer() {
  equalizerBars.classList.remove('playing');
  audioPlayBtn.disabled = false;
  audioStopBtn.disabled = true;
  audioStopBtn.style.color = 'var(--text-muted)';
  audioStopBtn.style.borderColor = 'var(--border-color)';
  audioStopBtn.style.background = 'rgba(255,255,255,0.02)';
  audioStopBtn.style.cursor = 'not-allowed';
  
  // Remove all highlights
  const blocks = document.querySelectorAll('.narrative-block');
  blocks.forEach(b => b.classList.remove('reading-active'));
}

function highlightNarrativeBlock(idx) {
  const blocks = document.querySelectorAll('.narrative-block');
  blocks.forEach((b, i) => {
    if (i === idx) {
      b.classList.add('reading-active');
      b.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      b.classList.remove('reading-active');
    }
  });
}

// 7. Cryptographic Ledger rendering
function addAuditBlock(blockData) {
  currentBlockIndex++;
  const blockEl = document.createElement('div');
  blockEl.style.background = 'rgba(0,0,0,0.3)';
  blockEl.style.border = '1px solid var(--border-color)';
  blockEl.style.borderRadius = '8px';
  blockEl.style.padding = '12px';
  blockEl.style.display = 'flex';
  blockEl.style.flexDirection = 'column';
  blockEl.style.gap = '6px';
  blockEl.style.fontFamily = 'var(--font-sans)';
  
  blockEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--accent-green);">
      <strong>BLOCK #${currentBlockIndex} (Draw Verification)</strong>
      <span style="font-family: var(--font-mono);">${new Date().toISOString()}</span>
    </div>
    <div style="font-size: 11px; color: #fff;"><strong>Target:</strong> ${blockData.draw} | <strong>Amount:</strong> ${blockData.amount}</div>
    <div style="font-size: 9px; color: var(--text-secondary); line-height: 1.4;">${blockData.details}</div>
    <div style="display: flex; flex-direction: column; gap: 2px; font-family: var(--font-mono); font-size: 8px; color: var(--text-muted); border-top: 1px dashed var(--border-color); padding-top: 6px; margin-top: 4px;">
      <div>PREV HASH: ${blockData.prevHash}</div>
      <div style="color: var(--accent-cyan);">CURR HASH: ${blockData.hash}</div>
    </div>
  `;
  
  // Insert at top of container
  if (auditBlocksContainer.firstChild && auditBlocksContainer.firstChild.className !== 'card') {
    auditBlocksContainer.insertBefore(blockEl, auditBlocksContainer.firstChild);
  } else {
    auditBlocksContainer.appendChild(blockEl);
  }
}

// Initial blocks loading
function loadInitialLedgerBlocks() {
  auditBlocksContainer.innerHTML = '';
  
  // Block 1: Initial G703 Budget & Land Equity Lock
  addAuditBlock({
    draw: 'G703 Base Capitalization Setup',
    amount: '$29,100,000.00 Floor Lock',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '8f0a0e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918c6f5a34e8d2e3c04',
    details: 'Locked Prudential CMBS Tranche ($25M) and M Helen Hotel LLC base land equity ($4.1M) as verified asset floor. Verified full G703 project construction budget ($28,906,886.00).'
  });
  
  ledgerStatusBadge.textContent = 'Chain Verified';
  ledgerStatusBadge.style.color = 'var(--accent-green)';
  ledgerStatusBadge.style.borderColor = 'var(--accent-green)';
  ledgerStatusBadge.style.background = 'rgba(16, 185, 129, 0.05)';
}

// Trigger initial load
loadInitialLedgerBlocks();
updateYieldMath();
