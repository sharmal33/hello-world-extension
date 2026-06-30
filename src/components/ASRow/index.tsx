import React, { ReactNode, Children, useState } from 'react';
import {
  Dimensions,
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

export type ASRowProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  spacing?: number;
  testId?: string;
  backgroundImage?: string | number | { uri: string };
  backgroundImageResizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
};

const ASRow: React.FC<ASRowProps> = (props: ASRowProps) => {
  const {
    children,
    style,
    accessibilityLabel,
    spacing,
    testId = 'ASRow',
    backgroundImage,
    backgroundImageResizeMode,
    scrollable,
    scrollDirection,
    ...restProps
  } = props || {};

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

  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width,
  );

  const wrappedChildren = Children.map(children, (child) =>
    applyAxisChildOverrides(
      child,
      flattenedStyle,
      isScrollable,
      'width',
      'center',
      isScrollable ? containerWidth : undefined,
    ),
  );

  const containerStyle = [
    styles.container,
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
        horizontal: scrollDirection !== 'vertical',
        contentContainerStyle: {
          flexGrow: 1,
          flexDirection: scrollDirection === 'vertical' ? 'column' : 'row',
          ...(spacing ? { gap: spacing } : {}),
        },
        children: wrappedChildren,
      })}
    </>
  );

  const layoutProps = {
    onLayout: isScrollable
      ? (e: any) => setContainerWidth(e.nativeEvent.layout.width)
      : undefined,
  };

  if (bgSource) {
    return (
      <ImageBackground
        testID={testId}
        source={bgSource}
        resizeMode={backgroundImageResizeMode || 'stretch'}
        imageStyle={[borderRadiusStyle, getWebImageStyle()]}
        style={containerStyle}
        accessibilityLabel={accessibilityLabel}
        {...layoutProps}
        {...restProps}
      >
        {contentNode}
      </ImageBackground>
    );
  }

  return (
    <View
      testID={testId}
      style={containerStyle}
      accessibilityLabel={accessibilityLabel}
      {...layoutProps}
      {...restProps}
    >
      {contentNode}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    position: 'relative',
  },
});

export default ASRow;

// Note: ASRow Example
/*
                <ASRow>
                    <ASText style={{textAlign: 'center'}}>Welcome to App Studio</ASText>
                    <ASVerticalDivider/>
                    <ASText style={{color: 'red'}}>Testing component</ASText>
                </ASRow>
* */
