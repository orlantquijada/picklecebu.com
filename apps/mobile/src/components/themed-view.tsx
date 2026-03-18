import { View } from "react-native";
import type { ViewProps } from "react-native";

import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  _lightColor?: string;
  _darkColor?: string;
  type?: ThemeColor;
};

export const ThemedView = ({
  style,
  _lightColor,
  _darkColor,
  type,
  ...otherProps
}: ThemedViewProps) => {
  const theme = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme[type ?? "background"] }, style]}
      {...otherProps}
    />
  );
};
