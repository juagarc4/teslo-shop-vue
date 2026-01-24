<script lang="ts">
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
</script>
<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">
      Product: <small class="text-blue-500">{{ title }}</small>
    </h1>
    <hr class="my-4" />
  </div>

  <form @submit="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5">
    <div class="first-col">
      <!-- First part of the form -->
      <div class="mb-4">
        <label for="title" class="form-label">Title</label>
        <CustomInput v-model="title" v-bind="titleAttrs" :error="errors.title" />
      </div>

      <div class="mb-4">
        <label for="slug" class="form-label">Slug</label>
        <CustomInput v-model="slug" v-bind="slugAttrs" :error="errors.slug" />
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Description</label>
        <CustomTextArea
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          :error="errors.description"
        />
      </div>

      <div class="flex flex-row gap-3">
        <div class="mb-4 flex-1">
          <label for="price" class="form-label">Price</label>
          <CustomInput
            id="price"
            v-model.number="price"
            v-bind="priceAttrs"
            :error="errors.price"
          />
        </div>

        <div class="mb-4 flex-1">
          <label for="stock" class="form-label">Stock</label>
          <CustomInput
            id="stock"
            v-model.number="stock"
            v-bind="stockAttrs"
            :error="errors.stock"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="sizes" class="form-label">Sizes</label>
        <div class="flex">
          <button
            v-for="size of allSizes"
            :key="size"
            @click="toggleSize(size)"
            type="button"
            :class="[
              'p-2 rounded w-14 mr-2 flex-1',
              { 'bg-blue-500 text-white': hasSize(size), 'bg-blue-100': !hasSize(size) },
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Segunda columna -->
    <div class="first-col">
      <label for="images" class="form-label">Images</label>
      <!-- Row with scrollable horizontal -->
      <div
        id="images"
        class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded"
      >
        <div v-for="image of images" :key="image.value" class="shrink-0">
          <img :src="image.value" :alt="title" class="w-[250px] h-[250px] rounded" />
        </div>
        <div v-for="imageFile of imageFiles" :key="imageFile.name" class="shrink-0">
          <img :src="tmpImageUrl(imageFile)" :alt="title" class="w-[250px] h-[250px] rounded" />
        </div>
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Upload image</label>

        <input
          multiple
          type="file"
          id="image"
          class="form-control"
          accept="image/*"
          @change="onFileChanged"
        />
      </div>

      <div class="mb-4">
        <label for="gender" class="form-label">Gender</label>
        <select v-model="gender" v-bind="genderAttrs" class="form-control">
          <option value="">Select</option>
          <option value="kid">Child</option>
          <option value="women">Woman</option>
          <option value="men">Man</option>
        </select>
        <span v-if="errors.gender" class="text-red-500">{{ errors.gender }}</span>
      </div>

      <!-- Botón para guardar -->
      <div class="my-4 text-right">
        <button
          :disabled="isPending"
          type="submit"
          class="disabled:bg-grey-300 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </form>
  <!-- DATA VISUALIZER
  <div class="grid grid-cols-2 mt-2">
    <pre class="bg-blue-200 p-2">
      {{ JSON.stringify(values, null, 2) }}
    </pre>
    <pre class="bg-red-200 p-2">
      {{ JSON.stringify(errors, null, 2) }}
    </pre>
    <pre class="bg-green-200 col-span-2">
      {{ JSON.stringify(meta, null, 2) }}
    </pre>
  </div> -->
</template>
<style scoped>
@reference '@/assets/main.css';
.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>
