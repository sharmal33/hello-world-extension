import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { text } from '@/assets';

import { ASContainer, ASText } from '@/components';

import { StyleSheet } from 'react-native';
import { sharedStyles } from '@/components/shared/sharedStyles';

import { useClearHeaderActions } from '@/utils/screen.effects';

import { STRINGS } from '@/strings';

type ScreenRouteParams = {};

type ScreenProps = {
  route: {
    params: ScreenRouteParams;
  };
};

const Greeting: React.FC<ScreenProps> = ({ route }) => {
  const navigation = useNavigation();

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-565162'}
      testID={'48e0b2a2-e7c9-48ba-bada-99233013b84d'}
      style={sharedStyles.container}
      testId={'ASContainer-565162'}
    >
      <ASText
        labelType={'string'}
        name={'ASText-804585'}
        dragStyle={sharedStyles.textDrag}
        style={[text.label.medium, sharedStyles.greetingMsg]}
        accessibilityLabel={STRINGS.Greeting.ASText_804585.accessibilityLabel}
        testId={'ASText-804585'}
      >
        {STRINGS.Greeting.ASText_804585.label}
      </ASText>
      <ASText
        labelType={'string'}
        name={'greetingMsg'}
        dragStyle={sharedStyles.textDrag}
        style={[text.label.medium, sharedStyles.greetingMsg]}
        testId={'greetingMsg'}
      >
        {route.params?.ext_helloWorld_greet?.message}
      </ASText>
    </ASContainer>
  );
};

const styles = StyleSheet.create({});

export default Greeting;
