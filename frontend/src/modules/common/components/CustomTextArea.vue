<script lang="ts" setup>
interface Props {
  id?: string;
  modelValue?: string | number;
  error?: string;
  type?: 'text' | 'number';
}

withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'blur']);
</script>
<style scoped>
@reference '@/assets/main.css';

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>

<template>
  <div>
    <textarea
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
      @blur="$emit('blur')"
      :class="['form-control', { 'border-red-500': error }]"
      rows="5"
    ></textarea>
    <span v-if="error" class="text-red-500">{{ error }}</span>
  </div>
</template>
