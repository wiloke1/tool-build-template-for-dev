const canvas = document.querySelector('canvas#canvas');
if (canvas) {
	var t, i = {
			screen: {
				elem: null,
				callback: null,
				ctx: null,
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				init: function (t, i, s) {
					return this.elem = document.getElementById(t), this.callback = i || null, "CANVAS" == this.elem.tagName && (this.ctx = this.elem.getContext("2d")), window.addEventListener("resize", function () {
						this.resize()
					}.bind(this), !1), this.elem.onselectstart = function () {
						return !1
					}, this.elem.ondrag = function () {
						return !1
					}, s && this.resize(), this
				},
				resize: function () {
					var t = this.elem;
					for (this.width = t.offsetWidth, this.height = t.offsetHeight, this.left = 0, this.top = 0; null != t; t = t.offsetParent) this.left += t.offsetLeft, this.top += t.offsetTop;
					this.ctx && (this.elem.width = this.width, this.elem.height = this.height), this.callback && this.callback()
				}
			}
		},
		s = function (t, i) {
			this.x = t, this.y = i, this.magnitude = t * t + i * i, this.computed = 0, this.force = 0
		};
	s.prototype.add = function (t) {
		return new s(this.x + t.x, this.y + t.y)
	};
	var h = function (t) {
		var i = .1,
			h = 1.5;
		this.vel = new s((Math.random() > .5 ? 1 : -1) * (.2 + .25 * Math.random()), (Math.random() > .5 ? 1 : -1) * (.2 + Math.random())), this.pos = new s(.2 * t.width + Math.random() * t.width * .6, .2 * t.height + Math.random() * t.height * .6), this.size = t.wh / 15 + (1.4 * Math.random() + .1) * (t.wh / 15), this.width = t.width, this.height = t.height
	};
	h.prototype.move = function () {
		this.pos.x >= this.width - this.size ? (this.vel.x > 0 && (this.vel.x = -this.vel.x), this.pos.x = this.width - this.size) : this.pos.x <= this.size && (this.vel.x < 0 && (this.vel.x = -this.vel.x), this.pos.x = this.size), this.pos.y >= this.height - this.size ? (this.vel.y > 0 && (this.vel.y = -this.vel.y), this.pos.y = this.height - this.size) : this.pos.y <= this.size && (this.vel.y < 0 && (this.vel.y = -this.vel.y), this.pos.y = this.size), this.pos = this.pos.add(this.vel)
	};
	var e = function (t, i, e, o, n) {
		this.step = 5, this.width = t, this.height = i, this.wh = Math.min(t, i), this.sx = Math.floor(this.width / this.step), this.sy = Math.floor(this.height / this.step), this.paint = !1, this.metaFill = r(t, i, t, o, n), this.plx = [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0], this.ply = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1], this.mscases = [0, 3, 0, 3, 1, 3, 0, 3, 2, 2, 0, 2, 1, 1, 0], this.ix = [1, 0, -1, 0, 0, 1, 0, -1, -1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1], this.grid = [], this.balls = [], this.iter = 0, this.sign = 1;
		for (var a = 0; a < (this.sx + 2) * (this.sy + 2); a++) this.grid[a] = new s(a % (this.sx + 2) * this.step, Math.floor(a / (this.sx + 2)) * this.step);
		for (var l = 0; l < e; l++) this.balls[l] = new h(this)
	};
	e.prototype.computeForce = function (t, i, s) {
		var h, e = s || t + i * (this.sx + 2);
		if (0 === t || 0 === i || t === this.sx || i === this.sy) h = .6 * this.sign;
		else {
			h = 0;
			for (var r = this.grid[e], o = 0, n; n = this.balls[o++];) h += n.size * n.size / (-2 * r.x * n.pos.x - 2 * r.y * n.pos.y + n.pos.magnitude + r.magnitude);
			h *= this.sign
		}
		return this.grid[e].force = h, h
	}, e.prototype.marchingSquares = function (t) {
		var i = t[0],
			s = t[1],
			h = t[2],
			e = i + s * (this.sx + 2);
		if (this.grid[e].computed === this.iter) return !1;
		for (var r, o = 0, n = 0; n < 4; n++) {
			var l = i + this.ix[n + 12] + (s + this.ix[n + 16]) * (this.sx + 2),
				d = this.grid[l].force;
			(d > 0 && this.sign < 0 || d < 0 && this.sign > 0 || !d) && (d = this.computeForce(i + this.ix[n + 12], s + this.ix[n + 16], l)), Math.abs(d) > 1 && (o += Math.pow(2, n))
		}
		if (15 === o) return [i, s - 1, !1];
		5 === o ? r = 2 === h ? 3 : 1 : 10 === o ? r = 3 === h ? 0 : 2 : (r = this.mscases[o], this.grid[e].computed = this.iter);
		var p = this.step / (Math.abs(Math.abs(this.grid[i + this.plx[4 * r + 2] + (s + this.ply[4 * r + 2]) * (this.sx + 2)].force) - 1) / Math.abs(Math.abs(this.grid[i + this.plx[4 * r + 3] + (s + this.ply[4 * r + 3]) * (this.sx + 2)].force) - 1) + 1);
		return a.lineTo(this.grid[i + this.plx[4 * r] + (s + this.ply[4 * r]) * (this.sx + 2)].x + this.ix[r] * p, this.grid[i + this.plx[4 * r + 1] + (s + this.ply[4 * r + 1]) * (this.sx + 2)].y + this.ix[r + 4] * p), this.paint = !0, [i + this.ix[r + 4], s + this.ix[r + 8], r]
	}, e.prototype.renderMetaballs = function () {
		for (var t = 0, i; i = this.balls[t++];) i.move();
		for (this.iter++, this.sign = -this.sign, this.paint = !1, a.fillStyle = this.metaFill, a.beginPath(), t = 0; i = this.balls[t++];) {
			var s = [Math.round(i.pos.x / this.step), Math.round(i.pos.y / this.step), !1];
			do {
				s = this.marchingSquares(s)
			} while (s);
			this.paint && (a.fill(), a.closePath(), a.beginPath(), this.paint = !1)
		}
	};
	var r = function (t, i, s, h, e) {
			var r = a.createRadialGradient(t / 1, i / 1, 0, t / 1, i / 1, s);
			return r.addColorStop(0, h), r.addColorStop(1, e), r
		},
		o = function () {
			requestAnimationFrame(o), a.clearRect(0, 0, n.width, n.height), t.renderMetaballs()
		},
		n = i.screen.init("canvas", null, !0),
		a = n.ctx;
	n.resize(), t = new e(n.width, n.height, 4, "#37e584", "#98ff00"), o()
}


