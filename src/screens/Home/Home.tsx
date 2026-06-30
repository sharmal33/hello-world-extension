import React, { useState, useRef } from 'react';
import { AppButton } from '@/components/shared';

import { useNavigation } from '@react-navigation/native';

import { color, text, space, radius, border, component } from '@/assets';

import { ASContainer, ASForm, ASText, ASTextField } from '@/components';

import { StyleSheet } from 'react-native';
import { sharedStyles } from '@/components/shared/sharedStyles';

import { FormikProps } from 'formik';
import * as Yup from 'yup';
import Route from '@/navigation/routes';
import { useClearHeaderActions } from '@/utils/screen.effects';
import { executeCustomFunction } from '@/extensions';

import { STRINGS } from '@/strings';

type FormValues = {
  name?: string;
};

type ScreenRouteParams = {};

type ScreenProps = {
  route: {
    params: ScreenRouteParams;
  };
};

const Home: React.FC<ScreenProps> = ({ route }) => {
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const navigation = useNavigation();

  const [extHelloWorldGreet, setExtHelloWorldGreet] = useState<any>(undefined);
  const onPressGreetASButton = async (values: FormValues) => {
    const __out = await executeCustomFunction('HelloWorldFunctions.greet', {
      name: values?.name,
    });
    setExtHelloWorldGreet(__out);
    switch (__out?.status) {
      case 'named': {
        navigation.navigate(Route.GREETING, { ext_helloWorld_greet: __out });
        break;
      }
      case 'anonymous': {
        navigation.navigate(Route.WELCOME, { ext_helloWorld_greet: __out });
        break;
      }
    }
  };

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-186010'}
      testID={'0e44ba80-545c-4dee-9589-aab3c1a734a5'}
      style={sharedStyles.container}
      testId={'ASContainer-186010'}
    >
      <ASForm
        enableReinitialize={true}
        name={'ASForm-642860'}
        validationSchema={Yup.object().shape({})}
        initialValues={{ name: '' }}
        innerRef={formikRef}
        testId={'ASForm-642860'}
      >
        {(formikProps: FormikProps<FormValues>) => {
          const { values } = formikProps;
          return (
            <>
              <ASText
                labelType={'string'}
                name={'ASText-453193'}
                dragStyle={sharedStyles.textDrag}
                style={[text.label.medium, sharedStyles.greetingMsg]}
                accessibilityLabel={
                  STRINGS.Home.ASText_453193.accessibilityLabel
                }
                testId={'ASText-453193'}
              >
                {STRINGS.Home.ASText_453193.label}
              </ASText>
              <ASTextField
                placeholderTextColor={color.text.tertiary}
                borderActiveColor={color.brand.primary}
                borderErrorColor={color.status.danger}
                autoCapitalize={'none'}
                keyboardType={'default'}
                textFieldType={'custom'}
                allowFontScaling={false}
                autoComplete={'off'}
                maxNumberOfLines={5}
                name={'name'}
                labelTextStyle={[text.label.medium, styles.nameLabelTextStyle]}
                prefixIconStyles={styles.namePrefixIconStyles}
                suffixIconStyles={styles.nameSuffixIconStyles}
                style={styles.nameStyle}
                inputTextStyle={[text.body.medium, styles.nameInputTextStyle]}
                errorMessageTextStyle={[
                  text.label.small,
                  styles.nameErrorMessageTextStyle,
                ]}
                prefixTextStyle={[text.body.medium, styles.namePrefixTextStyle]}
                contentContainerStyle={styles.nameContentContainerStyle}
                label={STRINGS.Home.name.label}
                accessibilityLabel={STRINGS.Home.name.accessibilityLabel}
                testId={'name'}
                placeholder={STRINGS.Home.name.placeholder}
              />
              <AppButton
                widgetId={'ASButton-820381'}
                onPress={async () => {
                  const formik = formikRef.current;
                  if (formik) {
                    if (formik.isValid && formik.dirty) {
                      onPressGreetASButton(values);
                    } else {
                      Object.keys(formik.values).forEach((field) => {
                        formik.setFieldTouched(field, true);
                      });
                    }
                  }
                }}
                style={sharedStyles.button}
                label={STRINGS.Home.ASButton_820381.label}
                accessibilityLabel={
                  STRINGS.Home.ASButton_820381.accessibilityLabel
                }
              />
            </>
          );
        }}
      </ASForm>
    </ASContainer>
  );
};

const styles = StyleSheet.create({
  nameLabelTextStyle: {
    maxWidth: '97%',
    paddingRight: 0,
    zIndex: 1,
    paddingLeft: 0,
    position: 'absolute',
  },
  namePrefixIconStyles: { color: color.text.primary, iconSize: 22 },
  nameSuffixIconStyles: { iconSize: 22, color: color.text.primary },
  nameStyle: {
    height: component.input.height,
    borderColor: color.border.default,
    borderRadius: radius.sm,
    borderWidth: border.default,
    paddingLeft: space['3'],
    width: '100%',
    backgroundColor: color.surface.default,
    paddingRight: space['3'],
  },
  nameInputTextStyle: {
    height: '100%',
    color: color.text.primary,
    textAlign: 'left',
  },
  nameErrorMessageTextStyle: { color: color.status.danger },
  namePrefixTextStyle: {},
  nameContentContainerStyle: {
    flexDirection: 'row',
    gap: space['2'],
    height: '100%',
    alignItems: 'center',
  },
});

export default Home;
