import Matter from "matter-js";
import p5 from "p5";
import P5 from 'p5';
import Char from "./classes/font.render";
import Mouse from "./classes/mouse.render";
import Rect from "./classes/rect.render";
import RectText from "./classes/text.render";
import { RenderDeps, TargetEnum } from "./classes/_core.render";

export default class PRender {
	deps: RenderDeps;
	/** Object for all bodies seen within the render */
	bodies: any = {};
	/** Object for all contraints and misc {Matter} methods */
	effects: any = {};

	constructor(p5: P5, engine: Matter.Engine) {
		this.deps = {
			p: p5,
			w: engine.world,
			e: engine
		}
	}

	public render() {
		for(const [key] of Object.entries(this.bodies)) {
			const body = this.bodies[key];
			// console.log(!!body.render)
			if(!!body.render) body.render();
		}
	}

	private add(name: string | boolean, value: any, target: TargetEnum = 'bodies') {
		const _this: any = this;
		const length = Object.keys(this.bodies).length;
		const fallbackName = `_${target}${length}`;
		const safeName = name ? name as string : fallbackName;

		if(!!_this[target][safeName]) throw TypeError(`Duplicate body identifier "${safeName}"`);

		Object.defineProperty(_this[target], safeName, {
			value: value,
			writable: false,
			enumerable: true
		});

		return _this[target][safeName];
	}

	public addTo() {
		/**
		 * TODO: add dynamic version of "add method" that allows all PRendererBody children
		 */
	}

	public rect(
		name: string | boolean, 
		x: number, y: number, 
		w: number, h: number, 
		options: Matter.IChamferableBodyDefinition = {}
	): Rect {
		return this.add(name, new Rect(x, y, w, h, this.deps, options));
	}

	public text(
		name: string | boolean, 
		element: any, 
		options: Matter.IChamferableBodyDefinition = {}
	): void {
		this.add(name, new RectText(element, this.deps, options));
	}

	public htmlFont(
		name: string | boolean, 
		element: any,
		font: p5.Font, 
		canvas: P5.Renderer,
		options: Matter.IChamferableBodyDefinition = {}
	): Char | boolean{
		// TODO:	
		//		loop over children
		//		divide text by space in paragraph
		
		const array: any = [];
		for (let i = 0; i < element.children.length; i++) {
			const childElement = element.children[i];
			array.push(this.add(name, new Char(childElement, font, canvas, this.deps, options)));
		}
		return array;
	}

	public paragraph(parentElement: any, options: Matter.IChamferableBodyDefinition = {}) {
		console.log(parentElement.innerHTML)
		parentElement.innerHTML = parentElement.innerHTML
			.replace(/./g, "<span>$&</span>")
			.replace(/\s/g, " ");
		const bodies = [];
		const elements = parentElement.children;
		for(let e of elements) {
			const text = this.text(false, e, options);
			bodies.push(text);
		}
	}

	public mouse(render: Matter.Render) { 
		this.add(false, new Mouse(render, this.deps.e), 'effects');
	}
}