import * as yup from 'yup';
import { EMAIL_REGEX } from '../../constants';
export const userSchema = yup.object().shape({
  first_name: yup
    .string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, 'First Name must contain only letters and spaces')
    .required('Name is required'),
  last_name: yup
    .string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, 'Last Name must contain only letters and spaces')
    .required('Name is required'),
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  role_id: yup.string().required('Role is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&]/,
      'Password must contain at least one special character'
    ),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  username: yup.string().required('Username is required'),
});

export const editUserSchema = yup.object().shape(
  {
    first_name: yup
      .string()
      .trim()
      .matches(
        /^[A-Za-z\s]+$/,
        'First Name must contain only letters and spaces'
      )
      .required('Name is required'),
    last_name: yup
      .string()
      .trim()
      .matches(
        /^[A-Za-z\s]+$/,
        'Last Name must contain only letters and spaces'
      )
      .required('Name is required'),
    email: yup
      .string()
      .matches(EMAIL_REGEX, 'Invalid email address')
      .required('Email is required'),
    role_id: yup.string().required('Role is required'),
    username: yup.string().required('Username is required'),
    password: yup
      .string()
      .default('')
      .when('password', {
        is: value => value !== '',
        then: () =>
          yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
              /[a-z]/,
              'Password must contain at least one lowercase letter'
            )
            .matches(
              /[A-Z]/,
              'Password must contain at least one uppercase letter'
            )
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(
              /[@$!%*?&]/,
              'Password must contain at least one special character'
            ),
        otherwise: () => yup.string().notRequired(),
      }),
    confirm_password: yup
      .string()
      .default('')
      .when('password', {
        is: value => value !== '',
        then: () =>
          yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
        otherwise: () => yup.string().notRequired(),
      }),
  },
  [['password', 'password']]
);
// password: yup.string().when('$self', {
//   is: value => value !== '',
//   then: yup
//     .string()
//     .min(8, 'Password must be at least 8 characters')
//     .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(
//       /[@$!%*?&]/,
//       'Password must contain at least one special character'
//     ),
// });

// password: yup.string().when('$self', {
//   is: value => value !== '',
//   then: yup
//     .string()
//     .min(8, 'Password must be at least 8 characters')
//     .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(
//       /[@$!%*?&]/,
//       'Password must contain at least one special character'
//     ),
//   otherwise: () => yup.string(),
// }),
// confirm_password: yup
//   .string()
//   .oneOf([yup.ref('password')], 'Passwords must match'),
// username: yup.string().required('Username is required'),
