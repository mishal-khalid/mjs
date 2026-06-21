(async function(){
  const params = new URLSearchParams(location.search);
  const electionId = params.get("id");
  const data = await Store.loadJSON("elections.json");
  const election = data.elections.find(e => e.id === electionId);
  if (!election) { document.body.innerHTML = "<div class='container'>Election not found.</div>"; return; }
  document.getElementById("title").textContent = `Results — ${election.title}`;

  const counts = Store.tally(election);
  const ballotsTotal = Store.getBallots(electionId).filter(b => b.verifiedStudentId).length;

  const winnersEl = document.getElementById("winners");
  winnersEl.innerHTML = election.positions.map(pos => {
    const list = counts[pos.id];
    const topId = Object.keys(list).sort((a,b)=>list[b]-list[a])[0];
    const winner = pos.candidates.find(c => c.id===topId);
    return Render.winnerCard(pos, winner, list[topId], ballotsTotal);
  }).join("");

  const chart = document.getElementById("chart");
  chart.innerHTML = election.positions.map(pos => {
    const list = counts[pos.id];
    const max = Math.max(...Object.values(list), 1);
    const rows = pos.candidates.map(c=>{
      const v = list[c.id];
      const pct = Math.round((v/max)*100);
      return Render.bar(c.full_name, v, pct);
    }).join("");
    return `<h3>${pos.name}</h3>${rows}`;
  }).join("<hr>");
})();