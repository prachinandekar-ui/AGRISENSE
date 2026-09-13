/**
 * CropWise — Frontend Application Controller
 * Handles UI routing, interactive soil & season selectors, geolocation,
 * Chart.js visualization, multi-language switching, and farmer authentication.
 */

// Application State
const state = {
  lang: localStorage.getItem('cropwise_lang') || 'en',
  user: JSON.parse(localStorage.getItem('cropwise_user') || 'null') || {
    name: "Ramesh Patil",
    phone: "9876543210",
    state: "Maharashtra",
    district: "Nagpur",
    landArea: 2.5,
    isDemo: true
  },
  selectedSoil: "Black Soil",
  selectedSeason: "Kharif",
  selectedState: "Maharashtra",
  selectedDistrict: "Nagpur",
  landArea: 2.5,
  currentRecommendations: null,
  chartInstance: null
};

// Multilingual Text Dictionary
const I18N = {
  en: {
    brandSubtitle: "Smart Crop Recommendation for Every Farmer",
    navHome: "Get Recommendation",
    navHowItWorks: "How It Works",
    navWeather: "Weather",
    navMandi: "Mandi Prices",
    navHistory: "History",
    navLogin: "Farmer Login",
    navProfile: "My Farm Profile",
    heroTitle: "Find the Best Crop for Your Land",
    heroSubtitle: "Get scientific, high-profit crop recommendations based on your soil type, regional climate, and upcoming season.",
    badgeNational: "🌱 Indian Agronomic Intelligence",
    step1Title: "Select Soil Type",
    step1Subtitle: "Choose the dominant soil on your farmland",
    step2Title: "Location & Region",
    step2Subtitle: "Where is your farm located?",
    step3Title: "Upcoming Season",
    step3Subtitle: "Which season are you sowing for?",
    btnAutoLocate: "📍 Use My Live Location",
    locDetected: "Selected Location:",
    landAreaLabel: "Total Land Size (Acres)",
    btnGetRecommendation: "🌱 Get Recommendation",
    btnTesting: "⚙️ Analyzing Soil & Climate Data...",
    resultsTitle: "Top 3 Recommended Crops for Your Field",
    resultsSubtitle: "Calculated based on agronomy models, regional climate, and market trends",
    rank: "Rank",
    suitability: "Suitability Score",
    waterNeed: "Water Requirement",
    growingTime: "Growing Time",
    expectedYield: "Expected Yield",
    mandiPrice: "Est. Mandi Price",
    netProfit: "Est. Net Profit",
    whyThisCrop: "Why This Crop?",
    howItWorksTitle: "How AGRISENSE Works",
    howItWorksSubtitle: "Simple, transparent, and built for real Indian farming conditions",
    hwStep1Title: "1. Select Soil & Location",
    hwStep1Desc: "Pick your soil type (Black, Alluvial, Red, etc.), district, and upcoming sowing season.",
    hwStep2Title: "2. Intelligent Agronomic Match",
    hwStep2Desc: "Our model matches your land against 16+ verified crops, water requirements, and climate zones.",
    hwStep3Title: "3. Harvest High Profit",
    hwStep3Desc: "Review suitability, growing days, irrigation advisory, and estimated Mandi earnings.",
    advisoryAlertTitle: "⚠️ Important Farmer Advisory Notice",
    advisoryAlertBody: "Crop recommendations are generated using scientific agronomic suitability models. We strongly advise farmers to cross-check real-time local weather forecasts (such as monsoon onset or rainfall breaks) and current APMC Mandi commodity rates before final seed procurement and sowing.",
    btnCheckAnother: "🔄 Check Another Field",
    btnSaveHistory: "📥 Save to History",
    historySaved: "Saved to your farm history!",
    loginTitle: "Farmer Login",
    loginSubtitle: "Sign in to view personalized field recommendations and track your crop history.",
    demoBtn: "🚀 Continue as Demo Farmer (Ramesh Patil)",
    phoneLabel: "Mobile Number",
    passLabel: "Password / PIN",
    btnLoginSubmit: "Sign In to AGRISENSE",
    noAccount: "New farmer? Create an account",
    registerTitle: "Create Farmer Account",
    fullNameLabel: "Full Name",
    createAccountSubmit: "🌱 Create My AGRISENSE Account",
    chartTitle: "Crop Suitability Comparison (%)"
  },
  hi: {
    brandSubtitle: "हर किसान के लिए सटीक फसल मार्गदर्शन",
    navHome: "फसल सिफारिश",
    navHowItWorks: "यह कैसे काम करता है",
    navWeather: "मौसम",
    navMandi: "मंडी भाव",
    navHistory: "इतिहास",
    navLogin: "किसान लॉगिन",
    navProfile: "मेरी प्रोफाइल",
    heroTitle: "अपने खेत के लिए सर्वोत्तम फसल चुनें",
    heroSubtitle: "अपनी मिट्टी, जिले और मौसम के आधार पर वैज्ञानिक व सर्वाधिक लाभ देने वाली फसलों की सिफारिश पाएं।",
    badgeNational: "🌱 भारतीय कृषि अनुसंधान पर आधारित",
    step1Title: "मिट्टी का प्रकार चुनें",
    step1Subtitle: "आपके खेत में किस प्रकार की मिट्टी है?",
    step2Title: "स्थान और क्षेत्र",
    step2Subtitle: "आपका खेत किस राज्य व जिले में है?",
    step3Title: "आगामी मौसम / सीजन",
    step3Subtitle: "आप किस मौसम में बुवाई कर रहे हैं?",
    btnAutoLocate: "📍 मेरी वर्तमान लोकेशन लें",
    locDetected: "चुना गया स्थान:",
    landAreaLabel: "खेत का आकार (एकड़)",
    btnGetRecommendation: "🌱 फसल सिफारिश प्राप्त करें",
    btnTesting: "⚙️ मिट्टी व मौसम डेटा का विश्लेषण हो रहा है...",
    resultsTitle: "आपके खेत के लिए शीर्ष 3 उपयुक्त फसलें",
    resultsSubtitle: "कृषि विज्ञान, जलवायु और मंडी मांग के आधार पर तैयार",
    rank: "स्थान",
    suitability: "अनुकूलता स्कोर",
    waterNeed: "पानी की आवश्यकता",
    growingTime: "तैयार होने का समय",
    expectedYield: "अनुमानित पैदावार",
    mandiPrice: "मंडी भाव",
    netProfit: "अनुमानित शुद्ध मुनाफा",
    whyThisCrop: "यही फसल क्यों?",
    howItWorksTitle: "CropWise कैसे काम करता है?",
    howItWorksSubtitle: "आसान, पारदर्शी और किसानों की ज़रूरतों के अनुकूल",
    hwStep1Title: "1. मिट्टी और स्थान चुनें",
    hwStep1Desc: "अपनी मिट्टी (काली, दोमट, लाल आदि), जिला और बुवाई का मौसम चुनें।",
    hwStep2Title: "2. एग्रोनॉमिक मैचिंग",
    hwStep2Desc: "हमारा मॉडल 16+ फसलों के पानी, तापमान व मिट्टी की ज़रूरतों का मिलान करता है।",
    hwStep3Title: "3. अधिकतम लाभ कमाएं",
    hwStep3Desc: "अनुकूलता स्कोर, अवधि, सिंचाई सलाह और अनुमानित मुनाफा देखकर फैसला लें।",
    advisoryAlertTitle: "⚠️ किसान भाइयों के लिए आवश्यक सूचना",
    advisoryAlertBody: "फसल सिफारिशें कृषि विज्ञान के मानकों पर आधारित हैं। बुवाई और बीज खरीदने से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK), स्थानीय मौसम पूर्वानुमान और वर्तमान मंडी भावों की पुष्टि अवश्य करें।",
    btnCheckAnother: "🔄 दूसरे खेत की जांच करें",
    btnSaveHistory: "📥 इतिहास में सहेजें",
    historySaved: "इतिहास में सुरक्षित किया गया!",
    loginTitle: "किसान लॉगिन",
    loginSubtitle: "अपनी फसलों का रिकॉर्ड देखने के लिए लॉगिन करें।",
    demoBtn: "🚀 डेमो किसान के रूप में आगे बढ़ें (रमेश पाटिल)",
    phoneLabel: "मोबाइल नंबर",
    passLabel: "पासवर्ड / पिन",
    btnLoginSubmit: "लॉगिन करें",
    noAccount: "नया खाता बनाएं",
    registerTitle: "किसान खाता बनाएं",
    fullNameLabel: "पूरा नाम",
    createAccountSubmit: "पंजीकरण करें",
    chartTitle: "फसल अनुकूलता तुलना (%)"
  },
  mr: {
    brandSubtitle: "शेतकऱ्यांसाठी अचूक पीक मार्गदर्शन",
    navHome: "पीक शिफारस",
    navHowItWorks: "हे कसे कार्य करते",
    navWeather: "हवामान",
    navMandi: "बाजारभाव",
    navHistory: "माझा इतिहास",
    navLogin: "शेतकरी लॉगिन",
    navProfile: "माझे प्रोफाईल",
    heroTitle: "तुमच्या शेतासाठी सर्वाधिक नफ्याचे पीक निवडा",
    heroSubtitle: "जमिनीचा प्रकार, स्थानिक हवामान आणि हंगामानुसार शास्त्रोक्त व हमखास उत्पन्न देणाऱ्या पिकांची निवड करा.",
    badgeNational: "🌱 भारतीय कृषी विज्ञानावर आधारित",
    step1Title: "जमिनीचा प्रकार निवडा",
    step1Subtitle: "तुमच्या शेतात कोणत्या प्रकारची माती आहे?",
    step2Title: "स्थान आणि जिल्हा",
    step2Subtitle: "तुमची शेती कुठे आहे?",
    step3Title: "पेरणीचा हंगाम",
    step3Subtitle: "तुम्ही कोणत्या हंगामात पेरणी करत आहात?",
    btnAutoLocate: "📍 माझे चालू लोकेशन घ्या",
    locDetected: "निवडलेले स्थान:",
    landAreaLabel: "जमिनीचे क्षेत्र (एकर)",
    btnGetRecommendation: "🌱 सर्वोत्तम पीक शिफारस मिळवा",
    btnTesting: "⚙️ माती व हवामान विश्लेषण सुरू आहे...",
    resultsTitle: "तुमच्या शेतासाठी पहिल्या ३ सर्वोत्तम पिकांची शिफारस",
    resultsSubtitle: "कृषी तज्ज्ञांच्या नियमांवर व बाजारभावानुसार काढलेले निष्कर्ष",
    rank: "क्रमांक",
    suitability: "अनुकूलता टक्केवारी",
    waterNeed: "पाण्याची गरज",
    growingTime: "वाढीचा कालावधी",
    expectedYield: "अपेक्षित उत्पादन",
    mandiPrice: "बाजारभाव",
    netProfit: "अपेक्षित निव्वळ नफा",
    whyThisCrop: "हेच पीक का?",
    howItWorksTitle: "CropWise कसे कार्य करते?",
    howItWorksSubtitle: "सोपे, पारदर्शक आणि शेतकऱ्यांच्या हिताचे",
    hwStep1Title: "१. माती आणि स्थान निवडा",
    hwStep1Desc: "तुमच्या जमिनीचा प्रकार (काळी, गाळाची, तांबडी), जिल्हा आणि पेरणीचा हंगाम निवडा.",
    hwStep2Title: "२. कृषी विज्ञानानुसार पडताळणी",
    hwStep2Desc: "आमचे मॉडेल १६+ पिकांची पाण्याची गरज, वाढीचा काळ आणि हवामानाशी अचूक जुळणी करते.",
    hwStep3Title: "३. भरघोस उत्पादन व नफा मिळवा",
    hwStep3Desc: "अनुकूलता टक्केवारी, पाण्याची गरज, खतांचे वेळापत्रक आणि बाजारभाव पाहून पेरणीचा निर्णय घ्या.",
    advisoryAlertTitle: "⚠️ शेतकरी बांधवांसाठी महत्त्वाची मार्गदर्शक सूचना",
    advisoryAlertBody: "ही पीक शिफारस कृषी शास्त्रीय नियमांवर आधारित आहे. बियाणे खरेदी आणि पेरणी करण्यापूर्वी स्थानिक हवामान अंदाज (मान्सूनची स्थिती) आणि नजीकच्या कृषी उत्पन्न बाजार समितीतील (APMC) सध्याचे बाजारभाव नक्की तपासा.",
    btnCheckAnother: "🔄 दुसऱ्या शेताची तपासणी करा",
    btnSaveHistory: "📥 इतिहास जतन करा",
    historySaved: "इतिहास यशस्वीरित्या जतन केला!",
    loginTitle: "शेतकरी लॉगिन",
    loginSubtitle: "तुमच्या शेताच्या शिफारशी आणि नोंदी पाहण्यासाठी लॉगिन करा.",
    demoBtn: "🚀 डेमो शेतकरी म्हणून सुरू करा (रमेश पाटील)",
    phoneLabel: "मोबाईल नंबर",
    passLabel: "पासवर्ड / पिन",
    btnLoginSubmit: "लॉगिन करा",
    noAccount: "नवीन शेतकरी? खाते तयार करा",
    registerTitle: "शेतकरी नोंदणी",
    fullNameLabel: "पूर्ण नाव",
    createAccountSubmit: "नोंदणी पूर्ण करा",
    chartTitle: "पीक अनुकूलता तुलना (%)"
  }
};

