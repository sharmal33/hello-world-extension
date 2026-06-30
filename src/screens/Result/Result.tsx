import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { text } from '@/assets';

import { ASContainer, ASText } from '@/components';

import { StyleSheet } from 'react-native';
import { sharedStyles } from '@/components/shared/sharedStyles';

import { useClearHeaderActions } from '@/utils/screen.effects';
import { useGlobalContext } from '@/context';

import { STRINGS } from '@/strings';

type ScreenRouteParams = {};

type ScreenProps = {
  route: {
    params: ScreenRouteParams;
  };
};

const Result: React.FC<ScreenProps> = ({ route }) => {
  const { globalData } = useGlobalContext();

  const navigation = useNavigation();

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-553271'}
      testID={'396b993a-d1d7-42fb-9d4f-e512cff36b25'}
      style={sharedStyles.container}
      testId={'ASContainer-553271'}
    >
      <ASText
        labelType={'string'}
        name={'resultTitle'}
        dragStyle={sharedStyles.greetingTextDrag}
        style={[text.label.medium, sharedStyles.greetingText]}
        accessibilityLabel={STRINGS.Result.resultTitle.accessibilityLabel}
        testId={'resultTitle'}
      >
        {STRINGS.Result.resultTitle.label}
      </ASText>
      <ASText
        labelType={'string'}
        name={'greetingText'}
        dragStyle={sharedStyles.greetingTextDrag}
        style={[text.label.medium, sharedStyles.greetingText]}
        accessibilityLabel={STRINGS.Result.greetingText.accessibilityLabel}
        testId={'greetingText'}
      >
        {globalData?.ext_helloWorld_greet.message}
      </ASText>
    </ASContainer>
  );
};

const styles = StyleSheet.create({});

export default Result;
