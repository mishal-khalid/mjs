(async function(){
  const params = new URLSearchParams(location.search);
  const electionId = params.get("id");
  const data = await Store.loadJSON("elections.json");
  const election = data.elections.find(e => e.id === electionId);
  if (!election) { document.body.innerHTML = "<div class='container'>Election not found.</div>"; return; }

  document.getElementById("title").textContent = election.title;
  document.getElementById("desc").textContent = election.description || "";

  const ballot = document.getElementById("ballot");
  ballot.innerHTML = election.positions.map(pos => {
    const choices = pos.candidates.map(c =>
      `<label class="choice">
         <input type="${pos.max_choices===1?'radio':'checkbox'}" 
                name="${pos.id}" value="${c.id}">
         <span>${c.full_name} <span class="small">(${c.class||''})</span></span>
       </label>`).join("");
    return `<div class="card">
      <h3>${pos.name} <span class="small">· Choose ${pos.max_choices}</span></h3>
      <div class="list">${choices}</div>
    </div>`;
  }).join("");

  document.getElementById("complete").addEventListener("click", () => {
    const votes = [];
    for (const pos of election.positions) {
      const sel = [...document.querySelectorAll(`[name="${pos.id}"]:checked`)].map(i=>i.value);
      if (sel.length !== pos.max_choices) {
        alert(`Please choose exactly ${pos.max_choices} for ${pos.name}.`);
        return;
      }
      votes.push({ positionId: pos.id, candidateId: sel[0] });
    }
    const ballotObj = {
      ballotId: crypto.randomUUID(),
      electionId,
      votes,
      createdAt: new Date().toISOString(),
      verifiedStudentId: null
    };
    Store.saveBallot(electionId, ballotObj);
    location.href = `teacher.html?election=${encodeURIComponent(electionId)}&ballot=${encodeURIComponent(ballotObj.ballotId)}`;
  });
})();