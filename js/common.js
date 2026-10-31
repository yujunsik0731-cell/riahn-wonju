// 리안헤어 원주 (통합 홈페이지) - 공통 스크립트

// ── 공통 지점 목록 (지점 추가는 여기 한 곳만) ─────────────────────────────
// 완성된 지점만 넣는다(「준비 중」 금지). pages = 그 지점에 있는 페이지 경로.
// instagram = 지점 인스타그램 계정(예: "riahnhair_musil"). 빈 값이면 하단 「인스타 DM」 버튼은 이동하지 않고 「준비 중」 안내를 띄운다.
//             계정이 생기면 여기 값만 넣고 생성기(gen.py)를 다시 돌리면 DM 링크·푸터·sameAs 가 바뀐다.
// _tools/wonju/gen.py 가 BEGIN~END 사이 JSON 을 읽어 기본 HTML 링크·PC 드롭다운·푸터를 만든다.
/* RIAHN_BRANCHES:BEGIN */
var RIAHN_SITE = {
  "group": {"name": {"ko": "원주 전체", "en": "All Wonju", "ja": "原州すべて", "zh": "原州全部"},
            "pages": ["", "recruit/"]},
  "label": {"ko": "지점", "en": "Branches", "ja": "店舗", "zh": "门店"},
  "branches": [
    {"id": "dangwan",
     "name": {"ko": "단관점", "en": "Dangwan", "ja": "Dangwan", "zh": "Dangwan"},
     "pages": ["", "cut/", "perm/", "color/", "clinic/", "designers/", "gallery/", "faq/", "location/", "recruit/"]},
    {"id": "musil",
     "name": {"ko": "무실점", "en": "Musil", "ja": "Musil", "zh": "Musil"},
     "instagram": "",
     "pages": ["", "cut/", "perm/", "color/", "clinic/", "designers/", "gallery/", "faq/", "location/", "recruit/"]},
    {"id": "gieopdosi",
     "name": {"ko": "원주기업도시점", "en": "Gieopdosi", "ja": "Gieopdosi", "zh": "Gieopdosi"},
     "instagram": "gieop_riahn",
     "pages": ["", "cut/", "perm/", "color/", "clinic/", "designers/", "gallery/", "faq/", "location/", "recruit/"]},
    {"id": "dangu",
     "name": {"ko": "단구롯데시네마점", "en": "Dangu Lotte Cinema", "ja": "Dangu Lotte Cinema", "zh": "Dangu Lotte Cinema"},
     "instagram": "riahn.0601",
     "pages": ["", "cut/", "perm/", "color/", "clinic/", "designers/", "gallery/", "faq/", "location/", "recruit/"]}
  ]
};
/* RIAHN_BRANCHES:END */

// 모바일 햄버거 메뉴
(function(){
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mobileNav');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    });
  });
})();

// 히어로 배경 영상: 화면에 보일 때만 재생 (모바일 데이터 절약)
(function(){
  var video = document.getElementById('heroVideo');
  if(!video) return;
  // 모션 줄이기 설정 사용자: 영상을 멈추고 poster 이미지만 보여 준다
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.removeAttribute('autoplay'); video.pause(); video.preload = 'none'; video.load();
    return;
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          video.play().catch(function(){});
        }else{
          video.pause();
        }
      });
    }, {threshold: 0.15});
    io.observe(video);
  }else{
    video.play().catch(function(){});
  }
})();

