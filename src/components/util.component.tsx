import React from "react";

type HttpResponse<T> = {data: T, fulfilled: boolean}
type HttpResolve<T> = (res: HttpResponse<T>) => void;

export class Http<DT> {
  fulfilled: boolean;
  promise: Promise<HttpResponse<DT>>;

  constructor(
    public url: string, 
    ) {
    this.fulfilled = false;
    this.promise = this.request(this.url);
  }

  async request(_url: string = this.url): Promise<HttpResponse<DT>> {
    this.fulfilled = false;
    return new Promise((res: HttpResolve<DT>) => {
      fetch(_url)
      .then((r: Response) => {
        this.fulfilled = r.ok
        return r;
      })
      .then((r: Response) => r.json())
      .then((j: any) => res({
        data: j.data, 
        fulfilled: this.fulfilled
      }))
      .catch(error => console.error(error));
    })
  }
}

// https://api-eu-central-1.graphcms.com/v2/cknj41e0xkh2r01z03fqlbdmb/master?operationName=About&query=query%20About%20%7B%0A%20%20about(where%3A%20%7Bid%3A%20%22cknkdtm801j390c99ol1ov8nk%22%7D)%20%7B%0A%20%20%20%20name%0A%20%20%20%20profile%20%7B%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20contacts%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20url%0A%20%20%20%20%7D%0A%20%20%20%20bio%20%7B%0A%20%20%20%20%20%20html%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A
// export class Http<T> extends React.Component<Http<T>> implements Http<T> {
//   url: string = this.props.url || '';
//   requestType: string = (this.props.requestType || 'GET').toUpperCase();
//   responseType: string = (this.props.responseType || 'json').toLowerCase();

//   responseData: T | Object = {};

//   request(_url: string): Promise<unknown> {
//     return fetch(_url)
//       .then((a: Response) => a.text())
//       .then((t: any) => {

//       })
//       .catch(error => console.log(error))
//   }

//   render(): React.ReactNode {
//     return this.props.children
//   }
// }


// DEPRECATED: Usefull for undersanding 
export class For extends React.Component<{
  array: any;
  // template: (v: any, i: number) => React.ReactNode;
}> {
  render() {
    const Child: React.FC<ForProps> = ({value, index}) => {
      return (
        <li>{value}</li>
      )
    }

    console.log(this.props.children)
    return this.props.array.map((value: ForProps["value"], index:  ForProps["index"]) => {
      return (
        <Child value={value} index={index}/>
      );
    }); 
  }
}

interface ForProps {
  value: any;
  index: number;
}
