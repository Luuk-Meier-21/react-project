import React from "react";

export abstract class Component extends React.Component {
    self: any = this;

    constructor(public props: any) {
        super(props)
        this.props = props;
        this.self = 'this';
    }

    // React.Component methods

    render(): React.ReactNode {
        return (<p className="error">{this.constructor.name} has not implemented "render"</p>);
    }
}

