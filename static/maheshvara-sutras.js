(function(){
  var sutras = [
    { id:1,  members:['a','i','u'],                                   it:'ṇ' },
    { id:2,  members:['ṛ','ḷ'],                                       it:'k' },
    { id:3,  members:['e','o'],                                       it:'ṅ' },
    { id:4,  members:['ai','au'],                                     it:'c' },
    { id:5,  members:['h','y','v','r'],                               it:'ṭ' },
    { id:6,  members:['l'],                                           it:'ṇ' },
    { id:7,  members:['ñ','m','ṅ','ṇ','n'],                           it:'m' },
    { id:8,  members:['jh','bh'],                                     it:'ñ' },
    { id:9,  members:['gh','ḍh','dh'],                                it:'ṣ' },
    { id:10, members:['j','b','g','ḍ','d'],                           it:'ś' },
    { id:11, members:['kh','ph','ch','ṭh','th','c','ṭ','t'],          it:'v' },
    { id:12, members:['k','p'],                                       it:'y' },
    { id:13, members:['ś','ṣ','s'],                                   it:'r' },
    { id:14, members:['h'],                                           it:'l' }
  ];

  var vowelGlyph = { a:'अ', i:'इ', u:'उ', 'ṛ':'ऋ', 'ḷ':'ऌ', e:'ए', o:'ओ', ai:'ऐ', au:'औ' };
  var consGlyph = {
    h:'ह', y:'य', v:'व', r:'र', l:'ल', 'ñ':'ञ', m:'म', 'ṅ':'ङ', 'ṇ':'ण', n:'न',
    jh:'झ', bh:'भ', gh:'घ', 'ḍh':'ढ', dh:'ध', j:'ज', b:'ब', g:'ग', 'ḍ':'ड', d:'द',
    kh:'ख', ph:'फ', ch:'छ', 'ṭh':'ठ', th:'थ', c:'च', 'ṭ':'ट', t:'त', k:'क', p:'प',
    'ś':'श', 'ṣ':'ष', s:'स'
  };
  
  function glyphFor(letter, role){
    if (vowelGlyph[letter]) return vowelGlyph[letter];
    var base = consGlyph[letter] || letter;
    return role === 'it' ? base + '्' : base;
  }

  var flat = [];
  sutras.forEach(function(s){
    s.members.forEach(function(m){ flat.push({ sutra:s.id, letter:m, type:'member' }); });
    flat.push({ sutra:s.id, letter:s.it, type:'it' });
  });

  function computeSpan(startSutra, startLetter, endSutra){
    var startIdx = -1, endIdx = -1;
    for (var i=0;i<flat.length;i++){
      var t = flat[i];
      if (startIdx === -1 && t.sutra===startSutra && t.letter===startLetter && t.type==='member') startIdx = i;
      if (t.sutra===endSutra && t.type==='it') endIdx = i;
    }
    if (startIdx===-1 || endIdx===-1 || endIdx<=startIdx) return [];
    return flat.slice(startIdx, endIdx).filter(function(t){ return t.type==='member'; });
  }

  var pratyaharas = [
    { key:'aṇ',  dev:'अण्',  start:[1,'a'],   end:1,          gloss:'the three simple vowels' },
    { key:'ik',  dev:'इक्',  start:[1,'i'],   end:2,          gloss:'vowels that take guṇa / vṛddhi and yaṇ substitution' },
    { key:'ec',  dev:'एच्',  start:[3,'e'],   end:4,          gloss:'the guṇa and vṛddhi replacements of ik' },
    { key:'ac',  dev:'अच्',  start:[1,'a'],   end:4,          gloss:'every vowel - the full svara inventory' },
    { key:'yaṇ', dev:'यण्',  start:[5,'y'],   end:6,          gloss:'the semivowels - substitute for ik before a vowel' },
    { key:'jaś', dev:'जश्',  start:[10,'j'],  end:10,         gloss:'voiced unaspirated stops (jaścatva sandhi)' },
    { key:'jhaṣ',dev:'झष्',  start:[8,'jh'],  end:9,          gloss:'voiced aspirated stops' },
    { key:'jhal',dev:'झल्',  start:[8,'jh'],  end:14,         gloss:'every stop, sibilant and h - excludes nasals & semivowels' },
    { key:'khar',dev:'खर्',  start:[11,'kh'], end:13,         gloss:'voiceless consonants + sibilants - trigger devoicing/deaspiration' },
    { key:'hal', dev:'हल्',  start:[5,'h'],   end:14,         gloss:'every consonant in the alphabet' },
    { key:'al',  dev:'अल्',  start:[1,'a'],   end:14,         gloss:'the entire Śiva-sūtra alphabet - every sound' }
  ];

  pratyaharas.forEach(function(p){ p.span = computeSpan(p.start[0], p.start[1], p.end); });

  var sutraListEl = document.getElementById('sutra-list');
  sutras.forEach(function(s){
    var row = document.createElement('div');
    row.className = 'entry';
    // CSS Grid ensures the number stays on the left while boxes wrap on the right
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'auto 1fr';
    row.style.alignItems = 'start';
    row.style.gap = '12px';
    row.style.padding = '16px 4px';

    var num = document.createElement('span');
    num.className = 'pc-tag';
    num.textContent = s.id + '.';
    // Slight top margin to perfectly align the number with the vertical center of the first row of boxes
    num.style.marginTop = '8px';
    row.appendChild(num);

    var lettersWrap = document.createElement('div');
    lettersWrap.style.display = 'flex';
    lettersWrap.style.flexWrap = 'wrap';
    lettersWrap.style.gap = '8px';
    lettersWrap.style.alignItems = 'center';

    s.members.forEach(function(m){
      var span = document.createElement('span');
      span.className = 'glyph-member dev'; 
      span.style.margin = '0';
      span.style.padding = '6px 12px';
      span.style.borderRadius = '8px'; 
      span.style.background = 'var(--output-bg)';
      span.style.border = '1px solid var(--line-soft)';
      span.style.fontSize = '1.35rem';
      span.style.fontFamily = 'var(--font-dev)';
      span.style.lineHeight = '1.2';
      span.style.color = 'var(--ink)';
      span.style.transition = 'all 0.25s ease';
      span.style.cursor = 'default';
      span.style.letterSpacing = 'normal'; // Prevent inheritance
      
      span.dataset.sutra = s.id;
      span.dataset.role = 'member';
      span.dataset.letter = m;
      span.textContent = glyphFor(m, 'member');
      lettersWrap.appendChild(span);
    });

    var itSpan = document.createElement('span');
    itSpan.className = 'glyph-it dev';
    itSpan.style.margin = '0';
    itSpan.style.padding = '6px 12px';
    itSpan.style.borderRadius = '8px';
    itSpan.style.fontSize = '1.2rem';
    itSpan.style.fontFamily = 'var(--font-dev)';
    itSpan.style.lineHeight = '1.2';
    itSpan.style.color = 'var(--terra)';
    itSpan.style.border = '1px dashed rgba(180, 86, 47, 0.4)';
    itSpan.style.background = 'transparent';
    itSpan.style.transition = 'all 0.25s ease';
    itSpan.style.letterSpacing = 'normal';
    
    itSpan.dataset.sutra = s.id;
    itSpan.dataset.role = 'it';
    itSpan.dataset.letter = s.it;
    itSpan.textContent = glyphFor(s.it, 'it');
    lettersWrap.appendChild(itSpan);

    row.appendChild(lettersWrap);
    sutraListEl.appendChild(row);
  });

  var paListEl = document.getElementById('pratyahara-list');
  var banner = document.getElementById('detail-banner');
  var detailText = document.getElementById('detail-text');
  var detailMembers = document.getElementById('detail-members');
  var detailIast = document.getElementById('detail-iast');
  var clearHint = document.getElementById('clear-hint');
  var selected = null;

  function clearHighlights(){
    document.querySelectorAll('.glyph-member.ms-highlighted').forEach(function(el){ 
      el.classList.remove('ms-highlighted');
    });
  }

  function selectPratyahara(p, btnEl){
    clearHighlights();
    document.querySelectorAll('.entry.ms-selected').forEach(function(el){
      el.classList.remove('ms-selected');
    });

    if (selected === p.key){
      selected = null;
      banner.style.display = 'none';
      clearHint.style.display = 'none';
      return;
    }

    selected = p.key;
    btnEl.classList.add('ms-selected');
    clearHint.style.display = 'inline-block';

    var allMemberGlyphs = document.querySelectorAll('.glyph-member');
    p.span.forEach(function(tok){
      for (var i=0;i<allMemberGlyphs.length;i++){
        var el = allMemberGlyphs[i];
        if (String(el.dataset.sutra) === String(tok.sutra) && el.dataset.letter === tok.letter){
          el.classList.add('ms-highlighted');
          break;
        }
      }
    });

    var distinct = Array.from(new Set(p.span.map(function(t){ return t.letter; })));
    detailText.innerHTML = '<strong><span class="dev" style="font-family: var(--font-dev);">' + p.dev + '</span> (' + p.key + ')</strong> - ' + p.gloss + '.<br>Spans ' + p.span.length + ' recited position' + (p.span.length===1?'':'s') + (distinct.length!==p.span.length ? ' (' + distinct.length + ' distinct sounds)' : '') + ':';
    detailMembers.textContent = p.span.map(function(t){ return glyphFor(t.letter,'member'); }).join(' ');
    detailIast.textContent = p.span.map(function(t){ return t.letter; }).join(' · ');
    banner.style.display = 'block';
  }

  pratyaharas.forEach(function(p){
    var item = document.createElement('div');
    item.className = 'entry';
    item.setAttribute('role', 'button');
    item.tabIndex = 0;
    item.style.cursor = 'pointer';
    item.style.borderRadius = '14px';
    item.style.marginBottom = '12px';
    item.style.background = 'var(--output-bg)';
    item.style.border = '1px solid var(--line-soft)';
    item.style.padding = '16px 20px';
    item.style.transition = 'all 0.25s ease';

    var head = document.createElement('div');
    head.className = 'entry-head';

    var devEl = document.createElement('span');
    devEl.className = 'hw dev';
    devEl.style.fontFamily = 'var(--font-dev)';
    devEl.style.fontSize = '1.5rem';
    devEl.style.letterSpacing = 'normal'; // Ensures Devanagari connects properly
    devEl.textContent = p.dev;

    var iastEl = document.createElement('span');
    iastEl.className = 'hw-dev';
    iastEl.style.fontFamily = 'var(--font-latin)';
    iastEl.style.fontSize = '1rem';
    iastEl.style.color = 'var(--ink-muted)';
    iastEl.style.border = 'none';
    iastEl.style.padding = '0';
    iastEl.style.marginLeft = '12px';
    iastEl.textContent = p.key;

    var spacer = document.createElement('span');
    spacer.className = 'spacer';

    var countEl = document.createElement('span');
    countEl.className = 'pc-tag';
    countEl.textContent = p.span.length + ' sounds';

    head.appendChild(devEl);
    head.appendChild(iastEl);
    head.appendChild(spacer);
    head.appendChild(countEl);

    var body = document.createElement('div');
    body.className = 'entry-body';
    body.style.fontSize = '0.95rem';
    body.style.color = 'var(--ink-soft)';
    body.style.marginTop = '8px';
    body.textContent = p.gloss;

    item.appendChild(head);
    item.appendChild(body);

    item.addEventListener('click', function(){ selectPratyahara(p, item); });
    item.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPratyahara(p, item); }
    });

    paListEl.appendChild(item);
  });

  clearHint.addEventListener('click', function(){
    clearHighlights();
    document.querySelectorAll('.entry.ms-selected').forEach(function(el){
      el.classList.remove('ms-selected');
    });
    selected = null;
    banner.style.display = 'none';
    clearHint.style.display = 'none';
  });

  document.getElementById('pa-count-stat').textContent = pratyaharas.length;
})();