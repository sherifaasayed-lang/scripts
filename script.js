// Default Approved Management Scripts
const approvedScripts = [
  {
    id: 1,
    title: "Greeting & Order Verification",
    category: "General",
    body: "Hello [Customer Name], thank you for reaching out to Talabat Support. My name is [Agent Name]. I would be happy to help you with order #[Order ID] today."
  },
  {
    id: 2,
    title: "Delayed Delivery Apology",
    category: "Delivery",
    body: "I sincerely apologize for the delay in receiving your order #[Order ID]. I am currently checking with the delivery driver and will provide an update shortly."
  },
  {
    id: 3,
    title: "Missing Item Refund Notice",
    category: "Refund",
    body: "I'm sorry to hear that an item was missing from your order. I have initiated a refund of [Amount] to your Talabat Pay balance."
  }
];

let personalScripts = JSON.parse(localStorage.getItem("talabat_personal_scripts")) || [];
let currentTab = "approved";

// Load elements
const scriptContainer = document.getElementById("scriptContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const tabBtns = document.querySelectorAll(".tab-btn");

// Render Scripts
function renderScripts() {
  scriptContainer.innerHTML = "";
  const query = searchInput.value.toLowerCase();
  const selectedCat = categorySelect.value;
  
  const dataset = currentTab === "approved" ? approvedScripts : personalScripts;

  const filtered = dataset.filter(item => {
    ariaMatch = item.title.toLowerCase().includes(query) || item.body.toLowerCase().includes(query);
    catMatch = selectedCat === "all" || item.category === selectedCat;
    return ariaMatch && catMatch;
  });

  if (filtered.length === 0) {
    scriptContainer.innerHTML = `<p style="font-size:12px; color:#888;">No scripts found.</p>`;
    return;
  }

  filtered.forEach(script => {
    const card = document.createElement("div");
    card.className = "script-card";
    
    const badgeText = currentTab === "approved" ? "Official Approved" : "Personal Script";
    const badgeClass = currentTab === "approved" ? "badge-approved" : "badge-personal";

    card.innerHTML = `
      <div class="script-header">
        <span class="script-title">${script.title}</span>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="script-body">${script.body}</div>
      <button class="copy-btn">📋 Copy Script</button>
    `;

    // One-click copy logic
    const copyBtn = card.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(script.body).then(() => {
        copyBtn.innerText = "✓ Copied!";
        copyBtn.style.background = "#28a745";
        setTimeout(() => {
          copyBtn.innerText = "📋 Copy Script";
          copyBtn.style.background = "#202124";
        }, 1500);
      });
    });

    scriptContainer.appendChild(card);
  });
}

// Tab Switching
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    renderScripts();
  });
});

// Event Listeners
searchInput.addEventListener("input", renderScripts);
categorySelect.addEventListener("change", renderScripts);

// Add Personal Script Logic
document.getElementById("addScriptBtn").addEventListener("click", () => {
  const title = document.getElementById("newTitle").value.trim();
  const category = document.getElementById("newCategory").value;
  const body = document.getElementById("newBody").value.trim();

  if (!title || !body) {
    alert("Please fill in both the title and script body.");
    return;
  }

  const newScript = { id: Date.now(), title, category, body };
  personalScripts.push(newScript);
  localStorage.setItem("talabat_personal_scripts", JSON.stringify(personalScripts));

  // Reset inputs
  document.getElementById("newTitle").value = "";
  document.getElementById("newBody").value = "";

  // Switch to personal tab & render
  currentTab = "personal";
  tabBtns[0].classList.remove("active");
  tabBtns[1].classList.add("active");
  renderScripts();
});

// Initial Render
renderScripts();
