import Matter from "matter-js";
import React from 'react';
import Home from './components/home/home.component';
import Comp from './components/comp/comp.component';

import * as Service from './core/context';

export default function App() {

  return (
    <main className="app">
      <Comp></Comp>
    </main>
  )
}

export function Loader(props: any) {
  const [loaded, setLoading] = React.useState(false);
  const [display, setDisplay] = React.useState(true);
  const loadingState = {loaded, setLoading};
  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1
  }

  return display ? (
    <Service.LoadingContext.Provider value={loadingState}>
      {props.children}
      <div style={style}>Loading...</div>
    </Service.LoadingContext.Provider>
  ): (
    props.children
  );
}




