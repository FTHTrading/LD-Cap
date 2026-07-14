import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, ShieldCheck, Coins, TrendingUp, Merge, Volume2, Play, Square, CheckCircle, ShieldAlert, ArrowRight, Check, X
} from 'lucide-react';

export default function SovereignPipelineDashboard() {
  // App States
  const [activeTab, setActiveTab] = useState('custody');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletLogs, setWalletLogs] = useState(['Awaiting handshake trigger...']);
  
  const [isDrawExecuted, setIsDrawExecuted] = useState(false);
  const [executingDraw, setExecutingDraw] = useState(false);
  const [mintLogs, setMintLogs] = useState(['System idle. Click "Verify & Execute" to initiate signature handshake...']);
  const [drawChildBal, setDrawChildBal] = useState('$0.00 USDF');
  const [drawStatus, setDrawStatus] = useState('Draw 1 Status: Ready to Execute');
  
  // Hedging desk states
  const [sofrLeverage, setSofrLeverage] = useState(1);
  const [sofrCollateral, setSofrCollateral] = useState(100000);
  const [dailyStakingYield, setDailyStakingYield] = useState('$12.33 USDF / day');
  
  // Audio states
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioIndexRef = useRef(0);
  
  // RWA & Cross-Collateralization states
  const [portfolio, setPortfolio] = useState([
    { id: 'mhelen', name: 'M Helen Hotel LLC', region: 'Georgia', valuation: 29100000, equity: 4100000, status: 'Refinance Active', action: 'Escrow Mapped', disabled: true, checked: true },
    { id: 'la_portfolio', name: 'Louisiana Hotel Portfolio', region: 'Louisiana', valuation: 30500000, equity: 15250000, status: 'Tokenized (100%)', action: 'Fractionalize', disabled: false, checked: false },
    { id: 'ky_hotel', name: 'Kentucky Full Service Hotel', region: 'Kentucky', valuation: 10000000, equity: 5000000, status: 'Tokenized (100%)', action: 'Fractionalize', disabled: false, checked: false },
    { id: 'ca_hotel', name: 'California Limited Service Hotel', region: 'California', valuation: 19000000, equity: 9500000, status: 'Tokenized (100%)', action: 'Fractionalize', disabled: false, checked: false },
    { id: 'ca_full', name: 'California Full Service Hotel', region: 'California', valuation: 33000000, equity: 16500000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false },
    { id: 'tn_hotel', name: 'Tennessee Limited Service Hotel', region: 'Tennessee', valuation: 7000000, equity: 3500000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false },
    { id: 'tx_hotel_a', name: 'Texas Limited Service Hotel A', region: 'Texas', valuation: 2500000, equity: 1250000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false },
    { id: 'oh_portfolio', name: 'Ohio Hotel Portfolio', region: 'Ohio', valuation: 9000000, equity: 4500000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false },
    { id: 'tx_hotel_b', name: 'Texas Limited Service Hotel B', region: 'Texas', valuation: 6100000, equity: 3050000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false },
    { id: 'la_hotel', name: 'Louisiana Limited Service Hotel', region: 'Louisiana', valuation: 8000000, equity: 4000000, status: 'Idle Equity', action: 'Tokenize Asset', disabled: true, checked: false }
  ]);
  const [targetAcquisition, setTargetAcquisition] = useState('Miami Beach Resort - Tranche A ($8.5M)');
  const [pooledCollateral, setPooledCollateral] = useState(4100000);
  const [maxLtv, setMaxLtv] = useState(2665000);
  const [requiredAcquisition, setRequiredAcquisition] = useState(8500000);
  const [collateralSurplus, setCollateralSurplus] = useState(-5835000);
  const [executingCrossPurchase, setExecutingCrossPurchase] = useState(false);
  const [crossPurchaseExecuted, setCrossPurchaseExecuted] = useState(false);

  // Cryptographic Ledger states
  const [ledgerBlocks, setLedgerBlocks] = useState([
    {
      index: 1,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      draw: 'G703 Base Capitalization Setup',
      amount: '$29,100,000.00 Floor Lock',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: '8f0a0e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918c6f5a34e8d2e3c04',
      details: 'Locked Prudential CMBS Tranche ($25M) and M Helen Hotel LLC base land equity ($4.1M) as verified asset floor. Verified full G703 project construction budget ($28,906,886.00).'
    }
  ]);

  const speechText = [
    "Reconciliation Draw targets the first milestone allocation of nine hundred and sixty-one thousand and twenty-one dollars and fifty-one cents for the M Helen Hotel LLC project.",
    "The G703 schedule verification reconciles twenty-nine point one million dollars in asset floor against the twenty-eight point nine million dollar budget, securing a capital surplus of one hundred and ninety-three thousand one hundred and fourteen dollars.",
    "Programmatic stablecoin minting on Port 8888 checks signature requests via HMAC-SHA256 signature hashes and signs the transaction against whitelisted custodians."
  ];

  // 1. Initial Speech Synthesis voices population
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const getVoicesList = () => {
        let list = window.speechSynthesis.getVoices();
        const natural = list.filter(v => {
          const name = v.name.toLowerCase();
          return !name.includes('david') && !name.includes('zira') && !name.includes('hazel') && !name.includes('espeak') && !name.includes('desktop');
        }).sort((a, b) => a.name.localeCompare(b.name));
        setVoices(natural);
      };
      getVoicesList();
      window.speechSynthesis.onvoiceschanged = getVoicesList;
    }
  }, []);

  // 2. SOFR math calculations
  useEffect(() => {
    const daily = (sofrCollateral * 0.045) / 365;
    setDailyStakingYield(`$${daily.toFixed(2)} USDF / day`);
  }, [sofrCollateral]);

  // 3. Recalculate Cross-Collateral Values
  useEffect(() => {
    let totalEquity = 4100000; // Base M Helen Hotel Equity
    portfolio.forEach(prop => {
      if (prop.checked && !prop.disabled) {
        totalEquity += prop.equity;
      }
    });

    const ltv = totalEquity * 0.65;

    // Parse target price
    const match = targetAcquisition.match(/\$(\d+\.?\d*)M/);
    const requiredAmt = match ? parseFloat(match[1]) * 1000000 : 8500000;

    setPooledCollateral(totalEquity);
    setMaxLtv(ltv);
    setRequiredAcquisition(requiredAmt);
    setCollateralSurplus(ltv - requiredAmt);
  }, [portfolio, targetAcquisition]);

  // 4. Wallet Connection Simulation
  const handleInitiateSignature = () => {
    setWalletConnecting(true);
    setWalletLogs([]);
    
    const logs = [
      '[INFO] Initializing BitGo Gateway API v2...',
      '[INFO] Mapping sub-vault: "M Helen Hotel LLC Escrow Pool"...',
      '[POLICY] Scanning active rules for "Helen_Escrow_Pool"...',
      '[POLICY] Whitelist Check: 0x4E574939D460d284B5D990646D4aeaEF2D49Fa13 (Vetted)',
      '[SIG] Awaiting signature from Key 2 (SafeGuard Custodian)...',
      '[SUCCESS] Handshake verified. Connected as Unykorn Parent Vault.'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setWalletLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${log}`]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            setIsWalletConnected(true);
            setShowWalletModal(false);
            setWalletConnecting(false);
          }, 800);
        }
      }, (index + 1) * 400);
    });
  };

  // 5. Execute G703 Draw 1
  const handleExecuteDraw = () => {
    if (!isWalletConnected) {
      alert('Signature error: Connect your BitGo wallet first.');
      return;
    }
    setExecutingDraw(true);
    setMintLogs([]);

    const logs = [
      '--- INCOMING PORT 8888 TRANSACTION DETECTED ---',
      'POST /v2/wallet/0x4E57...Fa13/mint HTTP/1.1',
      'Headers: X-HMAC-Signature-SHA256, Content-Type: application/json',
      '[HMAC] Verifying signature against parent secret key...',
      '[HMAC] Payload: {"drawCode":"DRAW_1","amount":961021.51,"coin":"USDF"}',
      '[HMAC] Signature Hash: e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918f0a0',
      '[POLICY] Reconciling Draw 1 amount ($961,021.51) against G703 Code schedules...',
      '  - G703-01 (Mobilization): $250,000.00 (Match)',
      '  - G703-02 (General Site): $310,000.00 (Match)',
      '  - G703-03 (Dirt/Drainage): $85,000.00 (Match)',
      '  - G703-04 (Architectural): $196,021.51 (Match)',
      '  - G703-05 (Closing Cost): $120,000.00 (Match)',
      '[MINT] Minting 961,021.51 USDF directly to child wallet...',
      '[BitGo] Co-signers approved. Broadmitting transaction to Sovereign Clearing...',
      '[LEDGER] Appending new transaction block to SHA-256 chain...',
      '--- TRANSACTION CONFIRMED: Block #27492019 ---'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setMintLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsDrawExecuted(true);
          setExecutingDraw(false);
          setDrawChildBal('$961,021.51 USDF');
          setDrawStatus('Draw 1: Executed & Minted');
          
          // Append Block 2 to Cryptographic ledger
          setLedgerBlocks(prev => [
            {
              index: prev.length + 1,
              timestamp: new Date().toISOString(),
              draw: 'G703 Draw 1: Mobilization & Site Prep',
              amount: '$961,021.51 USDF',
              prevHash: prev[prev.length - 1].hash,
              hash: 'c6f5a34e8d2e3c0429f6p9fxa45d2d41a772da12b918c6f5a34e8d2e3c04',
              details: 'Verified G703 reconciliation. Mobilization ($250k), Site Prep ($310k), Dirt Study ($85k), A&E ($196k), Loan Cost ($120k). Whitelisted child wallet destination: 0x4E57...Fa13.'
            },
            ...prev
          ]);
        }
      }, (index + 1) * 200);
    });
  };

  // 6. Tokenize Austin/Nashville
  const handleTokenize = (id) => {
    setPortfolio(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, action: 'Tokenizing...' };
      }
      return p;
    }));

    setTimeout(() => {
      setPortfolio(prev => prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: 'Tokenized (100%)',
            action: 'Tokenized',
            disabled: false
          };
        }
        return p;
      }));
    }, 1200);
  };

  // 7. Cross Collateral checkbox selection toggle
  const handleCheckCollateral = (id) => {
    setPortfolio(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, checked: !p.checked };
      }
      return p;
    }));
  };

  // 8. Execute Cross-Collateral Acquisition
  const handleExecuteCrossPurchase = () => {
    if (!isWalletConnected) {
      alert('Signature error: Connect your BitGo wallet first.');
      return;
    }
    setExecutingCrossPurchase(true);
    setMintLogs([]);
    setActiveTab('mint'); // Shift view to terminal logs console

    const logs = [
      '--- CROSS-COLLATERAL ACQUISITION SEQUENCE ---',
      `POST /v2/wallet/0x4E57...Fa13/cross-collateral HTTP/1.1`,
      `Target Asset: ${targetAcquisition}`,
      '[HMAC] Signing collateral lock with Unykorn Executive Key...',
      '[BitGo] Provisioning child org drawing sub-vault: "ldcap_mhelen_acquisition"...',
      '[BitGo] Locking collateral tranches in escrow pool sub-vaults...',
      '[MINT] Minting acquisition USDF stablecoins to destination escrow account...',
      '[SUCCESS] Acquisition cleared. Mapped to child org drawing account!',
      '--- TRANSACTION CONFIRMED: Block #27492020 ---'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setMintLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setCrossPurchaseExecuted(true);
          setExecutingCrossPurchase(false);
          
          // Append Block 3 to Cryptographic ledger
          setLedgerBlocks(prev => [
            {
              index: prev.length + 1,
              timestamp: new Date().toISOString(),
              draw: `Acquisition: ${targetAcquisition}`,
              amount: `$${(requiredAcquisition).toLocaleString()} USDF`,
              prevHash: prev[prev.length - 1].hash,
              hash: '772da12b918f0a0e8c6a51d8b2e3c0429f6p9fxa45d2d41a772da12b918f0a0',
              details: `Cross-collateralized national portfolio. Target asset acquired under multi-sig escrow whitelist. BitGo child organization configured and registered.`
            },
            ...prev
          ]);
        }
      }, (index + 1) * 200);
    });
  };

  // 9. Speech Audio Tour Handler
  const handlePlayAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setAudioPlaying(true);
      audioIndexRef.current = 0;
      speakNextSegment();
    }
  };

  const speakNextSegment = () => {
    if (audioIndexRef.current >= speechText.length) {
      setAudioPlaying(false);
      return;
    }
    const text = speechText[audioIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      const vObj = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (vObj) utterance.voice = vObj;
    }
    utterance.rate = playbackSpeed;

    utterance.onend = () => {
      audioIndexRef.current += 1;
      speakNextSegment();
    };

    utterance.onerror = () => {
      setAudioPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-hidden bg-slate-950">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-[20%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="absolute top-[-50px] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/5 h-[70px] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
            ⛳ UnyKorn | LD Capital
          </div>
          <ul className="flex gap-2">
            {[
              { id: 'custody', label: 'Custody & Draw 1' },
              { id: 'mint', label: 'Stablecoin Minting' },
              { id: 'hedge', label: 'SOFR Hedging' },
              { id: 'rwa', label: 'RWA Tokenization' },
              { id: 'ledger', label: 'Audit Ledger' }
            ].map(tab => (
              <li key={tab.id}>
                <button 
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-semibold px-3 4px py-2 rounded-md transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white/5 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/2'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => !isWalletConnected && setShowWalletModal(true)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${
                isWalletConnected 
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                  : 'border-amber-400/40 bg-amber-400/10 text-amber-400 hover:opacity-90'
              }`}
            >
              <Wallet size={13} />
              {isWalletConnected ? 'Connected (0x4E57...)' : 'Connect Wallet'}
            </button>
            <div className={`text-[10px] uppercase font-bold border px-3 py-2 rounded-full tracking-wider transition-all ${
              isDrawExecuted
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/50 bg-amber-500/10 text-amber-400'
            }`}>
              {drawStatus}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column (Main views) */}
        <main className="lg:col-span-8 flex flex-col gap-8">
          
          {/* CUSTODY & DRAW 1 VIEW */}
          {activeTab === 'custody' && (
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              
              {/* Capitalization details */}
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-lg text-white flex justify-between items-center mb-4">
                  <span>📊 Capitalization & G703 Reconciliation</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Asset Floor Verified</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Verified Asset Floor</div>
                    <div className="text-xl font-bold text-white font-mono mt-1">$29,100,000.00</div>
                    <div className="text-[9px] text-slate-500 mt-1">$25M CMBS + $4.1M Land Equity</div>
                  </div>
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">G703 Project Budget</div>
                    <div className="text-xl font-bold text-white font-mono mt-1">$28,906,886.00</div>
                    <div className="text-[9px] text-slate-500 mt-1">Full hotel construction schedule</div>
                  </div>
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Capital Surplus</div>
                    <div className="text-xl font-bold text-emerald-400 font-mono mt-1">$193,114.00</div>
                    <div className="text-[9px] text-slate-500 mt-1">Unencumbered reserves surplus</div>
                  </div>
                </div>
              </section>

              {/* AIA G703 Draw Details */}
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-base text-white mb-4">📋 G703 Proposed Draw 1 Allocation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/5">
                        <th className="py-2 pb-3 font-semibold">Budget Line Item</th>
                        <th className="py-2 pb-3 font-semibold">G703 Code</th>
                        <th className="py-2 pb-3 font-semibold text-right font-mono">Allocation Amount</th>
                        <th className="py-2 pb-3 font-semibold text-right">Vetting Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { item: 'Mobilization & Startup', code: 'G703-01', amt: 250000.00 },
                        { item: 'General Conditions & Site Prep', code: 'G703-02', amt: 310000.00 },
                        { item: 'Dirt & Drainage Geotechnical Study', code: 'G703-03', amt: 8500000 },
                        { item: 'Architectural & Engineering Fees', code: 'G703-04', amt: 196021.51 },
                        { item: 'Loan Closing & Transaction Costs', code: 'G703-05', amt: 120000.00 }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/2">
                          <td className="py-3 text-slate-300 font-medium">{row.item}</td>
                          <td className="py-3 text-slate-400 font-mono">{row.code}</td>
                          <td className="py-3 text-right text-white font-mono">${row.amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-right text-emerald-400 font-medium">Vetted ✓</td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t border-white/10 bg-white/2">
                        <td className="py-3 text-white">Total Draw 1 Request</td>
                        <td className="py-3 text-slate-400 font-mono">G703-TOTAL</td>
                        <td className="py-3 text-right text-amber-400 font-mono">${(961021.51).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 text-right text-amber-400">Draw Ready</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* BitGo Sub-vault profiles */}
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-base text-white flex items-center gap-2 mb-3">
                  <ShieldCheck className="text-amber-400" size={16} /> BitGo Parent-Child Vault Configuration
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  The parent vault enforces compliance parameters, while operational sub-vaults act as drawing accounts. Whitelists restrict capital outbound paths.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3 text-center">
                    <strong className="block text-[10px] text-white">Helen_Escrow_Pool</strong>
                    <span className="text-xs font-mono text-amber-400 block mt-1">$29.10M USDF</span>
                    <span className="text-[9px] text-slate-500">Asset Pool (Parent)</span>
                  </div>
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3 text-center">
                    <strong className="block text-[10px] text-white">Helen_Draw_Account</strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">{drawChildBal}</span>
                    <span className="text-[9px] text-slate-500">Operational (Child)</span>
                  </div>
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3 text-center">
                    <strong className="block text-[10px] text-white">Helen_Reserve_Staking</strong>
                    <span className="text-xs font-mono text-cyan-400 block mt-1">4.5% APY Staked</span>
                    <span className="text-[9px] text-slate-500">Yield Reserves</span>
                  </div>
                  <div className="bg-black/25 border border-white/5 rounded-lg p-3 text-center">
                    <strong className="block text-[10px] text-white">Helen_Treasury_Fees</strong>
                    <span className="text-xs font-mono text-purple-400 block mt-1">0.25% Fee Hook</span>
                    <span className="text-[9px] text-slate-500">Ecosystem Fee</span>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* STABLECOIN MINTING VIEW */}
          {activeTab === 'mint' && (
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <div className="border-b border-white/5 pb-3 flex justify-between items-center mb-4">
                  <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                    <Coins className="text-amber-400" size={18} /> USDF On-Chain Stablecoin Minting Console
                  </h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">Port 8888 Secured</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  <div className="md:col-span-5 flex flex-col gap-4 bg-black/15 border border-white/5 p-4 rounded-lg">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Reconciliation Draw Target</label>
                      <select className="bg-slate-950 border border-white/5 rounded-md p-2.5 text-xs text-white cursor-pointer focus:outline-none focus:border-amber-400">
                        <option value="DRAW_1">Draw 1: Mobilization ($961,021.51)</option>
                        <option value="DRAW_2">Draw 2: Foundation & Framing (Est. $1.5M)</option>
                        <option value="DRAW_3">Draw 3: Electrical & Plumbing (Est. $2.0M)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Custodian Target Wallet Address</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="0x4E574939D460d284B5D990646D4aeaEF2D49Fa13" 
                        className="bg-slate-950 border border-white/5 rounded-md p-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mint Amount (USDF Stablecoins)</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="961,021.51" 
                        className="bg-slate-950 border border-white/5 rounded-md p-2.5 text-xs text-slate-400 font-mono focus:outline-none"
                      />
                    </div>

                    <button 
                      onClick={handleExecuteDraw}
                      disabled={executingDraw || isDrawExecuted}
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 disabled:bg-slate-800 disabled:text-slate-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 text-xs font-bold py-3 rounded-lg transition-all shadow-md shadow-amber-400/10"
                    >
                      {executingDraw ? 'Verifying...' : isDrawExecuted ? 'Draw 1 Executed' : 'Verify & Execute G703 Draw 1'}
                    </button>
                  </div>

                  <div className="md:col-span-7 flex flex-col gap-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex justify-between">
                      <span>HMAC-SHA256 Signature Verification Logs</span>
                      <span className="text-cyan-400 font-mono">listening on :8888</span>
                    </div>
                    <div className="bg-black/45 border border-white/5 rounded-lg p-3 font-mono text-[9px] leading-relaxed h-[220px] overflow-y-auto text-cyan-400 whitespace-pre-wrap">
                      {mintLogs.map((line, idx) => (
                        <div key={idx} className={line.startsWith('[SUCCESS]') || line.includes('TRANSACTION CONFIRMED') ? 'text-emerald-400 font-bold' : line.startsWith('[HMAC]') ? 'text-cyan-400' : line.startsWith('[POLICY]') || line.startsWith('  -') ? 'text-amber-300' : 'text-slate-400'}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </section>
            </div>
          )}

          {/* SOFR HEDGING VIEW */}
          {activeTab === 'hedge' && (
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 mb-3">
                  <TrendingUp className="text-cyan-400" size={18} /> SOFR Interest Rate Hedging Swaps
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Hedge debt financing cost exposure against rate fluctuations. Swaps clear bilateral blocks directly against collateral pools.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                  
                  <div className="md:col-span-6 flex flex-col gap-4 bg-black/15 border border-white/5 p-4 rounded-lg">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Hedge Leverage</label>
                        <strong className="text-cyan-400 font-mono">{sofrLeverage}x Leverage</strong>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={sofrLeverage} 
                        onChange={(e) => setSofrLeverage(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-950 cursor-pointer h-1.5 rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">USDF Margin Collateral</label>
                      <input 
                        type="number" 
                        value={sofrCollateral} 
                        onChange={(e) => setSofrCollateral(parseFloat(e.target.value) || 0)}
                        className="bg-slate-950 border border-white/5 rounded-md p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="flex justify-between text-xs border-t border-white/5 pt-3 mt-1">
                      <span className="text-slate-400">Daily Staking Yield Offset (4.5% APY)</span>
                      <strong className="text-emerald-400">{dailyStakingYield}</strong>
                    </div>

                    <button 
                      onClick={() => alert(`Bilateral SOFR swap orders placed for $${sofrCollateral} at ${sofrLeverage}x leverage!`)}
                      className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 text-xs font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-md shadow-cyan-400/10"
                    >
                      Execute Bilateral SOFR Swap
                    </button>
                  </div>

                  <div className="md:col-span-6 bg-black/25 border border-white/5 rounded-lg p-4 flex flex-col gap-3">
                    <h4 className="font-display font-semibold text-xs text-white border-b border-white/5 pb-2">SOFR Swap Performance Specifications</h4>
                    <ul className="flex flex-col gap-3 text-xs">
                      <li className="flex gap-2">
                        <span className="text-amber-400 font-bold">✓</span>
                        <div>
                          <strong className="text-white block">Escrow Pool Isolation</strong>
                          <span className="text-slate-400">Collateral is kept isolated within individual BitGo Child accounts rather than pooled globally.</span>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 font-bold">✓</span>
                        <div>
                          <strong className="text-white block">SOFR 30-Day Average Locking</strong>
                          <span className="text-slate-400">Rate calculations reference CME SOFR Average indexes to prevent intraday volatility spikes.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </section>
            </div>
          )}

          {/* RWA TOKENIZATION VIEW */}
          {activeTab === 'rwa' && (
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              
              {/* National Portfolio Table */}
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-lg text-white flex justify-between items-center mb-4">
                  <span>🌐 National RWA Real Estate Portfolio</span>
                  <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">$82.0M Portfolio Assets</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Tokenize and fractionalize your idle real estate equity across the nation. Once tokenized, properties can be cross-collateralized to acquire new assets and mint instant USDF liquidity.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/5">
                        <th className="py-2 pb-3 font-semibold">Property Name</th>
                        <th className="py-2 pb-3 font-semibold">Valuation</th>
                        <th className="py-2 pb-3 font-semibold">Locked Equity</th>
                        <th className="py-2 pb-3 font-semibold">Tokenization Status</th>
                        <th className="py-2 pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {portfolio.map((prop) => (
                        <tr key={prop.id} className="hover:bg-white/2">
                          <td className="py-3 text-slate-200">
                            <strong>{prop.name}</strong> <span className="text-[10px] text-slate-500 font-normal">({prop.region})</span>
                          </td>
                          <td className="py-3 text-slate-300 font-mono">${prop.valuation.toLocaleString()}</td>
                          <td className="py-3 text-slate-300 font-mono">${prop.equity.toLocaleString()}</td>
                          <td className={`py-3 font-semibold ${
                            prop.status.includes('Tokenized') 
                              ? 'text-emerald-400' 
                              : prop.status === 'Idle Equity' 
                              ? 'text-slate-500' 
                              : 'text-cyan-400'
                          }`}>
                            {prop.status}
                          </td>
                          <td className="py-3 text-right">
                            {prop.id === 'mhelen' ? (
                              <button disabled className="bg-white/2 border border-white/5 text-slate-500 text-[9px] px-2 py-1 rounded cursor-not-allowed opacity-50">
                                {prop.action}
                              </button>
                            ) : prop.status.includes('Tokenized') || prop.status === 'Fractionalized' ? (
                              <button 
                                onClick={() => {
                                  setPortfolio(prev => prev.map(p => p.id === prop.id ? { ...p, status: 'Fractionalized' } : p));
                                  alert(`${prop.name} fractionalized into 10,000 tranches successfully.`);
                                }}
                                className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-bold px-2 py-1 rounded hover:opacity-90"
                              >
                                {prop.status === 'Fractionalized' ? 'Fractionalized' : prop.action}
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleTokenize(prop.id)}
                                disabled={prop.action === 'Tokenizing...'}
                                className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-bold px-2 py-1 rounded hover:opacity-90 disabled:opacity-50"
                              >
                                {prop.action}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Cross-Collateralization Panel */}
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-base text-white flex items-center gap-2 mb-3">
                  <Merge className="text-cyan-400" size={16} /> Cross-Collateralization & Multi-Property Acquisition
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Select multiple tokenized properties from your national portfolio. Leverage their pooled equity to buy a new property tranche instantly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                  
                  {/* Stepper checkboxes */}
                  <div className="md:col-span-7 bg-black/15 border border-white/5 rounded-lg p-4 flex flex-col gap-3">
                    <strong className="text-[10px] text-amber-400 uppercase tracking-wider">1. Select Collateral Pool</strong>
                    <div className="flex flex-col gap-2.5 text-xs">
                      {portfolio.map(prop => (
                        <label key={prop.id} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={prop.checked}
                            disabled={prop.id === 'mhelen' || prop.status === 'Idle Equity'}
                            onChange={() => handleCheckCollateral(prop.id)}
                            className="accent-amber-400 cursor-pointer w-3.5 h-3.5"
                          />
                          <span className={prop.status === 'Idle Equity' ? 'text-slate-500' : 'text-slate-200'}>
                            {prop.name} (${(prop.equity / 1000000).toFixed(1)}M Equity {prop.status === 'Idle Equity' && '— Tokenize First'})
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-2 flex flex-col gap-2">
                      <strong className="text-[10px] text-amber-400 uppercase tracking-wider">2. Select Target Acquisition</strong>
                      <select 
                        value={targetAcquisition}
                        onChange={(e) => setTargetAcquisition(e.target.value)}
                        className="bg-slate-950 border border-white/5 rounded-md p-2.5 text-xs text-white cursor-pointer focus:outline-none"
                      >
                        <option value="Miami Beach Resort - Tranche A ($8.5M)">Miami Beach Resort - Tranche A ($8.5M)</option>
                        <option value="Dallas Plaza Refinancing Tranche B ($5.0M)">Dallas Plaza Refinancing Tranche B ($5.0M)</option>
                        <option value="Denver Logistics Hub Tranche C ($12.0M)">Denver Logistics Hub Tranche C ($12.0M)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculations and Actions */}
                  <div className="md:col-span-5 bg-black/25 border border-white/5 rounded-lg p-4 flex flex-col justify-between gap-4">
                    <div>
                      <strong className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-3">Refinancing Calculations</strong>
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pooled Collateral Equity:</span>
                          <strong className="font-mono text-white">${pooledCollateral.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Max LTV (65%):</span>
                          <strong className="font-mono text-amber-400">${maxLtv.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Required Acquisition Draw:</span>
                          <strong className="font-mono text-red-400">${requiredAcquisition.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                          <span className="text-slate-400">Collateral Status:</span>
                          <strong className={`font-mono ${collateralSurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {collateralSurplus >= 0 
                              ? `Surplus: +$${collateralSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                              : `Deficit: -$${Math.abs(collateralSurplus).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleExecuteCrossPurchase}
                      disabled={executingCrossPurchase || crossPurchaseExecuted || collateralSurplus < 0}
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 disabled:bg-slate-800 disabled:text-slate-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 text-xs font-bold py-3 rounded-lg transition-all"
                    >
                      {executingCrossPurchase ? 'Executing...' : crossPurchaseExecuted ? 'Acquisition Executed' : 'Execute Cross-Collateral Acquisition'}
                    </button>
                  </div>

                </div>
              </section>

            </div>
          )}

          {/* LEDGER VIEW */}
          {activeTab === 'ledger' && (
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <h3 className="font-display font-semibold text-lg text-white flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                  <span>⛓️ G703 Cryptographic Audit Trail Ledger</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Chain Verified</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Real-time SHA-256 hash chains of draw allocations and policy validations. Any changes break parent anchors instantly.
                </p>
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {ledgerBlocks.map((block) => (
                    <div key={block.index} className="bg-black/30 border border-white/5 rounded-lg p-3.5 flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] text-emerald-400">
                        <strong>BLOCK #{block.index} (Draw Verification)</strong>
                        <span className="font-mono">{block.timestamp}</span>
                      </div>
                      <div className="text-xs text-white">
                        <strong>Target:</strong> {block.draw} | <strong>Amount:</strong> {block.amount}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-relaxed">{block.details}</div>
                      <div className="flex flex-col gap-1 font-mono text-[8px] text-slate-500 border-t border-white/5 border-dashed pt-2.5 mt-1.5">
                        <div>PREV HASH: {block.prevHash}</div>
                        <div className="text-cyan-400">CURR HASH: {block.hash}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

        </main>

        {/* Right Column (Pipeline / Stepper & Audio Panel) */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Sovereign Pipeline stepper */}
          <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
            <h3 className="font-display font-semibold text-xs text-white mb-4 uppercase tracking-wider">🚀 Phased Sovereign Draw Pipeline</h3>
            
            <div className="flex flex-col gap-5 relative">
              
              <div className="flex gap-4 items-start relative">
                <div className="absolute top-6 left-3 w-[2px] h-[calc(100%-12px)] bg-emerald-500" />
                <div className="bg-emerald-500 border-2 border-emerald-400/20 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold text-slate-950 flex-shrink-0 z-10">
                  1
                </div>
                <div>
                  <strong className="text-xs text-white block">CMBS Clearance & Entitlement Lock</strong>
                  <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">Prudential CMBS Tranche of $25M reconciled. Base land equity of $4.1M secured in child org sub-wallet.</span>
                </div>
              </div>

              <div className="flex gap-4 items-start relative">
                <div className={`absolute top-6 left-3 w-[2px] h-[calc(100%-12px)] ${isDrawExecuted ? 'bg-emerald-500' : 'bg-white/10'}`} />
                <div className={`border-2 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold flex-shrink-0 z-10 transition-all ${
                  isDrawExecuted 
                    ? 'bg-emerald-500 border-emerald-400/20 text-slate-950'
                    : 'bg-slate-950 border-white/10 text-amber-400 border-amber-400/40 shadow-sm shadow-amber-400/10'
                }`}>
                  2
                </div>
                <div>
                  <strong className="text-xs text-white block">G703 Draw 1 Audit Handshake</strong>
                  <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">Verify Draw 1 Request ($961,021.51) against general conditions and site prep entitling schedules.</span>
                </div>
              </div>

              <div className="flex gap-4 items-start relative">
                <div className={`border-2 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold flex-shrink-0 z-10 transition-all ${
                  crossPurchaseExecuted
                    ? 'bg-emerald-500 border-emerald-400/20 text-slate-950'
                    : isDrawExecuted
                    ? 'bg-slate-950 border-amber-400/40 text-amber-400 shadow-sm shadow-amber-400/10'
                    : 'bg-slate-950 border-white/10 text-slate-400'
                }`}>
                  3
                </div>
                <div>
                  <strong className="text-xs text-white block">On-Chain Stablecoin Draw Minting</strong>
                  <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">Approve HMAC signature checks and programmatically mint USDF directly into drawing sub-wallet.</span>
                </div>
              </div>

            </div>
          </section>

          {/* Guided Audio Presentation */}
          <section className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
            <h3 className="font-display font-semibold text-xs text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="text-amber-400" size={14} /> Guided Audio Presentation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Listen to Unykorn's sovereign capital pipeline and G703 Draw schedule audit mechanisms.
            </p>

            <div className="flex justify-between items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex gap-2">
                <button 
                  onClick={handlePlayAudio}
                  disabled={audioPlaying}
                  className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-bold py-1.5 px-3 rounded-md flex items-center gap-1 hover:opacity-90 disabled:opacity-50"
                >
                  <Play size={10} /> Listen
                </button>
                <button 
                  onClick={handleStopAudio}
                  disabled={!audioPlaying}
                  className={`border text-[10px] font-bold py-1.5 px-3 rounded-md flex items-center gap-1 transition-all ${
                    audioPlaying 
                      ? 'border-red-500/40 bg-red-500/5 text-red-400 cursor-pointer' 
                      : 'border-white/5 bg-white/2 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Square size={10} /> Stop
                </button>
              </div>

              {/* Wave equalizers */}
              <div className={`flex gap-1.5 items-end h-4 ${audioPlaying ? 'playing-equalizer' : ''}`}>
                {[1, 2, 3, 4, 5].map(bar => (
                  <div 
                    key={bar} 
                    className="w-[2px] h-1.5 bg-amber-400 transition-all duration-300"
                    style={{
                      animation: audioPlaying ? `equalize 0.8s infinite alternate delay-${bar}` : 'none',
                      animationDelay: audioPlaying ? `${bar * 0.15}s` : '0s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <select 
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-slate-950 border border-white/5 rounded-md p-2 text-[10px] text-white cursor-pointer focus:outline-none"
                  title="Select narration voice"
                >
                  <option value="">Default Voice</option>
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <select 
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-slate-950 border border-white/5 rounded-md p-2 text-[10px] text-white cursor-pointer focus:outline-none"
                  title="Select playback speed"
                >
                  <option value="0.8">0.8x Speed</option>
                  <option value="1.0">1.0x Speed</option>
                  <option value="1.2">1.2x Speed</option>
                </select>
              </div>
            </div>
          </section>

        </aside>

      </div>

      {/* BitGo Signature Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-xl p-6 shadow-2xl relative animate-scaleIn">
            
            <button 
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="text-amber-400" size={16} />
                BitGo Multi-Sig Signature Gateway
              </h4>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Establishing secure, bankruptcy-remote connection to Unykorn's institutional private custody vaults. Approve multi-sig policies to proceed.
              </p>

              <div className="bg-black/45 border border-white/5 rounded-lg p-3.5 font-mono text-[9px] h-36 overflow-y-auto text-cyan-400 flex flex-col gap-1">
                {walletLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>

              <button 
                onClick={handleInitiateSignature}
                disabled={walletConnecting}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold py-3 rounded-lg hover:opacity-90 transition-all"
              >
                {walletConnecting ? 'Processing Handshake...' : 'Initiate Signature Request'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global CSS Inject */}
      <style jsx global>{`
        @keyframes equalize {
          0% { height: 4px; }
          100% { height: 16px; }
        }
        .playing-equalizer div {
          height: 16px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
