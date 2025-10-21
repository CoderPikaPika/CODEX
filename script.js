/* ---------- sample NGO data (replace with API later) ---------- */
const ngos = [
  {
    id: "education",
    name: "Education for All",
    category: "education",
    location: "Rural India",
    impact: 42000,
    desc: "Providing free & quality education to rural children via mobile classrooms and teacher training.",
    tags: ["#Education", "#RemoteLearning", "#VolunteersNeeded"],
    contact: "contact@educationforall.org",
    website: "https://educationforall.example",
    banner: "", // optional banner URL
    logoIcon: "fa-book",
    followed: false,
  },
  {
    id: "health",
    name: "HealthFirst",
    category: "health",
    location: "Multiple States",
    impact: 81000,
    desc: "Affordable primary healthcare, mobile clinics and maternal health programs for underserved families.",
    tags: ["#Health", "#MaternalCare"],
    contact: "support@healthfirst.org",
    website: "https://healthfirst.example",
    banner: "",
    logoIcon: "fa-heartbeat",
    followed: false,
  },
  {
    id: "environment",
    name: "Future Forests",
    category: "environment",
    location: "Global",
    impact: 120000,
    desc: "Reforestation campaigns, community tree-planting and climate education programs.",
    tags: ["#Reforestation", "#ClimateAction"],
    contact: "hello@futureforests.org",
    website: "https://futureforests.example",
    banner: "",
    logoIcon: "fa-tree",
    followed: false,
  },
  {
    id: "women",
    name: "WomenRise",
    category: "women",
    location: "Urban & Rural",
    impact: 23000,
    desc: "Women empowerment through skill-building, legal aid & microfinance support.",
    tags: ["#WomenEmpowerment", "#Microfinance"],
    contact: "info@womenrise.org",
    website: "https://womenrise.example",
    banner: "",
    logoIcon: "fa-female",
    followed: false,
  },
  {
    id: "poverty",
    name: "LiftUp",
    category: "poverty",
    location: "Regional",
    impact: 54000,
    desc: "Economic uplift programs, vocational training and food-security initiatives.",
    tags: ["#PovertyAlleviation", "#Livelihoods"],
    contact: "hello@liftup.org",
    website: "https://liftup.example",
    banner: "",
    logoIcon: "fa-hands-helping",
    followed: false,
  },
];

// Variables to store current filter state
let currentCategory = "all";
let currentSort = "relevance";
let currentSearchQuery = "";

// Current page state
let currentPage = "home";

/* ---------- login ---------- */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email && password) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    showPage("home");
  } else {
    alert("Please enter both email and password");
  }
}

/* ---------- page navigation ---------- */
function showPage(page) {
  // Hide all pages
  document.getElementById("home-page").style.display = "none";
  document.getElementById("profile-page").style.display = "none";
  document.getElementById("network-page").style.display = "none";
  const myNgosPageEl = document.getElementById("my-ngos-page");
  if (myNgosPageEl) myNgosPageEl.style.display = "none";
  document.getElementById("collaborate-page").style.display = "none";
  document.getElementById("alerts-page").style.display = "none";
  const competitionsPageEl = document.getElementById("competitions-page");
  if (competitionsPageEl) competitionsPageEl.style.display = "none";

  // Show selected page
  document.getElementById(`${page}-page`).style.display = "block";

  // Update navigation active state
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));

  // Find and activate the clicked nav item
  const navItem = Array.from(navItems).find(
    (item) =>
      item.textContent.includes(page.charAt(0).toUpperCase() + page.slice(1)) ||
      (page === "home" && item.querySelector(".fa-home"))
  );

  if (navItem) {
    navItem.classList.add("active");
  }

  // If showing home or my-ngos page, render respective lists
  if (page === "home") {
    renderNGOList();
  } else if (page === "my-ngos") {
    renderFollowedNGOs();
  } else if (page === "competitions") {
    renderLeaderboard();
    renderChallenge();
  }

  currentPage = page;
}

