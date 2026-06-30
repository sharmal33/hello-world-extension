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
import { sharedStyles } from '@/components/shared/sharedStyles';

import { FormikProps } from 'formik';
import * as Yup from 'yup';
import Route from '@/navigation/routes';
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
  const { setGlobalData } = useGlobalContext();

  const navigation = useNavigation();

  const onPressGreetgreetBtn = async () => {
    const __out = await executeCustomFunction('HelloWorldFunctions.greet', {
      name: name,
    });
    setGlobalData({ ext_helloWorld_greet: __out });
    navigation.navigate(Route.RESULT);
  };

  useClearHeaderActions(navigation);

  return (
    <ASContainer
      disabledSafeArea={false}
      isScrollable={true}
      backgroundImageResizeMode={'contain'}
      name={'ASContainer-459262'}
      testID={'112886d2-9b04-432c-bc91-66ec54bac60d'}
      style={sharedStyles.container}
      testId={'ASContainer-459262'}
    >
      <ASForm
        enableReinitialize={true}
        name={'ASForm-659944'}
        validationSchema={Yup.object().shape({})}
        initialValues={{ name: '' }}
        innerRef={formikRef}
        testId={'ASForm-659944'}
      >
        {(formikProps: FormikProps<FormValues>) => {
          const { values } = formikProps;
          return (
            <>
              <ASText
                labelType={'string'}
                name={'titleText'}
                dragStyle={sharedStyles.greetingTextDrag}
                style={[text.label.medium, sharedStyles.greetingText]}
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
                label={STRINGS.Home.name.label}
                accessibilityLabel={STRINGS.Home.name.accessibilityLabel}
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
                label={STRINGS.Home.greetBtn.label}
                accessibilityLabel={STRINGS.Home.greetBtn.accessibilityLabel}
                testId={'greetBtn'}
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
});

export default Home;
