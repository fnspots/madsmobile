
(function(){
  var search = document.getElementById('weapon-search');
  var table = document.getElementById('weapons-table');
  var noResults = document.getElementById('no-results-msg');
  if (search && table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
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
  if (table) {
    var ths = table.querySelectorAll('th[data-sort]');
    var dir = {};
    ths.forEach(function(th){
      var key = th.dataset.sort;
      if (key === 'none') return;
      th.addEventListener('click', function(){
        var tbody = table.querySelector('tbody');
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        dir[key] = dir[key] === 'asc' ? 'desc' : 'asc';
        var mult = dir[key] === 'asc' ? 1 : -1;
        rows.sort(function(a, b){
          var av = key === 'tier-rank' ? parseInt(a.dataset.tierRank || a.dataset['tierRank'] || a.getAttribute('data-tier-rank'), 10) : a.dataset[key] || a.getAttribute('data-'+key);
          var bv = key === 'tier-rank' ? parseInt(b.dataset.tierRank || b.getAttribute('data-tier-rank'), 10) : b.dataset[key] || b.getAttribute('data-'+key);
          if (key === 'tier-rank') return (av - bv) * mult;
          if (av < bv) return -1 * mult;
          if (av > bv) return 1 * mult;
          return 0;
        });
        rows.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  }
})();