// Helper: Get text based on current language
function t(key) {
  const dict = I18N[state.lang] || I18N['en'];
  return dict[key] || I18N['en'][key] || key;
}

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSelector();
  populateLocationsDropdown();
  initRegisterLocations();
  initSoilSelector();
  initSeasonSelector();
  initUserBadge();
  applyLanguage(state.lang);

  // Setup form listener
  const form = document.getElementById('recommendationForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Pre-load default state into form fields
  syncFormWithState();
});

/**
 * Sync form elements with application state
 */
function syncFormWithState() {
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const landAreaInput = document.getElementById('landAreaInput');

  if (stateSelect && state.selectedState) {
    stateSelect.value = state.selectedState;
    updateDistricts();
  }
  if (districtSelect && state.selectedDistrict) {
    districtSelect.value = state.selectedDistrict;
  }
  if (landAreaInput) {
    landAreaInput.value = state.landArea;
  }
  updateLocationSummary();
}

/**
 * Initialize Language Dropdown
 */
function initLanguageSelector() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = state.lang;
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}

/**
 * Switch Application Language
 */
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('cropwise_lang', lang);
  applyLanguage(lang);

  // If recommendations already rendered, re-render with translated strings
  if (state.currentRecommendations) {
    // Re-evaluate with current language
    const recs = window.cropWiseEngine.predict({
      soilType: state.selectedSoil,
      state: state.selectedState,
      district: state.selectedDistrict,
      season: state.selectedSeason,
      landArea: state.landArea,
      lang: state.lang
    });
    renderResults(recs);
  }
}

