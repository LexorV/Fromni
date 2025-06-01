<template>
  <div class="q-gutter-md channel-message-form">
    <!-- Порядок сообщения (только для десктопа - экраны от 600px) -->
    <div class="row q-gutter-sm items-center gt-xs">
      <div class="text-subtitle2">Порядок:</div>
      <q-btn
        size="sm"
        icon="keyboard_arrow_up"
        @click="$emit('moveUp', index)"
        :disable="index === 0"
        flat
      />
      <q-btn size="sm" icon="keyboard_arrow_down" @click="$emit('moveDown', index)" flat />
    </div>

    <!-- Мобильная версия порядка (только для экранов меньше 600px) -->
    <div class="row items-center justify-between lt-sm q-mb-md">
      <div class="text-subtitle2 text-weight-medium">Порядок сообщения</div>
      <div class="row q-gutter-xs">
        <q-btn
          size="sm"
          icon="keyboard_arrow_up"
          @click="$emit('moveUp', index)"
          :disable="index === 0"
          color="primary"
          flat
          round
        />
        <q-btn
          size="sm"
          icon="keyboard_arrow_down"
          @click="$emit('moveDown', index)"
          color="primary"
          flat
          round
        />
      </div>
    </div>

    <!-- Адрес отправителя -->
    <q-input
      v-model="localMessage.senderAddress"
      label="Адрес отправителя"
      :hint="getSenderAddressHint()"
      outlined
      dense
      @update:model-value="updateMessage"
      class="channel-message-form__input"
    />

    <!-- Текст сообщения -->
    <q-input
      v-model="localMessage.text"
      label="Текст сообщения"
      type="textarea"
      :maxlength="getTextLimit()"
      :hint="getTextHint()"
      counter
      outlined
      :rows="4"
      @update:model-value="updateMessage"
      class="channel-message-form__textarea"
    />

    <!-- Настройки клавиатуры (если поддерживается) -->
    <div v-if="supportsKeyboard()" class="q-mt-md">
      <q-card flat bordered class="keyboard-settings">
        <q-card-section class="bg-grey-1 q-pa-sm">
          <div class="text-subtitle1 text-weight-medium">
            <q-icon name="keyboard" class="q-mr-sm" />
            Клавиатура
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md q-pa-sm-xs">
          <!-- Переключатель типа отображения -->
          <q-toggle
            v-model="isInlineKeyboard"
            label="Inline отображение"
            @update:model-value="updateKeyboardType"
            color="primary"
            class="q-mb-md"
          />

          <div class="text-caption text-grey-7 q-mb-md">
            {{ keyboardDescription }}
          </div>

          <!-- Кнопки клавиатуры -->
          <div class="q-mb-md">
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2 text-weight-medium">Кнопки</div>
              <q-space />
              <q-btn
                size="sm"
                icon="add"
                label="Добавить"
                color="primary"
                @click="addButton"
                :disable="!canAddButton()"
                unelevated
                dense
                class="text-caption"
              />
            </div>

            <!-- Список кнопок -->
            <q-list
              v-if="localMessage.keyboard?.buttons.length"
              separator
              bordered
              class="rounded-borders q-gutter-md"
            >
              <q-item
                v-for="(button, buttonIndex) in localMessage.keyboard.buttons"
                :key="buttonIndex"
                dense
                class="q-pa-sm"
              >
                <q-item-section>
                  <button-form
                    :button="button"
                    :button-index="buttonIndex"
                    :channel-type="localMessage.channelType"
                    :keyboard-type="localMessage.keyboard?.displayType"
                    :channel-limits="channelLimits"
                    @update="updateButton"
                    @remove="removeButton"
                  />
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center q-pa-md text-grey-6 bg-grey-1 rounded-borders">
              <q-icon name="keyboard_hide" size="2rem" class="q-mb-sm" />
              <div class="text-caption">Нет добавленных кнопок</div>
            </div>
          </div>

          <!-- Ограничения для текущего канала -->
          <q-card v-if="channelLimits" flat bordered class="bg-blue-1">
            <q-card-section class="q-pa-sm">
              <div class="text-caption text-primary text-weight-bold q-mb-xs">
                <q-icon name="info" class="q-mr-xs" />
                Ограничения для {{ getChannelName() }}:
              </div>
              <div v-if="currentKeyboardLimits" class="text-caption text-grey-8">
                <div>
                  • Максимум кнопок: {{ currentKeyboardLimits.maxButtons || 'неограничено' }}
                </div>
                <div v-if="currentKeyboardLimits.maxButtonTextLength">
                  • Максимум символов в кнопке: {{ currentKeyboardLimits.maxButtonTextLength }}
                </div>
                <div v-if="currentKeyboardLimits.supportsUrlButtons === false">
                  • Кнопки-ссылки не поддерживаются
                </div>
                <div v-if="currentKeyboardLimits.maxUrlButtons">
                  • Максимум кнопок-ссылок: {{ currentKeyboardLimits.maxUrlButtons }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import ButtonForm from './ButtonForm.vue';
  import type { ChannelLimits } from '../types/channel-limits';

  interface ChannelMessage {
    channelType: string;
    text: string;
    senderAddress?: string;
    keyboard?: Keyboard;
    order: number;
  }

  interface Keyboard {
    displayType: string;
    buttons: Button[];
  }

  interface Button {
    text: string;
    type: string;
    url?: string;
    quickReplyText?: string;
  }

  const props = defineProps<{
    message: ChannelMessage;
    channelLimits: ChannelLimits | undefined;
    index: number;
  }>();

  const emit = defineEmits<{
    update: [index: number, message: ChannelMessage];
    moveUp: [index: number];
    moveDown: [index: number];
  }>();

  const localMessage = ref<ChannelMessage>({ ...props.message });

  watch(
    () => props.message,
    (newMessage) => {
      localMessage.value = { ...newMessage };
    },
    { deep: true },
  );

  const isInlineKeyboard = ref(localMessage.value.keyboard?.displayType === 'inline');

  const supportsKeyboard = () => {
    if (!props.channelLimits) return false;

    const standardSupported = props.channelLimits.standardKeyboard?.supported !== false;
    const inlineSupported = props.channelLimits.inlineKeyboard?.supported !== false;

    return standardSupported || inlineSupported;
  };

  const getCurrentKeyboardLimits = () => {
    if (!props.channelLimits) return null;

    return isInlineKeyboard.value
      ? props.channelLimits.inlineKeyboard
      : props.channelLimits.standardKeyboard;
  };

  const currentKeyboardLimits = computed(() => getCurrentKeyboardLimits());

  const keyboardDescription = computed(() => {
    const limits = getCurrentKeyboardLimits();
    if (!limits) return '';

    const type = isInlineKeyboard.value ? 'Inline' : 'Стандартная';
    return `${type} клавиатура - отображается ${
      isInlineKeyboard.value ? 'внутри сообщения' : 'под полем ввода'
    }`;
  });

  const getTextLimit = () => {
    return props.channelLimits?.textMaxLength || 4096;
  };

  const getTextHint = () => {
    const limit = getTextLimit();
    return `Максимум ${limit} символов`;
  };

  const getSenderAddressHint = () => {
    const hints = {
      vkontakte: 'ID группы или пользователя ВКонтакте (например: -123456789)',
      telegram: 'Username или ID телеграм-бота (например: @mybot или 123456789)',
      whatsapp: 'Номер телефона в международном формате (например: +79001234567)',
      sms: 'Номер телефона отправителя (например: +79001234567)',
    };
    return (
      hints[localMessage.value.channelType as keyof typeof hints] ||
      'Адрес отправителя (телефон или аккаунт)'
    );
  };

  const getChannelName = () => {
    const names = {
      vkontakte: 'ВКонтакте',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
    };
    return (
      names[localMessage.value.channelType as keyof typeof names] || localMessage.value.channelType
    );
  };

  const canAddButton = () => {
    if (!localMessage.value.keyboard) return true;

    const limits = getCurrentKeyboardLimits();
    if (!limits || !limits.maxButtons) return true;

    return localMessage.value.keyboard.buttons.length < limits.maxButtons;
  };

  const updateMessage = () => {
    emit('update', props.index, localMessage.value);
  };

  const updateKeyboardType = (isInline: boolean) => {
    if (!localMessage.value.keyboard) {
      localMessage.value.keyboard = {
        displayType: isInline ? 'inline' : 'standard',
        buttons: [],
      };
    } else {
      localMessage.value.keyboard.displayType = isInline ? 'inline' : 'standard';
    }
    updateMessage();
  };

  const addButton = () => {
    if (!localMessage.value.keyboard) {
      localMessage.value.keyboard = {
        displayType: isInlineKeyboard.value ? 'inline' : 'standard',
        buttons: [],
      };
    }

    localMessage.value.keyboard.buttons.push({
      text: '',
      type: 'quick_reply',
    });

    updateMessage();
  };

  const updateButton = (buttonIndex: number, updatedButton: Button) => {
    if (localMessage.value.keyboard) {
      localMessage.value.keyboard.buttons[buttonIndex] = updatedButton;
      updateMessage();
    }
  };

  const removeButton = (buttonIndex: number) => {
    if (localMessage.value.keyboard) {
      localMessage.value.keyboard.buttons.splice(buttonIndex, 1);
      updateMessage();
    }
  };
</script>

<style lang="scss" scoped>
  .channel-message-form {
    &__input {
      .q-field__control {
        min-height: 48px;
      }
    }

    &__textarea {
      .q-field__control {
        min-height: 80px;
      }
    }
  }

  .keyboard-settings {
    .q-card-section {
      &:first-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  }

  // Мобильные стили только для экранов меньше 600px
  @media (max-width: 599px) {
    .channel-message-form {
      &__input,
      &__textarea {
        .q-field__control {
          min-height: 44px;
        }
      }

      &__textarea {
        .q-field__control {
          min-height: 72px;
        }
      }
    }

    .keyboard-settings {
      .q-card-section {
        padding: 8px 12px;
      }
    }
  }

  // Стили для экранов меньше 600px
  @media (max-width: 599px) {
    .channel-message-form {
      .q-gutter-md > * + * {
        margin-top: 12px;
      }
    }
  }
</style>
