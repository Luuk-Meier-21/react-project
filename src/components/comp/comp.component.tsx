import Matter from "matter-js";
import P5 from 'p5';
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
	const scene: React.MutableRefObject<any> = React.useRef()
	const htmlScene: React.MutableRefObject<any> = React.useRef()
	const testHtml: React.MutableRefObject<any> = React.useRef()
	const engine: React.MutableRefObject<Matter.Engine> = React.useRef(Engine.create())
	const test = process.env.PUBLIC_URL + '/logo192.png';

	// Global bodies

	// TODO: Add window resize to "cw" and "ch",
	// 		 Make "cw" and "ch" a react state so it is available to the whole component

	React.useEffect(() => {
		const cw = document.body.clientWidth;
		const ch = document.body.clientHeight;
		const fontUrl = process.env.PUBLIC_URL + '/assets/Roboto-Regular.otf';
		let render: Matter.Render;

		new P5((p: P5) => {
			const b = new PRender(p, engine.current);			
			let pFont: P5.Font;

			p.preload = () => {
				pFont = p.loadFont(fontUrl);
			}

			p.setup = () => {
				const canvas = p.createCanvas(cw, ch);
				
      			p.background('blue');
				render = Matter.Render.create({
					element: scene.current,
					engine: engine.current,
					options: {
						width: cw,
						height: ch,
						showAngleIndicator: true,
						showPositions: true
					} as any
				});
				b.mouse(render);
				b.rect(false, cw / 2, -10, cw, 20, { 
					isStatic: true,
					// render: {
					// 	visible: false
					// }
				});
				b.rect(false, -10, ch / 2, 20, ch, { 
					isStatic: true,
					// render: {
					// 	visible: false
					// }
				});
				b.rect(false, cw / 2, ch + 10, cw, 20, { 
					isStatic: true,
					// render: {
					// 	visible: false
					// }
				});
				b.rect(false, cw + 10, ch / 2, 20, ch, { 
					isStatic: true,
					// render: {
					// 	visible: false
					// }
				})

				// b.rect(false, 100, 100, 50, 50)
				// b.htmlFont(false, testHtml.current.children[1], pFont, canvas);
	
				const test = b.htmlFont(false, testHtml.current, pFont, canvas);
				// b.font(false, 'b', 400, pFont, 400, 400);

				// b.paragraph(htmlScene.current);

				Matter.Runner.run(engine.current);
				/**	
				 * Debug render:
				 */
				Matter.Render.run(render);
			}

			p.draw = () => {
				render.canvas.style.background = 'none';
				p.background('darkblue');
				b.render();
				// a.render();

				// console.log(htmlScene.current.children[0].offsetWidth)
			}
		}, scene.current);

		// Unmount
		return () => {
			// Destroy Matter
			// Render.stop(render)
			World.clear(engine.current.world, false)
			Engine.clear(engine.current)
			// render.canvas.remove()
		}
	}, [])

	return (
		<div className='comp'>
			<div ref={scene} className='comp__scene'>
				{/* <p ref={htmlScene} className="comp__scene__html">
					Nulla quis lorem ut libero malesuada feugiat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.
				</p> */}
				<CollitionParagraph htmlRef={testHtml}>
					K
				</CollitionParagraph>
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