class field {
	constructor() {
		this.css = {"module":".vinh_field__module","field":".vinh_field__field","select2":".vinh_field__select2","icon":".vinh_field__icon","textarea":".vinh_field__textarea","file":".vinh_field__file","select":".vinh_field__select","":""};
		this.apply();
	}
	
	apply() {
		const { css } = this;
		
		$(css.select2).select2({
			// ajax: {},
			minimumInputLengh: 1,
			placeholder: "Select a state",
		});
	}
}
new field();

(function formActive(el){
	const inputs = [...document.querySelectorAll(el)];
	// console.log(inputs.parentElement)
	console.log(inputs.parentNode)
	// console.log(outerEl)
	inputs.map((item)=>{
		item.addEventListener('focusin',function(){
			this.parentNode.wilAddClass('active');
		});
		item.addEventListener('focusout',function(){
			item.value === '' ? this.parentNode.wilRemoveClass('active') :null	
		})
	})
})('form#wil-subscribe input,form#wil-search input,form#wil-feedback input, form#wil-feedback textarea')



$('.swiper__module').each(function() {
	var self = $(this),
		wrapper = $('.swiper-wrapper', self),
		optData = eval('(' + self.attr('data-options') + ')'),
		method = {
			on: {
				init: function(){
					const container = wrapper[0];
					const items = [...container.querySelectorAll('.swiper-slide')]
					items.forEach(item	=>{
					let itemPosX = item.getBoundingClientRect().x;
					let windowWidth = window.innerWidth;
					let currentWidth = item.clientWidth;
						if(itemPosX<0 || windowWidth - itemPosX < currentWidth ){
							item.wilAddClass('covered')
						}
					})
				}
			}
		}
		,
		optDefault = {
			paginationClickable: true,
			pagination: {
				el: self.find('.swiper-pagination-custom')
			},
			navigation: {
				nextEl: self.find('.swiper-button-next-custom'),
				prevEl: self.find('.swiper-button-prev-custom'),
			},
			spaceBetween: 30
		},
		options = $.extend(optDefault, optData,method);
	wrapper.children().wrap('<div class="swiper-slide"></div>');
	var swiper = new Swiper(self, options);
	
	swiper.on('setTransition', function () {
		const container = wrapper[0];
		const items = [...container.querySelectorAll('.swiper-slide')]
		items.forEach(item	=>{
		let itemPosX = item.getBoundingClientRect().x;
		let windowWidth = window.innerWidth;
		let currentWidth = item.clientWidth;
			if(itemPosX<0 || windowWidth - itemPosX < currentWidth ){
				item.wilAddClass('covered')
			}
			else if(itemPosX>0){
				item.wilRemoveClass('covered')
			}
		})
	  });
	// console.log(swiper)
	function thumbnails(selector) {

		if (selector.length > 0) {
			var wrapperThumbs = selector.children('.swiper-wrapper'),
				optDataThumbs = eval('(' + selector.attr('data-options') + ')'),
				optDefaultThumbs = {
					spaceBetween: 10,
					centeredSlides: true,
					slidesPerView: 3,
					touchRatio: 0.3,
					slideToClickedSlide: true,
					pagination: {
						el: selector.find('.swiper-pagination-custom')
					},
					navigation: {
						nextEl: selector.find('.swiper-button-next-custom'),
						prevEl: selector.find('.swiper-button-prev-custom'),
					}
				},
				optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);
			wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
			var swiperThumbs = new Swiper(selector, optionsThumbs);
			swiper.controller.control = swiperThumbs;
			swiperThumbs.controller.control = swiper;
		}

	}
	thumbnails(self.next('.swiper-thumbnails__module'));
});



