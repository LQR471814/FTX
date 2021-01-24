declare module "*.svg" { //? Fix svg imports
    import React = require("react");
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

interface IUserMessages {
    collapsed: number,
    messages: Array<IMessage>,
}

interface IMessage {
    content: string,
    author: string
}

type INetInterface = [string, string, string]; //? ID, Name, IP