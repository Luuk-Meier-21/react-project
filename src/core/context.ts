import React from "react";

export const AppService = React.createContext<{ loading: boolean; setLoading: any }>({
    loading: true,
    setLoading: () => {}
});;
export const LoadingContext = React.createContext<{ loaded: boolean; setLoading: any }>({
    loaded: false,
    setLoading: () => {}
});;

interface ExpandedContext extends React.Context<any> {
    
}
type Context = React.Context<any>

/**
   * Home component
   * 
   * @remarks
   * Fetches its own needed data.
   * 
   * @returns TSX Home component.
   */
export function service(initial?: any): ExpandedContext {
    let value = initial || null;
  
    const addProps = (context: Context): ExpandedContext => {
        return context;
    }
    
    const context: Context = React.createContext<any>(value);
    const newContext = addProps(context);
    return newContext;
}