/**
 * Apply localized strings across all DOM elements with data-i18n attributes
 */
function applyLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated) {
      if (el.tagName === 'INPUT' && el.getAttribute('type') === 'button') {
        el.value = translated;
      } else {
        el.innerText = translated;
      }
    }
  });

  // Re-render soil selector labels for localized names
  renderSoilCards();
  renderSeasonCards();
  updateLocationSummary();
}

/**
 * Populate States and Districts in Dropdowns
 */
function populateLocationsDropdown() {
  const stateSelect = document.getElementById('stateSelect');
  if (!stateSelect) return;

  stateSelect.innerHTML = LOCATIONS_DATA.map((loc) => 
    `<option value="${loc.state}">${loc.state}</option>`
  ).join('');

  stateSelect.value = state.selectedState;
  stateSelect.addEventListener('change', (e) => {
    state.selectedState = e.target.value;
    updateDistricts();
    updateLocationSummary();
  });

  updateDistricts();
}

function updateDistricts() {
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  if (!districtSelect) return;

  const locObj = LOCATIONS_DATA.find((l) => l.state === stateSelect.value);
  if (locObj) {
    districtSelect.innerHTML = locObj.districts.map((d) => 
      `<option value="${d}">${d}</option>`
    ).join('');
    state.selectedDistrict = locObj.districts[0];
    districtSelect.value = state.selectedDistrict;
  }

  districtSelect.addEventListener('change', (e) => {
    state.selectedDistrict = e.target.value;
    updateLocationSummary();
  });
}

