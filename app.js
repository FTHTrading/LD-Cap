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
const navRwa = document.getElementById('nav-rwa');
const navProposals = document.getElementById('nav-proposals');

const custodyView = document.getElementById('custody-view');
const mintView = document.getElementById('mint-view');
const hedgeView = document.getElementById('hedge-view');
const ledgerView = document.getElementById('ledger-view');
const rwaView = document.getElementById('rwa-view');
const proposalsView = document.getElementById('proposals-view');

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
  { btn: navLedger, view: ledgerView },
  { btn: navRwa, view: rwaView },
  { btn: navProposals, view: proposalsView }
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
    { text: '[INFO] Initializing Secure Vault Connection...', color: 'var(--text-secondary)' },
    { text: '[INFO] Linking Escrow Account...', color: 'var(--text-secondary)' },
    { text: '[POLICY] Verifying account compliance policies...', color: 'var(--accent-cyan)' },
    { text: '[POLICY] Check: Recipient address matches approved whitelist', color: 'var(--accent-green)' },
    { text: '[SIG] Verifying institutional custodian approvals...', color: 'var(--gold)' },
    { text: '[SUCCESS] Connection authorized by linked treasury keys.', color: 'var(--accent-green)' }
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
        connectWalletBtn.innerHTML = `<i data-lucide="check-circle" style="width: 13px; height: 13px; color: var(--accent-green);"></i> Linked (0x4E57...)`;
        connectWalletBtn.style.color = 'var(--accent-green)';
        connectWalletBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        connectWalletBtn.style.background = 'rgba(16, 185, 129, 0.05)';
        
        if (window.lucide) window.lucide.createIcons();
        
        setTimeout(() => {
          walletModal.classList.remove('show');
          modalSignBtn.disabled = false;
          modalSignBtn.textContent = 'Initiate Signature Request';
          showToast('Treasury vaults successfully linked!');
        }, 1000);
      }
    }, delay);
    delay += 500;
  });
});

