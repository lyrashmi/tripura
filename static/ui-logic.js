/* ══════════════════════════════════════════════════════════════════════════
   UI LOGIC — Generic interface helpers (Tabs, Folds)
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';


document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);
  
  /* ── Tab Switching Logic ─────────────────────────────────────────────── */
  const tabBtnFirst = $('tabBtnFirst');
  const tabBtnSecond = $('tabBtnSecond');
  const tabFirst = $('tabFirst');
  const tabSecond = $('tabSecond');

  // Only attach listeners if these elements actually exist on the page
  if (tabBtnFirst && tabBtnSecond && tabFirst && tabSecond) {
    
    function switchTab(which) {
      const isFirst = which === 'first';
      
      // Toggle button active states
      tabBtnFirst.classList.toggle('active', isFirst);
      tabBtnSecond.classList.toggle('active', !isFirst);
      
      // Toggle content visibility
      tabFirst.classList.toggle('hidden', !isFirst);
      tabSecond.classList.toggle('hidden', isFirst);
      
      // Smooth scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabBtnFirst.addEventListener('click', () => switchTab('first'));
    tabBtnSecond.addEventListener('click', () => switchTab('second'));
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