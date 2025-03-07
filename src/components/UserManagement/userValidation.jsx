import * as yup from 'yup';
import { EMAIL_REGEX } from '../../constants';
export const userSchema = yup.object().shape({
  first_name: yup
    .string()
    .trim()
    .matches(/^[A-Za-z]+$/, 'First Name must contain only letters')
    .required('Name is required'),

  last_name: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .max(30, 'Last Name must be at most 30 characters')
    .test(
      'is-valid-last-name',
      'Last Name must contain only letters(no spaces)',
      value => !value || /^[A-Za-z]+$/.test(value)
    ),
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  username: yup.string().required('Username is required'),
});

export const editUserSchema = yup.object().shape(
  {
    first_name: yup
      .string()
      .required('First Name is required')
      .max(30, 'First Name must be at most 30 characters')
      .trim()
      .matches(
        /^[A-Za-z]+$/,
        'First Name must contain only letters(no spaces)'
      ),

    last_name: yup
      .string()
      .trim()
      .nullable()
      .notRequired()
      .max(30, 'Last Name must be at most 30 characters')
      .test(
        'is-valid-last-name',
        'Last Name must contain only letters(no spaces)',
        value => !value || /^[A-Za-z]+$/.test(value)
      ),
    middle_name: yup
      .string()
      .trim()
      .nullable()
      .notRequired()
      .max(30, 'Middle Name must be at most 30 characters')
      .test(
        'is-valid-middle-name',
        'Middle Name must contain only letters(no spaces)',
        value => !value || /^[A-Za-z]+$/.test(value) // ✅ Only validate if value exists
      ),
    email: yup
      .string()
      .required('Email is required')
      .trim()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|io|co|uk|us|in)$/i,
        'Invalid email address'
      ),
    username: yup
      .string()
      .required('Username is required')
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .matches(/^\S*$/, 'Username must not contain spaces'), // ✅ Ensures no spaces,
    phone: yup
      .string()
      .trim()
      .nullable()
      .notRequired()
      .test(
        'is-valid-phone',
        'Mobile number must be a 10-digit number',
        value => !value || /^\d{10}$/.test(value) // ✅ Only validate if value exists
      ),
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