// 4. Stablecoin Minting & G703 Draw 1 Execution Simulation (Port 8888)
executeDrawBtn.addEventListener('click', () => {
  if (!isWalletConnected) {
    showToast('Signature error: Link your treasury keys first.', 'error');
    return;
  }
  if (isDrawExecuted) {
    showToast('Draw 1 is already executed.', 'error');
    return;
  }
  
  executeDrawBtn.disabled = true;
  executeDrawBtn.textContent = 'Verifying Draw 1...';
  
  const mintLogs = [
    { text: '--- INCOMING DRAW TRANSFER REQUEST DETECTED ---', color: 'var(--text-muted)' },
    { text: 'Target Account: Operating Draw Account (0x4E57...Fa13)', color: 'var(--text-secondary)' },
    { text: 'Verification: Whitelisted Treasury Signature matches', color: 'var(--text-secondary)' },
    { text: '[CLEARING] Authenticating draw request against escrow rules...', color: 'var(--accent-cyan)' },
    { text: '[CLEARING] Request Detail: Draw 1 - Mobilization ($961,021.51)', color: 'var(--text-secondary)' },
    { text: '[CLEARING] Security key handshake: Verified', color: 'var(--accent-cyan)' },
    { text: '[POLICY] Verifying Draw 1 line-items match construction budget schedules...', color: 'var(--gold)' },
    { text: '  - G703-01 (Mobilization): $250,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-02 (General Site): $310,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-03 (Dirt/Drainage): $85,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-04 (Architectural): $196,021.51 (Match)', color: 'var(--accent-green)' },
    { text: '  - G703-05 (Closing Cost): $120,000.00 (Match)', color: 'var(--accent-green)' },
    { text: '[CLEARING] Disbursing $961,021.51 to Operating Account...', color: 'var(--accent-cyan)' },
    { text: '[BitGo] Multi-sig approvals verified. Broadmitting to clearing network...', color: 'var(--accent-cyan)' },
    { text: '[LEDGER] Appending immutable record to escrow draw ledger...', color: 'var(--accent-green)' },
    { text: '--- SETTLED & DEPOSITED: Reference #27492019 ---', color: 'var(--accent-green)' }
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
        executeDrawBtn.textContent = 'Draw 1 Disbursed';
        executeDrawBtn.disabled = true;
        drawChildBal.textContent = '$961,021.51 USDF';
        topStatusIndicator.textContent = 'Draw 1: Settled & Disbursed';
        topStatusIndicator.style.background = 'rgba(16, 185, 129, 0.05)';
        topStatusIndicator.style.color = 'var(--accent-green)';
        topStatusIndicator.style.borderColor = 'var(--accent-green)';
        
        // Show Signature Stamp
        const drawSignatureStamp = document.getElementById('draw-signature-stamp');
        const signatureTimestampVal = document.getElementById('signature-timestamp-val');
        if (drawSignatureStamp && signatureTimestampVal) {
          drawSignatureStamp.style.display = 'block';
          signatureTimestampVal.textContent = new Date().toLocaleString();
        }
        
        // Update timeline status
        pStep2.className = 'timeline-step completed';
        pStep3.className = 'timeline-step active';
        
        showToast('G703 Draw 1 successfully verified and disbursed!');
        
        // Add blocks to audit ledger
        addAuditBlock({
          draw: 'Draw 1: Mobilization & Site Prep',
          amount: '$961,021.51 USDF',
          prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
          hash: 'c6f5a34e8d2e3c0429f6p9fxa45d2d41a772da12b918f0a0e8c6a51d8b2e3c04',
          details: 'Verified budget reconciliation. Mobilization ($250k), Site Prep ($310k), Dirt Study ($85k), A&E ($196k), Loan Cost ($120k). Whitelisted operating sub-account target: 0x4E57...Fa13.'
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
  blockEl.style.background = 'var(--bg-main)';
  blockEl.style.border = '1px solid var(--border-color)';
  blockEl.style.borderRadius = '8px';
  blockEl.style.padding = '12px';
  blockEl.style.display = 'flex';
  blockEl.style.flexDirection = 'column';
  blockEl.style.gap = '6px';
  blockEl.style.fontFamily = 'var(--font-sans)';
  
  blockEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--accent-green);">
      <strong>BLOCK #${currentBlockIndex} (Draw Approved & Settled)</strong>
      <span style="font-family: var(--font-mono);">${new Date().toISOString()}</span>
    </div>
    <div style="font-size: 11px; color: var(--text-primary);"><strong>Target:</strong> ${blockData.draw} | <strong>Amount:</strong> ${blockData.amount}</div>
    <div style="font-size: 9px; color: var(--text-secondary); line-height: 1.4;">${blockData.details}</div>
    <div style="display: flex; flex-direction: column; gap: 2px; font-family: var(--font-mono); font-size: 8px; color: var(--text-muted); border-top: 1px dashed var(--border-color); padding-top: 6px; margin-top: 4px;">
      <div>PREV HASH: ${blockData.prevHash}</div>
      <div style="color: var(--blue-brand);">CURR HASH: ${blockData.hash}</div>
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
    draw: 'Escrow Base Capitalization Setup',
    amount: '$29,100,000.00 Floor Lock',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '8f0a0e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918c6f5a34e8d2e3c04',
    details: 'Locked CMBS Tranche ($25M) and M Helen Hotel LLC base land equity ($4.1M) as verified asset floor. Verified full project construction budget ($28,906,886.00).'
  });
  
  ledgerStatusBadge.textContent = 'Chain Verified';
  ledgerStatusBadge.style.color = 'var(--accent-green)';
  ledgerStatusBadge.style.borderColor = 'var(--accent-green)';
  ledgerStatusBadge.style.background = 'rgba(16, 185, 129, 0.05)';
}

// Trigger initial load
loadInitialLedgerBlocks();
updateYieldMath();

// ==========================================
// 8. RWA REAL ESTATE TOKENIZATION CONTROLLERS
// ==========================================

// Tokenize Actions
const btnFracLaPortfolio = document.getElementById('btn-frac-la-portfolio');
const btnFracKyHotel = document.getElementById('btn-frac-ky-hotel');
const btnFracCaHotel = document.getElementById('btn-frac-ca-hotel');

const tokenizePairs = [
  { btnId: 'btn-tok-ca-full', statusId: 'status-ca-full', checkId: 'check-col-ca-full', labelId: 'label-col-ca-full', name: 'California Full Service Hotel', equity: '$16.5M' },
  { btnId: 'btn-tok-tn-hotel', statusId: 'status-tn-hotel', checkId: 'check-col-tn-hotel', labelId: 'label-col-tn-hotel', name: 'Tennessee Limited Service Hotel', equity: '$3.5M' },
  { btnId: 'btn-tok-tx-hotel-a', statusId: 'status-tx-hotel-a', checkId: 'check-col-tx-hotel-a', labelId: 'label-col-tx-hotel-a', name: 'Texas Limited Service Hotel A', equity: '$1.25M' },
  { btnId: 'btn-tok-oh-portfolio', statusId: 'status-oh-portfolio', checkId: 'check-col-oh-portfolio', labelId: 'label-col-oh-portfolio', name: 'Ohio Hotel Portfolio', equity: '$4.5M' },
  { btnId: 'btn-tok-tx-hotel-b', statusId: 'status-tx-hotel-b', checkId: 'check-col-tx-hotel-b', labelId: 'label-col-tx-hotel-b', name: 'Texas Limited Service Hotel B', equity: '$3.05M' },
  { btnId: 'btn-tok-la-hotel', statusId: 'status-la-hotel', checkId: 'check-col-la-hotel', labelId: 'label-col-la-hotel', name: 'Louisiana Limited Service Hotel', equity: '$4.0M' }
];

tokenizePairs.forEach(pair => {
  const btn = document.getElementById(pair.btnId);
  const status = document.getElementById(pair.statusId);
  const check = document.getElementById(pair.checkId);
  const label = document.getElementById(pair.labelId);

  if (btn) {
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = 'Tokenizing...';
      setTimeout(() => {
        btn.textContent = 'Tokenized';
        status.textContent = 'Tokenized (100%)';
        status.style.color = 'var(--accent-green)';
        status.style.fontWeight = '600';
        
        if (check) check.disabled = false;
        if (label) {
          label.style.color = 'var(--text-primary)';
          label.textContent = `${pair.name} (${pair.equity} Equity)`;
        }
        
        showToast(`${pair.name} successfully tokenized!`);
        recalculateCrossCollateral();
      }, 1200);
    });
  }
});

