import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
<script src="./ProductView.ts" lang="ts"></script>

<style scoped>
@reference '@/assets/main.css';
.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>

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
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Upload image</label>

        <input multiple type="file" id="image" class="form-control" />
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
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </form>
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
  </div>
</template>
