/**
 * Core Swiper
 */
$(".swiper__module").each(function() {
	var self = $(this),
		swiperEl = self.children(".swiper__inner"),
		wrapper = $(".swiper-wrapper", self),
		optData = self.data("options"),
		optDefault = {
			pagination: {
				el: self.children(".swiper-pagination-custom"),
				clickable: true,
				dynamicBullets: true
			},
			navigation: {
				nextEl: self
					.children(".swiper-button-custom")
					.children(".swiper-button-next-custom"),
				prevEl: self
					.children(".swiper-button-custom")
					.children(".swiper-button-prev-custom")
			},
			spaceBetween: 30,
			autoHeight: true
		},
		options = $.extend(optDefault, optData);
	wrapper.children().wrap('<div class="swiper-slide"></div>');
	var swiper = new Swiper(swiperEl, options);

	function thumbnails(selector) {
		if (selector.length > 0) {
			var wrapperThumbs = selector.children(".swiper-wrapper"),
				optDataThumbs = selector.data("options"),
				optDefaultThumbs = {
					spaceBetween: 10,
					centeredSlides: true,
					slidesPerView: 3,
					touchRatio: 0.3,
					slideToClickedSlide: true,
					pagination: {
						el: selector.children(".swiper-pagination-custom")
					},
					navigation: {
						nextEl: selector.children(".swiper-button-next-custom"),
						prevEl: selector.children(".swiper-button-prev-custom")
					}
				},
				optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);
			wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
			var swiperThumbs = new Swiper(selector, optionsThumbs);
			swiper.controller.control = swiperThumbs;
			swiperThumbs.controller.control = swiper;
		}
	}
	thumbnails(self.next(".swiper-thumbnails__module"));
});

$(".js-video-popup").magnificPopup({
	disableOn: 700,
	type: "iframe",
	removalDelay: 160,
	preloader: false,
	fixedContentPos: false
});
class coreHoverParallax {
	constructor(el, opt) {
		this.el = $(el);
		const defaultOpt = {
			type: "3d"
		};
		const dataOpt = {
			type: this.el.data("hover-parallax-options")
		};
		this.opts = $.extend(defaultOpt, opt, dataOpt);
		this.inner = null;
		this.btnPlay = null;
		this.bgclone1 = '<div class="bg-parallax-clone-1"></div>';
		this.bgclone2 = '<div class="bg-parallax-clone-2"></div>';
		this.bgclone3 = '<div class="bg-parallax-clone-3"></div>';
		return this.init();
	}

	init() {
		var { el } = this;
		el.on({
			mousemove: event => this.mousemove(event),
			mouseenter: event => this.mouseenter(event),
			mouseleave: event => this.mouseleave(event)
		});
		this.type();
	}

	type() {
		const { opts } = this;
		this.el.each(index => {
			const img = $(".bg-cover", this.el[index]);
			img.css({
				width: img.outerWidth() + "px",
				height: img.outerHeight() + "px"
			});
			if (opts.type === "3d") {
				img.clone()
					.prependTo(img.parent())
					.wrap(this.bgclone1);
				img.clone()
					.prependTo(img.parent())
					.wrap(this.bgclone2);
				img.clone()
					.prependTo(img.parent())
					.wrap(this.bgclone3);
			}
		});
	}

	mousemove(event) {
		const self = $(event.currentTarget);
		let w = self.outerWidth(),
			h = self.outerHeight(),
			o = self.offset(),
			x = (o.left + w / 2 - event.pageX) / 15,
			y = (o.top + h / 2 - event.pageY) / 15;
		this.inner = self.children();
		this.btnPlay = $(".js-video-popup", self);
		this.inner.css(
			"transform",
			"perspective(300em) translate(" +
				parseInt(x / 2) +
				"px, " +
				parseInt(y / 2) +
				"px) rotateX(" +
				-parseInt(y) +
				"deg) rotateY(" +
				parseInt(x) +
				"deg)"
		);
		this.btnPlay.css(
			"transform",
			"translate(" + parseInt(x) + "px, " + parseInt(y) + "px)"
		);
		$("." + $(this.bgclone1)[0].className, self).css(
			"transform",
			"translate(" + -parseInt(x / 1) + "px, " + -parseInt(y / 1) + "px)"
		);
		$("." + $(this.bgclone2)[0].className, self).css(
			"transform",
			"translate(" + -parseInt(x / 2) + "px, " + -parseInt(y / 2) + "px)"
		);
		$("." + $(this.bgclone3)[0].className, self).css(
			"transform",
			"translate(" + -parseInt(x / 3) + "px, " + -parseInt(y / 3) + "px)"
		);
	}