['btn-frac-la-portfolio', 'btn-frac-ky-hotel', 'btn-frac-ca-hotel'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      showToast('Asset fractionalized successfully!');
    });
  }
});

// RWA Interface Declarations
const colPoolChecks = document.querySelectorAll('.col-pool-check');
const acquisitionTargetSelect = document.getElementById('acquisition-target-select');
const pooledCollateralVal = document.getElementById('pooled-collateral-val');
const maxLtvVal = document.getElementById('max-ltv-val');
const requiredAcquisitionVal = document.getElementById('required-acquisition-val');
const collateralStatusVal = document.getElementById('collateral-status-val');
const executeCrossPurchaseBtn = document.getElementById('execute-cross-purchase-btn');

// Cross Collateral Math
function recalculateCrossCollateral() {
  let totalEquity = 4100000; // Base M Helen Hotel Equity
  
  colPoolChecks.forEach(box => {
    if (box.checked && !box.disabled) {
      totalEquity += parseFloat(box.dataset.equity) || 0;
    }
  });

  const maxLtv = totalEquity * 0.65;
  
  // Parse required acquisition
  const targetStr = acquisitionTargetSelect.value;
  const match = targetStr.match(/\$(\d+\.?\d*)M/);
  const targetVal = match ? parseFloat(match[1]) * 1000000 : 8500000;
  
  const status = maxLtv - targetVal;

  // Render values
  pooledCollateralVal.textContent = `$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  maxLtvVal.textContent = `$${maxLtv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  requiredAcquisitionVal.textContent = `$${targetVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  if (status >= 0) {
    collateralStatusVal.textContent = `Surplus: +$${status.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    collateralStatusVal.style.color = 'var(--accent-green)';
    executeCrossPurchaseBtn.disabled = false;
  } else {
    collateralStatusVal.textContent = `Deficit: -$${Math.abs(status).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    collateralStatusVal.style.color = 'var(--accent-red)';
    executeCrossPurchaseBtn.disabled = true;
  }
}

// Bind checkbox listeners
colPoolChecks.forEach(box => {
  box.addEventListener('change', recalculateCrossCollateral);
});
acquisitionTargetSelect.addEventListener('change', recalculateCrossCollateral);

// Execute Cross-Collateral purchase
executeCrossPurchaseBtn.addEventListener('click', () => {
  if (!isWalletConnected) {
    showToast('Signature error: Link your treasury keys first.', 'error');
    return;
  }
  
  executeCrossPurchaseBtn.disabled = true;
  executeCrossPurchaseBtn.textContent = 'Executing...';
  
  // Force shift view to stablecoin mint tab so they can see logs in the secure console
  showToast('Initiating cross-collateral acquisition handshake...', 'success');
  
  // Switch to mint tab after a short delay
  setTimeout(() => {
    navMint.click();
    
    const crossLogs = [
      { text: '--- CROSS-COLLATERAL ACQUISITION SEQUENCE ---', color: 'var(--text-muted)' },
      { text: `Target Account: Operating Draw Account (0x4E57...Fa13)`, color: 'var(--text-secondary)' },
      { text: `Target Asset: ${acquisitionTargetSelect.value}`, color: 'var(--text-secondary)' },
      { text: '[CLEARING] Signing collateral lock with whitelisted keys...', color: 'var(--accent-cyan)' },
      { text: '[BitGo] Provisioning child account drawing sub-vault: "ldcap_mhelen_acquisition"...', color: 'var(--gold)' },
      { text: '[BitGo] Locking collateral tranches in escrow sub-vaults...', color: 'var(--gold)' },
      { text: '[CLEARING] Disbursing acquisition USDF stablecoins to destination account...', color: 'var(--accent-cyan)' },
      { text: '[SUCCESS] Refinancing draw cleared and credited to drawing account!', color: 'var(--accent-green)' },
      { text: '--- SETTLED & DEPOSITED: Reference #27492020 ---', color: 'var(--accent-green)' }
    ];

    hookConsoleLog.innerHTML = '';
    let delay = 0;
    
    crossLogs.forEach((log, idx) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.style.color = log.color;
        line.textContent = log.text;
        hookConsoleLog.appendChild(line);
        hookConsoleLog.scrollTop = hookConsoleLog.scrollHeight;
        
        if (idx === crossLogs.length - 1) {
          executeCrossPurchaseBtn.textContent = 'Acquisition Executed';
          showToast(`Successfully acquired ${acquisitionTargetSelect.value}!`);
          
          // Add to cryptographic audit ledger
          addAuditBlock({
            draw: `Acquisition: ${acquisitionTargetSelect.value}`,
            amount: `$${(parseFloat(acquisitionTargetSelect.value.match(/\$(\d+\.?\d*)M/)[1]) * 1000000).toLocaleString()} USDF`,
            prevHash: 'c6f5a34e8d2e3c0429f6p9fxa45d2d41a772da12b918c6f5a34e8d2e3c04',
            hash: '772da12b918f0a0e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918f0a0',
            details: `Cross-collateralized national portfolio. Target asset acquired under multi-sig escrow whitelist. Child sub-account configured and registered.`
          });
        }
      }, delay);
      delay += 250;
    });

  }, 1000);
});

// Run initial math
recalculateCrossCollateral();

// ==========================================
// 9. CAPITAL ENGINE SLIDE TAB SWITCHING
// ==========================================
document.querySelectorAll('.slide-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Deactivate all slide tab buttons
    document.querySelectorAll('.slide-tab-btn').forEach(b => b.classList.remove('active'));
    // Activate clicked button
    btn.classList.add('active');

    // Hide all slide panels
    document.querySelectorAll('.slide-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // Show targeted slide panel
    const slideId = btn.dataset.slide;
    const activePanel = document.getElementById(slideId);
    if (activePanel) {
      activePanel.style.display = activePanel.id === 'slide-exec' || activePanel.id === 'slide-stack' || activePanel.id === 'slide-governance' ? 'flex' : 'block';
    }
  });
});

// ==========================================
// 10. CLIENT PROPOSAL & ONE-PAGER GENERATOR (WITH 30-YEAR INVESTOR REGISTRY)
// ==========================================
const propProjectSelect = document.getElementById('prop-project-select');
const propTemplateSelect = document.getElementById('prop-template-select');
const propLtvSlider = document.getElementById('prop-ltv-slider');
const propLtvLabel = document.getElementById('prop-ltv-label');
const propSpeedSelect = document.getElementById('prop-speed-select');
const generateDocBtn = document.getElementById('generate-doc-btn');
const documentPreviewBox = document.getElementById('document-preview-box');
const btnCopyDoc = document.getElementById('btn-copy-doc');
const btnPrintDoc = document.getElementById('btn-print-doc');

// Investor Profiles Definition (30-Year Client History)
const investorProfiles = {
  doe: {
    key: 'doe',
    name: "John Doe",
    segment: "Institutional Partner",
    deals: "Louisiana Statewide Portfolio ($30.5M), Ohio cashout ($9M)",
    ltv: 65,
    speed: "90SEC",
    risk: "Direct, yield-focused, high velocity",
    context: "We notice you participated in our $30.5M Louisiana Statewide Portfolio refinance in the past. We have structured a new opportunity that meets your target LTV preferences and matches your standard clearing parameters."
  },
  smith: {
    key: 'smith',
    name: "Jane Smith",
    segment: "Family Office",
    deals: "Kentucky Full Service equity recapture ($10M)",
    ltv: 50,
    speed: "15MIN",
    risk: "Detail-oriented, risk-averse, rate hedge dependent",
    context: "Following your co-investment in the Louisville, Kentucky property, we have structured a low-leverage opportunity featuring CME SOFR fixed protection swaps designed specifically for family office capital stability."
  },
  johnson: {
    key: 'johnson',
    name: "Robert Johnson",
    segment: "LP Partner",
    deals: "Los Angeles limited service cashout ($19M)",
    ltv: 70,
    speed: "T1",
    risk: "Growth-focused, opportunistic, yield optimizer",
    context: "Building on the Los Angeles cashout refinancing framework, this custom structure incorporates daily reserve staking yields of 4.50% APY to actively offset borrower debt service costs."
  },
  connor: {
    key: 'connor',
    name: "Sarah Connor",
    segment: "Trust Principal",
    deals: "California Portfolio cashout ($33M)",
    ltv: 60,
    speed: "90SEC",
    risk: "Security-first, strict auditor, multi-sig dependent",
    context: "Reflecting your parameters on the California portfolio, this transaction implements whitelisted signature channels, 3-of-5 signatory quorum gates, and real-time G703 AIA budget compliance checking."
  }
};

let activeClientKey = 'doe';

// Client Select Buttons handler
document.querySelectorAll('.client-select-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active state
    document.querySelectorAll('.client-select-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const clientKey = btn.dataset.client;
    activeClientKey = clientKey;
    const client = investorProfiles[clientKey];

    // Update Profile Brief UI
    document.getElementById('brief-client-name').textContent = `${client.name} Profile`;
    document.getElementById('brief-client-segment').textContent = client.segment;
    document.getElementById('brief-client-deals').textContent = client.deals;
    document.getElementById('brief-client-risk').textContent = client.risk;

    // Auto-update parameters to match selected investor's preferences
    if (propLtvSlider) {
      propLtvSlider.value = client.ltv;
      propLtvLabel.textContent = `${client.ltv}% LTV`;
    }
    if (propSpeedSelect) {
      propSpeedSelect.value = client.speed;
    }

    // Auto-generate proposal instantly for a seamless "one-click" experience
    generateOutboundDocument();
  });
});

// Update LTV label dynamically
if (propLtvSlider) {
  propLtvSlider.addEventListener('input', () => {
    propLtvLabel.textContent = `${propLtvSlider.value}% LTV`;
  });
}

const projectData = {
  M_HELEN: {
    name: 'M Helen Hotel LLC',
    valuation: '$48,750,000.00',
    equity: '$7,312,500.00',
    debt: '$31,687,500.00',
    mezz: '$9,750,000.00',
    location: 'New Orleans, LA',
    description: 'A premium hospitality project featuring verified capital floors and multi-sig compliance controls.'
  },
  LA_PORTFOLIO: {
    name: 'Louisiana Hotel Portfolio',
    valuation: '$30,500,000.00',
    equity: '$15,250,000.00',
    debt: '$19,825,000.00',
    mezz: '$6,100,000.00',
    location: 'Louisiana Statewide',
    description: 'A diversified hotel portfolio cashout transaction restructured under whitelisted draw pathways.'
  },
  KY_HOTEL: {
    name: 'Kentucky Full Service Hotel',
    valuation: '$10,000,000.00',
    equity: '$5,000,000.00',
    debt: '$6,500,000.00',
    mezz: '$2,000,000.00',
    location: 'Louisville, KY',
    description: 'An equity recapture refinancing transaction utilizing isolated reserve vaults and yield staking offsets.'
  },
  CA_HOTEL: {
    name: 'California Limited Service Hotel',
    valuation: '$19,000,000.00',
    equity: '$9,500,000.00',
    debt: '$12,350,000.00',
    mezz: '$3,800,000.00',
    location: 'Los Angeles, CA',
    description: 'A Cashout Refinance transaction featuring CME SOFR rate protection and instant settlement.'
  }
};

const speeds = {
  '90SEC': 'under 90 seconds',
  '15MIN': 'within 15 minutes',
  'T1': 'next-day (T+1) settlement'
};

function generateOutboundDocument() {
  const projKey = propProjectSelect.value;
  const templateKey = propTemplateSelect.value;
  const ltv = propLtvSlider.value;
  const speedText = speeds[propSpeedSelect.value];
  const proj = projectData[projKey] || projectData.M_HELEN;
  const client = investorProfiles[activeClientKey];

  let content = '';

  if (templateKey === 'ONE_PAGER') {
    content = `
<div style="font-family: var(--font-display); border-bottom: 2px solid var(--gold); padding-bottom: 8px; margin-bottom: 15px; text-align: center;">
  <span style="font-weight: 800; font-size: 14px; color: var(--blue-brand); text-transform: uppercase; letter-spacing: 0.05em;">The Loan Depot</span><br/>
  <span style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em;">Commercial Real Estate Refinancing Executive Brief</span>
</div>

<h3 style="font-size: 12px; color: var(--blue-brand); margin-bottom: 4px; text-transform: uppercase;">Project: ${proj.name}</h3>
<p style="margin-bottom: 10px; font-size: 11px; color: var(--text-secondary);">${proj.description}</p>
<p style="margin-bottom: 12px; font-size: 10px; color: var(--text-primary); padding: 8px; background: rgba(15,59,124,0.03); border-left: 3px solid var(--blue-brand); border-radius: 4px;">
  <strong>Tailored Structure Briefing:</strong> ${client.context}
</p>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;">
  <thead>
    <tr style="background: var(--bg-darker);">
      <th style="padding: 6px; text-align: left; color: var(--blue-brand);">Financial Metric</th>
      <th style="padding: 6px; text-align: right; color: var(--blue-brand);">Structured Allocation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Asset Valuation</td>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color); text-align: right; font-weight: bold;">${proj.valuation}</td>
    </tr>
    <tr>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Target Loan-to-Value (LTV)</td>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color); text-align: right; font-weight: bold;">${ltv}%</td>
    </tr>
    <tr>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Structured Senior Debt</td>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color); text-align: right;">${proj.debt}</td>
    </tr>
    <tr>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Preferred Mezzanine Tranche</td>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color); text-align: right;">${proj.mezz}</td>
    </tr>
    <tr>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color);">Verified Land Equity (LP/GP)</td>
      <td style="padding: 6px; border-bottom: 1px solid var(--border-color); text-align: right;">${proj.equity}</td>
    </tr>
  </tbody>
