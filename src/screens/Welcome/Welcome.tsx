import React from 'react';
import { AppButton } from '@/components/shared';
import { useNavigation } from '@react-navigation/native';

import { text } from '@/assets';

import { ASContainer, ASText } from '@/components';

import { StyleSheet } from 'react-native';
import { sharedStyles } from '@/components/shared/sharedStyles';

import Route from '@/navigation/routes';
import { useClearHeaderActions } from '@/utils/screen.effects';

import { STRINGS } from '@/strings';

type ScreenRouteParams = {};

type ScreenProps = {
  route: {
    params: ScreenRouteParams;
  };
};

const Welcome: React.FC<ScreenProps> = ({ route }) => {
  const navigation = useNavigation();

  const onPressBackASButton = async () => {
    navigation.navigate(Route.HOME, {});
  };

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-513990'}
      testID={'dcfd2802-2477-4243-902a-8af71019bac8'}
      style={sharedStyles.container}
      testId={'ASContainer-513990'}
    >
      <ASText
        labelType={'string'}
        name={'ASText-715640'}
        dragStyle={sharedStyles.textDrag}
        style={[text.label.medium, sharedStyles.greetingMsg]}
        accessibilityLabel={STRINGS.Welcome.ASText_715640.accessibilityLabel}
        testId={'ASText-715640'}
      >
        {STRINGS.Welcome.ASText_715640.label}
      </ASText>
      <ASText
        labelType={'string'}
        name={'ASText-151226'}
        dragStyle={sharedStyles.textDrag}
        style={[text.label.medium, sharedStyles.greetingMsg]}
        accessibilityLabel={STRINGS.Welcome.ASText_151226.accessibilityLabel}
        testId={'ASText-151226'}
      >
        {STRINGS.Welcome.ASText_151226.label}
      </ASText>
      <AppButton
        widgetId={'ASButton-418522'}
        onPress={() => {
          onPressBackASButton({});
        }}
        style={sharedStyles.button}
        label={STRINGS.Welcome.ASButton_418522.label}
        accessibilityLabel={STRINGS.Welcome.ASButton_418522.accessibilityLabel}
      />
    </ASContainer>
  );
};

const styles = StyleSheet.create({});

export default Welcome;
