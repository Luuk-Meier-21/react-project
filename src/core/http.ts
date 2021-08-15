import React from "react";

type HttpResponse<T> = [data: T, fulfilled: boolean]

/**
  * Http request function for fetching data.
  *
  * @param url A string input of the url to be requested.
  * @returns Json data from the http response.
  */
export async function httpRequest<T>(url: string): Promise<HttpResponse<T>>{
  const response = await fetch(url);
  if (!response.ok) throw new TypeError('Bad response status');

  const json = await response.json();

  return [json.data, response.ok]
}

/**
  * A react hook for requesting data and updating it with React states.
  *
  * @remarks
  * This function uses ```React.useState()``` & ```React.useEffect()```
  * @param url A string input of the url to be requested.
  * @param initialState - An object that will be used as initial state.
  * @returns Json data from the http response as a react state.
  */
export function useHttpResolver(url: string, initialState: any){
  const dataState: [initialState: typeof initialState, ok: boolean] = [initialState, false];
  const [data, setData] = React.useState(dataState);

  React.useEffect(() => {
    httpRequest(url).then(([data, ok]: [any, boolean]) => {
      return setData([data, ok])
    });
  }, [url]);
  return data;
}


export default class Http {
  // static async 


  // ** Deprecated methods **

  // Not realy usefull
  // static async requestArray(urls: string[]): Promise<any>{
  //   const responses = await Promise.all(urls.map(url => fetch(url)));
  //   const results = await Promise.all(responses.map(response => {
  //     if (!response.ok) throw new TypeError('Bad response status');
  //     return response.json();
  //   }));
  //   const data = results.map(result => result.data);

  //   return {
  //     fulfilled: true,
  //     data: data
  //   }
  // }


  // Not working as wanted
  // static async requestObject(urlObj: {[prop: string]: string}): Promise<any>{
  //   const responses = await Promise.all(
  //     Object.entries(urlObj).map(async([key, url]) => {
  //       return {
  //         key: key,
  //         data: await fetch(url)
  //       }
  //     })
  //   )
  //   const results = await Promise.all(responses.map(async(response) => {
  //     const data = await response.data.json();
  //     return {
  //       key: response.key,
  //       data: await data.data
  //     }
  //   }));

  //   const dataObject = {};
  //   results.map((result) => {
  //     Object.defineProperty(dataObject, result.key, {
  //       value: result.data,
  //     });
  //     return '';
  //   })
  //   return dataObject;
  // }
}