function box() {
	const css = {"module":".vinh_box__module","social":".vinh_box__social","share":".vinh_box__share","img":".vinh_box__img","tag":".vinh_box__tag","content":".vinh_box__content","text":".vinh_box__text","desc":".vinh_box__desc","title":".vinh_box__title","view":".vinh_box__view","comment":".vinh_box__comment","meta":".vinh_box__meta","":""};
	const modules = [...document.querySelectorAll(css.module)]

	modules.map(module => {
		// const moduleWidth = module.clientWidth;
		// const currentX = module.getBoundingClientRect().x;

		// console.log(currentX)
		// module.addEventListener('mouseup',event=>{
		// 	console.log('release')
		// 	if(parentWidth - moduleWidth < currentX){
		// 		module.wilAddClass('hideme')
		// 		console.log(module)
		// 	}
		// 	else{
		// 		module.wilRemoveClass('hideme')
		// 	}

		// })
		const btn = module.querySelector(`${css.share} a`);
		btn.addEventListener('click',event => {
			module.wilToggleClass('active');
			event.preventDefault();
		})
	})
}
box();


// (function transCover(el){
// 	const containers = [...document.querySelectorAll(el)];
// 	containers.forEach(container => {
// 		console.log(container)
// 		const containerClass=`.${container.className}`;
// 		// console.log(containerClass)
// 		// console.log(`${containerClass}`);
		
// 		var mutationObserver = new MutationObserver(function(mutations) {
// 			mutations.forEach(function (mutation){
// 				console.log(mutation)
// 			})

// 		})
// 		console.log(el)
// 		mutationObserver.observe(document.querySelector('.swiper-wrapper'), {
// 			attributes: true,
// 			characterData: true,
// 			childList: false,
// 			subtree: false,
// 			attributeOldValue: true,
// 			characterDataOldValue: true
// 		});
		
		
		
