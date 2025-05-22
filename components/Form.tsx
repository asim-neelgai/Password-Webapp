import { Formik, FormikHelpers } from 'formik'

interface FormProps {
  initialValues: object
  onSubmit: (values: { [key: string]: any }, formikHelpers: FormikHelpers<any>) => void | Promise<void>
  validationSchema: any
  children: React.ReactNode
  innerRef?: any
}

const Form = ({ initialValues, onSubmit, validationSchema, innerRef, children }: FormProps): React.ReactNode => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
      innerRef={innerRef}
    >
      {() => (
        <>
          {children}
        </>
      )}
    </Formik>
  )
}
export default Form
