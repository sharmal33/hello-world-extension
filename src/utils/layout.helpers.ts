import {
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {
  ReactNode,
  isValidElement,
  cloneElement,
  createElement,
} from 'react';
import { getPlatformShadowStyle } from './common.utils';

export type AxisDimension = 'width' | 'height';

export interface DerivedLayoutStyle {
  flattenedStyle: ViewStyle & Record<string, unknown>;
  platformShadowStyle: ViewStyle;
  gradientColors: unknown;
  gradientStops: unknown;
  gradientStart: unknown;
  gradientEnd: unknown;
  hasGradient: boolean;
  isScrollable: boolean;
  overflowStyle: ViewStyle;
  borderRadiusStyle: ViewStyle;
}

export function deriveLayoutStyle(
  style: StyleProp<ViewStyle>,
  scrollable: boolean | undefined,
): DerivedLayoutStyle {
  const flattenedStyle: ViewStyle & Record<string, unknown> =
    StyleSheet.flatten(style);
  const platformShadowStyle = getPlatformShadowStyle(flattenedStyle);

  const {
    gradientColors: _gradientColors,
    gradientStops: _gradientStops,
    gradientStart: _gradientStart,
    gradientEnd: _gradientEnd,
  } = flattenedStyle || {};
  const hasGradient =
    Array.isArray(_gradientColors) && _gradientColors.length >= 2;

  const isScrollable =
    scrollable === true || flattenedStyle?.overflow === 'scroll';

  const overflowStyle = flattenedStyle?.overflow
    ? { overflow: flattenedStyle.overflow }
    : {};

  const borderRadiusStyle = extractBorderRadiusStyle(flattenedStyle);

  return {
    flattenedStyle,
    platformShadowStyle,
    gradientColors: _gradientColors,
    gradientStops: _gradientStops,
    gradientStart: _gradientStart,
    gradientEnd: _gradientEnd,
    hasGradient,
    isScrollable,
    overflowStyle,
    borderRadiusStyle,
  };
}

export function getAxisFlexOverrides(
  childStyle: ViewStyle | undefined,
  isScrollable: boolean,
): ViewStyle {
  if (isScrollable || !childStyle) return {};
  const hasFlex = childStyle.flex !== undefined && childStyle.flex !== 0;
  if (
    !hasFlex ||
    childStyle.flexBasis !== undefined ||
    childStyle.aspectRatio !== undefined
  )
    return {};
  const result: ViewStyle = {
    flexGrow: childStyle.flex ?? 0,
    flexShrink: childStyle.flexShrink ?? 1,
    flexBasis: 'auto',
    flex: undefined,
  };
  if (childStyle.minWidth === undefined) result.minWidth = 0;
  if (childStyle.minHeight === undefined) result.minHeight = 0;
  return result;
}

export function getAxisPlatformOverride(
  childStyle: ViewStyle | undefined,
  parentAlignItems: string,
  axis: AxisDimension,
): ViewStyle {
  if (Platform.OS === 'web' || !childStyle) return {};
  const value = childStyle[axis] as unknown as string | number | undefined;
  if (
    typeof value !== 'string' ||
    value === '' ||
    value === 'auto' ||
    value.endsWith('%')
  )
    return {};
  const result: ViewStyle = { [axis]: undefined };
  if (
    parentAlignItems === 'stretch' &&
    (!childStyle.alignSelf || childStyle.alignSelf === 'auto')
  ) {
    result.alignSelf = 'flex-start';
  }
  return result;
}

export function extractBorderRadiusStyle(
  style: ViewStyle | undefined,
): ViewStyle {
  if (!style) return {};
  const result: ViewStyle = {};
  if (style.borderRadius !== undefined)
    result.borderRadius = style.borderRadius;
  if (style.borderTopLeftRadius !== undefined)
    result.borderTopLeftRadius = style.borderTopLeftRadius;
  if (style.borderTopRightRadius !== undefined)
    result.borderTopRightRadius = style.borderTopRightRadius;
  if (style.borderBottomLeftRadius !== undefined)
    result.borderBottomLeftRadius = style.borderBottomLeftRadius;
  if (style.borderBottomRightRadius !== undefined)
    result.borderBottomRightRadius = style.borderBottomRightRadius;
  return result;
}

// Resolve a percentage dimension (e.g. width: '50%') against the known container
// width while scrolling — percentage sizes don't resolve inside a scroll
// container, so they're converted to absolute pixels. Returns undefined when the
// override doesn't apply. Extracted from applyAxisChildOverrides to keep that
// function's cognitive complexity within limits (SonarQube S3776).
function resolveScrollablePercentage(
  childStyle: ViewStyle | undefined,
  fullDimension: AxisDimension,
  isScrollable: boolean,
  containerWidth?: number,
): number | undefined {
  if (!isScrollable || !containerWidth || containerWidth <= 0) return undefined;
  const dimValue = childStyle?.[fullDimension] as unknown as
    | string
    | number
    | undefined;
  if (typeof dimValue !== 'string' || !dimValue.endsWith('%')) return undefined;
  const pct = Number.parseFloat(dimValue);
  return Number.isNaN(pct) ? undefined : (pct / 100) * containerWidth;
}

export function applyAxisChildOverrides(
  child: React.ReactNode,
  flattenedStyle: ViewStyle & Record<string, unknown>,
  isScrollable: boolean,
  axis: AxisDimension,
  defaultAlignItems: string,
  containerWidth?: number,
): React.ReactNode {
  const fullDimension: AxisDimension = axis;
  const platformAxis: AxisDimension = axis === 'width' ? 'height' : 'width';
  if (
    isValidElement(child) &&
    !!(child.props as { style?: StyleProp<ViewStyle> })?.style
  ) {
    const childStyle = StyleSheet.flatten(
      (child.props as { style?: StyleProp<ViewStyle> })?.style,
    );
    const overrideStyle: ViewStyle = isScrollable ? { flexShrink: 0 } : {};
    Object.assign(
      overrideStyle,
      getAxisFlexOverrides(childStyle, isScrollable),
    );
    const resolvedPercentage = resolveScrollablePercentage(
      childStyle,
      fullDimension,
      isScrollable,
      containerWidth,
    );
    if (resolvedPercentage !== undefined) {
      overrideStyle[fullDimension] = resolvedPercentage;
    }
    if (!isScrollable && childStyle?.[fullDimension] === '100%') {
      overrideStyle.flex = 1;
      overrideStyle[fullDimension] = undefined;
    }
    Object.assign(
      overrideStyle,
      getAxisPlatformOverride(
        childStyle,
        flattenedStyle?.alignItems ?? defaultAlignItems,
        platformAxis,
      ),
    );
    return cloneElement(
      child as React.ReactElement<{ style?: StyleProp<ViewStyle> }>,
      {
        style: [
          (child.props as { style?: StyleProp<ViewStyle> })?.style,
          overrideStyle,
        ],
      },
    );
  }
  return (
    applyContainerAxisOverride(child, isScrollable, fullDimension) ?? child
  );
}

function applyContainerAxisOverride(
  child: React.ReactNode,
  isScrollable: boolean,
  fullDimension: AxisDimension,
): React.ReactNode | null {
  if (
    !isValidElement(child) ||
    !(child.props as { containerStyle?: StyleProp<ViewStyle> })?.containerStyle
  ) {
    return null;
  }
  const cStyle = StyleSheet.flatten(
    (child.props as { containerStyle?: StyleProp<ViewStyle> })?.containerStyle,
  );
  if (isScrollable || cStyle?.[fullDimension] !== '100%') {
    return null;
  }
  const containerOverride: ViewStyle =
    fullDimension === 'width'
      ? { flex: 1, width: undefined, minWidth: 0 }
      : { flex: 1, height: undefined, minHeight: 0 };
  return cloneElement(
    child as React.ReactElement<{ containerStyle?: StyleProp<ViewStyle> }>,
    {
      containerStyle: [
        (child.props as { containerStyle?: StyleProp<ViewStyle> })
          ?.containerStyle,
        containerOverride,
      ],
    },
  );
}

export function resolveBackgroundSource(
  backgroundImage: string | number | { uri: string } | undefined,
): ImageSourcePropType | undefined {
  if (!backgroundImage) return undefined;
  return typeof backgroundImage === 'string'
    ? { uri: backgroundImage }
    : backgroundImage;
}

export function createGradientElement(
  LinearGradient: React.ComponentType<any>,
  gradientColors: unknown,
  gradientStops: unknown,
  gradientStart: unknown,
  gradientEnd: unknown,
  borderRadiusStyle: ViewStyle,
): ReactNode {
  return createElement(LinearGradient, {
    colors: gradientColors,
    ...(gradientStops ? { locations: gradientStops } : {}),
    ...(gradientStart ? { start: gradientStart } : {}),
    ...(gradientEnd ? { end: gradientEnd } : {}),
    style: [StyleSheet.absoluteFillObject, borderRadiusStyle],
  });
}

export function getWebImageStyle(): ViewStyle | undefined {
  return Platform.OS === 'web'
    ? { width: '100%' as any, height: '100%' as any }
    : undefined;
}

export interface LayoutContentParams {
  isScrollable: boolean;
  testId?: string;
  horizontal: boolean;
  contentContainerStyle: Record<string, unknown>;
  children: ReactNode;
}

export function renderLayoutContent(params: LayoutContentParams): ReactNode {
  const { isScrollable, testId, horizontal, contentContainerStyle, children } =
    params;
  if (!isScrollable) return children;
  return createElement(
    ScrollView,
    {
      testID: `scrollView-${testId}`,
      horizontal,
      style: { width: '100%', height: '100%' },
      contentContainerStyle,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
      nestedScrollEnabled: true,
    },
    children,
  );
}
