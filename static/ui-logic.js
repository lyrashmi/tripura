/* ══════════════════════════════════════════════════════════════════════════
   UI LOGIC — Generic interface helpers (Tabs, Folds)
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';


document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);
  
  /* ── Tab Switching Logic ─────────────────────────────────────────────── */
  const tabBtnCalc = $('tabBtnCalc');
  const tabBtnLearn = $('tabBtnLearn');
  const tabCalc = $('tabCalc');
  const tabLearn = $('tabLearn');

  // Only attach listeners if these elements actually exist on the page
  if (tabBtnCalc && tabBtnLearn && tabCalc && tabLearn) {
    
    function switchTab(which) {
      const isCalc = which === 'calc';
      
      // Toggle button active states
      tabBtnCalc.classList.toggle('active', isCalc);
      tabBtnLearn.classList.toggle('active', !isCalc);
      
      // Toggle content visibility
      tabCalc.classList.toggle('hidden', !isCalc);
      tabLearn.classList.toggle('hidden', isCalc);
      
      // Smooth scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabBtnCalc.addEventListener('click', () => switchTab('calc'));
    tabBtnLearn.addEventListener('click', () => switchTab('learn'));
  }

  /* ── Foldable Section Logic (Accordion) ──────────────────────────────── */
  const foldHead = $('foldHead');
  const foldBody = $('foldBody');
  const foldArrow = $('foldArrow');

  if (foldHead && foldBody && foldArrow) {
    foldHead.addEventListener('click', () => {
      foldBody.classList.toggle('open');
      foldArrow.classList.toggle('open');
    });
  }

});