/* ---------- profile tab switching ---------- */
function switchProfileTab(tab) {
  // Hide all tabs
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("activity-tab").style.display = "none";
  document.getElementById("connections-tab").style.display = "none";
  document.getElementById("projects-tab").style.display = "none";

  // Show selected tab
  document.getElementById(`${tab}-tab`).style.display = "block";

  // Update tab active state
  const tabs = document.querySelectorAll(".profile-tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Find and activate the clicked tab
  const activeTab = Array.from(tabs).find((t) =>
    t.textContent.toLowerCase().includes(tab)
  );

  if (activeTab) {
    activeTab.classList.add("active");
  }
}

/* ---------- tag search (clickable tags) ---------- */
function tagSearch(e, tag) {
  e.stopPropagation();
  const input = document.getElementById("globalSearch");
  input.value = tag;
  currentSearchQuery = tag;
  applyFilters();
}

/* ---------- apply filters function ---------- */
function applyFilters() {
  // Get current filter values
  currentCategory = document.getElementById("categoryFilter").value;
  currentSort = document.getElementById("sortSelect").value;
  currentSearchQuery = document
    .getElementById("globalSearch")
    .value.toLowerCase()
    .trim();

  // Render the NGO list with the current filters
  renderNGOList();
}

/* ---------- rendering list ---------- */
function renderNGOList() {
  // show explore view
  showExplore(false);

  const grid = document.getElementById("ngoGrid");
  grid.innerHTML = "";

  let filtered = ngos.filter((n) => {
    const matchesCategory =
      currentCategory === "all" || n.category === currentCategory;
    const tagsJoined = (n.tags || []).join(" ").toLowerCase();
    const matchesQuery =
      !currentSearchQuery ||
      n.name.toLowerCase().includes(currentSearchQuery) ||
      n.desc.toLowerCase().includes(currentSearchQuery) ||
      tagsJoined.includes(currentSearchQuery);
    return matchesCategory && matchesQuery;
  });

  // simple sorts
  if (currentSort === "impact") {
    filtered.sort((a, b) => b.impact - a.impact);
  } else if (currentSort === "new") {
    filtered = filtered.slice().reverse(); // placeholder for newest (if we had timestamps)
  }

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p class="muted">No NGOs found. Try another filter or search term.</p>';
    return;
  }

  filtered.forEach((n) => {
    const card = document.createElement("div");
    card.className = "ngo-card";
    // Build tags with clickable onclick to filter by tag
    const tagsHtml = (n.tags || [])
      .map((t) => {
        // escape single quotes in tag for safe inline handler
        const safe = t.replace(/'/g, "\\'");
        return `<span class="ngo-tag" onclick="tagSearch(event,'${safe}')">${t}</span>`;
      })
      .join("");
    card.innerHTML = `
                    <div style="display:flex;gap:12px;align-items:center">
                        <div class="ngo-icon"><i class="fa ${
                          n.logoIcon
                        }"></i></div>
                        <div style="flex:1">
                            <h3>${n.name}</h3>
                            <div class="muted">${n.location} • ${
      n.category
    }</div>
                        </div>
                    </div>
                    <p style="margin-top:12px">${
                      n.desc.length > 120 ? n.desc.slice(0, 120) + "…" : n.desc
                    }</p>
                    <div class="ngo-tags">${tagsHtml}</div>
                    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                        <button class="btn" onclick="showProfile('${
                          n.id
                        }')">View Profile</button>
                        <button class="btn" onclick="donate('${
                          n.id
                        }')"><i class="fas fa-donate" style="margin-right:6px"></i>Quick Donate</button>
                        <button class="follow-btn ${
                          n.followed ? "followed" : ""
                        }" onclick="followNGO(event,this,'${n.id}')">
                            ${
                              n.followed
                                ? `<i class=\"fas fa-check\" style=\"margin-right:8px\"></i>Followed`
                                : `<i class=\"fas fa-plus\" style=\"margin-right:8px\"></i>Follow`
                            }
                        </button>
                    </div>
                `;
    grid.appendChild(card);
  });
}

/* ---------- follow/unfollow toggle ----------
           - toggles the `followed` property on the NGO object
           - updates either the grid or the profile view depending on which is visible
        */
function followNGO(e, btn, id) {
  e.stopPropagation();
  const ngo = ngos.find((x) => x.id === id);
  if (!ngo) return;

  // toggle state
  ngo.followed = !ngo.followed;

  // If profile view is currently visible for this NGO, refresh it.
  // Otherwise refresh the NGO grid/list.
  const profileVisible =
    document.getElementById("ngoProfileView").style.display === "block";
  if (profileVisible) {
    // re-render profile for this NGO (keeps user on profile page)
    showProfile(id);
  } else {
    if (currentPage === "home") {
      renderNGOList();
    } else if (currentPage === "my-ngos") {
      renderFollowedNGOs();
    }
  }
}

/* ---------- show profile ---------- */
function showProfile(id) {
  const n = ngos.find((x) => x.id === id);
  if (!n) return alert("NGO not found");

  // hide grid, show profile view
  document.getElementById("ngoGrid").style.display = "none";
  const profileView = document.getElementById("ngoProfileView");
  profileView.style.display = "block";

  // populate profile content
  const content = document.getElementById("ngoProfileContent");

  const tagsHtml = (n.tags || [])
    .map((t) => {
      const safe = t.replace(/'/g, "\\'");
      return `<span class="ngo-tag" onclick="tagSearch(event,'${safe}')">${t}</span>`;
    })
    .join("");

  content.innerHTML = `
                <div class="ngo-banner">${
                  n.banner
                    ? `<img src="${n.banner}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
                    : `<div style="font-size:18px;color:var(--primary)">${n.name}</div>`
                }</div>
                <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
                    <div style="min-width:120px">
                        <div class="ngo-icon" style="width:120px;height:120px;border-radius:12px;font-size:40px"><i class="fa ${
                          n.logoIcon
                        }"></i></div>
                    </div>
                    <div style="flex:1">
                        <h2 style="margin:0">${n.name}</h2>
                        <div class="meta-row">
                            <div><i class="fas fa-map-marker-alt" style="margin-right:8px"></i>${
                              n.location
                            }</div>
                            <div>•</div>
                            <div><strong>Impact:</strong> ${n.impact.toLocaleString()}</div>
                            <div>•</div>
                            <div class="muted">${n.category}</div>
                        </div>
                        <p style="margin-top:12px">${n.desc}</p>

                        <div class="ngo-tags" style="margin-top:6px">${tagsHtml}</div>

                        <div class="ngo-actions" style="margin-top:12px">
                            <button class="btn" onclick="donate('${
                              n.id
                            }')"><i class="fas fa-donate" style="margin-right:8px"></i>Donate</button>
                            <button class="btn btn-secondary" onclick="join('${
                              n.id
                            }')"><i class="fas fa-handshake" style="margin-right:8px"></i>Join / Volunteer</button>
                            <button class="btn btn-secondary" onclick="share('${
                              n.id
                            }')"><i class="fas fa-share" style="margin-right:8px"></i>Share</button>
                            <a class="btn btn-secondary" href="${
                              n.website
                            }" target="_blank" rel="noopener">Visit Website</a>

                            <!-- follow button on profile uses same handler -->
                            <button style="margin-left:10px" class="follow-btn ${
                              n.followed ? "followed" : ""
                            }" onclick="followNGO(event,this,'${n.id}')">
                                ${
                                  n.followed
                                    ? `<i class="fas fa-check" style="margin-right:8px"></i>Followed`
                                    : `<i class="fas fa-plus" style="margin-right:8px"></i>Follow`
                                }
                            </button>
                        </div>

                        <div style="margin-top:12px">
                            <strong>Contact:</strong> <a href="mailto:${
                              n.contact
                            }">${n.contact}</a>
                        </div>
                    </div>
                </div>

                <div style="margin-top:18px">
                    <h4>Recent updates</h4>
                    <div class="post" style="margin-top:8px;padding:12px">
                        <div style="display:flex;align-items:center;gap:10px">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover">
                            <div>
                                <strong>${n.name}</strong>
                                <div class="muted" style="font-size:13px">2h ago</div>
                            </div>
                        </div>
                        <p style="margin-top:10px">${
                          n.name
                        } — sample update about recent project highlights. (Replace with real content from API)</p>
                    </div>
                </div>
            `;
  // scroll to profile
  content.scrollIntoView({ behavior: "smooth" });
}

function showExplore(scroll = true) {
  document.getElementById("ngoGrid").style.display = "grid";
  document.getElementById("ngoProfileView").style.display = "none";
  if (scroll)
    document.getElementById("ngoGrid").scrollIntoView({ behavior: "smooth" });
}

/* ---------- small actions ---------- */
function donate(id) {
  // Award 10 points per donation
  const user = getCurrentUser();
  const current = getPoints(user);
  setPoints(user, current + 10);
  incrementWeeklyDonationCount(user, id);
  showToast(
    "Thank you!",
    "You earned 10 points for donating to " + id,
    "success"
  );
  // Update competitions displays if visible
  if (currentPage === "competitions") {
    renderLeaderboard();
    renderChallenge();
  }
}
function join(id) {
  alert("Open join/volunteer flow for " + id);
}
function share(id) {
  navigator.share
    ? navigator.share({
        title: "Check this NGO",
        text: "Take a look at " + id,
        url: location.href,
      })
    : alert("Share this NGO: " + id);
}

// simple connect action for Network page
function connectWith(name) {
  showToast(
    "Connection Request",
    "Connection request sent to " + name,
    "success"
  );
}

// ---------- My NGOs (Followed) ----------
function renderFollowedNGOs() {
  const grid = document.getElementById("myNgosGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const followed = ngos.filter((n) => n.followed);
  if (followed.length === 0) {
    grid.innerHTML =
      '<p class="muted">You have not followed any NGOs yet. Explore and follow to see them here.</p>';
    return;
  }
  followed.forEach((n) => {
    const card = document.createElement("div");
    card.className = "ngo-card";
    const tagsHtml = (n.tags || [])
      .map((t) => {
        const safe = t.replace(/'/g, "\\'");
        return `<span class="ngo-tag" onclick="tagSearch(event,'${safe}')">${t}</span>`;
      })
      .join("");
    card.innerHTML = `
                    <div style="display:flex;gap:12px;align-items:center">
                        <div class="ngo-icon"><i class="fa ${
                          n.logoIcon
                        }"></i></div>
                        <div style="flex:1">
                            <h3>${n.name}</h3>
                            <div class="muted">${n.location} • ${
      n.category
    }</div>
                        </div>
                    </div>
                    <p style="margin-top:12px">${
                      n.desc.length > 120 ? n.desc.slice(0, 120) + "…" : n.desc
                    }</p>
                    <div class="ngo-tags">${tagsHtml}</div>
                    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                        <button class="btn" onclick="showProfile('${
                          n.id
                        }')">View Profile</button>
                        <button class="btn" onclick="donate('${
                          n.id
                        }')"><i class="fas fa-donate" style="margin-right:6px"></i>Quick Donate</button>
                        <button class="follow-btn ${
                          n.followed ? "followed" : ""
                        }" onclick="followNGO(event,this,'${n.id}')">
                            ${
                              n.followed
                                ? `<i class=\"fas fa-check\" style=\"margin-right:8px\"></i>Followed`
                                : `<i class=\"fas fa-plus\" style=\"margin-right:8px\"></i>Follow`
                            }
                        </button>
                    </div>
                `;
    grid.appendChild(card);
  });
}

// ---------- Leaderboard & Weekly Challenge (localStorage) ----------
const LS_POINTS_KEY = "connectngo_points_v1";
const LS_WEEKLY_KEY = "connectngo_weekly_v1";
function getCurrentUser() {
  return "You";
}
function getPoints(user) {
  const map = JSON.parse(localStorage.getItem(LS_POINTS_KEY) || "{}");
  return map[user] || 0;
}
function setPoints(user, points) {
  const map = JSON.parse(localStorage.getItem(LS_POINTS_KEY) || "{}");
  map[user] = points;
  localStorage.setItem(LS_POINTS_KEY, JSON.stringify(map));
}
function getAllPoints() {
  const map = JSON.parse(localStorage.getItem(LS_POINTS_KEY) || "{}");
  return map;
}
function getWeekId() {
  const d = new Date();
  const year = d.getUTCFullYear();
  const firstJan = new Date(Date.UTC(year, 0, 1));
  const days = Math.floor((d - firstJan) / 86400000) + firstJan.getUTCDay();
  const week = Math.floor(days / 7);
  return `${year}-w${week}`;
}
function getWeeklyData() {
  const data = JSON.parse(localStorage.getItem(LS_WEEKLY_KEY) || "{}");
  const currentWeek = getWeekId();
  if (data.weekId !== currentWeek) {
    return {
      weekId: currentWeek,
      donationsByUser: {},
      donationTargetsByUser: {},
    };
  }
  return data;
}
function saveWeeklyData(data) {
  localStorage.setItem(LS_WEEKLY_KEY, JSON.stringify(data));
}
function incrementWeeklyDonationCount(user, ngoId) {
  const data = getWeeklyData();
  if (!data.donationsByUser[user]) data.donationsByUser[user] = 0;
  data.donationsByUser[user] += 1;
  if (!data.donationTargetsByUser[user]) data.donationTargetsByUser[user] = {};
  data.donationTargetsByUser[user][ngoId] = true; // count unique NGOs via key set
  saveWeeklyData(data);
}
function getUniqueDonationCount(user) {
  const data = getWeeklyData();
  const targets = data.donationTargetsByUser[user] || {};
  return Object.keys(targets).length;
}
function seedDemoPoints(map) {
  const demo = {
    Priya: 70,
    Sarah: 60,
    Michael: 50,
    Emily: 30,
    Aisha: 25,
    David: 20,
    John: 15,
  };
  Object.entries(demo).forEach(([name, pts]) => {
    if (map[name] == null) map[name] = pts;
  });
  if (map["You"] == null) map["You"] = 0;
  localStorage.setItem(LS_POINTS_KEY, JSON.stringify(map));
}
function getLeague(pts) {
  // Simple Clash of Clans-inspired tiers
  if (pts >= 2000)
    return { name: "Legend", cls: "league-legend", nextAt: Infinity };
  if (pts >= 1500) return { name: "Titan", cls: "league-titan", nextAt: 2000 };
  if (pts >= 1200)
    return { name: "Champion", cls: "league-champion", nextAt: 1500 };
  if (pts >= 800) return { name: "Master", cls: "league-master", nextAt: 1200 };
  if (pts >= 500)
    return { name: "Crystal", cls: "league-crystal", nextAt: 800 };
  if (pts >= 300) return { name: "Gold", cls: "league-gold", nextAt: 500 };
  if (pts >= 150) return { name: "Silver", cls: "league-silver", nextAt: 300 };
  return { name: "Bronze", cls: "league-bronze", nextAt: 150 };
}
function renderLeaderboard() {
  const el = document.getElementById("leaderboardBody");
  if (!el) return;
  const map = getAllPoints();
  seedDemoPoints(map);
  const sorted = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  el.innerHTML = "";
  sorted.forEach(([name, pts], idx) => {
    const row = document.createElement("div");
    row.className = "lb-row";
    const league = getLeague(pts);
    row.innerHTML = `
                    <div class="lb-user">
                        <div class="lb-rank">${idx + 1}</div>
                        <strong>${name}</strong>
                        <span class="league-badge ${
                          league.cls
                        }" style="margin-left:8px">${league.name}</span>
                    </div>
                    <div class="lb-points">${pts} pts</div>
                `;
    el.appendChild(row);
  });
  // Update your league card
  const youPts = getPoints(getCurrentUser());
  const info = getLeague(youPts);
  const badge = document.getElementById("yourLeagueBadge");
  const ptsEl = document.getElementById("yourLeaguePoints");
  const progBar = document.getElementById("leagueProgressBar");
  const progText = document.getElementById("leagueProgressText");
  if (badge) {
    badge.className = `league-badge ${info.cls}`;
    badge.textContent = info.name;
  }
  if (ptsEl) {
    ptsEl.textContent = `${youPts} pts`;
  }
  if (progBar && progText) {
    const nextAt = info.nextAt;
    if (nextAt === Infinity) {
      progBar.style.width = "100%";
      progText.textContent = "Max league reached";
    } else {
      const fromAt =
        getLeague(Math.max(0, youPts - 1)).nextAt === info.nextAt
          ? 0
          : getLeagueThresholdStart(info.name);
      const start = getLeagueThresholdStart(info.name);
      const pct = Math.max(
        0,
        Math.min(100, Math.round(((youPts - start) / (nextAt - start)) * 100))
      );
      progBar.style.width = pct + "%";
      progText.textContent = `${Math.max(0, youPts - start)} / ${
        nextAt - start
      } to next league`;
    }
  }
}
function getLeagueThresholdStart(name) {
  switch (name) {
    case "Bronze":
      return 0;
    case "Silver":
      return 150;
    case "Gold":
      return 300;
    case "Crystal":
      return 500;
    case "Master":
      return 800;
    case "Champion":
      return 1200;
    case "Titan":
      return 1500;
    case "Legend":
      return 2000;
    default:
      return 0;
  }
}
function renderChallenge() {
  const done = getUniqueDonationCount(getCurrentUser());
  const total = 3;
  const pct = Math.min(100, Math.round((done / total) * 100));
  const bar = document.getElementById("challengeProgressBar");
  const text = document.getElementById("challengeProgressText");
  if (bar) bar.style.width = pct + "%";
  if (text) text.textContent = `${done} / ${total} donations completed`;
}

// ---------- League Info Modal ----------
function openLeagueInfo() {
  const m = document.getElementById("leagueInfoModal");
  if (m) m.style.display = "flex";
}
function closeLeagueInfo(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const m = document.getElementById("leagueInfoModal");
  if (m) m.style.display = "none";
}

// ---------- Toasts ----------
function showToast(title, message, type = "info", timeoutMs = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="title">${title}</div><div>${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut .2s forwards";
    setTimeout(() => container.removeChild(toast), 180);
  }, timeoutMs);
}

// initial: nothing until login
