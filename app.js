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

// Guided Audio Presentation Tour States
let tourUtterance = null;
let currentNarrativeIndex = 0;
let narratives = [];

// Element references
const navCustody = document.getElementById('nav-custody');
const navMint = document.getElementById('nav-mint');
const navHedge = document.getElementById('nav-hedge');
const navLedger = document.getElementById('nav-ledger');
const navRwa = document.getElementById('nav-rwa');
const navProposals = document.getElementById('nav-proposals');
const navPof = document.getElementById('nav-pof');
const navLibrary = document.getElementById('nav-library');
const navQa = document.getElementById('nav-qa');

const custodyView = document.getElementById('custody-view');
const mintView = document.getElementById('mint-view');
const hedgeView = document.getElementById('hedge-view');
const ledgerView = document.getElementById('ledger-view');
const rwaView = document.getElementById('rwa-view');
const proposalsView = document.getElementById('proposals-view');
const pofView = document.getElementById('pof-view');
const libraryView = document.getElementById('library-view');
const qaView = document.getElementById('qa-view');

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
  { btn: navProposals, view: proposalsView },
  { btn: navPof, view: pofView },
  { btn: navLibrary, view: libraryView },
  { btn: navQa, view: qaView }
];

const tabNarrativeSpeechMap = {
  'custody-view': [
    "Welcome to the Custody and Draw 1 Desk. Here, you can review the land equity lock and approve the first mobilization draw of nine hundred and sixty-one thousand dollars, which clears directly into your operating account under twenty-nine point one million dollars of verified asset backing.",
    "This screen enables you to review G703 mobilization details, verify structural requirements, and approve the release of funds immediately.",
    "Click Connect Wallet to link your multi-sig key and approve the mobilization draw on-chain."
  ],
  'mint-view': [
    "This is the Draw Disbursal scheduler. It shows the detailed schedule of construction draw releases, G702 general conditions checks, and contractor off-ramps.",
    "Our clearing bridge checks requests against the approved budget and off-ramps payments to contractor bank accounts in under ninety seconds.",
    "Review entitling timelines and milestones to monitor construction progress."
  ],
  'hedge-view': [
    "This is the Rate Hedging panel. Here, you can structure bilateral interest rate swaps based on average CME SOFR rates to protect borrower principal against market shifts.",
    "Use the leverage slider to adjust yield ratios and active reserve offsets.",
    "Staked reserves accumulate interest at four point five percent APY, directly offsetting daily borrowing costs."
  ],
  'rwa-view': [
    "This is the Portfolio Equity structure panel. It displays senior and mezzanine tranches, target Loan-to-Value ratios, and borrower capital capacity.",
    "You can model different capital stack scenarios by adjusting the loan-to-value limits.",
    "This matrix ensures compliant debt structure layouts before CMBS packaging."
  ],
  'ledger-view': [
    "This is the Escrow Ledger. It displays a real-time, immutable audit trail of SHA-256 block validations tracking draw clearance events.",
    "Designated underwriters can monitor the cryptographic signature consensus for every draw approval.",
    "Each block validates ledger compliance and establishes absolute audit trails."
  ],
  'proposals-view': [
    "Welcome to the Client Proposal Desk. Here, you can access the thirty-year investor registry to structure tailored one-page memos, terms sheets, and proposal emails.",
    "Select a client profile to auto-fill their leverage and speed preferences.",
    "Once generated, you can digitally co-sign and execute agreements directly on the secure ledger."
  ],
  'pof-view': [
    "This is the Proof of Funds and Flash Loan Desk. You can build verified, cryptographically signed Proof-of-Funds escrow instruments immediately.",
    "Deploy the atomic non-custodial flash loan bridge to instantly verify liquidity presence.",
    "The simulator returns success status in under two seconds to confirm qualified reserve backing."
  ],
  'library-view': [
    "This is the Institutional Resource Library. It contains thirteen comprehensive guides, including legacy comparables, lender protocols, and advanced CRE strategies.",
    "Click Listen to hear a voice overview of the guide's key compliance criteria.",
    "Click Download to dynamically compile and print official briefing sheets."
  ],
  'qa-view': [
    "Welcome to the Q and A Desk. This panel addresses critical underwriting inquiries, including why under-ninety-second disbursals are legitimately backed by chartered trust vaults.",
    "Learn how our direct access to qualified custody eliminates middleman clearing lag entirely.",
    "See how this architecture Corporate structures elevate commercial real estate developers to self-funding principals."
  ]
};

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

    // Dynamically update Guided Audio Narratives based on active tab view
    const viewId = tab.view.id;
    const activeSpeech = tabNarrativeSpeechMap[viewId] || tabNarrativeSpeechMap['custody-view'];
    if (typeof narratives !== 'undefined') {
      narratives[0] = activeSpeech[0];
      narratives[1] = activeSpeech[1];
      narratives[2] = activeSpeech[2];
    }

    // Reset speaker index and stop if speaking
    currentNarrativeIndex = 0;
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      stopVisualizer();
    }
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
narratives.push(
  document.getElementById('narrative-1').textContent.trim(),
  document.getElementById('narrative-2').textContent.trim(),
  document.getElementById('narrative-3').textContent.trim()
);

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
  let preferredVoiceSelected = false;
  naturalVoices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    
    // Auto-select Google UK English Male or en-GB Male
    const isMale = voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female');
    const isPreferred = voice.name.includes('Google UK English Male') || (voice.lang === 'en-GB' && isMale);
    if (isPreferred && !preferredVoiceSelected) {
      option.selected = true;
      preferredVoiceSelected = true;
    }
    
    voiceSelect.appendChild(option);
  });

  // If a preferred voice was selected, trigger select change to update default voice select value
  if (preferredVoiceSelected && voiceSelect.value === "") {
    const preferredOption = Array.from(voiceSelect.options).find(opt => opt.selected);
    if (preferredOption) {
      voiceSelect.value = preferredOption.value;
    }
  }
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
            :root {
              --blue-brand: #0f3b7c;
              --gold: #b38d38;
              --text-primary: #1e293b;
              --text-secondary: #475569;
              --border-color: #e2e8f0;
              --bg-darker: #f1f5f9;
              --accent-green: #10b981;
            }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: var(--text-primary); line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; border-bottom: 1px solid var(--border-color); text-align: left; }
            th { background: var(--bg-darker); }
            ul { padding-left: 20px; }
            li { margin-bottom: 6px; }
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