// 	})

// })('swiper-wrapper')

// var mutationObserver = new MutationObserver(function(mutations) {
// 	mutations.forEach(function(mutation) {
// 		const containers = [...document.querySelectorAll('.swiper-wrapper')];
// 		console.log(mutation)
// 		console.log('check')
// 		console.log(containers)
// 		containers.forEach(container => {
// 			const items = [...container.querySelectorAll('.swiper-slide')]
// 			console.log(items)
// 			items.map(item => {
// 				let itemPosX = item.getBoundingClientRect().x;
// 				let windowWidth = window.innerWidth;
// 				let currentWidth = item.clientWidth;
// 				if(itemPosX<0 || windowWidth - itemPosX < currentWidth ){
// 					item.wilAddClass('covered')
// 				}
// 				else if(itemPosX>0){
// 					item.wilRemoveClass('covered')
// 				}
// 			})
// 		})

// 	});
//   });

// (function transCover(el){
// 	console.log(el);

// 	const containers = [...document.querySelectorAll(el)];
// 	console.log(containers)
// 	containers.map(container => {
// 		mutationObserver.observe(document.querySelector(`${container.className}`), {
// 			attributes: true,
// 			characterData: true,
// 			childList: false,
// 			subtree: false,
// 			attributeOldValue: true,
// 			characterDataOldValue: true
// 		});
		
// 	})
// })('.swiper-wrapper')



// (function checkOpts(el){
// 	const containers =  [...document.querySelectorAll(el)]
// 	console.log(containers);
// 	containers.map(container => {
// 		container.addEventListener('mousemove',event => {
// 			console.log('move')

// 			const items = [...container.querySelectorAll('.swiper-slide')];
// 			console.log(items);
// 			items.map(item => {
// 				let itemPosX = item.getBoundingClientRect().x;

// 				}
// 				else if(itemPosX>0){
// 					item.wilRemoveClass('covered')
// 				}
// 			})
// 		})

// 	})
// })('.swiper-wrapper')
function box4() {
	const css = {"module":".vinh_box4__module","title":".vinh_box4__title","content":".vinh_box4__content","desc":".vinh_box4__desc","thumbgroup":".vinh_box4__thumbgroup","":""};
	;
	const thisModule = css.module;
	// console.log(thisModule);
	const items = [...document.querySelectorAll(thisModule)];
	// items.forEach((item) => item.clientWidth > 320 ? item.wilAddClass('small') : console.log(item));
	// items.forEach((item) => console.log(item.offsetWidth));
}
box4();

function randomRotate(from,to) {
	const random = from => to => Math.floor((Math.random() * to) + from);
	const getRotate = condition => from => to => {
		const num = random(from)(to);
		return condition ? `rotate(${num}deg)` : `rotate(-${num}deg)` ;
	}
	return (el) => {
		const items = [...document.querySelectorAll(el)];
		for(let i = 0 ; i < items.length;i++){
		  items[i].style.transform = getRotate(i % 2 === 0)(from)(to)
		}
	}
}
randomRotate(0,10)('.bg');




class navVertical {
	constructor() {
		this.css = {"module":".vinh_nav-vertical__module","search":".vinh_nav-vertical__search","navVertical":".vinh_nav-vertical__navVertical","nav-menu":".vinh_nav-vertical__nav-menu","":""};
		this.apply();
	}

	apply() {
		const { css } = this;

		new wilMenuVertical(css.navVertical, {
			menuWidth: 270,
			duration: 250,
			arrow: '<span class="nav-arrow"><i class="pe-7s-angle-right"></i></span>',
			backButton: '<a href="#"><i class="pe-7s-angle-left"></i> Back to {{ backName }}</a>',
			classBackButton: 'nav-back-button',
			verticalAlign: 'top'
		});

		$(css.module).each(function() {
			const self = $(this);
			const navVertical = $(css.navVertical, self);
			const search = $(css.search, self);

			const setHeight = () => {
				const searchHeight = search.outerHeight(true);
				const selfHeight = self.outerHeight();
				navVertical.height(selfHeight - searchHeight);
			}
			setHeight();
			$(window).on('resize', setHeight);
		});
	}
}
new navVertical();