function updateLocationSummary() {
  const summaryEl = document.getElementById('locSummaryText');
  if (summaryEl) {
    summaryEl.innerHTML = `<span class="text-stone-500">${t('locDetected')}</span> <strong class="text-emerald-800 font-bold">${state.selectedDistrict}, ${state.selectedState}</strong>`;
  }
}

/**
 * Populate Registration Page State & District Selectors
 */
function initRegisterLocations() {
  const regState = document.getElementById('regState');
  const regDistrict = document.getElementById('regDistrict');
  if (!regState || !regDistrict) return;

  regState.innerHTML = LOCATIONS_DATA.map((loc) => 
    `<option value="${loc.state}">${loc.state}</option>`
  ).join('');

  regState.value = "Maharashtra";
  updateRegisterDistricts();

  regState.addEventListener('change', () => {
    updateRegisterDistricts();
  });
}

function updateRegisterDistricts() {
  const regState = document.getElementById('regState');
  const regDistrict = document.getElementById('regDistrict');
  if (!regState || !regDistrict) return;

  const locObj = LOCATIONS_DATA.find((l) => l.state === regState.value);
  if (locObj) {
    regDistrict.innerHTML = locObj.districts.map((d) => 
      `<option value="${d}">${d}</option>`
    ).join('');
    regDistrict.value = locObj.districts[0];
  }
}