// ==========================================
// 11. CRYPTOGRAPHIC PROOF-OF-FUNDS & FLASH LOAN SIMULATOR
// ==========================================
const btnGeneratePof = document.getElementById('btn-generate-pof');
const pofAmountSelect = document.getElementById('pof-amount-select');
const certDocId = document.getElementById('cert-doc-id');
const certDate = document.getElementById('cert-date');
const certStatus = document.getElementById('cert-status');
const certConfirmedBox = document.getElementById('cert-confirmed-box');
const certTxHash = document.getElementById('cert-tx-hash');

const btnSimulateFlash = document.getElementById('btn-simulate-flash');
const flashStatusStamp = document.getElementById('flash-status-stamp');
const flashConsoleLog = document.getElementById('flash-console-log');

const pofAmounts = {
  '1M': { formatted: '1,000,000', value: '1M', tx: '773CD23C4C8307C7991F82B5012D9D65E3FD357E82EBBB32E50C4E564CE7F0A4' },
  '5M': { formatted: '5,000,000', value: '5M', tx: '849BA850DF283BC60B12F0A3D99C8D678E2FF8902A2BBB90FF501D890CC7F3B9' },
  '10M': { formatted: '10,000,000', value: '10M', tx: '912BA890EF223CC50D23F1C4E88C7D823F3AA9803B2BBB80EF402C892CC8E4C0' },
  '25M': { formatted: '25,000,000', value: '25M', tx: '250BA900FF334DD60E34F2D5F99D8D904F4BB9904C3CCC90FF503D893DD9F5D1' }
};

