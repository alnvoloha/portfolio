/* Portfolio site script: projects rendering + filters + particles */

const state = {
  projects: [],
  category: "All",
  query: ""
};

const $ = (sel) => document.querySelector(sel);

function uniq(arr) {
  return Array.from(new Set(arr));
}

function toText(v){
  return (v || "").toString().toLowerCase();
}

function match(project, query){
  if (!query) return true;
  const q = toText(query);
  const hay = [
    project.title,
    project.subtitle,
    project.description,
    project.category,
    ...(project.tech || [])
  ].map(toText).join(" ");
  return hay.includes(q);
}

function categoryOf(p){
  return p.category || "Other";
}

function filteredProjects(){
  return state.projects.filter(p => {
    const okCat = state.category === "All" ? true : categoryOf(p) === state.category;
    const okQuery = match(p, state.query);
    return okCat && okQuery;
  });
}

function renderFilters(categories){
  const root = $("#filters");
  root.innerHTML = "";

  const all = ["All", ...categories];
  for (const cat of all){
    const btn = document.createElement("button");
    btn.className = "filter" + (cat === state.category ? " active" : "");
    btn.type = "button";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      state.category = cat;
      render(filtersData());
      $("#search").focus();
    });
    root.appendChild(btn);
  }
}

function projectCard(p){
  const card = document.createElement("article");
  card.className = "pcard";

  const meta = document.createElement("div");
  meta.className = "pmeta";

  const left = document.createElement("div");
  const h = document.createElement("h3");
  h.className = "ptitle";
  h.textContent = p.title;

  const sub = document.createElement("div");
  sub.className = "psub";
  sub.textContent = p.subtitle || "";

  left.appendChild(h);
  left.appendChild(sub);

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.textContent = categoryOf(p);

  meta.appendChild(left);
  meta.appendChild(badge);

  const desc = document.createElement("div");
  desc.className = "pdesc";
  desc.textContent = p.description || "";

  const tech = document.createElement("div");
  tech.className = "tech";
  for (const t of (p.tech || []).slice(0, 7)){
    const s = document.createElement("span");
    s.textContent = t;
    tech.appendChild(s);
  }

  const links = document.createElement("div");
  links.className = "links";

  const repo = document.createElement("a");
  repo.className = "plink";
  repo.href = p.repo;
  repo.target = "_blank";
  repo.rel = "noopener noreferrer";
  repo.textContent = "Repo";

  const live = document.createElement("a");
  live.className = "plink";
  if (p.live){
    live.href = p.live;
    live.target = "_blank";
    live.rel = "noopener noreferrer";
    live.textContent = "Live";
  } else {
    live.classList.add("disabled");
    live.href = "#";
    live.textContent = "Live";
    live.title = "No live demo";
  }

  links.appendChild(repo);
  links.appendChild(live);

  card.appendChild(meta);
  card.appendChild(desc);
  card.appendChild(tech);
  card.appendChild(links);

  return card;
}

function renderGrid(list){
  const root = $("#grid");
  root.innerHTML = "";
  if (!list.length){
    const empty = document.createElement("div");
    empty.className = "glass";
    empty.style.padding = "16px";
    empty.textContent = "No projects match your filters.";
    root.appendChild(empty);
    return;
  }
  for (const p of list){
    root.appendChild(projectCard(p));
  }
}

function filtersData(){
  const categories = uniq(state.projects.map(categoryOf)).sort((a,b) => a.localeCompare(b));
  return categories;
}

function updateStats(){
  const total = state.projects.length;
  const featured = state.projects.filter(p => p.featured).length;
  const categories = uniq(state.projects.map(categoryOf)).length;

  $("#statProjects").textContent = String(total);
  $("#statFeatured").textContent = String(featured);
  $("#statCategories").textContent = String(categories);

  $("#year").textContent = String(new Date().getFullYear());
}

function render(categories){
  renderFilters(categories);
  renderGrid(filteredProjects());
  updateStats();
}

async function init(){
  try{
    const res = await fetch("./projects.json", { cache: "no-store" });
    const data = await res.json();
    state.projects = (data.projects || []).slice();

    // Default: show featured first by sorting, but keep stable inside categories
    state.projects.sort((a,b) => (b.featured === true) - (a.featured === true));

    render(filtersData());

    $("#search").addEventListener("input", (e) => {
      state.query = e.target.value || "";
      render(filtersData());
    });

  }catch(e){
    console.error(e);
    const root = $("#grid");
    root.innerHTML = "";
    const err = document.createElement("div");
    err.className = "glass";
    err.style.padding = "16px";
    err.textContent = "Failed to load projects.json. Check console.";
    root.appendChild(err);
  }
}

/* ====== Canvas particle background (network) ====== */

function particles(){
  const canvas = $("#bg");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;

  const opts = {
    count: 70,
    maxSpeed: 0.35,
    linkDist: 120,
    dot: 1.35
  };

  const pts = [];

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function rand(min, max){
    return Math.random() * (max - min) + min;
  }

  function initPts(){
    pts.length = 0;
    for (let i=0; i<opts.count; i++){
      pts.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-opts.maxSpeed, opts.maxSpeed) * dpr,
        vy: rand(-opts.maxSpeed, opts.maxSpeed) * dpr
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,w,h);

    // faint vignette
    const g = ctx.createRadialGradient(w*0.5, h*0.15, 0, w*0.5, h*0.5, Math.max(w,h)*0.65);
    g.addColorStop(0, "rgba(255,255,255,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0.0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for (const p of pts){
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, opts.dot * dpr, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();
    }

    // links
    for (let i=0; i<pts.length; i++){
      for (let j=i+1; j<pts.length; j++){
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < opts.linkDist * dpr){
          const alpha = (1 - dist / (opts.linkDist * dpr)) * 0.18;
          ctx.strokeStyle = `rgba(106, 209, 255, ${alpha})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  initPts();
  step();

  window.addEventListener("resize", () => {
    resize();
    initPts();
  }, { passive: true });
}

particles();
init();
