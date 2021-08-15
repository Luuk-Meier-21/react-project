import Matter from "matter-js";
import P5 from 'p5';
import renderBodies from "./matter.render";

interface Render extends Matter.Render {
	engine?: any;
}

export default class CustomRender {

	static getSizes(part: Matter.Body): Array<number> {
		const { min, max } = part.bounds;
		
		const a = [
			Math.floor(max.x - min.x),
			Math.floor(max.y - min.y)
		]

		return a;
	}

	/**
	 * Runs custom renderer
	 * 
	 * @param render
	 * 
	 */
	static run(render: Render, engine: Matter.Engine) {
		const p5 = new P5((p: P5) => {
			p.setup = () => {
				p.createCanvas(render.options.width as number, render.options.height as number);
      			p.background(30);

				// render.canvas.style.display = 'none';

				Matter.Runner.run(engine)
			}

			p.draw = () => {
				const bodies = Matter.Composite.allBodies(render.engine.world);
				const body = bodies.find((a: any) => {
					return a.render.visible;
				});
				const [bw, bh] = this.getSizes(body as any);
				p.fill(237, 34, 93);
				p.noStroke();
				p.rect(30, 20, bw, bh);


				render.context.fillStyle = "#fff";
				render.context.fillRect(0, 0, render.canvas.width, render.canvas.height);

				render.context.beginPath();

				renderBodies(render, bodies, render.context);
			}
		}, render.element);

		// (function loop() {
		// 	const bodies = Composite.allBodies(render.engine.world);
		// 	window.requestAnimationFrame(loop);

		// 	render.context.fillStyle = "#fff";
		// 	render.context.fillRect(0, 0, render.canvas.width, render.canvas.height);

		// 	render.context.beginPath();

		// 	renderBodies(render, bodies, render.context);
		// })();
	}
}


