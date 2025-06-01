<template>
  <div class="row q-gutter-md items-start button-form" :data-button-index="buttonIndex">
    <!-- Тип кнопки -->
    <q-select
      v-model="localButton.type"
      :options="buttonTypeOptions"
      label="Тип кнопки"
      emit-value
      map-options
      style="min-width: 140px"
      @update:model-value="updateButton"
    />

    <!-- Текст кнопки -->
    <q-input
      v-model="localButton.text"
      label="Текст кнопки"
      :maxlength="getButtonTextLimit()"
      :hint="getButtonTextHint()"
      :rules="[(val) => !!val || 'Поле обязательно для заполнения']"
      counter
      style="min-width: 200px"
      @update:model-value="updateButton"
    />

    <!-- URL для кнопки-ссылки -->
    <q-input
      v-if="localButton.type === 'url'"
      v-model="localButton.url"
      label="URL"
      type="url"
      :rules="[
        (val) => !!val || 'Поле обязательно для заполнения',
        (val) => !val || isValidUrl(val) || 'Введите корректный URL',
      ]"
      style="min-width: 200px"
      @update:model-value="updateButton"
    />

    <!-- Текст быстрого ответа -->
    <q-input
      v-if="localButton.type === 'quick_reply'"
      v-model="localButton.quickReplyText"
      label="Текст быстрого ответа"
      :hint="'Текст, который отправится в чат при нажатии'"
      :rules="[(val) => !!val || 'Поле обязательно для заполнения']"
      style="min-width: 200px"
      @update:model-value="updateButton"
    />

    <!-- Кнопка удаления -->
    <q-btn size="sm" icon="delete" color="negative" flat @click="$emit('remove', buttonIndex)" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { ChannelLimits } from '../types/channel-limits';

  interface Button {
    text: string;
    type: string;
    url?: string;
    quickReplyText?: string;
  }

  const props = defineProps<{
    button: Button;
    buttonIndex: number;
    channelType: string;
    keyboardType: string;
    channelLimits: ChannelLimits | undefined;
  }>();

  const emit = defineEmits<{
    update: [buttonIndex: number, button: Button];
    remove: [buttonIndex: number];
  }>();

  const localButton = ref<Button>({ ...props.button });

  // Удаляем refs для валидации - больше не нужны

  watch(
    () => props.button,
    (newButton) => {
      localButton.value = { ...newButton };
    },
    { deep: true },
  );

  const buttonTypeOptions = computed(() => {
    const options = [{ label: 'Быстрый ответ', value: 'quick_reply' }];

    // Проверяем, поддерживаются ли кнопки-ссылки для данного канала и типа клавиатуры
    const keyboardLimits =
      props.keyboardType === 'inline'
        ? props.channelLimits?.inlineKeyboard
        : props.channelLimits?.standardKeyboard;

    if (keyboardLimits?.supportsUrlButtons) {
      options.push({ label: 'Ссылка', value: 'url' });
    }

    return options;
  });

  const getButtonTextLimit = () => {
    const keyboardLimits =
      props.keyboardType === 'inline'
        ? props.channelLimits?.inlineKeyboard
        : props.channelLimits?.standardKeyboard;

    return keyboardLimits?.maxButtonTextLength || 100;
  };

  const getButtonTextHint = () => {
    const limit = getButtonTextLimit();
    return `Максимум ${limit} символов`;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const updateButton = () => {
    // Очищаем неиспользуемые поля в зависимости от типа
    if (localButton.value.type === 'quick_reply') {
      delete localButton.value.url;
      if (!localButton.value.quickReplyText) {
        localButton.value.quickReplyText = localButton.value.text;
      }
    } else if (localButton.value.type === 'url') {
      delete localButton.value.quickReplyText;
    }

    emit('update', props.buttonIndex, localButton.value);
  };
</script>
<style lang="scss" scoped>
  .button-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
