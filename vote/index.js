(async function(){
  const data = await Store.loadJSON("elections.json");
  const now = new Date();
  const ongoing = [], upcoming = [], closed = [];

  for (const e of data.elections) {
    const start = new Date(e.start_at), end = new Date(e.end_at);
    const card = Render.electionCard(e);
    if (now < start) upcoming.push(card);
    else if (now > end) closed.push(card);
    else ongoing.push(card);
  }

  document.getElementById("ongoing").innerHTML = ongoing.join("") || '<div class="small">No ongoing elections.</div>';
  document.getElementById("upcoming").innerHTML = upcoming.join("") || '<div class="small">No upcoming elections.</div>';
  document.getElementById("closed").innerHTML = closed.join("") || '<div class="small">No closed elections yet.</div>';
})();