</table>

<h4 style="font-size: 10px; color: var(--blue-brand); margin-bottom: 6px; text-transform: uppercase;">Operational Advantages</h4>
<ul style="padding-left: 15px; margin-bottom: 12px; font-size: 10px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
  <li><strong>Instant Drawing Accounts:</strong> Restructured draw processing allows disbursal ${speedText} directly to General Contractors.</li>
  <li><strong>Preferred Yield Offsets:</strong> Staked reserve accounts accumulate yield at 4.5% APY, offsetting daily debt service.</li>
  <li><strong>Bilateral Rate Protection:</strong> CME SOFR average hedging swaps protect borrower principal against market volatility.</li>
  <li><strong>Multi-Sig Governance Gates:</strong> Quorum routing restricts outbound paths to pre-vetted project whitelists, eliminating escrow risk.</li>
</ul>

<div style="font-size: 8px; color: var(--text-muted); text-align: center; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 12px;">
  Confidential Document — For Qualified Institutional Review Only — Distributed by The Loan Depot
</div>
    `;
  } else if (templateKey === 'EMAIL_PITCH') {
    content = `
<div style="font-family: var(--font-mono); font-size: 10px; border: 1px solid var(--border-color); padding: 12px; background: var(--bg-main); border-radius: 4px; margin-bottom: 12px;">
  <strong>Subject:</strong> Institutional Refinancing Innovation & Draw Efficiency — ${proj.name}<br/>
  <strong>From:</strong> Niraj Sheth, CEO, The Loan Depot &lt;nsheth@ldlgh.com&gt;
