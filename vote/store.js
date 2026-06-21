const Store = (() => {
  const LS_VOTES = "mjs_votes";
  const LS_VERIFIED = "mjs_verified";

  async function loadJSON(url) {
    const r = await fetch(url, {cache: "no-store"});
    if (!r.ok) throw new Error("Failed to load " + url);
    return r.json();
  }

  function getLS(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function setLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function saveBallot(electionId, ballot) {
    const all = getLS(LS_VOTES, {});
    all[electionId] = all[electionId] || [];
    all[electionId].push(ballot);
    setLS(LS_VOTES, all);
  }
  function getBallots(electionId) {
    const all = getLS(LS_VOTES, {});
    return all[electionId] || [];
  }

  function markVerified(electionId, studentId) {
    const v = getLS(LS_VERIFIED, {});
    v[electionId] = v[electionId] || {};
    v[electionId][studentId] = true;
    setLS(LS_VERIFIED, v);
  }
  function isVerified(electionId, studentId) {
    const v = getLS(LS_VERIFIED, {});
    return !!(v[electionId] && v[electionId][studentId]);
  }

  function tally(election) {
    const counts = {};
    for (const pos of election.positions) {
      counts[pos.id] = {};
      for (const c of pos.candidates) counts[pos.id][c.id] = 0;
    }
    for (const b of getBallots(election.id)) {
      if (b.verifiedStudentId) {
        for (const v of b.votes) counts[v.positionId][v.candidateId] += 1;
      }
    }
    return counts;
  }

  return { loadJSON, saveBallot, getBallots, markVerified, isVerified, tally };
})();