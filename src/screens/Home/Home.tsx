import React, { useRef } from 'react';

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
import { useGlobalContext } from '@/context';

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
  const { setGlobalData, globalData } = useGlobalContext();

  const navigation = useNavigation();

  const onPressGreetgreetBtn = async () => {
    const __out = await executeCustomFunction('HelloWorldFunctions.greet', {
      name: name,
    });
    setGlobalData({ ext_helloWorld_greet: __out });
  };

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-501920'}
      testID={'025ef1be-97ac-42c4-bd6b-6c3b83f692fd'}
      style={styles.aSContainerStyle}
      testId={'ASContainer-501920'}
    >
      <ASForm
        enableReinitialize={true}
        name={'ASForm-172090'}
        validationSchema={Yup.object().shape({})}
        initialValues={{ name: '' }}
        innerRef={formikRef}
        testId={'ASForm-172090'}
      >
        {(formikProps: FormikProps<FormValues>) => {
          const { values } = formikProps;
          return (
            <>
              <ASText
                labelType={'string'}
                name={'titleText'}
                dragStyle={styles.titleTextDragStyle}
                style={[text.label.medium, styles.titleTextStyle]}
                accessibilityLabel={STRINGS.Home.titleText.accessibilityLabel}
                testId={'titleText'}
              >
                {STRINGS.Home.titleText.label}
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
                name={'greetBtn'}
                onPress={async () => {
                  const formik = formikRef.current;
                  if (formik) {
                    if (formik.isValid && formik.dirty) {
                      onPressGreetgreetBtn(values);
                    } else {
                      Object.keys(formik.values).forEach((field) => {
                        formik.setFieldTouched(field, true);
                      });
                    }
                  }
                }}
                style={styles.greetBtnStyle}
                iconStyles={styles.greetBtnIconStyles}
                leadingIconStyles={styles.greetBtnLeadingIconStyles}
                trailingIconStyles={styles.greetBtnTrailingIconStyles}
                textStyle={[text.label.medium, styles.greetBtnTextStyle]}
                accessibilityLabel={STRINGS.Home.greetBtn.accessibilityLabel}
                label={STRINGS.Home.greetBtn.label}
                testId={'greetBtn'}
              />
              <ASText
                labelType={'string'}
                name={'greetingText'}
                dragStyle={styles.greetingTextDragStyle}
                style={[text.label.medium, styles.greetingTextStyle]}
                accessibilityLabel={
                  STRINGS.Home.greetingText.accessibilityLabel
                }
                testId={'greetingText'}
              >
                {globalData?.ext_helloWorld_greet.message}
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
  titleTextDragStyle: { flexBasis: 'auto' },
  titleTextStyle: {
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
  greetBtnStyle: {
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
  greetBtnIconStyles: {
    iconSize: component.icon.size.md,
    color: color.brand.onPrimary,
  },
  greetBtnLeadingIconStyles: { marginRight: space['1'] },
  greetBtnTrailingIconStyles: { marginLeft: space['1'] },
  greetBtnTextStyle: { color: color.brand.onPrimary },
  greetingTextDragStyle: { flexBasis: 'auto' },
  greetingTextStyle: {
    overflow: 'visible',
    textAlign: 'left',
    ...Platform.select({ web: { whiteSpace: 'pre-wrap' }, default: {} }),
  },
});

export default Home;