if (btnGeneratePof) {
  btnGeneratePof.addEventListener('click', () => {
    btnGeneratePof.disabled = true;
    btnGeneratePof.textContent = 'Verifying approval gates...';
    
    // Reset gates
    const gates = ['gate-1', 'gate-2', 'gate-3', 'gate-4'];
    gates.forEach(g => {
      const el = document.getElementById(g);
      if (el) {
        el.style.background = '#fff';
        el.style.borderColor = 'var(--border-color)';
        el.style.color = 'var(--text-muted)';
      }
    });

    // Reset status & certificate
    if (certStatus) {
      certStatus.textContent = 'Awaiting Verification';
      certStatus.style.color = 'var(--accent-red)';
    }
    if (certConfirmedBox) {
      certConfirmedBox.innerHTML = `
        <i data-lucide="lock" style="width: 24px; height: 24px; color: var(--text-muted); margin-bottom: 6px;"></i>
        <span style="font-size: 10px; color: var(--text-secondary); font-weight: 500;">Click 'Generate & Verify' to lock escrow reserves and stamp instrument on-chain.</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
    if (certTxHash) certTxHash.textContent = 'Generates upon execution...';
    if (btnSimulateFlash) {
      btnSimulateFlash.disabled = true;
      flashStatusStamp.textContent = 'Bridge Idle';
      flashStatusStamp.style.background = '#fff';
      flashStatusStamp.style.color = 'var(--text-muted)';
      flashStatusStamp.style.borderColor = 'var(--border-color)';
      flashConsoleLog.style.display = 'none';
      flashConsoleLog.innerHTML = '';
    }

    const amtKey = pofAmountSelect.value;
    const amt = pofAmounts[amtKey] || pofAmounts['1M'];

    // Simulating sequential on-chain signature aggregation
    setTimeout(() => {
      const el = document.getElementById('gate-1');
      if (el) {
        el.style.background = 'rgba(16, 185, 129, 0.05)';
        el.style.borderColor = 'var(--accent-green)';
        el.style.color = 'var(--accent-green)';
      }
    }, 200);

    setTimeout(() => {
      const el = document.getElementById('gate-2');
      if (el) {
        el.style.background = 'rgba(16, 185, 129, 0.05)';
        el.style.borderColor = 'var(--accent-green)';
        el.style.color = 'var(--accent-green)';
      }
    }, 400);

    setTimeout(() => {
      const el = document.getElementById('gate-3');
      if (el) {
        el.style.background = 'rgba(16, 185, 129, 0.05)';
        el.style.borderColor = 'var(--accent-green)';
        el.style.color = 'var(--accent-green)';
      }
    }, 600);

    setTimeout(() => {
      const el = document.getElementById('gate-4');
      if (el) {
        el.style.background = 'rgba(16, 185, 129, 0.05)';
        el.style.borderColor = 'var(--accent-green)';
        el.style.color = 'var(--accent-green)';
      }
    }, 800);

    setTimeout(() => {
      btnGeneratePof.disabled = false;
      btnGeneratePof.textContent = 'Generate & Verify POF Instrument';
      
      // Update Certificate ID and Date
      if (certDocId) certDocId.textContent = `TROPT-POF-USDC-${amt.value}-ESCROW-2026-07-14`;
      if (certDate) certDate.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      if (certStatus) {
        certStatus.textContent = 'Verified - Funds Escrowed';
        certStatus.style.color = 'var(--accent-green)';
      }

      if (certConfirmedBox) {
        certConfirmedBox.innerHTML = `
          <div style="border: 2px solid var(--accent-green); background: rgba(16, 185, 129, 0.03); border-radius: 6px; padding: 15px; text-align: center; width: 100%;">
            <div style="font-size: 20px; font-weight: bold; color: var(--accent-green); margin-bottom: 5px;">✓</div>
            <div style="font-size: 10px; font-weight: bold; color: var(--accent-green); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
              ${amt.formatted} USDC CONFIRMED IN ESCROW CUSTODY WALLET
            </div>
            <div style="font-size: 13px; font-weight: 800; color: var(--blue-brand); margin-bottom: 6px;">
              ${amt.formatted} USDC ESCROWED
            </div>
            <div style="font-size: 8px; color: var(--text-secondary); font-family: var(--font-mono);">
              Escrow Wallet: r3kSVwgsoQZCSG9NZ1GMUG54SUiH8yv66H
            </div>
          </div>
        `;
      }

      if (certTxHash) certTxHash.textContent = amt.tx;
      if (btnSimulateFlash) btnSimulateFlash.disabled = false;

      // Enable Action Buttons
      const btnDownloadPofPdf = document.getElementById('btn-download-pof-pdf');
      const btnEmailPof = document.getElementById('btn-email-pof');
      const btnSignIssuePof = document.getElementById('btn-sign-issue-pof');

      if (btnDownloadPofPdf) btnDownloadPofPdf.disabled = false;
      if (btnEmailPof) btnEmailPof.disabled = false;
      if (btnSignIssuePof) btnSignIssuePof.disabled = false;

      showToast("Cryptographic Proof-of-Funds instrument generated and verified!");
    }, 1200);
  });
}

if (btnSimulateFlash) {
  btnSimulateFlash.addEventListener('click', () => {
    btnSimulateFlash.disabled = true;
    flashConsoleLog.style.display = 'block';
    flashConsoleLog.innerHTML = '';
    
    const amtKey = pofAmountSelect.value;
    const amt = pofAmounts[amtKey] || pofAmounts['1M'];

    const logs = [
      `[FLASH] Initiating non-custodial flash bridge check for $${amt.formatted} USDC...`,
      `[FLASH] Borrowing flash liquidity from whitelisted clearing pool: tesSUCCESS`,
      `[FLASH] Deposited into escrow wallet address r3kSVwgsoQZCSG9NZ1GMUG54SUiH8yv66H: OK`,
      `[FLASH] On-chain asset ledger reserve status confirmed: tesSUCCESS`,
      `[FLASH] Releasing escrow lock and returning liquidity to pool...`,
      `[FLASH] Flash check completed. Latency: 1480ms. Status: tesSUCCESS.`
    ];

    let delay = 0;
    logs.forEach((log, idx) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.textContent = log;
        if (log.includes('tesSUCCESS')) {
          line.style.color = '#34d399'; // Bright emerald green
        } else if (log.includes('Initiating')) {
          line.style.color = '#38bdf8'; // Bright sky blue
        }
        flashConsoleLog.appendChild(line);
        flashConsoleLog.scrollTop = flashConsoleLog.scrollHeight;

        if (idx === logs.length - 1) {
          flashStatusStamp.textContent = 'Verified';
          flashStatusStamp.style.background = 'var(--accent-green)';
          flashStatusStamp.style.color = '#ffffff';
          flashStatusStamp.style.borderColor = 'var(--accent-green)';
          showToast("Atomic flash loan verification success! Asset backing validated.");
        }
      }, delay);
      delay += 300;
    });
  });
}

// Bilateral POF Action listeners
const btnDownloadPofPdf = document.getElementById('btn-download-pof-pdf');
const btnEmailPof = document.getElementById('btn-email-pof');
const btnSignIssuePof = document.getElementById('btn-sign-issue-pof');

if (btnDownloadPofPdf) {
  btnDownloadPofPdf.addEventListener('click', () => {
    const amtKey = pofAmountSelect.value;
    const amt = pofAmounts[amtKey] || pofAmounts['1M'];
    const docId = `TROPT-POF-USDC-${amt.value}-ESCROW-2026-07-14`;
    const preparedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Proof of Funds Escrow Instrument - ${docId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 3px solid #b38d38; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
            .header h1 { font-size: 20px; color: #0f3b7c; margin: 0; text-transform: uppercase; }
            .header span { font-size: 10px; color: #64748b; font-weight: bold; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; font-size: 12px; }
            .meta-grid span { color: #64748b; font-size: 10px; display: block; text-transform: uppercase; }
            .verified-box { border: 2px solid #10b981; background: rgba(16, 185, 129, 0.03); border-radius: 8px; padding: 25px; text-align: center; margin-bottom: 25px; }
            .verified-box h2 { font-size: 14px; color: #10b981; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.05em; }
            .verified-box h3 { font-size: 18px; color: #0f3b7c; margin: 0 0 10px; font-weight: 800; }
            .verified-box code { font-family: monospace; font-size: 11px; color: #334155; }
            .details-list { font-size: 11px; color: #475569; display: grid; grid-template-columns: 120px 1fr; gap: 8px; margin-bottom: 25px; }
            .details-list strong { color: #1e293b; }
            .footer { border-top: 1px dashed #cbd5e1; padding-top: 15px; text-align: center; font-size: 9px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span>INSTITUTIONAL ESCROW DOCUMENTATION — CONFIDENTIAL</span>
              <h1>Proof-of-Funds Escrow Instrument</h1>
              <p style="margin: 2px 0 0; font-size: 11px; color: #475569;">USDC / USDF Custodial Escrow — XRPL Mainnet Clearing</p>
            </div>
            <div style="text-align: right;">
              <span style="display:block;">DOCUMENT ID</span>
              <strong style="font-family: monospace; font-size: 10px; color: #0f3b7c;">${docId}</strong>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <span>Date Prepared</span>
              <strong>${preparedDate}</strong>
            </div>
            <div>
              <span>Clearing Rail</span>
              <strong>XRPL Mainnet</strong>
            </div>
            <div>
              <span>Verification Status</span>
              <strong style="color: #10b981;">VERIFIED - FUNDS ESCROWED</strong>
            </div>
          </div>

          <div class="verified-box">
            <h2>✓ Confirmed in Escrow Custody Wallet</h2>
            <h3>${amt.formatted} USDC ESCROWED</h3>
            <code>Escrow Wallet Address: r3kSVwgsoQZCSG9NZ1GMUG54SUiH8yv66H</code>
          </div>

          <div class="details-list">
            <strong>Source Wallet:</strong> <span>rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt (Verified Balance: 174,000,000 USDC)</span>
            <strong>Issuer Wallet:</strong> <span>rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ (TROPTIONS / ECLAW Stablecoin Issuer)</span>
            <strong>Beneficiary Address:</strong> <span>r2KaS3soaSCSXpYJyiCvUf68UUPmepPxC (Awaiting Release activation)</span>
            <strong>Transfer Hash:</strong> <span style="font-family: monospace;">${amt.tx}</span>
          </div>

          <p style="font-size: 11px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            By issuing this instrument, The Loan Depot clears and guarantees the presence of verified reserve backing held inside whitelisted BitGo Trust multi-sig accounts, fully compliant with CMBS and institutional credit regulations.
          </p>

          <div class="footer">
            Confidential Document — For Qualified Institutional Review Only — Issued by The Loan Depot Lending Co.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  });
}

if (btnEmailPof) {
  btnEmailPof.addEventListener('click', () => {
    showToast("PDF Proof-of-Funds successfully emailed to compliance@prudential.com!");
  });
}

if (btnSignIssuePof) {
  btnSignIssuePof.addEventListener('click', () => {
    btnSignIssuePof.disabled = true;
    btnSignIssuePof.textContent = "Issued & Certified";
    
    // Add stamp inside certificate confirmed box
    const innerConfirmed = certConfirmedBox.querySelector('div');
    if (innerConfirmed) {
      innerConfirmed.innerHTML += `
        <div style="border-top: 1px dashed var(--accent-green); padding-top: 6px; margin-top: 6px; font-family: 'Fira Code', monospace; font-size: 8px; color: var(--accent-green);">
          ✓ ISSUED & CO-SIGNED BY NICK SHETH, CEO<br/>
          Consensus cleared: SECURE-POF-TLD-9093
        </div>
      `;
    }

    showToast("Proof-of-Funds instrument digitally signed and issued to counterparty!");
  });
}

// Resource Library Guides Document Database
const libraryGuides = {
  borrower_guide: {
    title: "Traditional CRE Lending Comparables (Legacy Systems)",
    overviewSpeechText: "This document is a comparative analysis sheet of traditional commercial real estate lending to show our clients the extreme friction of legacy institutions. It contrasts legacy timelines of 15 to 30 days for underwriting and closing with our instant on-chain escrow clearance and 90-second draw finality.",
    htmlContent: `
      <h1>Traditional CRE Lending Comparables</h1>
      <h3>Comparative Legacy Reference Document</h3>
      <p>Prepared by Niraj (Nick) Desai, President & CEO | The Loan Depot Lending Co.</p>
      <hr/>
      <p><strong>IMPORTANT NOTICE:</strong> This document details traditional commercial lending protocols and is provided <em>solely</em> as a market comparable to illustrate legacy friction. Under legacy guidelines, deals take weeks to close and draws take days. The Loan Depot’s Sovereign Clearing Network eliminates these timelines completely.</p>
      
      <h4>Underwriting & Clearing Telemetry: Traditional vs. Our System</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; width: 30%;">Loan Phase</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; width: 35%; color: #dc2626;">Legacy Bank Comparable</th>
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; width: 35%; color: #10b981;">Our Sovereign Clearing Network</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Loan Sizing</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #7f1d1d;">3 to 5 business days</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #10b981;">Within 48 hours (Direct Line)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Underwriting & Appraisal</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #7f1d1d;">15 to 30 business days (Paper search)</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #10b981;">Automated API & Floor Attestations</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Loan Closing & Funding</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #7f1d1d;">5 to 10 business days</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #10b981;">Under 90 Seconds (BitGo Trust Vault)</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Construction Draws</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #7f1d1d;">3 to 5 business days per request</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #10b981;">Instant Clearing (<90s to GC bank wire)</td>
          </tr>
        </tbody>
      </table>

      <h4>System Architecture Highlights:</h4>
      <ul>
        <li><strong>Frictionless Netting:</strong> Bypasses FedWire batching and escrow holds via whitelisted child account settlement.</li>
        <li><strong>Automated Attestations:</strong> Validates reserve backing on-chain in real time, eliminating outdated paper comfort letters.</li>
        <li><strong>Protected Quorum:</strong> 3-of-5 key consensus governs draw disburals dynamically.</li>
      </ul>
    `
  },
  cashout_guide: {
    title: "Cash-Out Refinance and Equity Recapture Client Guide",
    overviewSpeechText: "The Cash Out Refinance Guide details how to recapture built-up equity through restructured cashout loans without selling the asset. This allows developers to unlock their appreciation under compliant custody structures.",
    htmlContent: `
      <h1>Cash-Out Refinance and Equity Recapture Client Guide</h1>
      <h3>Accessing the Value You Have Built Instantly</h3>
      <p>The Loan Depot Lending Co. | origination desk</p>
      <hr/>
      <p>If your property has appreciated significantly, or if your loan balance has paid down substantially, you may have the option to recapture equity through a cash-out refinance. Traditional cashouts take weeks; our system executes refinancing recaptures instantly through programmatic netting and daily yield offsets.</p>
      <h4>Key Advantages:</h4>
      <ul>
        <li>No re-gathering of 5 years of documents; we utilize your existing active loan record.</li>
        <li>Bilateral SOFR interest rate swaps shield your cashout tranches from market volatility.</li>
        <li>Clears directly into isolated yield accounts earning 4.5% APY to actively offset borrower debt service costs.</li>
      </ul>
    `
  },
  private_network: {
    title: "The Loan Depot — Private Lending Network and Internal Funding Mechanisms",
    overviewSpeechText: "The Private Lending Network Guide explains how clearing nodes, isolated ledger pools, and whitelisted sub-account routing are used to eliminate traditional clearing friction.",
    htmlContent: `
      <h1>Private Lending Network and Internal Funding Mechanisms</h1>
      <h3>Sovereign Clearing Architecture</h3>
      <p>Confidential Reference Manual — The Loan Depot Lending Co.</p>
      <hr/>
      <p>By bringing our drawing ledgers completely in-house, we remove third-party clearing friction entirely. Draw settlements that previously took days can now finalize in minutes. We utilize isolated drawing sub-accounts and whitelisted recipient paths to secure borrower principal.</p>
      <h4>Features:</h4>
      <ul>
        <li>Clearing latency reduced from 3 business days to under 90 seconds.</li>
        <li>On-chain audit ledger appends immutable records to escrow draw registry.</li>
      </ul>
    `
  },
  asset_custody: {
    title: "The Loan Depot — Institutional Asset Custody and Borrower Fund Protection",
    overviewSpeechText: "The Institutional Custody Guide details how capital reserves are isolated in highly-regulated BitGo Trust Qualified Custody secure vaults, requiring a 3-of-5 signatory quorum for releases.",
    htmlContent: `
      <h1>Institutional Asset Custody and Borrower Fund Protection</h1>
      <h3>BitGo Trust Qualified Custody Infrastructure</h3>
      <hr/>
      <p>All loan proceeds are deposited into a dedicated institutional custody account established exclusively for your loan. Within that custody account, each major reserve and fund is held in its own separately tracked sub-account:</p>
      <ul>
        <li><strong>Construction Draw Reserve:</strong> Released to contractor upon approved draw milestones.</li>
        <li><strong>Debt Service Reserve:</strong> Covers loan payments during occupancy stabilization.</li>
        <li><strong>Contingency Fund:</strong> Held for unforeseen construction costs.</li>
        <li><strong>FF&E Budget:</strong> Furniture, Fixtures & Equipment for hotel loans.</li>
      </ul>
    `
  },
  cmbs_guide: {
    title: "The Loan Depot — CMBS Loan Packaging and Securitization Guide",
    overviewSpeechText: "The CMBS Securitization Guide explains how loans are packaged into CMBS pools and rated by credit agencies, using verified 25 million dollar tranche floors to protect senior debt.",
    htmlContent: `
      <h1>CMBS Loan Packaging and Securitization Guide</h1>
      <h3>Underwriting & Risk Allocation</h3>
      <hr/>
      <p>This guide explains how commercial real estate loans are packaged into Commercial Mortgage-Backed Securities (CMBS) pools. The Loan Depot partners with institutional desks like Prudential Mortgage Capital to structure senior and mezzanine debt tranches under verified capitalization asset floors.</p>
      <ul>
        <li>Senior CMBS Debt Tranche: $25,000,000.00</li>
        <li>Mezzanine Preferred Equity: $9,750,000.00</li>
        <li>Borrower Base Land Equity Floor: $4,100,000.00</li>
      </ul>
    `
  },
  m_helen_capital: {
    title: "M Helen Hotel LLC — Project Funding Summary and Capital Structure",
    overviewSpeechText: "The M Helen Hotel Summary details the capital structure, showing the 25 million dollar CMBS tranche and the 4 point 1 million land equity floor to create the 29 point 1 million dollar asset floor.",
    htmlContent: `
      <h1>M Helen Hotel LLC — Project Funding Summary & Capital Structure</h1>
      <h3>Property: New Orleans hospitality asset</h3>
      <hr/>
      <p>Financial structure detailing total verified asset floor of $29,100,000.00 matching G703 project budget of $28,906,886.00 with $193,114.00 unencumbered capital surplus.</p>
      <ul>
        <li>Prudential CMBS Tranche: $25,000,000.00</li>
        <li>Base Land Equity: $4,100,000.00</li>
        <li>Draw 1 Allocation (Mobilization): $961,021.51</li>
      </ul>
    `
  },
  m_helen_draw: {
    title: "M Helen Hotel LLC — Step-by-Step Funding Process and Draw Schedule",
    overviewSpeechText: "The M Helen Draw Schedule outlines the step-by-step G703 mobilization draw timeline, allocating 961 thousand dollars for mobilization, general conditions, and closing costs.",
    htmlContent: `
      <h1>M Helen Hotel LLC — Step-by-Step Funding Process and Draw Schedule</h1>
      <h3>Draw 1 Mobilization Breakdown</h3>
      <hr/>
      <p>Detailed G703 project budget allocation proposed for Draw 1:</p>
      <ul>
        <li>G703-01: Mobilization ($250,000.00)</li>
        <li>G703-02: General Conditions & Site Prep ($310,000.00)</li>
        <li>G703-03: Dirt & Drainage Study ($85,000.00)</li>
        <li>G703-04: Architectural & Engineering ($196,021.51)</li>
        <li>G703-05: Loan Closing & Legal Costs ($120,000.00)</li>
      </ul>
    `
  },
  draw_disbursement: {
    title: "The Loan Depot — Construction Draw Disbursement Guide",
    overviewSpeechText: "The Construction Draw Guide details how G702/G703 draw requests are cleared dynamically via isolated drawing accounts and off-ramped to contractors as fiat cash wires.",
    htmlContent: `
      <h1>Construction Draw Disbursement Guide</h1>
      <h3>Milestone-Based Draw Clearance</h3>
      <hr/>
      <p>Traditional draws require 3 to 5 business days per release. Our system clearing bridge checks compliance dynamically against approved budgets and off-ramps payments to standard USD Fiat wire to contractors in under 90 seconds.</p>
      <ul>
        <li>Step 1: General Contractor submits AIA G702/G703 application.</li>
        <li>Step 2: Loan system automatically checks draw against approved budget.</li>
        <li>Step 3: Construction monitor inspects site and certifies work.</li>
        <li>Step 4: Lender representative reviews monitor certification and approves.</li>
        <li>Step 5: Funds are released from Draw Reserve directly as standard USD Fiat via bank wire.</li>
      </ul>
    `
  },
  digital_enhanced: {
    title: "The Loan Depot — What Digital-Enhanced Commercial Lending Means for You",
    overviewSpeechText: "The Digital Enhanced Lending Guide contrasts legacy paper-based comfort letters with real-time balance attestations on the ledger, clearing transfers in under 90 seconds.",
    htmlContent: `
      <h1>What Digital-Enhanced Commercial Lending Means for You</h1>
      <h3>Real-Time Balance Attestations vs Legacy Comfort Letters</h3>
      <hr/>
      <p>Contrasts static, outdated physical bank comfort letters that take 3-5 business days to draft with real-time, cryptographically signed API balance attestations. Demonstrates compliance under highly-regulated custodian vault policy rules.</p>
    `
  },
  access_100m: {
    title: "Accessing $100M in Institutional Capital",
    overviewSpeechText: "Accessing One Hundred Million Dollars in Institutional Capital outlines how UnyKorn and The Loan Depot deploy capital at scale using syndicated liquidity matrices, CMBS conduits, and life insurance facilities.",
    htmlContent: `
      <h1>Accessing $100M in Institutional Capital</h1>
      <h3>The Loan Depot Lending Co. | In Partnership with Prudential</h3>
      <hr/>
      <p>Details how UnyKorn + The Loan Depot provides up to $100 Million for transactions. Through our institutional capital network—anchored by our partnership with Prudential Mortgage Capital Company and CMBS conduits—we structure and deploy up to $100 million in a single commercial real estate transaction with zero clearing friction.</p>
    `
  },
  lender_protocol: {
    title: "Prudential and Lender Access Protocol",
    overviewSpeechText: "The Prudential and Lender Access Protocol details the operational and technical rules for designated partners to verify, monitor, and audit construction escrow pools in real time via read only API clearing nodes.",
    htmlContent: `
      <h1>Prudential and Lender Access Protocol</h1>
      <h3>How Institutional Partners Verify and Monitor in Real Time</h3>
      <hr/>
      <p>Technical and operational protocol describing system roles, read-only API clearing nodes, and role-based access for Prudential capital markets, compliance, and asset management teams to audit escrow balances 24/7 without manual document requests.</p>
    `
  },
  power_moves: {
    title: "Power Moves: Advanced CRE Strategies",
    overviewSpeechText: "Power Moves details the advanced capital strategies made available to our borrowers, including same day proof of funds, earnest money bridges, simultaneous closings, and preferred equity leverage.",
    htmlContent: `
      <h1>Power Moves: Advanced CRE Strategies</h1>
      <h3>Institutional Capital Strategy Document</h3>
      <hr/>
      <p>Seven Power Moves for Qualified Borrowers:</p>
      <ul>
        <li><strong>Same-Day Proof of Funds Package:</strong> Wins competitive bidding windows through real-time attestation.</li>
        <li><strong>Earnest Money Bridge:</strong> Preserves operator liquidity during diligence.</li>
        <li><strong>Simultaneous Close:</strong> Eliminates two-step acquisition closing friction.</li>
        <li><strong>Preferred Equity Leverage:</strong> Maximizes LTV options up to 85% with SOFR netting.</li>
      </ul>
    `
  },
  bitgo_pof: {
    title: "BitGo Institutional Proof of Funds Guide",
    overviewSpeechText: "The BitGo Institutional Proof of Funds Guide explains how qualified custody trust accounts and the Go Network trading pools deliver verified capital confirmations in under ninety seconds.",
    htmlContent: `
      <h1>BitGo Institutional Proof of Funds Guide</h1>
      <h3>How BitGo Delivers Verified Capital Confirmation in Under 90 Seconds</h3>
      <hr/>
      <p>Detailed description of UnyKorn’s Master Enterprise setup (ID: 69a0b54edd793f289161ec0c50cee070) utilizing segregated Child Organization isolation, Qualified Custody vaults with 3-of-4 multi-sig keys, and Go Network trading escrow pools to confirm reserve backing instantly without legacy banking lag.</p>
    `
  }
};

let synthesisSpeechGuide = null;

// Listen Guide Handler
document.querySelectorAll('.btn-listen-guide').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof speechSynthesis === 'undefined') return;

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      // If clicking already speaking, stop and return
      if (synthesisSpeechGuide && btn.classList.contains('speaking')) {
        btn.classList.remove('speaking');
        btn.innerHTML = `<i data-lucide="volume-2" style="width:11px; height:11px;"></i> Listen`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }
    }

    // Reset other listen buttons
    document.querySelectorAll('.btn-listen-guide').forEach(b => {
      b.classList.remove('speaking');
      b.innerHTML = `<i data-lucide="volume-2" style="width:11px; height:11px;"></i> Listen`;
    });

    const guideKey = btn.dataset.guide;
    const guide = libraryGuides[guideKey];
    if (!guide) return;

    btn.classList.add('speaking');
    btn.innerHTML = `<i data-lucide="square" style="width:11px; height:11px;"></i> Stop`;
    if (window.lucide) window.lucide.createIcons();

    synthesisSpeechGuide = new SpeechSynthesisUtterance(guide.overviewSpeechText);

    // Apply voice and speed settings
    const selectedVoiceName = voiceSelect.value;
    if (selectedVoiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) synthesisSpeechGuide.voice = voice;
    }
    synthesisSpeechGuide.rate = parseFloat(speedSelect.value) || 1.0;

    synthesisSpeechGuide.onend = () => {
      btn.classList.remove('speaking');
      btn.innerHTML = `<i data-lucide="volume-2" style="width:11px; height:11px;"></i> Listen`;
      if (window.lucide) window.lucide.createIcons();
    };

    synthesisSpeechGuide.onerror = () => {
      btn.classList.remove('speaking');
      btn.innerHTML = `<i data-lucide="volume-2" style="width:11px; height:11px;"></i> Listen`;
      if (window.lucide) window.lucide.createIcons();
    };

    speechSynthesis.speak(synthesisSpeechGuide);
  });
});

// Download Guide Handler
document.querySelectorAll('.btn-download-guide').forEach(btn => {
  btn.addEventListener('click', () => {
    const guideKey = btn.dataset.guide;
    const guide = libraryGuides[guideKey];
    if (!guide) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${guide.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: auto; }
            h1 { color: #0f3b7c; border-bottom: 2px solid #b38d38; padding-bottom: 10px; font-size: 22px; }
            h3 { color: #b38d38; font-size: 14px; margin-top: -5px; }
            h4 { color: #0f3b7c; margin-top: 20px; font-size: 14px; text-transform: uppercase; }
            ul { padding-left: 20px; }
            li { margin-bottom: 6px; }
            hr { border: 0; border-top: 1px solid #ddd; margin: 20px 0; }
            .footer { margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 10px; font-size: 10px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          ${guide.htmlContent}
          <div class="footer">
            © 2026 The Loan Depot Lending Co, Inc. In Partnership with Prudential Mortgage Capital Company. All rights reserved.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  });
});

// Trigger initial generation
generateOutboundDocument();


