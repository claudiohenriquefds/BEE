import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AdminContainer from '../../../components/AdminContainer';
import FormProductAdmin from '../../../components/FormProductAdmin';
import ValidationErrorsContainer from '../../../components/ValidationErrorsContainer';
import ButtonsFormAdmin from '../../../components/ButtonsFormAdmin';
import validationSchema from '../../../services/validations/validationProductAdmin';
import ProductAdminApiService from '../../../services/api/ProductAdminApiService';

function ProductPage() {
  const history = useHistory();

  const [values, setValues] = useState({
    name: '',
    unity: '',
    quantity: 0,
    unitary_value: 0,
    description: '',
    image: '',
    category_id: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async () => {
    setIsSaving(true);
    const form = {
      ...values,
    };
    try {
      const isValid = await validationSchema
        .validate(form, { abortEarly: false })
        .then(() => {
          setErrors([]);
          return true;
        })
        .catch((err) => {
          setErrors([...err.errors]);
          return undefined;
        });
      if (isValid !== undefined) {
        const resp = await ProductAdminApiService.create(form).then(
          (r) => r.data
        );
        if (resp.success) {
          history.push('/admin/produtos/page/1');
        } else {
          throw new Error(`Failed to create product: ${resp.error}`);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearErrors = () => {
    setErrors([]);
  };

  return (
    <AdminContainer link="produtos">
      <ButtonsFormAdmin
        path="/admin/produtos/page/1"
        handleSubmit={handleSubmit}
        isNew
        isSaving={isSaving}
      />
      <ValidationErrorsContainer
        errors={[...errors]}
        clear={handleClearErrors}
      />
      <FormProductAdmin values={values} update={setValues} />
    </AdminContainer>
  );
}

export default ProductPage;
