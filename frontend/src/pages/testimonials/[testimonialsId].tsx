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

import { update, fetch } from '../../stores/testimonials/testimonialsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditTestimonials = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    client_name: '',

    photo: [],

    testimonial_text: '',

    rating: '',

    email: '',

    status: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { testimonials } = useAppSelector((state) => state.testimonials);

  const { testimonialsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: testimonialsId }));
  }, [testimonialsId]);

  useEffect(() => {
    if (typeof testimonials === 'object') {
      setInitialValues(testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    if (typeof testimonials === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = testimonials[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [testimonials]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: testimonialsId, data }));
    await router.push('/testimonials/testimonials-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit testimonials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit testimonials'}
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
              <FormField label='ClientName'>
                <Field name='client_name' placeholder='ClientName' />
              </FormField>

              <FormField>
                <Field
                  label='Photo'
                  color='info'
                  icon={mdiUpload}
                  path={'testimonials/photo'}
                  name='photo'
                  id='photo'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField label='TestimonialText' hasTextareaHeight>
                <Field
                  name='testimonial_text'
                  id='testimonial_text'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Rating'>
                <Field type='number' name='rating' placeholder='Rating' />
              </FormField>

              <FormField label='Email'>
                <Field name='email' placeholder='Email' />
              </FormField>

              <FormField label='Status' labelFor='status'>
                <Field name='Status' id='Status' component='select'>
                  <option value='pending'>pending</option>

                  <option value='approved'>approved</option>

                  <option value='rejected'>rejected</option>
                </Field>
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
                  onClick={() => router.push('/testimonials/testimonials-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditTestimonials.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_TESTIMONIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditTestimonials;
