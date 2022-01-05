import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Category } from 'types/category';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import './styles.css';

type UrlParams = {
  productId: string;
};

const Form = () => {
  const { productId } = useParams<UrlParams>();
  const isEditind = productId !== 'create';
  const history = useHistory();
  const [selectCategories, setSelectCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Product>();

  useEffect(() => {
    requestBackend({ url: `/categories` }).then((result) => {
      setSelectCategories(result.data.content);
    });
  }, []);

  useEffect(() => {
    if (isEditind) {
      requestBackend({ url: `/products/${productId}` }).then((result) => {
        const product = result.data as Product;
        setValue('name', product.name);
        setValue('price', product.price);
        setValue('description', product.description);
        setValue('imgUrl', product.imgUrl);
        setValue('categories', product.categories);
      });
    }
  }, [isEditind, productId, setValue]);

  const onSubmit = async (formData: Product) => {
    const data = {
      ...formData,
      price: String(formData.price).replace(',', '.'),
    };
    const config: AxiosRequestConfig = {
      method: isEditind ? 'PUT' : 'POST',
      url: isEditind ? `/products/${productId}` : '/products',
      data,
      withCredentials: true,
    };

    try {
      await requestBackend(config);
      toast.info('Produto criado com sucesso!');
      history.push('/admin/products');
    } catch (error) {
      toast.error('Ouch!!! Algo deu errado');
    }
  };

  const handleCancel = () => {
    history.push('/admin/products');
  };

  return (
    <div className="product-crud-container">
      <div className="base-card product-crud-form-card">
        <h1 className="product-crud-form-title">Dados do produto</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row product-crud-inputs-container">
            <div className="col-lg-6 product-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatorio',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Nome do produto"
                  name="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <Controller
                  name="categories"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectCategories}
                      classNamePrefix="product-crud-select"
                      isMulti
                      getOptionLabel={(category: Category) => category.name}
                      getOptionValue={(category: Category) =>
                        String(category.id)
                      }
                    />
                  )}
                />
                {errors.categories && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>

              <div className="margin-bottom-30">
                <Controller
                  name="price"
                  rules={{ required: 'Campo obrigatorio' }}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      placeholder="Preço"
                      className={`form-control base-input ${
                        errors.price ? 'is-invalid' : ''
                      }`}
                      disableGroupSeparators={true}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.price?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('imgUrl', {
                    required: 'Campo obrigatorio',
                    pattern: {
                      value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                      message: 'Deve ser uma URL valida',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.imgUrl ? 'is-invalid' : ''
                  }`}
                  placeholder="Url da imagemdo produto"
                  name="imgUrl"
                />
                <div className="invalid-feedback d-block">
                  {errors.imgUrl?.message}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div>
                <textarea
                  {...register('description', {
                    required: 'Campo obrigatorio',
                  })}
                  className={`form-control base-input h-auto ${
                    errors.description ? 'is-invalid' : ''
                  }`}
                  placeholder="Descrição"
                  name="description"
                  rows={10}
                />
                <div className="invalid-feedback d-block">
                  {errors.description?.message}
                </div>
              </div>
            </div>
          </div>
          <div className="product-crud-buttons-container">
            <button
              className="btn btn-outline-danger product-crud-buttons"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary text-white product-crud-buttons">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
