import React, { useState, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';

import { color, text, space, radius, border, component } from '@/assets';

import {
  ASContainer,
  ASForm,
  ASText,
  ASTextField,
  ASButton,
} from '@/components';

import { Platform, StyleSheet } from 'react-native';

import { FormikProps } from 'formik';
import * as Yup from 'yup';
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
  };

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-140510'}
      testID={'4b818e1e-d2f5-487f-a0c2-d2a9ec8ce1ac'}
      style={styles.aSContainerStyle}
      testId={'ASContainer-140510'}
    >
      <ASForm
        enableReinitialize={true}
        name={'ASForm-927376'}
        validationSchema={Yup.object().shape({})}
        initialValues={{ name: '' }}
        innerRef={formikRef}
        testId={'ASForm-927376'}
      >
        {(formikProps: FormikProps<FormValues>) => {
          const { values } = formikProps;
          return (
            <>
              <ASText
                labelType={'string'}
                name={'ASText-844190'}
                dragStyle={styles.aSTextDragStyle}
                style={[text.label.medium, styles.aSTextStyle]}
                accessibilityLabel={
                  STRINGS.Home.ASText_844190.accessibilityLabel
                }
                testId={'ASText-844190'}
              >
                {STRINGS.Home.ASText_844190.label}
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
                accessibilityLabel={STRINGS.Home.name.accessibilityLabel}
                label={STRINGS.Home.name.label}
                testId={'name'}
                placeholder={STRINGS.Home.name.placeholder}
              />
              <ASButton
                iconPosition={'leading'}
                simpleTextButton={false}
                backgroundImageResizeMode={'contain'}
                name={'ASButton-173431'}
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
                style={styles.aSButtonStyle}
                iconStyles={styles.aSButtonIconStyles}
                leadingIconStyles={styles.aSButtonLeadingIconStyles}
                trailingIconStyles={styles.aSButtonTrailingIconStyles}
                textStyle={[text.label.medium, styles.aSButtonTextStyle]}
                label={STRINGS.Home.ASButton_173431.label}
                accessibilityLabel={
                  STRINGS.Home.ASButton_173431.accessibilityLabel
                }
                testId={'ASButton-173431'}
              />
              <ASText
                labelType={'string'}
                name={'greeting'}
                dragStyle={styles.greetingDragStyle}
                style={[text.label.medium, styles.greetingStyle]}
                testId={'greeting'}
              >
                {extHelloWorldGreet?.message}
              </ASText>
            </>
          );
        }}
      </ASForm>
    </ASContainer>
  );
};

const styles = StyleSheet.create({
  aSContainerStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: color.surface.default,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  aSTextDragStyle: { flexBasis: 'auto' },
  aSTextStyle: {
    overflow: 'visible',
    textAlign: 'left',
    ...Platform.select({ web: { whiteSpace: 'pre-wrap' }, default: {} }),
  },
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
  aSButtonStyle: {
    paddingBottom: space['2'],
    borderRadius: space['3'],
    paddingLeft: space['3'],
    alignItems: 'center',
    height: component.button.height,
    paddingTop: space['2'],
    backgroundColor: color.brand.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: space['3'],
    ...Platform.select({ web: { display: 'flex' }, default: {} }),
  },
  aSButtonIconStyles: {
    iconSize: component.icon.size.md,
    color: color.brand.onPrimary,
  },
  aSButtonLeadingIconStyles: { marginRight: space['1'] },
  aSButtonTrailingIconStyles: { marginLeft: space['1'] },
  aSButtonTextStyle: { color: color.brand.onPrimary },
  greetingDragStyle: { flexBasis: 'auto' },
  greetingStyle: {
    overflow: 'visible',
    textAlign: 'left',
    ...Platform.select({ web: { whiteSpace: 'pre-wrap' }, default: {} }),
  },
});

export default Home;