/**
 * Geolocation Detection
 */
function detectLiveLocation() {
  const btn = document.getElementById('btnAutoLocate');
  if (btn) {
    btn.innerHTML = `<span>⏳ Detecting...</span>`;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser. Using regional location.");
    if (btn) btn.innerHTML = `<span>${t('btnAutoLocate')}</span>`;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // Approximate nearest Indian state/district
      let detectedState = "Maharashtra";
      let detectedDistrict = "Nagpur";

      if (lat > 28 && lon < 77) {
        detectedState = "Punjab";
        detectedDistrict = "Ludhiana";
      } else if (lat > 25 && lon > 80) {
        detectedState = "Uttar Pradesh";
        detectedDistrict = "Varanasi";
      } else if (lat > 21 && lon < 74) {
        detectedState = "Gujarat";
        detectedDistrict = "Surat";
      } else if (lat < 15) {
        detectedState = "Karnataka";
        detectedDistrict = "Belagavi";
      }

      state.selectedState = detectedState;
      state.selectedDistrict = detectedDistrict;

      const stateSelect = document.getElementById('stateSelect');
      if (stateSelect) {
        stateSelect.value = detectedState;
        updateDistricts();
        const districtSelect = document.getElementById('districtSelect');
        if (districtSelect) districtSelect.value = detectedDistrict;
      }

      updateLocationSummary();

      if (btn) {
        btn.innerHTML = `<span>✅ ${detectedDistrict} Detected</span>`;
        setTimeout(() => {
          btn.innerHTML = `<span>${t('btnAutoLocate')}</span>`;
        }, 3000);
      }
    },
    (err) => {
      console.warn("Geolocation error or permission denied:", err);
      alert("Location access was denied or timed out. Defaulted to Nagpur, Maharashtra.");
      if (btn) btn.innerHTML = `<span>${t('btnAutoLocate')}</span>`;
    },
    { timeout: 6000 }
  );
}

/**
 * Soil Type Selector Component
 */
function initSoilSelector() {
  renderSoilCards();
}

function renderSoilCards() {
  const container = document.getElementById('soilCardContainer');
  if (!container) return;

  container.innerHTML = SOIL_TYPES.map((soil) => {
    const isSelected = soil.id === state.selectedSoil;
    return `
      <div class="selectable-card ${isSelected ? 'active' : ''}" onclick="selectSoil('${soil.id}')">
        <div class="text-3xl flex-shrink-0">${soil.icon}</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-stone-900 text-sm sm:text-base truncate">${soil.id}</div>
          <div class="text-xs text-stone-500 line-clamp-1">${soil.desc}</div>
        </div>
        <div class="check-indicator">${isSelected ? '✓' : ''}</div>
      </div>
    `;
  }).join('');
}

function selectSoil(soilId) {
  state.selectedSoil = soilId;
  renderSoilCards();
}

/**
 * Season Selector Component
 */
function initSeasonSelector() {
  renderSeasonCards();
}

function renderSeasonCards() {
  const container = document.getElementById('seasonCardContainer');
  if (!container) return;

  container.innerHTML = SEASONS.map((season) => {
    const isSelected = season.id === state.selectedSeason;
    return `
      <div class="selectable-card ${isSelected ? 'active' : ''}" onclick="selectSeason('${season.id}')">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-stone-900 text-sm sm:text-base">${season.label}</div>
          <div class="text-xs text-stone-500 mt-0.5">${season.desc}</div>
        </div>
        <div class="check-indicator">${isSelected ? '✓' : ''}</div>
      </div>
    `;
  }).join('');
}

function selectSeason(seasonId) {
  state.selectedSeason = seasonId;
  renderSeasonCards();
}

/**
 * Form Submit Handler — Runs Agronomic Recommendation Engine
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const landInput = document.getElementById('landAreaInput');
  if (landInput) {
    state.landArea = parseFloat(landInput.value) || 2.5;
  }

  const btn = document.getElementById('btnSubmit');
  if (btn) {
    btn.innerHTML = `<span>${t('btnTesting')}</span>`;
    btn.disabled = true;
  }

  // Smooth delay for feedback
  setTimeout(() => {
    const recommendations = window.cropWiseEngine.predict({
      soilType: state.selectedSoil,
      state: state.selectedState,
      district: state.selectedDistrict,
      season: state.selectedSeason,
      landArea: state.landArea,
      lang: state.lang
    });

    state.currentRecommendations = recommendations;

    renderResults(recommendations);

    // Save to user history
    saveToHistory(recommendations);

    if (btn) {
      btn.innerHTML = `<span>${t('btnGetRecommendation')}</span>`;
      btn.disabled = false;
    }

    // Scroll smoothly to results
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.classList.remove('hidden');
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 450);
}

/**
 * Render Top 3 Crop Recommendation Cards
 */
