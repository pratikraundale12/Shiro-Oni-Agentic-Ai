/* eslint-disable */
// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";

// const DynamicForm = () => {
//   const { register, control, handleSubmit } = useForm({
//     defaultValues: {
//       users: [{ name: "", password: "" }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "users",
//   });

//   const onSubmit = (data) => {
//     console.log("Submitted Data:", data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {fields.map((field, index) => (
//         <div key={field.id} style={{ marginBottom: "10px" }}>
//           <input
//             {...register(`users.${index}.name`, { required: true })}
//             placeholder="Name"
//           />
//           <input
//             {...register(`users.${index}.password`, { required: true })}
//             type="password"
//             placeholder="Password"
//           />
//           {fields.length > 1 && (
//             <button type="button" onClick={() => remove(index)}>
//               Remove
//             </button>
//           )}
//         </div>
//       ))}

//       <button type="button" onClick={() => append({ name: "", password: "" })}>
//         Add
//       </button>

//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default DynamicForm;

// import { useForm, useFieldArray } from 'react-hook-form';
// import React from 'react';
// import { InputField, SelectField } from '../../../shared';
// import { PlusIcon, QRIcons } from '../../../assets';
// import styled from 'styled-components';
// import DynamicForm from './poc';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// const LabelSelect = styled.div`
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 16px;
//   color: ${props => props.theme.colors.darker};
// `;
// const ActiveButtonDiv = styled.div`
//   height: 48px;
//   width: 48px;
//   max-width: 48px;
//   max-height: 48px;
//   min-height: 48px;
//   min-width: 48px;
//   border: 1px solid #444445;
//   border-radius: 8px;
//   background-color: #f5f7fa;
//   cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   &:hover {
//     border: 1px solid
//       ${props => (props.isActive ? props.activeColor : '#FF7A00')};
//   }

//   & span {
//     position: absolute;
//     top: 0px;
//     right: 2px;
//     font-family: ${props => props.theme.fontNato};
//     font-size: 14px;
//     font-weight: 500;
//     line-height: 23px;
//     color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
//   }

//   svg path {
//     fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
//   }
// `;

// const DynamicHostForm = () => {
//   //   const clusterSchema = yup.object().shape({
//   //     hostIP: yup.string().required('Cluster is required'),
//   //     username: yup.string().required('Username is required'),
//   //     password: yup.string().required('Password is required'),
//   //   });
//   //   const {
//   //     register,
//   //     control,
//   //     handleSubmit,
//   //     formState: { errors },
//   //   } = useForm({ resolver: yupResolver(clusterSchema) });
//   //   const { fields, append, remove } = useFieldArray({
//   //     control,
//   //     name: 'hosts',
//   //   });
//   //   console.log(errors, 'error');
//   //   const onSubmit = (data, event) => {
//   //     event.preventDefault(); // Prevents any unexpected form behaviors
//   //     console.log('Submitted Data:', data);
//   //   };

//   //   return (
//   //     <form onSubmit={handleSubmit(onSubmit)}>
//   //       {fields.map((field, index) => (
//   //         <div className="col-11 row" key={field.id}>
//   //           <div className="col-4">
//   //             <LabelSelect className="mb-3">Host IP {index + 1}</LabelSelect>
//   //             <InputField
//   //               //   {...register(`hosts.${index}.hostIp`, { required: true })}
//   //               type="text"
//   //               placeholder="Enter your Host IP"
//   //               //   required
//   //               icon={<QRIcons />}
//   //               name="hostIP"
//   //               register={register}
//   //               errors={errors}
//   //             />
//   //           </div>
//   //           <div className="col-4">
//   //             <LabelSelect className="mb-3">Username</LabelSelect>
//   //             <InputField
//   //               //   {...register(`hosts.${index}.username`, { required: true })}
//   //               type="text"
//   //               placeholder="Enter your Username"
//   //               //   required
//   //               icon={<QRIcons />}
//   //               name="username"
//   //               register={register}
//   //               errors={errors}
//   //             />
//   //           </div>
//   //           <div className="col-4">
//   //             <LabelSelect className="mb-3">Password</LabelSelect>
//   //             <InputField
//   //               //   {...register(`hosts.${index}.password`, { required: true })}
//   //               type="text"
//   //               placeholder="Enter your Password"
//   //               //   required
//   //               icon={<QRIcons />}
//   //               name="password"
//   //               register={register}
//   //               errors={errors}
//   //             />
//   //           </div>
//   //           {fields.length > 1 && (
//   //             <button
//   //               type="button"
//   //               className="btn btn-danger mt-2"
//   //               onClick={() => remove(index)}
//   //             >
//   //               Remove
//   //             </button>
//   //           )}
//   //         </div>
//   //       ))}