function placeHolderLoad() {
	const css = {"module":".vinh_placeholder-load__module","hero":".vinh_placeholder-load__hero","search":".vinh_placeholder-load__search","content":".vinh_placeholder-load__content","container":".vinh_placeholder-load__container","blog":".vinh_placeholder-load__blog","blog-standard":".vinh_placeholder-load__blog-standard","blog-detail":".vinh_placeholder-load__blog-detail","col8":".vinh_placeholder-load__col8","col4":".vinh_placeholder-load__col4","home":".vinh_placeholder-load__home","destination-single":".vinh_placeholder-load__destination-single","home2":".vinh_placeholder-load__home2","destination":".vinh_placeholder-load__destination","col12":".vinh_placeholder-load__col12","about":".vinh_placeholder-load__about","col3":".vinh_placeholder-load__col3","col6":".vinh_placeholder-load__col6","":""};
	const module = document.querySelector(css.module);
	if(module){
			window.addEventListener('load',event =>{
				module.remove()
			})
		}
	}
placeHolderLoad();




function post() {
	const css = {"module":".vinh_post__module","header":".vinh_post__header","body":".vinh_post__body","footer":".vinh_post__footer","text":".vinh_post__text","meta":".vinh_post__meta","share":".vinh_post__share","metaItem":".vinh_post__metaItem","grid":".vinh_post__grid","latest":".vinh_post__latest","metaText":".vinh_post__metaText","list":".vinh_post__list","post02":".vinh_post__post02","title":".vinh_post__title","desc":".vinh_post__desc","post03":".vinh_post__post03","view":".vinh_post__view","comment":".vinh_post__comment","postImage":".vinh_post__postImage","img":".vinh_post__img","social":".vinh_post__social","":""};
	const postImagesModules = [...document.querySelectorAll(css.postImage)]
	const postModules = [...document.querySelectorAll(css.module)]

	postModules.map(module => {
		if(module.clientWidth < 400){
			module.wilAddClass('sm')
		}
		else {
			module.wilRemoveClass('sm')
		}
	})

	


	postImagesModules.map(module => {
		const btn = module.querySelector(`${css.share} a`);
		btn.addEventListener('click', event => {
			event.preventDefault();
			module.setAttribute('data-state',module.getAttribute('data-state') === 'open' ? 'closed' :'open')
		})
	})
}
post();

class share {
	constructor() {
		this.css = {"module":".vinh_share__module","shareTitle":".vinh_share__shareTitle","scrollTop":".vinh_share__scrollTop","vertical":".vinh_share__vertical","center":".vinh_share__center","":""};
		this.apply();
	}
	
	apply() {
		const { css } = this;
		
		const scrollTop = $(css.scrollTop);

		scrollTop.on('click', event => {
			event.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, 300);
		})		
	}
}
new share();



class textBoxGradient {
	constructor() {
		this.css = {"module":".vinh_text-box-gradient__module","icon":".vinh_text-box-gradient__icon","title":".vinh_text-box-gradient__title","light":".vinh_text-box-gradient__light","active":".vinh_text-box-gradient__active","":""};
		this.apply();
	}

	handleScroll(event, active) {
		// event.preventDefault();
		const { css } = this;
		const { currentTarget } = event;
		const href = $(currentTarget).find('a').attr('href');
		const o = $(href).offset();
		$(css.module).removeClass(active);
		$(currentTarget).addClass(active);
		$('html, body').animate({
			scrollTop: o.top - 30 + 'px'
		}, 300);
	}

	handleActive(active) {
		const { css } = this;
		const st = $(window).scrollTop();
		$('.panel__module').each((index, element) => {
			const o = $(element).offset();
			const h = $(element).outerHeight(true);
			const id = $(element).attr('id');
			if (st >= o.top - 100 && st <= o.top + h - 100) {
				$(`[href="#${ id }"]`).parent().addClass(active);
			} else {
				$(`[href="#${ id }"]`).parent().removeClass(active);
			}
		});
	}
	