function renderResults(crops) {
  const container = document.getElementById('cropCardsContainer');
  if (!container) return;

  container.innerHTML = crops.map((crop, idx) => {
    const isRank1 = crop.rank === 1;
    const badgeColor = isRank1 
      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
      : 'bg-stone-100 text-stone-800 border border-stone-200';
    const rankEmoji = crop.rank === 1 ? '🥇' : (crop.rank === 2 ? '🥈' : '🥉');

    // Localized Crop Name
    let displayName = crop.name;
    if (state.lang === 'mr' && crop.mrName) displayName = `${crop.mrName} (${crop.enName})`;
    else if (state.lang === 'hi' && crop.hiName) displayName = `${crop.hiName} (${crop.enName})`;

    // Water level badge
    let waterBadge = 'bg-blue-50 text-blue-800 border-blue-200';
    if (crop.waterLevel === 'Low') waterBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    else if (crop.waterLevel === 'High') waterBadge = 'bg-indigo-50 text-indigo-800 border-indigo-200';

    return `
      <div class="crop-card ${isRank1 ? 'rank-1' : 'bg-white'} p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
        <div>
          <!-- Header: Rank Badge & Crop Emoji -->
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${badgeColor}">
              <span>${rankEmoji}</span> ${t('rank')} #${crop.rank}
            </span>
            <span class="text-3xl">${crop.icon}</span>
          </div>

          <!-- Crop Name -->
          <h3 class="text-2xl font-black text-stone-900 leading-snug mb-3">
            ${displayName}
          </h3>

          <!-- Suitability Score Bar -->
          <div class="mb-5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
            <div class="flex justify-between items-center text-xs font-bold mb-1.5">
              <span class="text-stone-600">${t('suitability')}</span>
              <span class="text-emerald-700 text-base font-extrabold">${crop.suitability}%</span>
            </div>
            <div class="suitability-bar-bg">
              <div class="suitability-bar-fill" style="width: ${crop.suitability}%"></div>
            </div>
          </div>

          <!-- Key Crop Attributes (User requested: Water Requirement & Growing Time) -->
          <div class="grid grid-cols-2 gap-2.5 text-xs mb-4">
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span class="text-stone-500 font-semibold block mb-0.5">💧 ${t('waterNeed')}</span>
              <strong class="text-stone-900 font-bold block">${crop.waterReq}</strong>
            </div>
            <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span class="text-stone-500 font-semibold block mb-0.5">⏳ ${t('growingTime')}</span>
              <strong class="text-stone-900 font-bold block">${crop.duration}</strong>
            </div>
          </div>

          <!-- Bonus Agronomic Yield & Mandi Estimates -->
          <div class="space-y-1.5 text-xs text-stone-600 mb-4 px-1">
            <div class="flex justify-between">
              <span>🌾 ${t('expectedYield')}:</span>
              <span class="font-bold text-stone-900">${crop.yieldPerAcre}/acre</span>
            </div>
            <div class="flex justify-between">
              <span>💰 ${t('mandiPrice')}:</span>
              <span class="font-bold text-stone-900">₹${crop.mandiRate.toLocaleString()} / qtl</span>
            </div>
            <div class="flex justify-between border-t border-stone-100 pt-1.5">
              <span class="font-bold text-stone-800">📈 ${t('netProfit')} (${state.landArea} ac):</span>
              <span class="font-extrabold text-emerald-700 text-sm">₹${crop.estNetProfit.toLocaleString()}</span>
            </div>
          </div>

          <!-- Short Reason for Recommendation (User requested requirement) -->
          <div class="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-xs text-stone-800 leading-relaxed font-medium mb-4">
            <span class="font-bold text-emerald-900 block mb-1">💡 ${t('whyThisCrop')}</span>
            ${crop.shortReason}
          </div>
        </div>

        <!-- Actionable Agronomy Drawer Toggle -->
        <div class="border-t border-stone-100 pt-3">
          <details class="text-xs text-stone-700 cursor-pointer">
            <summary class="font-bold text-emerald-800 hover:text-emerald-900 select-none py-1">
              📋 Sowing & Care Advice ▼
            </summary>
            <div class="mt-2 space-y-1.5 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <p><strong>🌱 Sowing:</strong> ${crop.sowingAdvice}</p>
              <p><strong>💧 Irrigation:</strong> ${crop.irrigationAdvice}</p>
              <p><strong>🌾 Fertilizer:</strong> ${crop.fertilizerAdvice}</p>
              <p><strong>🐛 Pest Alert:</strong> ${crop.pestAlert}</p>
            </div>
          </details>
        </div>

      </div>
    `;
  }).join('');

  // Render Suitability Chart
  renderChart(crops);

  // Update dynamic winner banner
  const winner = crops[0];
  const winnerEl = document.getElementById('winnerCropName');
  if (winnerEl) {
    let winName = winner.name;
    if (state.lang === 'mr' && winner.mrName) winName = winner.mrName;
    else if (state.lang === 'hi' && winner.hiName) winName = winner.hiName;
    winnerEl.innerText = `${winner.icon} ${winName}`;
  }
}