//   //       <button
//   //         type="button"
//   //         className="btn btn-primary mt-3"
//   //         onClick={() => append({ hostIp: '', username: '', password: '' })}
//   //       >
//   //         Add Host
//   //       </button>

//   //       <button type="submit" className="btn btn-success mt-3">
//   //         Submit
//   //       </button>
//   //     </form>
//   //   );
//   const clusterSchema = yup.object().shape({
//     hosts: yup.array().of(
//       yup.object().shape({
//         hostIp: yup.string().required('Host IP is required'),
//         username: yup.string().required('Username is required'),
//         password: yup.string().required('Password is required'),
//       })
//     ),
//   });

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(clusterSchema),
//     defaultValues: {
//       hosts: [{ hostIp: '', username: '', password: '' }],
//     },
//   });
//   console.log(errors, 'errors');

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'hosts',
//   });
//   const onSubmit = (data, event) => {
//     event.preventDefault(); // Prevents any unexpected form behaviors
//     console.log('Submitted Data:', data);
//   };
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {fields.map((field, index) => (
//         <div className="col-11 row" key={field.id}>
//           <div className="col-4">
//             <LabelSelect className="mb-3">Host IP {index + 1}</LabelSelect>
//             <InputField
//               {...register(`hosts.${index}.hostIp`)}
//               type="text"
//               placeholder="Enter your Host IP"
//               icon={<QRIcons />}
//             />
//             {errors.hosts?.[index]?.hostIp && (
//               <span className="text-danger">
//                 {errors.hosts[index].hostIp.message}
//               </span>
//             )}
//           </div>
//           <div className="col-4">
//             <LabelSelect className="mb-3">Username</LabelSelect>
//             <InputField
//               {...register(`hosts.${index}.username`)}
//               type="text"
//               placeholder="Enter your Username"
//               icon={<QRIcons />}
//             />
//             {errors.hosts?.[index]?.username && (
//               <span className="text-danger">
//                 {errors.hosts[index].username.message}
//               </span>
//             )}
//           </div>
//           <div className="col-4">
//             <LabelSelect className="mb-3">Password</LabelSelect>
//             <InputField
//               {...register(`hosts.${index}.password`)}
//               type="text"
//               placeholder="Enter your Password"
//               icon={<QRIcons />}
//             />
//             {errors.hosts?.[index]?.password && (
//               <span className="text-danger">
//                 {errors.hosts[index].password.message}
//               </span>
//             )}
//           </div>
//           {fields.length > 1 && (
//             <button
//               type="button"
//               className="btn btn-danger mt-2"
//               onClick={() => remove(index)}
//             >
//               Remove
//             </button>
//           )}
//         </div>
//       ))}

//       <button
//         type="button"
//         className="btn btn-primary mt-3"
//         onClick={() => append({ hostIp: '', username: '', password: '' })}
//       >
//         Add Host
//       </button>

//       <button type="submit" className="btn btn-success mt-3">
//         Submit
//       </button>
//     </form>
//   );
// };

// export default DynamicHostForm;

import { useForm, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { InputField, SelectField } from '../../../shared';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PlusIcon,
  QRIcons,
} from '../../../assets';
import styled from 'styled-components';
import DynamicForm from './poc';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteIcon } from '../../../assets/Icons/DeleteIcon';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #444445;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }

  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
  }
`;

//// GOOD WORKING FLOW
// const DynamicHostForm = () => {
//   const validationSchema = yup.object().shape({
//     hosts: yup.array().of(
//       yup.object().shape({
//         hostIp: yup.string().required('Host IP is required'),
//         username: yup.string().required('Username is required'),
//         password: yup.string().required('Password is required'),
//       })
//     ),
//   });

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       hosts: [{ hostIp: '', username: '', password: '' }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'hosts',
//   });

//   const onSubmit = data => {
//     console.log('Submitted Data:', data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {fields.map((field, index) => (
//         <div key={field.id} className="row">
//           {console.log(index, 'index')}
//           <div className="col-11 row">
//             <div className="col-4">
//               <LabelSelect className="mb-3">Host IP {index + 1} </LabelSelect>
//               <InputField
//                 name={`hosts.${index}.hostIp`}
//                 register={register}
//                 errors={errors}
//                 placeholder="Enter your Host IP"
//                 type="text"
//                 icon={<QRIcons />}
//               />
//             </div>

//             <div className="col-4">
//               <LabelSelect className="mb-3">Username</LabelSelect>
//               <InputField
//                 name={`hosts.${index}.username`}
//                 register={register}
//                 errors={errors}
//                 placeholder="Enter your Username"
//                 type="text"
//                 icon={<QRIcons />}
//               />
//             </div>

//             <div className="col-4">
//               <LabelSelect className="mb-3">Password</LabelSelect>
//               <InputField
//                 name={`hosts.${index}.password`}
//                 register={register}
//                 errors={errors}
//                 placeholder="Enter your Password"
//                 type="password"
//                 icon={<QRIcons />}
//               />
//             </div>
//           </div>
//           <div className="col-1 pt-4">
//             {index === 0 && (
//               <div className="d-flex justify-content-center">
//                 <ActiveButtonDiv
//                   className="div-btn-1 mr-2 mt-2"
//                   onClick={() =>
//                     append({ hostIp: '', username: '', password: '' })
//                   }
//                 >
//                   {' '}
//                   <PlusIcon color="#444445" />{' '}
//                 </ActiveButtonDiv>
//               </div>
//             )}
//             {index !== 0 && fields.length > 1 && (
//               <ActiveButtonDiv
//                 className="div-btn-1 mr-2 mt-2"
//                 onClick={() => remove(index)}
//               >
//                 {' '}
//                 <DeleteSmallIcon color="black" />{' '}
//               </ActiveButtonDiv>
//             )}
//           </div>
//         </div>
//       ))}
//       <button type="submit" className="btn btn-success mt-3">
//         Submit
//       </button>
//     </form>
//   );
// };

const DynamicHostForm = () => {
  const validationSchema = yup.object().shape({
    hosts: yup.array().of(
      yup.object().shape({
        hostIp: yup.string().required('Host IP is required'),
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required'),
      })
    ),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      hosts: [{ hostIp: '', username: '', password: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hosts',
  });

  const [formData, setFormData] = useState([]);

  const watchedFields = watch('hosts');

  useEffect(() => {
    setFormData(watchedFields);
  }, [watchedFields]);

  const onSubmit = data => {
    console.log('Submitted Data:', data);
  };

  const handleAddHost = async () => {
    const isValid = await trigger();
    if (isValid) {
      append({ hostIp: '', username: '', password: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className="row">
          <div className="col-11 row">
            {/* Host IP Field */}
            <div className="col-4">
              <LabelSelect className="mb-3">Host IP {index + 1}</LabelSelect>
              <InputField
                name={`hosts.${index}.hostIp`}
                register={register}
                errors={errors}
                placeholder="Enter your Host IP"
                type="text"
                icon={<QRIcons />}
              />
            </div>

            {/* Username Field */}
            <div className="col-4">
              <LabelSelect className="mb-3">Username</LabelSelect>
              <InputField
                name={`hosts.${index}.username`}
                register={register}
                errors={errors}
                placeholder="Enter your Username"
                type="text"
                icon={<QRIcons />}
              />
            </div>

            {/* Password Field */}
            <div className="col-4">
              <LabelSelect className="mb-3">Password</LabelSelect>
              <InputField
                name={`hosts.${index}.password`}
                register={register}
                errors={errors}
                placeholder="Enter your Password"
                type="password"
                icon={<QRIcons />}
              />
            </div>
          </div>

          {/* Add/Remove Buttons */}
          <div className="col-1 pt-4">
            {index === 0 && (
              <div className="d-flex justify-content-center">
                <ActiveButtonDiv
                  className="div-btn-1 mr-2 mt-2"
                  onClick={handleAddHost}
                >
                  <PlusIcon color="#444445" />
                </ActiveButtonDiv>
              </div>
            )}
            {index !== 0 && fields.length > 1 && (
              <ActiveButtonDiv
                className="div-btn-1 mr-2 mt-2"
                onClick={() => remove(index)}
              >
                <DeleteSmallIcon color="black" />
              </ActiveButtonDiv>
            )}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button type="submit" className="btn btn-success mt-3">
        Submit
      </button>

      {/* Show Form Data in State (For Debugging) */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </form>
  );
};

export default DynamicHostForm;
