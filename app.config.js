// Config
const appConfig = {
	folders: {
		path: "_content",
		content: "wiloke-template",
		core: "wiloke-core",
		docs: "wiloke-docs"
	},

	progress: {
		all: "#41a5fa",
		working: "#F2D600",
		review: "#bc74ff",
		reject: "#ff7474",
		complete: "#61BD4F"
	},

	toggleHtmlElement: false,

	generateScopedName: "custom",

	classModulePrefix: {
		general: ""
		// hien: 'listing'
	},

	// data comment & check
	data: "data",

	createfileScss: false,

	entry: {
		path: "app",
		filename: "main.js",
		img: "img",
		font: "fonts",
		css: "styles/app.js",
		js: "js/app.js",
		scssImportInline: "abstracts"
	},
	output: {
		path: "build",
		css: "assets/css/app.css",
		libsCss: "assets/css/libs",
		js: "assets/js/app.js",
		img: "assets/img",
		font: "assets/fonts"
	},
	use: {
		html: /\.(pug|html)$/,
		css: /\.(scss|sass|less|css)$/,
		js: /\.exec\.js$/
	},
	browserSync: {
		host: "localhost",
		port: 3000
	}
};
module.exports = appConfig;
