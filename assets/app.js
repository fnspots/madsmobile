
(function(){
  // --- Complete Weapons: sortable, filterable table (one per game page) ---
  var NUMERIC_SORT_KEYS = {"tier-rank":1,"rpm":1,"magazine":1};
  Array.prototype.slice.call(document.querySelectorAll('.complete-table-wrap')).forEach(function(wrap){
    var search = wrap.querySelector('.complete-search');
    var table = wrap.querySelector('.complete-table');
    var noResults = wrap.querySelector('.no-results-msg');
    if (!table) return;
    var tbody = table.querySelector('tbody');
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    if (search) {
      search.addEventListener('input', function(){
        var q = search.value.trim().toLowerCase();
        var visible = 0;
        rows.forEach(function(r){
          var match = r.dataset.name.indexOf(q) !== -1 || r.dataset.class.indexOf(q) !== -1;
          r.hidden = !match;
          if (match) visible++;
        });
        if (noResults) noResults.hidden = visible !== 0;
      });
    }
    var dir = {};
    Array.prototype.slice.call(table.querySelectorAll('th[data-sort]')).forEach(function(th){
      var key = th.dataset.sort;
      if (key === 'none') return;
      th.addEventListener('click', function(){
        dir[key] = dir[key] === 'asc' ? 'desc' : 'asc';
        var mult = dir[key] === 'asc' ? 1 : -1;
        var isNumeric = !!NUMERIC_SORT_KEYS[key];
        var sorted = rows.slice().sort(function(a, b){
          var av = a.dataset[key.replace(/-([a-z])/g, function(m,c){return c.toUpperCase();})] || a.getAttribute('data-'+key);
          var bv = b.dataset[key.replace(/-([a-z])/g, function(m,c){return c.toUpperCase();})] || b.getAttribute('data-'+key);
          if (isNumeric) {
            av = parseFloat(av); bv = parseFloat(bv);
            if (isNaN(av)) av = -1;
            if (isNaN(bv)) bv = -1;
            return (av - bv) * mult;
          }
          av = (av || '').toLowerCase(); bv = (bv || '').toLowerCase();
          if (av < bv) return -1 * mult;
          if (av > bv) return 1 * mult;
          return 0;
        });
        sorted.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  });

  // --- game page template v2: weapon cards (Best / Complete tabs) ---
  function setupWeaponPanel(panel){
    var search = panel.querySelector('.weapon-search');
    var grid = panel.querySelector('.weapon-card-grid');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.weapon-card'));
    var noResults = panel.querySelector('.no-results-msg');
    if (search) {
      search.addEventListener('input', function(){
        var q = search.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function(c){
          var match = c.dataset.name.indexOf(q) !== -1 || c.dataset.class.indexOf(q) !== -1;
          c.hidden = !match;
          if (match) visible++;
        });
        if (noResults) noResults.hidden = visible !== 0;
      });
    }
    var dir = {};
    Array.prototype.slice.call(panel.querySelectorAll('[data-sort-key]')).forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.dataset.sortKey;
        dir[key] = dir[key] === 'asc' ? 'desc' : 'asc';
        var mult = dir[key] === 'asc' ? 1 : -1;
        var sorted = cards.slice().sort(function(a, b){
          var av, bv;
          if (key === 'tier-rank') {
            av = parseInt(a.dataset.tierRank, 10);
            bv = parseInt(b.dataset.tierRank, 10);
            return (av - bv) * mult;
          }
          av = a.dataset[key] || '';
          bv = b.dataset[key] || '';
          if (av < bv) return -1 * mult;
          if (av > bv) return 1 * mult;
          return 0;
        });
        sorted.forEach(function(c){ grid.appendChild(c); });
      });
    });
  }
  Array.prototype.slice.call(document.querySelectorAll('.weapon-tab-panel')).forEach(setupWeaponPanel);

  Array.prototype.slice.call(document.querySelectorAll('.tab-btn')).forEach(function(btn){
    btn.addEventListener('click', function(){
      var group = btn.parentElement;
      var panelsContainer = group.nextElementSibling;
      Array.prototype.slice.call(group.querySelectorAll('.tab-btn')).forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      if (panelsContainer) {
        Array.prototype.slice.call(panelsContainer.querySelectorAll('.weapon-tab-panel')).forEach(function(p){ p.classList.remove('active'); });
      }
      var target = document.getElementById(btn.dataset.tabTarget);
      if (target) target.classList.add('active');
    });
  });
})();