	mouseenter() {
		const self = $(event.currentTarget);
		this.inner = self.children();
		this.btnPlay = $(".js-video-popup", self);
		if (
			this.btnPlay.css("transform") === "none" ||
			this.btnPlay.css("transform") === "matrix(1, 0, 0, 1, 0, 0)"
		) {
			this.inner.css("transition", "all 0.3s ease");
			this.btnPlay.css("transition", "all 0.3s ease");
			$(
				"." +
					$(this.bgclone1)[0].className +
					", ." +
					$(this.bgclone2)[0].className +
					", ." +
					$(this.bgclone3)[0].className,
				self
			).css("transition", "all 0.3s ease");
			setTimeout(() => {
				this.inner.css("transition", "none");
				this.btnPlay.css("transition", "none");
				$(
					"." +
						$(this.bgclone1)[0].className +
						", ." +
						$(this.bgclone2)[0].className +
						", ." +
						$(this.bgclone3)[0].className,
					self
				).css("transition", "none");
			}, 300);
		}
	}

	mouseleave(event) {
		const self = $(event.currentTarget);
		const update = setInterval(() => {
			if (this.btnPlay.css("transform") !== "matrix(1, 0, 0, 1, 0, 0)") {
				this.inner.css({
					transform:
						"perspective(300em) translate(0px, 0px) rotateX(0deg) rotateY(0deg)",
					transition: "all 0.3s ease"
				});
				this.btnPlay.css({
					transform: "translate(0px, 0px)",
					transition: "all 0.3s ease"
				});
				$(
					".bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3",
					self
				).css({
					transform: "translate(0px, 0px)",
					transition: "all 0.3s ease"
				});
			} else {
				this.inner.css("transition", "none");
				this.btnPlay.css("transition", "none");
				$(
					".bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3",
					self
				).css("transition", "none");
				clearInterval(update);
			}
		}, 5);
	}
}

new coreHoverParallax('[class*="video-popup-parallax-"]');

class TodoList extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          name: "Photoshop",
          complete: false
        },
        {
          name: "After Effect",
          complete: false
        },
        {
          name: "Sketch",
          complete: false
        }
      ],
      value: ""
    };
    this._renderItem = this._renderItem.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleAdd = this._handleAdd.bind(this);
    this._handleComplete = this._handleComplete.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleChange(event) {
    const { value } = event.target;
    this.setState({ value });
  }

  _handleAdd(event) {
    event.preventDefault();
    this.setState(prevState => {
      const newItem = {
        name: prevState.value,
        complete: false
      };
      return {
        data: [newItem, ...prevState.data],
        value: ""
      };
    });
  }

  _handleComplete(index) {
    console.log("_handleComplete");
    return function() {
      this.setState(prevState => ({
        data: prevState.data.map((item, _index) => {
          return {
            name: item.name,
            complete: _index === index ? !item.complete : item.complete
          };
        })
      }));
    }.bind(this);
  }

  _handleDelete(index) {
    return function() {
      this.setState(prevState => ({
        data: prevState.data.filter((_, _index) => _index !== index)
      }));
    }.bind(this);
  }

  _renderItem(item, index) {
    const style = { color: item.complete ? "red" : "black" };
    return (
      <li key={index}>
        <span onClick={this._handleComplete(index)} style={style}>
          {item.name}
        </span>
        <button onClick={this._handleDelete(index)}>Delete</button>
      </li>
    );
  }

  render() {
    const { data, value } = this.state;
    return (
      <div>
        <form>
          <input onChange={this._handleChange} type="text" value={value} />
          <button
            className="wil-btn wil-btn--primary"
            onClick={this._handleAdd}
          >
            Add List
          </button>
        </form>
        <ul>{data.map(this._renderItem)}</ul>
      </div>
    );
  }
}

