import React, { ReactNode, Children } from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  applyAxisChildOverrides,
  createGradientElement,
  deriveLayoutStyle,
  getWebImageStyle,
  renderLayoutContent,
  resolveBackgroundSource,
} from '../../utils/layout.helpers';

import LinearGradient from 'react-native-linear-gradient';

export type ASColumnProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundImage?: string;
  backgroundImageResizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  accessibilityLabel?: string;
  spacing?: number;
  testId?: string;
  scrollable?: boolean;
  scrollDirection?: string;
};

const ASColumn: React.FC<ASColumnProps> = (props: ASColumnProps) => {
  const {
    children,
    style,
    backgroundImage,
    backgroundImageResizeMode,
    accessibilityLabel,
    spacing = 0,
    testId = 'ASColumn',
    scrollable,
    scrollDirection,
    ...restProps
  } = props;
  const flexValue =
    Array.isArray(children) && children.length > 0
      ? children.reduce(
          (
            acc: number | undefined,
            child: React.ReactElement<{ style?: StyleProp<ViewStyle> }>,
          ) => {
            if (!child?.props?.style) return acc; // Ensure child and its props exist
            const { flex } = StyleSheet.flatten(child.props.style);
            if (flex !== undefined && flex !== 0) return flex; // Return the first non-zero flex value found
            return acc; // Keep the previous value if none found
          },
          undefined,
        )
      : undefined;

  const {
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
  } = deriveLayoutStyle(style, scrollable);

  const wrappedChildren = Children.map(children, (child) =>
    applyAxisChildOverrides(
      child,
      flattenedStyle,
      isScrollable,
      'height',
      'stretch',
    ),
  );

  const containerStyle = [
    styles.container,
    { ...(flexValue && { flex: flexValue }) },
    style,
    platformShadowStyle,
    { ...(spacing && { gap: spacing }) },
    overflowStyle,
  ];

  const bgSource = resolveBackgroundSource(backgroundImage);
  const gradientLayer = hasGradient
    ? createGradientElement(
        LinearGradient,
        _gradientColors,
        _gradientStops,
        _gradientStart,
        _gradientEnd,
        borderRadiusStyle,
      )
    : null;

  const contentNode = (
    <>
      {gradientLayer}
      {renderLayoutContent({
        isScrollable,
        testId,
        horizontal: scrollDirection === 'horizontal',
        contentContainerStyle: {
          flexGrow: 1,
          ...(scrollDirection === 'horizontal' ? { flexDirection: 'row' } : {}),
          ...(spacing ? { gap: spacing } : {}),
        },
        children: wrappedChildren,
      })}
    </>
  );

  if (bgSource) {
    return (
      <ImageBackground
        testID={`view-${testId}`}
        source={bgSource}
        resizeMode={backgroundImageResizeMode || 'stretch'}
        imageStyle={[borderRadiusStyle, getWebImageStyle()]}
        style={containerStyle}
        accessibilityLabel={accessibilityLabel}
        {...restProps}
      >
        {contentNode}
      </ImageBackground>
    );
  }

  return (
    <View
      testID={`view-${testId}`}
      style={containerStyle}
      accessibilityLabel={accessibilityLabel}
      {...restProps}
    >
      {contentNode}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'visible',
    borderColor: 'transparent',
    position: 'relative',
  },
});

export default ASColumn;