	apply() {
		const { css } = this;
		const active = css.active.replace(/^\./g, '');
		$(css.module).on('click', event => this.handleScroll(event, active));
		$(window).on('scroll', () => this.handleActive(active));
	}
}


new textBoxGradient();

$('.js-video-popup').magnificPopup({
	disableOn: 700,
	type: 'iframe',
	removalDelay: 160,
	preloader: false,
	fixedContentPos: false
});
class wilHoverParallax {
	constructor(el, opt) {
		this.el = $(el);
		const defaultOpt = {
			type: '3d'
		};
		const dataOpt = {
			type: this.el.data('hover-parallax-options')
		};
		this.opts = $.extend(defaultOpt, opt, dataOpt);
		this.inner = null;
		this.btnPlay = null;
		this.bgclone1 = '<div class="bg-parallax-pclone-1"></div>';
		this.bgclone2 = '<div class="bg-parallax-clone-2"></div>';
		this.bgclone3 = '<div class="bg-parallax-clone-3"></div>';
		return this.init();
	}

	init() {
		var {el} = this;
		el.on({
			mousemove: event => this.mousemove(event),
			mouseenter: event => this.mouseenter(event),
			mouseleave: event => this.mouseleave(event)
		});
		this.type();
	}

	type() {
		const {opts} = this;
		this.el.each((index) => {
			const img = $('.bg-cover', this.el[index]);
			img.css({
				'width': img.outerWidth() + 'px',
				'height': img.outerHeight() + 'px'
			});
			if (opts.type === '3d') {
				img.clone().prependTo(img.parent())
					.wrap(this.bgclone1);
				img.clone().prependTo(img.parent())
					.wrap(this.bgclone2);
				img.clone().prependTo(img.parent())
					.wrap(this.bgclone3);
			}
		});
	}

	mousemove(event) {
		const self = $(event.currentTarget);
		let	w = self.outerWidth(),
			h = self.outerHeight(),
			o = self.offset(),
			x = parseInt((o.left + w/2 - event.pageX) / 15),
			y = parseInt((o.top + h/2 - event.pageY) / 15);
		this.inner = self.children();
		this.btnPlay = $('.js-video-popup', self);
		this.inner.css('transform', 'perspective(300em) translate(' + (x/2) + 'px, ' + (y/2) + 'px) rotateX(' + -(y) + 'deg) rotateY(' + (x) + 'deg)');
		this.btnPlay.css('transform', `translate(${ x }px, ${ y }px)`);
		$('.' + $(this.bgclone1)[0].className, self).css('transform', 'translate(' + -(x/1) + 'px, ' + -(y/1) + 'px)');
		$('.' + $(this.bgclone2)[0].className, self).css('transform', 'translate(' + -(x/2) + 'px, ' + -(y/2) + 'px)');
		$('.' + $(this.bgclone3)[0].className, self).css('transform', 'translate(' + -(x/3) + 'px, ' + -(y/3) + 'px)');
	}

	mouseenter() {
		const self = $(event.currentTarget);
		this.inner = self.children();
		this.btnPlay = $('.js-video-popup', self);
		if (
			this.btnPlay.css('transform') === 'none' || 
			this.btnPlay.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)'
		) {
			this.inner.css('transition', 'all 0.3s ease');
			this.btnPlay.css('transition', 'all 0.3s ease');
			$('.' + $(this.bgclone1)[0].className + ', .' + $(this.bgclone2)[0].className + ', .' + $(this.bgclone3)[0].className, self).css('transition', 'all 0.3s ease');
			setTimeout(() => {
				this.inner.css('transition', 'none');
				this.btnPlay.css('transition', 'none');
				$('.' + $(this.bgclone1)[0].className + ', .' + $(this.bgclone2)[0].className + ', .' + $(this.bgclone3)[0].className, self).css('transition', 'none');
			}, 300);
		}
	}

	mouseleave(event) {
		const self = $(event.currentTarget);
		const update = setInterval(() => {
			if (this.btnPlay.css('transform') !== 'matrix(1, 0, 0, 1, 0, 0)') {
				this.inner.css({
					'transform': 'perspective(300em) translate(0px, 0px) rotateX(0deg) rotateY(0deg)',
					'transition': 'all 0.3s ease'
				});
				this.btnPlay.css({
					'transform': 'translate(0px, 0px)',
					'transition': 'all 0.3s ease'
				});
				$('.bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3', self).css({
					'transform': 'translate(0px, 0px)',
					'transition': 'all 0.3s ease'
				});
			} else {
				this.inner.css('transition', 'none');
				this.btnPlay.css('transition', 'none');
				$('.bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3', self).css('transition', 'none');
				clearInterval(update);
			}
		}, 5);
	}
}

