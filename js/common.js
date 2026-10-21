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
