import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';

import { getProductByIdAction, createUpdateProductAction } from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required().min(3),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().min(1),
  stock: yup.number().required().min(1),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductByIdAction(props.productId),
      retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');
    const { fields: images } = useFieldArray<string>('images');

    const imageFiles = ref<File[]>([]);

    const onSubmit = handleSubmit(async (values) => {
      const formValues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };
      mutate(formValues);
    });

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const hasSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      return currentSizes.includes(size);
    };

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files;
      if (!fileList) return;
      if (fileList.length === 0) return;

      for (const imageFile of fileList) {
        imageFiles.value.push(imageFile);
      }
    };

    const tmpImageUrl = (imageFile: File) => {
      return URL.createObjectURL(imageFile);
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
      }
    });

    watch(
      product,
      () => {
        if (!product) return;
        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(
      isUpdateSuccess,
      (value) => {
        if (!value) return;
        toast.success('Product updated successfully');

        router.replace(`/admin/products/${updatedProduct.value!.id}`);

        resetForm({
          values: updatedProduct.value,
        });
        imageFiles.value = [];
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.productId,
      () => {
        refetch();
      },
      {
        immediate: true,
      },
    );

    return {
      // Properties
      values,
      errors,
      meta,

      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      images,
      imageFiles,
      sizes,
      isPending,
      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Actions
      onSubmit,
      onFileChanged,
      toggleSize,
      hasSize,
      tmpImageUrl,
    };
  },
});