</div>

<div style="font-size: 11px; color: var(--text-primary);">
  <p>Dear ${client.name},</p>
  
  <p>We are pleased to introduce our proprietary, in-house refinancing and draw clearing platform. We have structured a custom scenario for <strong>${proj.name}</strong> that eliminates traditional lending friction and sets a new institutional standard.</p>
  
  <p style="padding: 8px; background: rgba(15,59,124,0.03); border-left: 3px solid var(--blue-brand); border-radius: 4px; font-size: 10px;">
    <strong>Tailored Client Context:</strong> ${client.context}
  </p>

  <p><strong>Proposed Refinancing Terms:</strong></p>
  <ul style="padding-left: 15px; margin: 10px 0;">
    <li><strong>Asset Valuation:</strong> ${proj.valuation}</li>
    <li><strong>Target Loan-to-Value:</strong> ${ltv}% LTV</li>
    <li><strong>Draw Disbursal Window:</strong> Cleared and settled <strong>${speedText}</strong> directly to drawing accounts.</li>
    <li><strong>Escrow Security:</strong> Whitelisted multi-sig custody gates preventing un-vetted capital outflows.</li>
    <li><strong>Yield Optimizations:</strong> Active reserve accounts earning 4.5% APY to offset debt costs.</li>
  </ul>
  
  <p>By bringing our drawing ledgers completely in-house, we remove third-party clearing friction entirely. Draw settlements that previously took days can now finalize in minutes. We are also able to lock in custom bilateral SOFR interest rate swaps to guarantee rate protection throughout the project life.</p>
  
  <p>Please let us know your availability this week to review the structured one-pager and finalize the draw whitelists.</p>
  
  <p>Sincerely,</p>
  <p><strong>Niraj (Nick) Sheth</strong><br/>
  President & CEO, The Loan Depot Lending Co, Inc.<br/>
  Office: (423) 385-2300 | www.LDLGH.com</p>
