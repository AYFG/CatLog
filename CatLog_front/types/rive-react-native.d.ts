declare module "rive-react-native" {
  import { Component } from "react";
  import { ViewStyle } from "react-native";

  interface RiveProps {
    resourceName: string;
    artboardName?: string;
    stateMachineName?: string;
    autoplay?: boolean;
    style?: ViewStyle;
  }

  export default class Rive extends Component<RiveProps> {}
}
