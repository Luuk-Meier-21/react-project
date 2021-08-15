import React from "react";
import "./home.component.scss"

import Api from "src/data/api.data";

import * as Http from "src/core/http";
import * as Service from 'src/core/context';

/**
   * Home component
   * 
   * @remarks
   * Fetches its own needed data.
   * 
   * @returns JSX Home component.
   */
export default function Home(props: any, context: any) {
  const [data, ok] = Http.useHttpResolver(Api.url, {
    about: undefined
  });
  const {loaded, setLoading} = React.useContext(Service.LoadingContext);

  React.useEffect(() => {
    setLoading(ok);
  }, [ok, setLoading]);

  return (  
    <section className='home' style={{opacity: loaded ? 1 : 0}}>
      {loaded && (
        data.about.name
      )}
    </section>  
  )
}