</div>
    `;
  } else if (templateKey === 'STRUCTURE_BRIEF') {
    content = `
<div style="text-align: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
  <strong style="font-size: 12px; color: var(--blue-brand); text-transform: uppercase;">Underwriting & Risk Management Memorandum</strong>
</div>

<div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 12px; display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
  <strong>To:</strong> <span>Credit Committee & Underwriting Desk</span>
  <strong>From:</strong> <span>The Loan Depot Executive Desk</span>
  <strong>Date:</strong> <span>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
  <strong>Subject:</strong> <span>Risk Mitigation & Refinancing Audit for ${proj.name}</span>
</div>

<p style="margin-bottom: 12px; font-size: 10px; color: var(--text-primary); padding: 8px; background: rgba(15,59,124,0.03); border-left: 3px solid var(--blue-brand); border-radius: 4px;">
  <strong>Review Context (${client.name}):</strong> Investor Profile: ${client.segment} (Past record: ${client.deals}). Underwriting settings set to LTV: ${ltv}% and disbursal latency: ${speedText}.
</p>

<h4 style="font-size: 10px; color: var(--blue-brand); text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px dashed var(--border-color); padding-bottom: 3px;">1. Capital Stack Structure</h4>
<p style="margin-bottom: 8px; line-height: 1.4;">
  The project is capitalized at a total value of ${proj.valuation}. Under the proposed ${ltv}% LTV framework, the senior loan tranche is set at ${proj.debt}, supported by a mezzanine preferred equity position of ${proj.mezz} and a borrower land equity floor of ${proj.equity}.
