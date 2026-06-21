const Render = (() => {
  function electionCard(e) {
    const now = new Date();
    const start = new Date(e.start_at), end = new Date(e.end_at);
    const status = now < start ? "Upcoming" : now > end ? "Closed" : "Ongoing";
    return `
      <div class="card">
        <div class="header">
          <img src="assets/logo.png" alt="logo" class="logo"/>
          <div>
            <h3>${e.title}</h3>
            <div class="small">${e.description || ""}</div>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <span class="badge">${status}</span>
          <span class="badge">From: ${start.toLocaleString()}</span>
          <span class="badge">To: ${end.toLocaleString()}</span>
        </div>
        <div class="row" style="margin-top:12px">
          <a class="btn primary" href="election.html?id=${encodeURIComponent(e.id)}">Vote</a>
          <a class="btn muted" href="results.html?id=${encodeURIComponent(e.id)}">View results</a>
        </div>
      </div>`;
  }

  function winnerCard(position, winner, votes, total) {
    return `
      <div class="card">
        <h3>${position.name} – Winner</h3>
        <div>${winner.full_name}</div>
        <div class="small">Achieved <b>${votes}</b> out of <b>${total}</b> verified ballots</div>
      </div>`;
  }

  function bar(label, value, pct) {
    return `
      <div>
        <div class="row" style="justify-content:space-between">
          <div>${label}</div>
          <div class="small">${value} votes</div>
        </div>
        <div class="bar"><span style="width:${pct}%"></span></div>
      </div>`;
  }

  return { electionCard, winnerCard, bar };
})();