new wilHoverParallax('[class*="video-popup-parallax-"]');

$(document).ready(function(){
	$('footer .widget_list li.has-child > ul').hide();

	$('footer .widget_list li.has-child > a').click(function(event){
		this.parentNode.setAttribute('data-state',this.parentNode.getAttribute('data-state') === 'open' ? 'closed' :'open')
		$(this).next().toggle(250)
		event.preventDefault();
	})	
})


class bodyDesSingle {
	constructor() {
		this.css = {"module":".vinh_body-des-single__module","share":".vinh_body-des-single__share","style1":".vinh_body-des-single__style1","style2":".vinh_body-des-single__style2","nav":".vinh_body-des-single__nav","":""};
		this.apply();
	}

	theiaStickySidebar(nav) {
		nav.parent().theiaStickySidebar({
			updateSidebarHeight: true,
			additionalMarginTop: nav.attr('data-margin-top') || 20
		});
	}
	
	apply() {
		const { css } = this;
		
		$(css.nav).each((index, element) => {
			let nav = $(element);
			if (window.innerWidth < 992) {
				nav.parent().remove();
			} else {
				this.theiaStickySidebar(nav);
			}
		});
	}
}
new bodyDesSingle();

class header {
	constructor() {
		this.css = {"module":".vinh_header__module","logo":".vinh_header__logo","search":".vinh_header__search","fixed":".vinh_header__fixed","sticky":".vinh_header__sticky","style02":".vinh_header__style02","dark":".vinh_header__dark","full":".vinh_header__full","":""};
		this.apply();
	}

	handleMenu() {
		$('.header-nav').wilMenu({
			menuClass: 'header-menu',
			breakpoint: 1200,
		});
	}
	handleSearch(event, formSearch) {
		event.preventDefault();
		formSearch.setAttribute('data-state', 'true');
	}



	handleHeaderFixed(module) {
		const { css } = this;
		const st = window.wilScrollTop();
		const wh = window.innerHeight;
		const hasFixed = css.fixed.replace(/^\./g, '');
		const classSticky = css.sticky.replace(/^\./g, '');
		if (module.getAttribute('class').indexOf(hasFixed) !== -1) {
			if (st > wh) {
				module.wilAddClass(classSticky);
			} else {
				module.wilRemoveClass(classSticky);
			}
		}
	}
	
	apply() {
		const { css } = this;
		const modules = document.querySelectorAll(css.module);
		const moduleArr = [].slice.call(modules);
		wilEach(moduleArr, module => {
			const search = module.querySelector(`${css.search} a`);
			const formSearch = document.querySelector('[data-state]');
			if (search) {
				// search.addEventListener('click', event => this.handleSearch(event, formSearch));
			}
			window.addEventListener('scroll', () => this.handleHeaderFixed(module));
		});
		this.handleMenu();
	}
}
new header();