class ReactTest extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
  }

  _handleSubmit(event) {
    event.preventDefault();
    console.log(event);
  }

  _renderHeader() {
    return (
      <div className="long_box__header">
        <h3 className="long_box__title">Memorable holidays</h3>
      </div>
    );
  }

  _renderForm() {
    return (
      <form className="long_contactBox__form">
        <textarea>
          I am interested in Sunny Apartment near Metro station, 467 Pacific
          Road , Calle del Carmen, 28013, Madrid
        </textarea>
        <label className="long_contactBox__label">Edit your infomation</label>
        <button
          onClick={this._handleSubmit}
          className="wil-btn wil-btn--primary wil-btn--pill wil-btn--lg wil-btn--block"
        >
          REQUEST INFO
        </button>
      </form>
    );
  }
  render() {
    return (
      <div>
        <TodoList />
        <div className="long_box__module long_box__boxWhite">
          {this._renderHeader()}
          <div className="long_box__body">
            <div className="long_contactBox__module">
              <div className="long_contactBox__top">
                <div
                  className="long_contactBox__avatar bg-cover"
                  style={{
                    "background-image":
                      "url(https://uinames.com/api/photos/male/9.jpg)"
                  }}
                />
                <div className="long_contactBox__body">
                  <h3 className="long_contactBox__name">Jose Snyder</h3>
                  <div className="long_contactBox__des">
                    Christie’s Internation Real Estate
                  </div>
                  <div className="long_contactBox__meta">1625 Listings</div>
                  <div className="long_contactBox__social">
                    <div className="long_social__module long_social__bgColor">
                      <a className="long_social__item" href="#">
                        <i className="fa fa-facebook long_social__icon" />
                      </a>
                      <a className="long_social__item" href="#">
                        <i className="fa fa-twitter long_social__icon" />
                      </a>
                      <a className="long_social__item" href="#">
                        <i className="fa fa-pinterest long_social__icon" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {this._renderForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const reactTest = document.getElementById("reactTest");

reactTest && ReactDOM.render(<ReactTest />, reactTest);

/**
 * Wil Popup
 */
class wilPopup {
  constructor(el) {
    this.el = $(el);
    this.st = 0;
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.handleClosePopup = this.handleClosePopup.bind(this);
    this.init();
  }
  handleOpenPopup(self, content, inputFocus) {
    return function(event) {
      event.preventDefault();
      const allContent = document.querySelectorAll("[data-popup-content]");
      wilEach(allContent, content => (content.style.zIndex = ""));
      $("[data-popup-content]").css("z-index", "");
      self.addClass("active");
      content.css("z-index", "10000").addClass("active");
      this.st = $(window).scrollTop();
      $("body")
        .css("top", `${-this.st}px`)
        .addClass("disabled-scroll");
      setTimeout(() => inputFocus.focus(), 1000);
    }.bind(this);
  }
  handleClosePopup(self, content) {
    return function(event) {
      event.preventDefault();
      content.removeClass("active");
      self.removeClass("active");
      $("body")
        .css("top", "")
        .removeClass("disabled-scroll");
      $(window).scrollTop(this.st);
    }.bind(this);
  }

  init() {
    this.el.each(index => {
      const self = $(this.el[index]);
      const dataPopup = self.attr("data-popup");
      const content = $(`[data-popup-content="${dataPopup}"]`);
      const close = $(".js-toggle-close, .js-popup-overlay", content);
      const inputFocus = $(".js-input-focus", content);
      self.on("click", this.handleOpenPopup(self, content, inputFocus));
      close.on("click", this.handleClosePopup(self, content));
    });
  }
}

const newWilPopup = new wilPopup("[data-popup]");

