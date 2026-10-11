import React from "react";
import { Pressable,  View } from "react-native";
import { IconKey } from "@/lib/icons";
import Icon from "../icon";
import { Text } from "../ui/text";
import { useQuizSetup, useStyleTarget} from "@/hooks"
import type { AnyStyle } from "@/lib/styles";


export interface ModeOptionProps<Mode_T> {
  value: Mode_T;
  title: string;
  icon: IconKey;
  description?: string;
  color?: string;
  name?: string;
}

export default function ModeOption<Mode_T>({
  value,
  title,
  icon,
  description,
  color = "#007AFF", // Pass a valid color hex/string or token if overriding
}: ModeOptionProps<Mode_T>) {
  const { data, setMode } = useQuizSetup<Mode_T>();
  const selected = data.mode === value;
  const { styles } = useStyleTarget("modeOption");

  const handlePress = () => {
    setMode(value);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.container,
        selected ? styles.pressedBorder : styles.defaultBorder,
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {title}
        </Text>
        {description ? (
          <Text style={styles.descriptionText }>
            {description}
          </Text>
        ) : null}
      </View>

      <Icon color={color} name={icon} />
    </Pressable>
  );
}