(function headerToggleBtnSearch(el){
	const module = document.querySelector(el);
	if(module){
		const input =  module.querySelector('input');
		const btnForm = module.querySelector('button');
		const btn = document.querySelector('a.toggle-mobile');
		module.setAttribute('data-state','closed');

		btn.addEventListener('click',event => {
			module.setAttribute('data-state','open');
		})
		
		input.addEventListener('focusout',event => {
			if(input.value===''){
				module.setAttribute('data-state','closed')
			}
		})
	}
})('header form.search-form')
class heroDesSingle {
	constructor() {
		this.css = {"module":".vinh_hero-des-single__module","sm":".vinh_hero-des-single__sm","title":".vinh_hero-des-single__title","nav":".vinh_hero-des-single__nav","fixed":".vinh_hero-des-single__fixed","svg":".vinh_hero-des-single__svg","style1":".vinh_hero-des-single__style1","style2":".vinh_hero-des-single__style2","":""};
		this.apply();
	}

	handleSticky(nav) {
		const { css } = this;
		const st = $(window).scrollTop();
		const wh = $(window).outerHeight();
		const ph = $('.page-wrap').outerHeight();
		const classFixed = css.fixed.replace(/^\./g, '');
		if (st > wh && st < ph - wh - 500) {
			nav.addClass(classFixed);
		} else {
			nav.removeClass(classFixed);
		}
	}

	mobile(nav) {
		if (isMobile.any()) {
			nav.remove();	
		}
	}
	
	apply() {
		const { css } = this;
		
		$(css.nav).each((index, element) => {
			const nav = $(element);
			$(window).on('scroll', () => this.handleSticky(nav));

			this.mobile(nav);
		});
	}
}
new heroDesSingle();

class hero {
	constructor() {
		this.css = {"module":".vinh_hero__module","header":".vinh_hero__header","img":".vinh_hero__img","videoPlaceholder":".vinh_hero__videoPlaceholder","bgVideo":".vinh_hero__bgVideo","fullscreen":".vinh_hero__fullscreen","sm":".vinh_hero__sm","style02":".vinh_hero__style02","video":".vinh_hero__video","style03":".vinh_hero__style03","":""};
		this.apply();
	}

	rect(header) {
		if (header) {
			header.style.clip = `rect(0, 100vw, ${ header.offsetHeight }px, 0)`
		}
	}

	handleHeight(img, header) {
		if (img) {
			img.style.height = `${ header.offsetHeight }px`;
		}
	}

	handleParallax(img, header) {
		const st = window.wilScrollTop();
		if (img && header) {
			if (st < header.offsetHeight) {
				img.style.transform = `translate(0, -${ st/4 }px)`
			}
		}
	}

	videoBackground(bgVideo) {
		if (bgVideo) {
			if (bgVideo.offsetHeight < window.innerHeight) {
				bgVideo.wilRemoveClass('wide');
				bgVideo.wilAddClass('high');
			} else {
				bgVideo.wilRemoveClass('high');
				bgVideo.wilAddClass('wide');
			}
			if (isMobile.any()) {
				bgVideo.style.opacity = 0;
			}
		}
	}
	
	apply() {
		const { css } = this;
		const moduleList = document.querySelectorAll(css.module);
		const moduleArr = [].slice.call(moduleList);
		for (let i = 0; i < moduleArr.length; i++) {
			const module = moduleArr[i];
			const img = module.querySelector(css.img);
			const header = module.querySelector(css.header);
			const bgVideo = module.querySelector(css.bgVideo);
			
			this.handleHeight(img, header);
			this.rect(header);
			this.videoBackground(bgVideo);
			window.addEventListener('resize', () => {
				this.handleHeight(img, header);
				this.rect(header);
				this.videoBackground(bgVideo);
			});

			window.addEventListener('scroll', () => this.handleParallax(img, header));

		}
	}
}
new hero();

class searchFixed {
	constructor() {
		this.css = {"module":".vinh_search-fixed__module","close":".vinh_search-fixed__close","nav":".vinh_search-fixed__nav","":""};
		this.apply();
	}
	
	apply() {
		const { css } = this;
		const close = document.querySelector(css.close);
		const module = document.querySelector(css.module);
		if (close) {
			close.addEventListener('click', () => module.setAttribute('data-search-active', 'false'));
		}
	}
}
new searchFixed();

function section() {
	const css = {"module":".vinh_section01__module","":""};
}
section();

// const mySwiper =  new Swiper('.swiper-container',{
// 	thumbnail: false,
// })

