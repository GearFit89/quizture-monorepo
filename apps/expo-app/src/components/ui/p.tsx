import React, { JSX } from 'react'
import { TextProps as RNTextProps } from 'react-native'
import { Text } from './text'

/**
 * Props for the `P` (Paragraph) typography component.
 */
export interface PProps extends RNTextProps {
  /** Optional additional Tailwind CSS or NativeWind class names. */
  className?: string;
  /** Content to be rendered inside the paragraph component. */
  children?: React.ReactNode;
}

/**
 * A standard Paragraph typography component that applies default base text styles.
 *
 * @param props - Component properties extending React Native's `TextProps`.
 * @returns A styled React Native `Text` element.
 */
export function P ({ className = '', children, ...props }: PProps): JSX.Element {
  return (
    <Text
      className={`text-base text-foreground leading-6 mb-4 ${className}`.trim()}
      {...props}
    >
      {children}
    </Text>
  )
}
