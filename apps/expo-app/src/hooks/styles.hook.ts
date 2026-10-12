import { useCallback, useContext, useMemo, useState } from "react";
import type { AnyStyle, StyleClass, StyleContent } from "../lib/styles/types";
import { StyleContext } from "@/context";
import { stylesContent } from "@/lib/styles/content";
import { NavigationRouteContext } from "expo-router/build/react-navigation";
import { NativeEventsManager } from "react-native-reanimated";

type StyleJson = typeof stylesContent;
export interface StylesState {
  stylesContent: StyleContent;
  /** Replace the whole tree. */
  setStylesContent: (next: StyleContent) => void;
  exportJSON: () => string;
  resetStyles: () => void;
  /** Functional update of the whole tree. */
  updateStylesContent: (updater: (prev: StyleContent) => StyleContent) => void;
  /** Set (or overwrite) a single style property on target.element. */
  setStyleProperty: (
    target: string,
    element: string,
    styleKey: string,
    value: AnyStyle[keyof AnyStyle]
  ) => void;
  /** Remove a single style property from target.element. */
  removeStyleProperty: (target: string, element: string, styleKey: string) => void;
  /** Create a new sub-element under a target with an empty style object. */
  addElement: (target: string, element: string) => void;
  /** Create a new top-level target with an empty StyleClass. */
  addTarget: (target: string) => void;
}

export function useStylesState(initial: StyleContent): StylesState {
  const [stylesContent, setStylesContent] = useState<StyleContent>(initial);

  const updateStylesContent = useCallback(
    (updater: (prev: StyleContent) => StyleContent) => {
      setStylesContent((prev) => updater(prev));
    },
    [],
  );

  const setStyleProperty = useCallback(
    (
      target: string,
      element: string,
      styleKey: string,
      value: AnyStyle[keyof AnyStyle],
    ) => {
      setStylesContent((prev) => {
        const prevClass: StyleClass = prev[target] ?? {};
        const prevElementStyle: AnyStyle = prevClass[element] ?? {};
        return {
          ...prev,
          [target]: {
            ...prevClass,
            [element]: {
              ...prevElementStyle,
              [styleKey]: value,
            },
          },
        };
      });
    },
    [],
  );


  const removeStyleProperty = useCallback(
    (target: string, element: string, styleKey: string) => {
      setStylesContent((prev) => {
        const prevClass = prev[target];
        if (!prevClass || !prevClass[element]) return prev;
        const nextElementStyle = { ...prevClass[element] } as Record<string, unknown>;
        delete nextElementStyle[styleKey];
        return {
          ...prev,
          [target]: {
            ...prevClass,
            [element]: nextElementStyle ,
          },
        };
      });
    },
    [],
  );

  const addElement = useCallback((target: string, element: string) => {
    setStylesContent((prev) => ({
      ...prev,
      [target]: {
        ...(prev[target] ?? {}),
        [element]: prev[target]?.[element] ?? {},
      },
    }));
  }, []);

const resetStyles = useCallback(() => {
  setStylesContent(initial);
  console.debug("Styles Reset")

}, [])

const exportJSON = useCallback(() => {
  const json = JSON.stringify(stylesContent);
  console.debug("styles json:", json);

  return json;

  
}, [stylesContent]);
  const addTarget = useCallback((target: string) => {
    setStylesContent((prev) => ({
      ...prev,
      [target]: prev[target] ?? {},
    }));
  }, []);

  return useMemo(
    () => ({
      stylesContent,
      resetStyles,
      exportJSON,
      setStylesContent,
      updateStylesContent,
      setStyleProperty,
      removeStyleProperty,
      addElement,
      addTarget,
    }),
    [addElement, addTarget, removeStyleProperty, setStyleProperty, stylesContent, updateStylesContent],
  );
}

export const useStyles = () => {
  try {
    const context = useContext(StyleContext);
    if (!context) {
      throw new Error("Context is null or undefined");
    }
    return useMemo(() => context, [context]);
  } catch (error) {
    console.error(error);
    throw new Error("UseStyles must in a <StyleProvider> </StyleProvider> Provider.");
  }
};

interface UseStylesTarget<T extends keyof StyleJson> {
  styles: StyleJson[T];
  updateStyles: Function // TODO: MAke this an actual updater
  setProperty: (element: keyof StyleJson[T], styleKey: string, value: AnyStyle[keyof AnyStyle]) => void

}

export const useStyleTarget = <T extends keyof StyleJson>(target: T): UseStylesTarget<T> => {
  const { stylesContent, updateStylesContent, setStyleProperty } = useStyles();

  const styles = useMemo(
    () => stylesContent[target] as StyleJson[T],
    [stylesContent, target],
  );

  const setProperty = useCallback(
    (element: keyof StyleJson[T], styleKey: string, value: AnyStyle[keyof AnyStyle]) => {
      setStyleProperty(target, element as string, styleKey, value);
    },
    [setStyleProperty, target],
  );

  return useMemo(
    () => ({
      styles,
      updateStyles: updateStylesContent,
      setProperty,
    }),
    [setProperty, styles, updateStylesContent],
  );
};