/**
 * Render Chart.js Suitability Comparison
 */
function renderChart(crops) {
  const ctx = document.getElementById('suitabilityChartCanvas');
  if (!ctx) return;

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

  const labels = crops.map(c => {
    if (state.lang === 'mr') return c.mrName || c.enName;
    if (state.lang === 'hi') return c.hiName || c.enName;
    return c.enName;
  });

  state.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: t('suitability'),
        data: crops.map(c => c.suitability),
        backgroundColor: [
          '#15803d', // Deep Emerald for Rank 1
          '#22c55e', // Lush green for Rank 2
          '#86efac'  // Mint green for Rank 3
        ],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => ` Suitability: ${item.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (val) => `${val}%`,
            font: { family: 'Plus Jakarta Sans', weight: 'bold' }
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', weight: 'bold' } }
        }
      }
    }
  });
}

/**
 * History Management (LocalStorage)
 */
function saveToHistory(crops) {
  try {
    const history = JSON.parse(localStorage.getItem('cropwise_history') || '[]');
    const record = {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      soil: state.selectedSoil,
      state: state.selectedState,
      district: state.selectedDistrict,
      season: state.selectedSeason,
      landArea: state.landArea,
      topCrop: crops[0].enName,
      topSuitability: crops[0].suitability,
      estProfit: crops[0].estNetProfit
    };
    history.unshift(record);
    // Keep last 15 items
    localStorage.setItem('cropwise_history', JSON.stringify(history.slice(0, 15)));
    renderHistoryList();
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

function renderHistoryList() {
  const container = document.getElementById('historyItemsContainer');
  if (!container) return;

  const history = JSON.parse(localStorage.getItem('cropwise_history') || '[]');
  if (history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-stone-400">
        <span class="text-4xl block mb-2">📜</span>
        <p class="font-medium text-sm">No previous recommendations yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((item, i) => `
    <div class="p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <div class="font-bold text-stone-900 text-base">🌱 ${item.topCrop} (${item.topSuitability}% Match)</div>
        <div class="text-xs text-stone-500 mt-0.5">
          ${item.district}, ${item.state} • ${item.soil} • ${item.season} • ${item.landArea} Acres
        </div>
      </div>
      <div class="text-left sm:text-right">
        <div class="text-sm font-extrabold text-emerald-700">₹${item.estProfit.toLocaleString()} profit</div>
        <div class="text-[11px] text-stone-400">${item.date}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Authentication & Farmer Profile
 */
function initUserBadge() {
  const authContainer = document.getElementById('authNavBadge');
  if (!authContainer) return;

  if (state.user) {
    authContainer.innerHTML = `
      <div class="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-900 transition shadow" onclick="navigateTo('profile')">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-black text-emerald-100">${state.user.name}</span>
      </div>
    `;
    const profName = document.getElementById('profName');
    const profPhone = document.getElementById('profPhone');
    const profState = document.getElementById('profState');
    const profDistrict = document.getElementById('profDistrict');
    const profArea = document.getElementById('profArea');

    if (profName) profName.innerText = state.user.name;
    if (profPhone) profPhone.innerText = state.user.phone;
    if (profState) profState.innerText = state.user.state || "Maharashtra";
    if (profDistrict) profDistrict.innerText = state.user.district || "Nagpur";
    if (profArea) profArea.innerText = (state.user.landArea || 2.5) + " Acres";
  } else {
    authContainer.innerHTML = `
      <button onclick="navigateTo('login')" class="px-3.5 py-1.5 bg-harvest-400 hover:bg-harvest-500 text-agri-950 font-black text-xs rounded-xl transition shadow flex items-center gap-1.5">
        <span>👨‍🌾</span> Login / Register
      </button>
    `;
  }
}

function loginAsDemoFarmer() {
  state.user = {
    name: "Ramesh Patil",
    phone: "9876543210",
    state: "Maharashtra",
    district: "Nagpur",
    soil: "Black Soil",
    landArea: 2.5,
    isDemo: true
  };
  localStorage.setItem('cropwise_user', JSON.stringify(state.user));
  
  state.selectedState = "Maharashtra";
  state.selectedDistrict = "Nagpur";
  state.selectedSoil = "Black Soil";
  state.landArea = 2.5;

  syncFormWithState();
  renderSoilCards();
  initUserBadge();
  navigateTo('home');
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value.trim();
  const pass = document.getElementById('loginPass').value;

  if (phone.length < 10) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  // Look up existing registered users in localStorage
  const existingUsers = JSON.parse(localStorage.getItem('agrisense_users') || '[]');
  const matchedUser = existingUsers.find(u => u.phone === phone);

  if (matchedUser) {
    state.user = matchedUser;
    if (matchedUser.state) state.selectedState = matchedUser.state;
    if (matchedUser.district) state.selectedDistrict = matchedUser.district;
    if (matchedUser.soil) state.selectedSoil = matchedUser.soil;
    if (matchedUser.landArea) state.landArea = matchedUser.landArea;
  } else {
    state.user = {
      name: "Farmer " + phone.slice(-4),
      phone: phone,
      state: state.selectedState,
      district: state.selectedDistrict,
      soil: state.selectedSoil,
      landArea: state.landArea,
      isDemo: false
    };
  }

  localStorage.setItem('cropwise_user', JSON.stringify(state.user));
  syncFormWithState();
  renderSoilCards();
  initUserBadge();
  alert("✅ Welcome to AGRISENSE, " + state.user.name + "!");
  navigateTo('home');
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const st = document.getElementById('regState').value;
  const dt = document.getElementById('regDistrict').value;
  const area = parseFloat(document.getElementById('regArea').value) || 2.5;
  const soil = document.getElementById('regSoil') ? document.getElementById('regSoil').value : "Black Soil";
  const pass = document.getElementById('regPass').value;
  const confirmPass = document.getElementById('regConfirmPass').value;

  if (phone.length < 10) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (pass !== confirmPass) {
    alert("Passwords do not match! Please check and confirm your password.");
    return;
  }

  const newUser = {
    name,
    phone,
    state: st,
    district: dt,
    soil,
    landArea: area,
    isDemo: false,
    registeredAt: new Date().toISOString()
  };

  // Save to persistent users list
  const existingUsers = JSON.parse(localStorage.getItem('agrisense_users') || '[]');
  existingUsers.push(newUser);
  localStorage.setItem('agrisense_users', JSON.stringify(existingUsers));

  // Set active user
  state.user = newUser;
  localStorage.setItem('cropwise_user', JSON.stringify(newUser));

  // Sync farm state
  state.selectedState = st;
  state.selectedDistrict = dt;
  state.selectedSoil = soil;
  state.landArea = area;

  syncFormWithState();
  renderSoilCards();
  initUserBadge();

  alert("🎉 Welcome to AGRISENSE, " + name + "!\n\nYour farmer account has been created for " + area + " Acres in " + dt + ", " + st + ". You can now get tailored crop recommendations.");
  navigateTo('home');
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input) {
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerText = '🙈';
    } else {
      input.type = 'password';
      btn.innerText = '👁️';
    }
  }
}

function logoutUser() {
  state.user = null;
  localStorage.removeItem('cropwise_user');
  initUserBadge();
  navigateTo('login');
}

/**
 * View Navigation Controller
 */
function navigateTo(viewId) {
  const views = ['home', 'login', 'register', 'profile', 'weather', 'mandi', 'history'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update active states in navigation
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('text-amber-400', 'font-black'));
  const activeNav = document.getElementById(`nav-${viewId}`);
  if (activeNav) activeNav.classList.add('text-amber-400', 'font-black');

  if (viewId === 'history') {
    renderHistoryList();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global exposure for inline HTML events
window.selectSoil = selectSoil;
window.selectSeason = selectSeason;
window.detectLiveLocation = detectLiveLocation;
window.loginAsDemoFarmer = loginAsDemoFarmer;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.togglePasswordVisibility = togglePasswordVisibility;
window.logoutUser = logoutUser;
window.navigateTo = navigateTo;
window.setLanguage = setLanguage;
