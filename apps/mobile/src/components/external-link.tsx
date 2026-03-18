import type { Href } from "expo-router";
import { Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import type { ComponentProps } from "react";
import { useCallback } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
};

export const ExternalLink = ({ href, ...rest }: Props) => {
  const handlePress = useCallback(
    async (event: Parameters<NonNullable<ComponentProps<typeof Link>["onPress"]>>[0]) => {
      if (process.env.EXPO_OS !== "web") {
        // Prevent the default behavior of linking to the default browser on native.
        event.preventDefault();
        // Open the link in an in-app browser.
        await openBrowserAsync(href, {
          presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
        });
      }
    },
    [href]
  );

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={handlePress}
    />
  );
};
