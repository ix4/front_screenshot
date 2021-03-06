import ascii from "rollup-plugin-ascii";
import resolve from "rollup-plugin-node-resolve";
import replace from 'rollup-plugin-replace';
import babel from "rollup-plugin-babel";
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';

var html2canvas_pkg = require('./node_modules/html2canvas/package.json');
//console.log(html2canvas_pkg.version);

var input = "src/ig_screenshot.js",
	plugins = [

		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'__VERSION__': html2canvas_pkg.version,
			'__DEV__': false,
			'const': 'var',
			'let': 'var',
			'simple_colors': 'channels,simple_colors',
			'textBaselineMapping': 'i,textBaselineMapping',
			'$npm_package_version': html2canvas_pkg.version
		}),
		alias({
			rgbcolor: "./rgbcolor.js",
			stackblur: "./StackBlur.js"
		}),
		commonjs({
			namedExports: {
				'./node_modules/punycode/punycode.js': ['version', 'ucs2', 'decode', 'encode', 'toASCII', 'toUnicode']
			},
		}),
		/*babel(babelrc({
			config: babelConfig

		})),*/
		babel({
			"presets": ["es2015-rollup"],
			plugins: ['external-helpers'],
			//runtimeHelpers: true,
			//"externalHelpers": true,
			exclude: ['node_modules/babel-runtime/**', 'node_modules/babel-helpers/**'],
			"babelrc": false
		}),

		resolve({
			preferBuiltins: false,
		}),
		ascii()
	],
	output = [{
		file: "dist/ig_screenshot.es6.js",
		format: "es",
		name: "screenShooter"
	}, {
		file: "dist/ig_screenshot.js",
		format: "umd",
		exports: 'named',
		name: "screenShooter"
	}];

if (process.env.MINIFY) {
	input = "dist/ig_screenshot.es6.js";
	plugins.push(uglify({
		mangle: false
	}));
	output = [{
		file: "dist/ig_screenshot.min.js",
		format: "umd",
		exports: 'named',
		name: "screenShooter",
		sourcemap: true
	}]
} else if (process.env.CANVG) {
	input = "node_modules/canvg/canvg.js";
	output = [{
		file: "src/canvg.js",
		format: "es"
	}];
} else if (process.env.HTML2CANVAS) {
	input = "node_modules/html2canvas/dist/npm/index.js";
	output = [{
		file: "src/html2canvas.js",
		format: "es"
	}];
}

export default {
	//input: "src/html2canvas/index.js",
	//input: "html2canvas/index.js",
	input: input,
	extend: true,

	plugins: plugins,
	output: output
};
