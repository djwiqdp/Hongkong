(() => {
  const TOTAL = 40;
  const BY_DAY = [8, 12, 9, 11];              // Day별 이미지 수
  const z2 = n => String(n).padStart(2, '0');

  /* 이미지 설명 — 임시 40개 */
  const descs = [
    "첫끼로 먹었던 새우완탕면집",
    "어딜가든 보이는 초록색의 간판들",
    "갑자기 나타난 그래피티 벽",
    "높은 경사로와 사람들",
    "카페에서 찍었던 출구이미지",
    "걷던 중 마주친 사원",
    "아슬아슬한 대나무 공사장들",
    "이름 모를 홍콩의 과일",
    "마켓의 과일들, 코끝 치던 향",
    "붉은색의 귀여운 홍콩 택시",
    "2층 트램에서 본 자연풍경",
    "앉아서 여유를 즐기는 아저씨",
    "빨래줄이 맞닿던 다닥다닥한 건물 사이",
    "돌고 돌아 도착한 시장의 입구",
    "창문 사이의 녹음",
    "숙소로 돌아갈때 한참 걸었던 곳",
    "바빠보이는 사람들",
    "읽을 수 없는 간판과 출근길",
    "옥색의 귀여운 아파트 뼈대",
    "귀여운 벽화와 초록색의 느티나무",
    "마주보고 앉을 수 있는 2층 의자",
    "페리에서 본 섬의 풍경",
    "홍콩의 바다",
    "습하다 습해, 홍콩",
    "매일 타던 트램",
    "YES, UA!",
    "새빨간색의 버스",
    "시계샵이 즐비한 거리들",
    "노란색의 흔들린 사진",
    "박물관 같은 사탕숍",
    "매번 들렸던 육교의 모양",
    "옥색의 귀여운 아파트 뼈대",
    "학교 운동장",
    "트램에서 찍은 사진들",
    "익숙한 듯 익숙하지 않은 간판",
    "다닥다닥 붙어있는 청킹맨션",
    "밤과 육교",
    "굴다리 밑 트램에서",
    "홍콩의 시청 앞 초록색과 연두색",
    "마지막 밤, 화려한 창문들"
  ];

  const daysRoot = document.getElementById('days');
  let imgNum = 1;

  /* ---------- Day 섹션 빌드 ---------- */
  BY_DAY.forEach((count, dayIdx) => {
    const s = document.createElement('section'); s.className='day';
    const row = document.createElement('div'); row.className='dayrow';

    const meta = document.createElement('div'); meta.className='meta';
    const h = document.createElement('div'); h.className='daytitle'; h.textContent=`Day ${dayIdx+1}`;
    const c = document.createElement('div'); c.className='daycount'; c.textContent=z2(count);
    meta.append(h,c);

    const grid = document.createElement('div'); grid.className='grid';

    for(let i=0;i<count && imgNum<=TOTAL;i++,imgNum++){
      const indexInDay=i+1;
      const current=imgNum;

      // 랜덤 스팬
      const rnd=Math.random(); let cols=1, rows=1;
      if(rnd>0.85){ cols=2; rows=2; }
      else if(rnd>0.65){ cols=2; rows=1; }
      else if(rnd>0.50){ cols=1; rows=2; }

      const t=document.createElement('div'); t.className='tile';

      const label=document.createElement('div'); label.className='label';
      label.innerHTML = `<span class="num">${z2(indexInDay)}</span><span class="txt">${descs[current-1] || ''}</span>`;

      const img=new Image(); img.loading='lazy'; img.src=`${current}.JPG`; img.alt=`Hong Kong #${current}`;

      t.append(label,img);

      t.dataset.cols=cols; t.dataset.rows=rows;
      t.style.gridColumnEnd=`span ${cols}`;

      t.addEventListener('click',()=>openLightbox(current, indexInDay));
      grid.appendChild(t);
    }

    row.append(meta,grid);
    const hr=document.createElement('div'); hr.className='hr';
    s.append(row,hr); daysRoot.appendChild(s);

    requestAnimationFrame(()=>layoutGrid(grid));
    window.addEventListener('resize',()=>layoutGrid(grid));
  });

  // masonry-like span 계산
  function layoutGrid(grid){
    const styles=getComputedStyle(grid);
    const cols=styles.gridTemplateColumns.split(' ').length;
    const gap=parseFloat(styles.gap)||0;
    const gridWidth=grid.clientWidth;
    const colW=(gridWidth - (cols-1)*gap)/cols;
    const rowH=parseFloat(styles.gridAutoRows); // 8px

    [...grid.children].forEach(el=>{
      const rows=parseInt(el.dataset.rows||1,10);
      const target=(colW*rows) + (gap*(rows-1));
      const span=Math.ceil(target / rowH);
      el.style.gridRowEnd=`span ${span}`;
    });
  }

  /* ---------- Lightbox ---------- */
  const lb=document.getElementById('lightbox');
  const big=document.getElementById('big');
  const lbCaption=document.getElementById('lbCaption');
  const vbPrev=document.getElementById('vbPrev');
  const vbNext=document.getElementById('vbNext');
  let curIdx=1;

  function openLightbox(i, indexInDay){
    curIdx=i;
    big.src=`${i}.JPG`;
    const local = typeof indexInDay === 'number' ? indexInDay : i;
    lbCaption.innerHTML = `<span class="num">${z2(local)}</span><span class="txt">${descs[i-1] || ''}</span>`;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }
  function closeLightbox(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
  }
  function nav(d){
    curIdx+=d;
    if(curIdx<1)curIdx=TOTAL;
    if(curIdx>TOTAL)curIdx=1;
    big.src=`${curIdx}.JPG`;
    lbCaption.innerHTML = `<span class="num">${z2(curIdx)}</span><span class="txt">${descs[curIdx-1] || ''}</span>`;
  }
  vbPrev.onclick=()=>nav(-1);
  vbNext.onclick=()=>nav(1);
  lb.addEventListener('click',(e)=>{ if(e.target===lb) closeLightbox(); });
  window.addEventListener('keydown',(e)=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') nav(-1);
    if(e.key==='ArrowRight') nav(1);
  });

  /* --------- Jukebox --------- */
  const tracks = [
    { file:'1.MP3', title:'Travel Again',        artist:'Beenzino',       art:'music1.JPG' },
    { file:'2.MP3', title:'Sydney Hongkong’',   artist:'Kidmilli',    art:'music2.JPG' },
    { file:'3.MP3', title:'夢中人 (Dreams)',        artist:'Faye Wong',                art:'music3.JPG' },
    { file:'4.MP3', title:'Im Fish',               artist:'Sunset Rollercoaster',     art:'music4.JPG' },
    { file:'5.MP3', title:'My Jinji',              artist:'Sunset Rollercoaster',     art:'music5.JPG' },
    { file:'6.MP3', title:'散去的時候',             artist:'deca joins',               art:'music6.JPG' },
  ];

  const audio   = document.getElementById('audio');
  const disc    = document.getElementById('discBtn');   // 버튼 id와 일치
  const art     = document.getElementById('art');
  const titleEl = document.getElementById('title');
  const artistEl= document.getElementById('artist');
  const bar     = document.getElementById('bar');
  const progress= document.getElementById('progress');
  const curT    = document.getElementById('cur');
  const durT    = document.getElementById('dur');
  const list    = document.getElementById('list');

  let idx=0, isPlaying=false;

  tracks.forEach((t,i)=>{
    const row=document.createElement('div');
    row.className='row';
    row.innerHTML=`<div class="t1">${t.title}</div><div class="t2">${t.artist}</div>`;
    row.addEventListener('click',()=>{ load(i); play(); });
    list.appendChild(row);
  });

  function highlight(){
    [...list.children].forEach((r,i)=>r.classList.toggle('active', i===idx));
  }

  function load(i){
    idx=i;
    const t=tracks[idx];
    audio.src=t.file;
    art.src=t.art;
    titleEl.textContent=t.title;
    artistEl.textContent=t.artist;

    bar.style.width='0%';
    curT.textContent='0:00';
    durT.textContent='0:00';
    highlight();

    // 상태에 맞춰 디스크 외형
    if (isPlaying) {
      disc.classList.add('playing');
      disc.classList.remove('colored');  // 재생 중엔 흑백
    } else {
      disc.classList.remove('playing');
      disc.classList.add('colored');     // 정지 시 컬러
    }
  }

  function play(){
    audio.play().then(()=>{
      isPlaying = true;
      disc.classList.add('playing');
      disc.classList.remove('colored');   // 재생 중엔 흑백
    }).catch(()=>{});
  }
  function pause(){
    audio.pause();
    isPlaying = false;
    disc.classList.remove('playing');
    disc.classList.add('colored');        // 정지 시 컬러
  }

  disc.onclick=()=> isPlaying ? pause() : play();

  audio.addEventListener('loadedmetadata',()=>{ durT.textContent=fmt(audio.duration); });

  audio.addEventListener('timeupdate',()=>{
    if(!isNaN(audio.duration)){
      curT.textContent=fmt(audio.currentTime);
      bar.style.width = `${(audio.currentTime/audio.duration)*100}%`;
    }
  });

  audio.addEventListener('ended',()=>{
    bar.style.width='100%';
    load((idx+1)%tracks.length);
    play();
  });

  progress.addEventListener('click',(e)=>{
    const r=progress.getBoundingClientRect();
    const p=(e.clientX-r.left)/r.width;
    if(!isNaN(audio.duration)){
      audio.currentTime = p * audio.duration;
    }
  });

  window.addEventListener('keydown',(e)=>{
    if(['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if(e.code==='Space'){ e.preventDefault(); (isPlaying?pause:play)(); }
    if(e.key==='ArrowRight'){ e.preventDefault(); load((idx+1)%tracks.length); play(); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); load((idx-1+tracks.length)%tracks.length); play(); }
    if(e.key==='ArrowUp'){ audio.volume=Math.min(1, audio.volume+0.05); }
    if(e.key==='ArrowDown'){ audio.volume=Math.max(0, audio.volume-0.05); }
  });

  function fmt(s){
    const m=Math.floor(s/60)||0;
    const ss=Math.floor(s%60)||0;
    return `${m}:${ss.toString().padStart(2,'0')}`;
  }

  /* Cursor trails */
  const core=document.querySelector('#cursor .core');
  const trailBox=document.getElementById('trail');
  const trailCount=10, trails=[];
  for(let i=0;i<trailCount;i++){
    const sp=document.createElement('span');
    sp.style.opacity=(1-i/trailCount).toFixed(2);
    trailBox.appendChild(sp); trails.push(sp);
  }
  let mx=0,my=0;
  const history=Array.from({length:trailCount},()=>({x:0,y:0}));
  window.addEventListener('mousemove',(e)=>{
    mx=e.clientX; my=e.clientY;
    core.style.left=mx+'px'; core.style.top=my+'px';
  });
  (function loop(){
    history.unshift({x:mx,y:my}); history.pop();
    trails.forEach((t,i)=>{
      const p=history[i+1]||history[history.length-1];
      t.style.left=p.x+'px'; t.style.top=p.y+'px';
    });
    requestAnimationFrame(loop);
  })();
  window.addEventListener('mousedown',()=>document.getElementById('cursor').classList.add('click'));
  window.addEventListener('mouseup',()=>document.getElementById('cursor').classList.remove('click'));

  /* ----- Invitation Modal (letter.png, X 없이) ----- */
  const invite = document.getElementById('invite');
  if (invite) {
    invite.classList.add('open'); // 페이지 로드시 표시

    // 편지(이미지) 바깥을 클릭하면 닫기
    invite.addEventListener('click', (e) => {
      const sheet = document.querySelector('.invite-sheet');
      if (!sheet.contains(e.target)) {
        invite.classList.remove('open');
      }
    });

    // ESC로 닫기(선택)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') invite.classList.remove('open');
    });
  }

  // 초기 트랙 로드(정지 상태)
  load(0);
})();