</p>

<h4 style="font-size: 10px; color: var(--blue-brand); text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px dashed var(--border-color); padding-bottom: 3px;">2. Draw Clearance Risk Control</h4>
<p style="margin-bottom: 8px; line-height: 1.4;">
  Draw disbursals are managed via isolated drawing sub-accounts. Outbound draw routing enforces G703 AIA budget compliance automatically. Funds are disbursed ${speedText} upon satisfying multi-party approval quorums (3-of-5 signatures collected from monitor, lender, GP, and legal representatives).
</p>

<h4 style="font-size: 10px; color: var(--blue-brand); text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px dashed var(--border-color); padding-bottom: 3px;">3. Rate Volatility Mitigation</h4>
<p style="margin-bottom: 8px; line-height: 1.4;">
  The borrower utilizes bilateral SOFR average rate swaps clearing directly against the isolated yield accounts. Staked reserve pools earn 4.5% APY to provide an active buffer for interest payments.
</p>
    `;
  }

  documentPreviewBox.innerHTML = content;
}

if (generateDocBtn) {
  generateDocBtn.addEventListener('click', () => {
    generateOutboundDocument();
    showToast('Document successfully generated!');
  });
}

// Copy to Clipboard handler
if (btnCopyDoc) {
  btnCopyDoc.addEventListener('click', () => {
    const text = documentPreviewBox.innerText;
    if (text.includes('Select options and click')) {
      showToast('Generate a document first.', 'error');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('Document text copied to clipboard!');
    }).catch(err => {
      showToast('Copy failed.', 'error');
    });
  });
}

// Print handler
if (btnPrintDoc) {
  btnPrintDoc.addEventListener('click', () => {
    const text = documentPreviewBox.innerHTML;
    if (text.includes('Select options and click')) {
      showToast('Generate a document first.', 'error');
      return;
    }
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Export Proposal - The Loan Depot</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          ${text}
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  });
}

// Bilateral Signature Desk Execution
const btnExecuteAgreement = document.getElementById('btn-execute-agreement');
const agreementSignatureStamp = document.getElementById('agreement-signature-stamp');
const stampSignatoryVal = document.getElementById('stamp-signatory-val');

if (btnExecuteAgreement) {
  btnExecuteAgreement.addEventListener('click', () => {
    btnExecuteAgreement.disabled = true;
    btnExecuteAgreement.textContent = "Executing secure signature...";

    setTimeout(() => {
      btnExecuteAgreement.textContent = "Agreement Digitally Executed";
      const client = investorProfiles[activeClientKey];
      
      if (stampSignatoryVal) {
        stampSignatoryVal.innerHTML = `<strong>Nick Sheth</strong> (President & CEO, The Loan Depot) <br/>& <strong>${client.name}</strong> (${client.segment})`;
      }
      if (agreementSignatureStamp) {
        agreementSignatureStamp.style.display = "block";
      }

      showToast("Agreement cryptographically signed and locked to escrow ledger!");
    }, 1000);
  });
}

// Reset signature stamp on client selection
const originalClientSelectBtnHandler = document.querySelectorAll('.client-select-btn');
originalClientSelectBtnHandler.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btnExecuteAgreement) {
      btnExecuteAgreement.disabled = false;
      btnExecuteAgreement.textContent = "Sign & Execute Agreement";
    }
    if (agreementSignatureStamp) {
      agreementSignatureStamp.style.display = "none";
    }
  });
});

// Trigger initial generation
generateOutboundDocument();


