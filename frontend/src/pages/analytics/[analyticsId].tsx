import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/analytics/analyticsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditAnalytics = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    submitted_count: '',

    approved_count: '',

    rejected_count: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { analytics } = useAppSelector((state) => state.analytics);

  const { analyticsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: analyticsId }));
  }, [analyticsId]);

  useEffect(() => {
    if (typeof analytics === 'object') {
      setInitialValues(analytics);
    }
  }, [analytics]);

  useEffect(() => {
    if (typeof analytics === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = analytics[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [analytics]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: analyticsId, data }));
    await router.push('/analytics/analytics-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit analytics')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit analytics'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='SubmittedCount'>
                <Field
                  type='number'
                  name='submitted_count'
                  placeholder='SubmittedCount'
                />
              </FormField>

              <FormField label='ApprovedCount'>
                <Field
                  type='number'
                  name='approved_count'
                  placeholder='ApprovedCount'
                />
              </FormField>

              <FormField label='RejectedCount'>
                <Field
                  type='number'
                  name='rejected_count'
                  placeholder='RejectedCount'
                />
              </FormField>

              <FormField label='Organization' labelFor='organization'>
                <Field
                  name='organization'
                  id='organization'
                  component={SelectField}
                  options={initialValues.organization}
                  itemRef={'organizations'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/analytics/analytics-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAnalytics.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_ANALYTICS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAnalytics;
