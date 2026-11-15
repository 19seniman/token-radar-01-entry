(function () {
  var B = window.BOARD, rows = B.rows, tpl = B.tpl;
  var R = { slug: 0, name: 1, rank: 2, value: 3, cat: 4, chains: 5, tvl: 6, chg: 7, tok: 8, wl: 9, steps: 10 };
  var el = function (id) { return document.getElementById(id); };

  function money(n) {
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
    return "$" + n;
  }
  function pct(v) {
    if (v === null || v === undefined) return "—";
    var s = (v > 0 ? "+" : "") + v.toFixed(1) + "%";
    return '<span class="' + (v > 0 ? "up" : v < 0 ? "down" : "") + '">' + s + "</span>";
  }
  function fill(t, r) {
    var chain = r[R.chains][0] || "its main chain";
    return t.replace(/\u0000N\u0000/g, r[R.name]).replace(/\u0000C\u0000/g, chain);
  }

  // controls
  var cats = {}, chs = {};
  rows.forEach(function (r) {
    if (r[R.cat]) cats[r[R.cat]] = 1;
    r[R.chains].forEach(function (c) { chs[c] = 1; });
  });
  Object.keys(cats).sort().forEach(function (c) {
    var o = document.createElement("option"); o.value = c; o.textContent = c; el("cat").appendChild(o);
  });
  Object.keys(chs).sort().forEach(function (c) {
    var o = document.createElement("option"); o.value = c; o.textContent = c; el("chain").appendChild(o);
  });

  el("stats").innerHTML =
    '<div class="stat"><b>' + rows.length + "</b><span>protocols</span></div>" +
    '<div class="stat"><b>' + rows.filter(function (r) { return r[R.wl]; }).length + "</b><span>on watchlist</span></div>" +
    '<div class="stat"><b>' + money(rows[0][R.value]) + "</b><span>top implied</span></div>" +
    '<div class="stat"><b>' + B.as_of + "</b><span>snapshot</span></div>";

  var current = null;

  function visible() {
    var q = el("q").value.trim().toLowerCase(), c = el("cat").value, ch = el("chain").value, wl = el("wl").checked;
    return rows.filter(function (r) {
      if (wl && !r[R.wl]) return false;
      if (c && r[R.cat] !== c) return false;
      if (ch && r[R.chains].indexOf(ch) < 0) return false;
      if (!q) return true;
      return (r[R.name] + " " + r[R.slug] + " " + r[R.cat] + " " + r[R.chains].join(" ")).toLowerCase().indexOf(q) >= 0;
    });
  }

  function render() {
    var list = visible(), out = [];
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      out.push(
        '<tr data-slug="' + r[R.slug] + '"' + (current === r[R.slug] ? ' class="on"' : "") + ">" +
        '<td class="num">' + r[R.rank] + "</td>" +
        '<td><div class="name">' + r[R.name] + (r[R.wl] ? '<span class="pill wl">watchlist</span>' : "") +
        '</div><div class="slug">' + r[R.slug] + "</div></td>" +
        '<td>' + (r[R.cat] || "—") + "</td>" +
        '<td class="slug">' + r[R.chains].slice(0, 3).join(", ") + (r[R.chains].length > 3 ? " +" + (r[R.chains].length - 3) : "") + "</td>" +
        '<td class="num">' + money(r[R.tvl]) + "</td>" +
        '<td class="num">' + pct(r[R.chg]) + "</td>" +
        '<td class="num val">' + money(r[R.value]) + "</td>" +
        "</tr>"
      );
    }
    el("rows").innerHTML = out.join("");
    el("count").textContent = list.length + " of " + rows.length + " rows";
  }

  function detail(r) {
    var chain = r[R.chains][0] || "its main chain";
    var steps = r[R.steps].map(function (t) { return "<li>" + fill(tpl[t], r) + "</li>"; }).join("");
    var why = r[R.tok]
      ? "Records a token already, so it ranks on what the token trades at rather than on a launch."
      : "Records no token, so the implied value is what a launch could be worth.";
    el("detail").innerHTML =
      "<h2>" + r[R.name] + "</h2>" +
      '<div class="meta">' + r[R.slug] + " · " + (r[R.cat] || "no category") + "</div>" +
      '<div class="kv">' +
      "<div>Rank</div><div>" + r[R.rank] + " of " + rows.length + "</div>" +
      "<div>Implied value</div><div class=\"val\">" + money(r[R.value]) + "</div>" +
      "<div>TVL</div><div>" + money(r[R.tvl]) + "</div>" +
      "<div>7-day change</div><div>" + pct(r[R.chg]) + "</div>" +
      "<div>Watchlist</div><div>" + (r[R.wl] ? "yes" : "no") + "</div>" +
      "<div>Token</div><div>" + (r[R.tok] ? "exists" : "none yet") + "</div>" +
      "</div>" +
      '<h3>Chains</h3><div class="chips">' +
      r[R.chains].map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") +
      "</div>" +
      '<h3>Why it ranks here</h3><p class="why">' + why + " Implied value is TVL times a category multiple, adjusted for the 7-day trend, the strongest chain it runs on and how long it has been tracked.</p>" +
      "<h3>Steps to farm it</h3><ol class=\"steps\">" + steps + "</ol>";
  }

  el("rows").addEventListener("click", function (e) {
    var tr = e.target.closest("tr");
    if (!tr) return;
    current = tr.getAttribute("data-slug");
    var r = rows.filter(function (x) { return x[R.slug] === current; })[0];
    render();
    detail(r);
  });
  ["q", "cat", "chain", "wl"].forEach(function (id) {
    el(id).addEventListener("input", render);
    el(id).addEventListener("change", render);
  });

  render();

})();
