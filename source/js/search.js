var SearchService = "";

(function() {
  SearchService = function(options) {
    var self = this;

    self.config = Object.assign({
      per_page: 10,
      selectors: {
        body: "body",
        form: ".u-search-form",
        input: ".u-search-input",
        container: "#u-search",
        modal: "#u-search .modal",
        modal_body: "#u-search .modal-body",
        modal_footer: "#u-search .modal-footer",
        modal_overlay: "#u-search .modal-overlay",
        modal_results: "#u-search .modal-results",
        modal_metadata: "#u-search .modal-metadata",
        modal_error: "#u-search .modal-error",
        modal_loading_bar: "#u-search .modal-loading-bar",
        modal_ajax_content: "#u-search .modal-ajax-content",
        modal_logo: '#u-search .modal-footer .logo',
        btn_close: "#u-search .btn-close",
        btn_next: "#u-search .btn-next",
        btn_prev: "#u-search .btn-prev"
      },
      brands: {
        'google': {logo: 'google.svg', url: 'https://cse.google.com'},
        'algolia': {logo: 'algolia.svg', url: 'https://www.algolia.com'},
        'hexo': {logo: '', url: ''},
        'azure': {logo: 'azure.svg', url: 'https://azure.microsoft.com/en-us/services/search/'},
        'baidu': {logo: 'baidu.svg', url: 'http://zn.baidu.com/cse/home/index'}
      },
      imagePath: ROOT + "img/"
    }, options);

    self.dom = {};
    self.percentLoaded = 0;
    self.open = false;
    self.queryText = "";
    self.nav = {
      next: -1,
      prev: -1,
      total: 0,
      current: 1
    };

    self.parseSelectors = function() {
      for (var key in self.config.selectors) {
        self.dom[key] = document.querySelector(self.config.selectors[key]);
      }
    };

    self.beforeQuery = function() {
      if (!self.open) {
        self.dom.container.style.display = 'block';
        self.dom.body.classList.add('modal-active');
      }
      self.dom.input.forEach(function(elem) {
        elem.value = self.queryText;
      });
      document.activeElement.blur();
      self.dom.modal_error.style.display = 'none';
      self.dom.modal_ajax_content.classList.remove('loaded');
      self.startLoading();
    };
    
    self.afterQuery = function() {
      self.dom.modal_body.scrollTop = 0;
      self.dom.modal_ajax_content.classList.add('loaded');
      self.stopLoading();
    };

    self.search = function(startIndex, callback) {
      self.beforeQuery();
      if (self.query instanceof Function) {
        self.query(self.queryText, startIndex, function() {
          self.afterQuery();
        });
      } else {
        console.log("query() does not exist.");
        self.onQueryError(self.queryText, '');
        self.afterQuery();
      }
    };

    self.onQueryError = function(queryText, status) {
      var errMsg = "";
      if (status === "success") errMsg = "No result found for \"" + queryText + "\".";
      else if (status === "timeout") errMsg = "Unfortunate timeout.";
      else errMsg = "Mysterious failure.";
      self.dom.modal_results.innerHTML = "";
      self.dom.modal_error.innerHTML = errMsg;
      self.dom.modal_error.style.display = 'block';
    };
    
    self.nextPage = function() {
      if (self.nav.next !== -1) {
        self.search(self.nav.next);
      }
    };
    
    self.prevPage = function() {
      if (self.nav.prev !== -1) {
        self.search(self.nav.prev);
      }
    };
    
    self.buildResult = function(url, title, digest) {
      var html = "<li>";
      html +=   "<a class='result' href='" + url + "'>";
      html +=     "<span class='title'>" + title + "</span>";
      html +=     "<span class='digest'>" + digest + "</span>";
      html +=     "<span class='icon icon-chevron-thin-right'></span>";
      html +=   "</a>";
      html += "</li>";
      return html;
    };
    
    self.close = function() {
      self.open = false;
      self.dom.container.style.display = 'none';
      self.dom.body.classList.remove('modal-active');
    };
    
    self.onSubmit = function(event) {
      event.preventDefault();
      self.queryText = event.target.querySelector('.u-search-input').value;
      if (self.queryText) {
        self.search(1);
      }
    };
    
    self.startLoading = function() {
      self.dom.modal_loading_bar.style.display = 'block';
      self.loadingTimer = setInterval(function() { 
        self.percentLoaded = Math.min(self.percentLoaded + 5, 95);
        self.dom.modal_loading_bar.style.width = self.percentLoaded + '%';
      }, 100);
    };
    
    self.stopLoading = function() {
      clearInterval(self.loadingTimer);
      self.dom.modal_loading_bar.style.width = '100%';
      setTimeout(function() {
        self.percentLoaded = 0;
        self.dom.modal_loading_bar.style.width = '0%';
        self.dom.modal_loading_bar.style.display = 'none';
      }, 300);
    };

    self.addLogo = function(service) {
      var html = "";
      if (self.config.brands[service] && self.config.brands[service].logo) {
        html += "<a href='" + self.config.brands[service].url + "' class='" + service + "'>";
        html +=    '<img src="' + self.config.imagePath + self.config.brands[service].logo + '" />';
        html += "</a>";
        self.dom.modal_logo.innerHTML = html;
      }
    };

    self.destroy = function() {
      self.dom.form.forEach(function(elem) {
        elem.removeEventListener('submit', self.onSubmit);
      });
      self.dom.modal_overlay.removeEventListener('click', self.close);
      self.dom.btn_close.removeEventListener('click', self.close);
      self.dom.btn_next.removeEventListener('click', self.nextPage);
      self.dom.btn_prev.removeEventListener('click', self.prevPage);
      self.dom.container.remove();
    };
    
    self.init = function() {
      document.body.insertAdjacentHTML('beforeend', template);
      self.parseSelectors();
      self.dom.modal_footer.style.display = 'block';
      self.dom.form.forEach(function(elem) {
        elem.addEventListener('submit', self.onSubmit);
      });
      self.dom.modal_overlay.addEventListener('click', self.close);
      self.dom.btn_close.addEventListener('click', self.close);
      self.dom.btn_next.addEventListener('click', self.nextPage);
      self.dom.btn_prev.addEventListener('click', self.prevPage);
    };

    self.init();
  };

  var template = `
    <div id="u-search">
      <div class="modal">
        <header class="modal-header clearfix">
          <form id="u-search-modal-form" class="u-search-form" name="uSearchModalForm">
            <input type="text" id="u-search-modal-input" class="u-search-input" />
            <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit">
              <span class="icon icon-search"></span>
            </button>
          </form>
          <a class="btn-close">
            <span class="icon icon-close"></span>
          </a>
          <div class="modal-loading">
            <div class="modal-loading-bar"></div>
          </div>
        </header>
        <main class="modal-body">
          <ul class="modal-results modal-ajax-content"></ul>
        </main>
        <footer class="modal-footer clearfix">
          <div class="modal-metadata modal-ajax-content">
            <strong class="range"></strong> of <strong class="total"></strong>
          </div>
          <div class="modal-error"></div>
          <div class="logo"></div>
          <a class="nav btn-next modal-ajax-content">
            <span class="text">NEXT</span>
            <span class="icon icon-chevron-right"></span>
          </a>
          <a class="nav btn-prev modal-ajax-content">
            <span class="icon icon-chevron-left"></span>
            <span class="text">PREV</span>
          </a>
        </footer>
      </div>
      <div class="modal-overlay"></div>
    </div>`;
})();
