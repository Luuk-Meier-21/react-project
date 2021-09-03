import Matter from "matter-js";
import { PRendererBody, RenderDeps } from "./_core.render";

export default class RectText extends PRendererBody {
	private matterBody: Matter.Body;
	public w: number;
	public h: number;
	public initalX: number;
	public initalY: number;

	constructor(
		public element: any,
		public deps: RenderDeps,
		public options: Matter.IChamferableBodyDefinition
	) {
		super(deps, options);
		this.type = 'html';
		this.deps.p.rectMode(this.deps.p.CENTER);
		
		this.w = element.offsetWidth;
		this.h = element.offsetHeight;

		const bounds = element.getBoundingClientRect();
		this.initalX = bounds.left + (this.w / 2);
		this.initalY = bounds.top + (this.h / 2);
		this.matterBody = Matter.Bodies.rectangle(this.initalX, this.initalY, this.w, this.h, options);
		
		Matter.World.add(this.deps.w, this.matterBody);
	}

	private translate(x: number, y: number): string {
		return `translate(${x}px, ${y}px)`;
	}

	private rotate(angle: number): string {
		const degs = this.deps.p.degrees(angle);
		return `rotate(${degs}deg)`;
	}

	render(): void {
		if(this.visible) {
			const {x, y} = this.matterBody.position;
			const angle = this.matterBody.angle;
		
			this.element.style.transform = 
				this.translate(x - this.initalX, y - this.initalY) + 
				this.rotate(angle);
		}
	};
}