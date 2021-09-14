import Matter from "matter-js";
import P5 from 'p5';
import Opentype from 'opentype.js';
import React from 'react';
import PRender from "./render/render";

import "./style.render.scss"

export default function Comp() {
	const Engine = Matter.Engine,
		Render = Matter.Render,
		Bodies = Matter.Bodies,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		World = Matter.World;

	// Refs
	const scene: React.MutableRefObject<any> = React.useRef();
	const testHtml: React.MutableRefObject<any> = React.useRef();
	const engine: React.MutableRefObject<Matter.Engine> = React.useRef(Engine.create());

	const [viewSize, setViewSize] = React.useState({ 
		h: window.innerHeight,
		w: window.innerWidth
	})
	const [active, setActive] = React.useState(true);
	let updateActive: any;

	window.addEventListener('resize', () => {
		clearTimeout(updateActive);
		setActive(false)
		updateActive = setTimeout(() => {
			setActive(true)
		}, 1000);
	})

	React.useEffect(() => {
		const fontUrl = process.env.PUBLIC_URL + '/assets/Roboto-Regular.otf';
		let render: Matter.Render;
		let runner: Matter.Runner;
		let b: PRender;

		let p =  new P5((p: P5) => p, scene.current);

		b = new PRender(p, engine.current);	
		runner = Matter.Runner.create({

		})
		let pFont: P5.Font;

		p.preload = () => {
			pFont = p.loadFont(fontUrl);
		}

		p.setup = () => {
			const canvas = p.createCanvas(viewSize.w, viewSize.h);
			
			render = Matter.Render.create({
				element: scene.current,
				//@ts-ignore
				engine: undefined,
				options: {
					width: viewSize.w,
					height: viewSize.h,
					showAngleIndicator: true,
					showPositions: true
				} as any
			});
			// FIX: memory leak when resizing canvas.
			//@ts-ignore
			render.engine = engine.current

			b.mouse(render);
			b.rect(false, viewSize.w / 2, -10, viewSize.w, 20, { 
				isStatic: true,
			});
			b.rect(false, -10, viewSize.h / 2, 20, viewSize.h, { 
				isStatic: true,
			});
			b.rect(false, viewSize.w / 2, viewSize.h + 10, viewSize.w, 20, { 
				isStatic: true,
			});
			b.rect(false, viewSize.w + 10, viewSize.h / 2, 20, viewSize.h, { 
				isStatic: true,
			})
			const test = b.htmlFont(false, testHtml.current, pFont, canvas);
			Matter.Runner.start(runner, engine.current);		
			/**	
			 * Debug render:
			 */
			Matter.Render.run(render);
		}

		p.draw = () => {
			render.canvas.style.background = 'none';
			p.background('white');
			b.render();
		}

		// Unmount
		return () => {
			// Destroy Matter

			Matter.Render.stop(render);
			Matter.World.clear(engine.current.world, false);
			Matter.Engine.clear(engine.current);
			render.canvas.remove();
			(render.canvas as any) = null;
			(render.canvas as any) = null;
			render.textures = {};
		}
	})

	return (
		<div className='comp'>
			<div ref={scene} className='comp__scene'>
				{/* <p ref={htmlScene} className="comp__scene__html">
					Nulla quis lorem ut libero malesuada feugiat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.
				</p> */}
				{ active && (
					<CollitionParagraph htmlRef={testHtml}>
						a
					</CollitionParagraph>
				)}
				
				{/* <p ref={testHtml} className="comp__scene__html">
					<span>a</span>
					<span>c</span>
					<BaselineSpan>a</BaselineSpan>	
				</p> */}
			</div>
		</div>
	)
}

function CollitionParagraph(props: {
	children: string
	htmlRef: React.MutableRefObject<any>
}) {
	// parentElement.innerHTML
	// 		.replace(/./g, "<span>$&</span>")
	// 		.replace(/\s/g, " ");
	const characters = props.children.match(/./g) || [];
	return (
		<p className="collision-p" ref={props.htmlRef}>
			{characters.map((a) => (
				<span>{a}<span className="baseline"/></span>
			))}
		</p>
	)
}

  // connnecting parts
  // const partA = Bodies.rectangle(0,  0, 50, 50, { inertia: Infinity })
  // const partB = Bodies.rectangle(0, 50, 50, 50, { inertia: Infinity })

  // const body = Body.create({
  //   parts: [partA, partB],
  //   inertia: Infinity,
  //   friction: .002,
  //   restitution: 0,
  //   sleepThreshold: Infinity
  // })

  // setTimeout(function(){
  //   body.force.y = -.2
  //   setTimeout(function(){
  //     Body.setPosition(partB, { x: partB.position.x, y: partB.position.y + 25 })
  //   }, 100);
  // }, 3000)