// 모바일 지점 탭 바: 공통 지점 목록으로 칩을 그리고, 현재 지점 칩을 화면 안으로
// (JS 가 꺼져 있으면 생성기가 만든 기본 <a> 링크가 그대로 작동한다)
(function(){
  var bar = document.querySelector('.branch-tabs');
  if(!bar || typeof RIAHN_SITE === 'undefined') return;
  var row = bar.querySelector('.branch-tabs-row');
  var m = location.pathname.match(/^\/(en|ja|zh)\//);
  var lang = m ? m[1] : 'ko';
  var pre = m ? '/' + lang + '/' : '/';
  var rest = location.pathname.slice(pre.length).replace(/index\.html$/, '');
  var cur = null, sub = rest;
  RIAHN_SITE.branches.forEach(function(b){
    if(rest === b.id + '/' || rest.indexOf(b.id + '/') === 0){ cur = b.id; sub = rest.slice(b.id.length + 1); }
  });
  function chip(href, text, active){
    var a = document.createElement('a');
    a.className = 'branch-chip';
    a.href = href; a.textContent = text;
    if(active) a.setAttribute('aria-current', 'page');
    return a;
  }
  var g = RIAHN_SITE.group;
  row.innerHTML = '';
  row.appendChild(chip(pre + (g.pages.indexOf(sub) >= 0 ? sub : ''), g.name[lang], cur === null));
  RIAHN_SITE.branches.forEach(function(b){
    row.appendChild(chip(pre + b.id + '/' + (b.pages.indexOf(sub) >= 0 ? sub : ''), b.name[lang], cur === b.id));
  });
  var on = row.querySelector('[aria-current="page"]');
  if(on){   // 현재 지점 칩을 줄 가운데로 (화면 좌표 기준 · 애니메이션 없이 즉시)
    var r = on.getBoundingClientRect(), rr = row.getBoundingClientRect();
    row.style.scrollBehavior = 'auto';
    row.scrollLeft += (r.left - rr.left) - (rr.width - r.width) / 2;
    row.style.scrollBehavior = '';
  }
})();

// 디자이너 포트폴리오 크게 보기 (2026-10-31) — 카드의 .pf 영역 data-* 는 생성기(_tools/wonju/portfolio.py)가 넣는다
// PC: 큰 사진 + 오른쪽 정보 · ← → · ESC · 바깥 클릭 / 모바일: 전체 화면 · 좌우 스와이프 · 뒤로 가기 = 창 닫기
// 열린 동안 뒤 페이지 스크롤 잠금 · 포커스는 창 안에서만. JS 가 꺼져 있으면 썸네일 링크가 큰 사진 파일로 이동한다.
(function(){
  var blocks = document.querySelectorAll('.pf');
  if(!blocks.length) return;
  var m = document.createElement('div');
  m.className = 'pf-modal'; m.hidden = true;
  m.innerHTML = '<div class="pf-backdrop"></div>' +
    '<div class="pf-dialog" role="dialog" aria-modal="true" aria-labelledby="pfTitle">' +
      '<div class="pf-top"><p class="pf-top-title" id="pfTitle"><span class="pf-top-who"></span><span class="pf-count"></span></p>' +
        '<button type="button" class="pf-close">✕</button></div>' +
      '<div class="pf-stage"><button type="button" class="pf-nav pf-prev">‹</button><img class="pf-big" alt="">' +
        '<button type="button" class="pf-nav pf-next">›</button></div>' +
      '<div class="pf-info"><p class="pf-eyebrow"></p><h3 class="pf-menu-big"></h3>' +
        '<div class="pf-des"><img class="pf-des-photo" alt="" width="64" height="80"><div><p class="pf-des-name"><b></b><small></small></p>' +
          '<p class="pf-des-field"></p><p class="pf-des-award"></p></div></div>' +
        '<p class="pf-others-h"></p><div class="pf-others"></div>' +
        '<div class="pf-actions"><a class="btn btn-wood pf-book" target="_blank" rel="noopener"></a><a class="btn btn-outline pf-about"></a></div>' +
      '</div></div>';
  document.body.appendChild(m);
  function q(s){ return m.querySelector(s); }
  var big = q('.pf-big'), others = q('.pf-others'), items = [], idx = 0, opener = null, pushed = false, block = null;

  function show(i){
    idx = (i + items.length) % items.length;
    var a = items[idx];
    big.removeAttribute('src');
    big.width = +a.getAttribute('data-w'); big.height = +a.getAttribute('data-h');
    big.alt = a.getAttribute('data-alt');
    big.src = a.getAttribute('data-full');                       // 큰 사진은 열 때 불러온다
    q('.pf-menu-big').textContent = a.getAttribute('data-menu');
    q('.pf-count').textContent = (idx + 1) + ' / ' + items.length;
    others.querySelectorAll('button').forEach(function(b, k){ b.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
    var nx = items[(idx + 1) % items.length];                    // 다음 사진 미리 받기
    (new Image()).src = nx.getAttribute('data-full');
  }
  function open(bl, i, from){
    block = bl; opener = from;
    items = Array.prototype.slice.call(bl.querySelectorAll('.pf-item'));
    var d = function(k){ return bl.getAttribute('data-' + k) || ''; };
    q('.pf-top-who').textContent = d('l-dialog');
    q('.pf-close').setAttribute('aria-label', d('l-close'));
    q('.pf-prev').setAttribute('aria-label', d('l-prev'));
    q('.pf-next').setAttribute('aria-label', d('l-next'));
    q('.pf-eyebrow').textContent = 'PORTFOLIO';
    var ph = q('.pf-des-photo'); ph.src = d('photo'); ph.alt = d('who');
    q('.pf-des-name b').textContent = d('name');
    q('.pf-des-name small').textContent = d('title-text');
    q('.pf-des-field').textContent = d('field');
    q('.pf-des-award').textContent = d('award');
    q('.pf-others-h').textContent = d('l-others');
    var bk = q('.pf-book'); bk.href = d('book'); bk.textContent = d('l-book');
    var ab = q('.pf-about'); ab.href = d('about'); ab.textContent = d('l-about');
    others.innerHTML = '';
    items.forEach(function(a, k){
      var b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-label', a.getAttribute('data-menu'));
      var im = a.querySelector('img').cloneNode(); im.alt = ''; b.appendChild(im);
      b.addEventListener('click', function(){ show(k); });
      others.appendChild(b);
    });
    show(i);
    m.hidden = false;
    document.documentElement.classList.add('pf-open');            // 뒤 페이지 스크롤 잠금
    if(!pushed){ history.pushState({pfModal: true}, ''); pushed = true; }   // 뒤로 가기 = 창 닫기
    q('.pf-close').focus();
  }
  var refocus = null;
  function back(){ if(opener) opener.focus({preventScroll: true}); }
  function close(fromPop){
    if(m.hidden) return;
    m.hidden = true;
    document.documentElement.classList.remove('pf-open');
    if(pushed && !fromPop){                                       // 추가한 기록을 되돌린 뒤(popstate) 연 썸네일로 포커스를 돌려준다
      pushed = false; refocus = true; history.back();
      setTimeout(function(){ if(refocus){ refocus = null; back(); } }, 400);
    } else { pushed = false; back(); }
  }
  blocks.forEach(function(bl){
    bl.querySelectorAll('[data-index]').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); open(bl, +a.getAttribute('data-index'), a); });
    });
  });
  q('.pf-close').addEventListener('click', function(){ close(false); });
  q('.pf-backdrop').addEventListener('click', function(){ close(false); });
  q('.pf-prev').addEventListener('click', function(){ show(idx - 1); });
  q('.pf-next').addEventListener('click', function(){ show(idx + 1); });
  q('.pf-about').addEventListener('click', function(e){         // 디자이너 소개: 창을 닫고 그 카드로 (추가한 기록을 이 주소로 바꿈)
    e.preventDefault();
    var h = this.getAttribute('href');
    m.hidden = true; document.documentElement.classList.remove('pf-open');
    if(pushed){ history.replaceState(null, '', h); pushed = false; } else { history.pushState(null, '', h); }
    var t = document.querySelector(h); if(t){ t.scrollIntoView(); t.setAttribute('tabindex', '-1'); t.focus({preventScroll: true}); }
  });
  window.addEventListener('popstate', function(){
    if(!m.hidden){ pushed = false; close(true); }                 // 뒤로 가기 버튼 = 창 닫기
    else if(refocus){ refocus = null; back(); }
  });
  document.addEventListener('keydown', function(e){
    if(m.hidden) return;
    if(e.key === 'Escape'){ e.preventDefault(); close(false); }
    else if(e.key === 'ArrowLeft'){ show(idx - 1); }
    else if(e.key === 'ArrowRight'){ show(idx + 1); }
    else if(e.key === 'Tab'){                                     // 포커스를 창 안에 가둔다
      var f = Array.prototype.filter.call(m.querySelectorAll('button, a[href]'), function(x){ return x.offsetParent !== null; });
      if(!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      else if(!m.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
    }
  });
  var sx = 0, sy = 0, stage = q('.pf-stage');                     // 모바일 좌우 스와이프
  stage.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
  stage.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
  });
})();

// 인스타 DM 「준비 중」 안내: data-soon 이 있는 버튼은 이동하지 않고 화면 아래에 짧게 표시 (alert 창 사용 안 함)
(function(){
  var btns = document.querySelectorAll('[data-soon]');
  if(!btns.length) return;
  var toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  var timer;
  btns.forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      toast.textContent = b.getAttribute('data-soon');
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function(){ toast.classList.remove('show'); }, 2500);
    });
  });
})();
