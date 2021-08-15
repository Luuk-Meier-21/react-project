import Matter from "matter-js";
import React from 'react';
import CustomRender from "./comp.render";

export default function Comp() {
	const Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Bodies = Matter.Bodies,
		Composite = Matter.Composite,
		MouseConstraint = Matter.MouseConstraint,
		Body = Matter.Body,
		Mouse = Matter.Mouse,
		World = Matter.World;

	// Refs
	const isPressed = React.useRef(false)
	const scene: React.MutableRefObject<any> = React.useRef()
	const engine: React.MutableRefObject<any> = React.useRef(Engine.create())

	// Global bodies
	const cube = Bodies.rectangle(100, 0, 50, 50, {
		render: {
			name: 'cube',
			fillStyle: 'red',
			strokeStyle: 'green',
			lineWidth: 3,
			text:{
				content:"Test",
				color:"blue",
				size:40,
				family:"helvetica",
			},
	   	}
	} as any);

	// TODO: Add window resize to "cw" and "ch",
	// 		 Make "cw" and "ch" a react state so it is available to the whole component

	// TODO: Make renderder that is able to render text and fonts

	React.useEffect(() => {
		
		// mount
		const cw = document.body.clientWidth
		const ch = document.body.clientHeight
		const render = Render.create({
			element: scene.current,
			engine: engine.current,
			options: {
				wireframes: false,
				width: cw,
				height: ch,
			}
		});

		// console.log(render)

		// Boundaries
		World.add(engine.current.world, [
			Bodies.rectangle(cw / 2, -10, cw, 20, { 
				isStatic: true,
				render: {
					visible: false
				}
			}),
			Bodies.rectangle(-10, ch / 2, 20, ch, { 
				isStatic: true,
				render: {
					visible: false
				}
			}),
			Bodies.rectangle(cw / 2, ch + 10, cw, 20, { 
				isStatic: true,
				render: {
					visible: false
				}
			}),
			Bodies.rectangle(cw + 10, ch / 2, 20, ch, { 
				isStatic: true,
				render: {
					visible: false
				}
			 })
		])

		// Bodies
		World.add(engine.current.world, cube);

		// Mouse
		const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine.current, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        } as any);

		World.add(engine.current.world, mouseConstraint);

		// Run the engine
		
		CustomRender.run(render, engine.current);

		// Unmount
		return () => {
			// Destroy Matter
			// Render.stop(render)
			World.clear(engine.current.world, false)
			Engine.clear(engine.current)
			render.canvas.remove()
		}
	}, [])

	return (
		<div>
			<div ref={scene} style={{ width: '100%', height: '100%' }} />
		</div>
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
