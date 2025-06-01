<template>
  <q-card flat bordered class="campaign-form">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6 text-h6-xs">
        <q-icon name="edit" class="q-mr-sm" />
        {{ campaign._id ? 'Редактирование кампании' : 'Создание новой кампании' }}
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md q-pa-sm-xs">
      <q-form ref="campaignForm" @submit.prevent="handleSubmit" class="q-gutter-md">
        <!-- Основная информация о кампании -->
        <div class="row">
          <div class="input-container q-mb-md">
            <q-input
              ref="nameInput"
              v-model="localCampaign.name"
              label="Название кампании *"
              :rules="[(val) => !!val || 'Поле обязательно']"
              outlined
              dense
              class="campaign-form__input"
            />
          </div>

          <div class="input-container">
            <q-input
              ref="descriptionInput"
              v-model="localCampaign.description"
              label="Описание кампании"
              type="textarea"
              outlined
              :rows="3"
              class="campaign-form__input"
            />
          </div>
        </div>

        <!-- Выбор каналов -->
        <div class="q-mt-lg">
          <div class="text-h6 text-subtitle1-xs q-mb-md text-weight-medium">
            <q-icon name="settings_input_antenna" class="q-mr-sm" />
            Каналы
          </div>

          <q-select
            ref="channelsSelect"
            v-model="selectedChannels"
            :options="channelOptions"
            label="Выберите каналы"
            :rules="[(val) => (val && val.length > 0) || 'Выберите хотя бы один канал']"
            multiple
            outlined
            emit-value
            map-options
            @update:model-value="updateChannels"
            class="campaign-form__select"
            :display-value-html="true"
            behavior="menu"
          />
        </div>

        <!-- Настройка сообщений для каждого канала -->
        <div v-if="localCampaign.messages.length > 0" class="q-mt-lg">
          <div class="text-h6 text-subtitle1-xs q-mb-md text-weight-medium">
            <q-icon name="message" class="q-mr-sm" />
            Настройка сообщений
          </div>

          <!-- Мобильная версия с вкладками - только для экранов меньше 600px -->
          <div class="lt-sm">
            <q-tabs
              v-model="activeMessageTab"
              dense
              class="text-grey-7 bg-grey-1 rounded-borders"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
              inline-label
            >
              <q-tab
                v-for="message in localCampaign.messages"
                :key="message.channelType"
                :name="message.channelType"
                :icon="getChannelIcon(message.channelType)"
                :label="getChannelLabel(message.channelType)"
                class="text-caption"
              />
            </q-tabs>

            <q-tab-panels v-model="activeMessageTab" animated class="q-mt-md">
              <q-tab-panel
                v-for="(message, index) in localCampaign.messages"
                :key="message.channelType"
                :name="message.channelType"
                :data-channel="message.channelType"
                class="q-pa-none"
              >
                <q-card flat bordered>
                  <q-card-section class="q-pa-sm">
                    <div class="row items-center q-mb-sm">
                      <q-icon :name="getChannelIcon(message.channelType)" class="q-mr-sm" />
                      <span class="text-weight-medium">{{
                        getChannelLabel(message.channelType)
                      }}</span>
                      <q-space />
                      <q-btn
                        round
                        dense
                        flat
                        icon="delete"
                        color="negative"
                        @click="removeChannel(message.channelType)"
                        :disable="localCampaign.messages.length <= 1"
                        size="sm"
                      >
                        <q-tooltip>
                          {{
                            localCampaign.messages.length <= 1
                              ? 'Нельзя удалить последний канал'
                              : 'Удалить канал'
                          }}
                        </q-tooltip>
                      </q-btn>
                    </div>

                    <channel-message-form
                      :message="message"
                      :channel-limits="channelLimits[message.channelType]"
                      :index="index"
                      @update="updateMessage"
                      @move-up="moveMessageUp"
                      @move-down="moveMessageDown"
                    />
                  </q-card-section>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </div>

          <!-- Десктопная версия с аккордеоном - только для экранов от 600px -->
          <q-list separator class="gt-xs">
            <q-expansion-item
              v-for="(message, index) in localCampaign.messages"
              :key="message.channelType"
              :label="getChannelLabel(message.channelType)"
              :icon="getChannelIcon(message.channelType)"
              :data-channel="message.channelType"
              default-opened
              header-class="text-weight-medium"
            >
              <template v-slot:header>
                <q-item-section side>
                  <q-icon :name="getChannelIcon(message.channelType)" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{
                    getChannelLabel(message.channelType)
                  }}</q-item-label>
                  <q-item-label caption>
                    {{
                      message.text
                        ? `${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}`
                        : 'Сообщение не настроено'
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    flat
                    icon="delete"
                    color="negative"
                    @click.stop="removeChannel(message.channelType)"
                    :disable="localCampaign.messages.length <= 1"
                    class="q-mr-sm"
                  >
                    <q-tooltip>
                      {{
                        localCampaign.messages.length <= 1
                          ? 'Нельзя удалить последний канал'
                          : 'Удалить канал'
                      }}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </template>

              <q-card flat>
                <q-card-section>
                  <channel-message-form
                    :message="message"
                    :channel-limits="channelLimits[message.channelType]"
                    :index="index"
                    @update="updateMessage"
                    @move-up="moveMessageUp"
                    @move-down="moveMessageDown"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

        <!-- Кнопки действий -->
        <div class="q-mt-lg">
          <!-- Десктопные кнопки - только для экранов от 600px -->
          <div class="row q-gutter-md gt-xs">
            <q-btn type="submit" color="primary" label="Сохранить" icon="save" unelevated />
            <q-btn color="grey" label="Отмена" @click="$emit('cancel')" flat />
          </div>

          <!-- Мобильные кнопки - только для экранов меньше 600px -->
          <div class="column q-gutter-sm lt-sm">
            <q-btn
              type="submit"
              color="primary"
              label="Сохранить"
              icon="save"
              class="full-width"
              unelevated
            />
            <q-btn color="grey" label="Отмена" @click="$emit('cancel')" class="full-width" flat />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useQuasar } from 'quasar';
  import ChannelMessageForm from './ChannelMessageForm.vue';
  import type { AllChannelLimits } from '../types/channel-limits';

  interface Campaign {
    _id?: string;
    name: string;
    description?: string;
    messages: ChannelMessage[];
    isActive: boolean;
  }

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
    campaign: Campaign;
    channelLimits: AllChannelLimits;
  }>();

  const emit = defineEmits<{
    save: [campaign: Campaign];
    cancel: [];
  }>();

  const localCampaign = ref<Campaign>({ ...props.campaign });

  const $q = useQuasar();

  const campaignForm = ref();
  const nameInput = ref();
  const descriptionInput = ref();
  const channelsSelect = ref();

  const channelOptions = [
    { label: 'ВКонтакте', value: 'vkontakte', icon: 'chat' },
    { label: 'Telegram', value: 'telegram', icon: 'telegram' },
    { label: 'WhatsApp', value: 'whatsapp', icon: 'chat' },
    { label: 'SMS', value: 'sms', icon: 'sms' },
  ];

  const selectedChannels = ref<string[]>(localCampaign.value.messages.map((m) => m.channelType));

  const activeMessageTab = ref(
    localCampaign.value.messages.length > 0 && localCampaign.value.messages[0]
      ? localCampaign.value.messages[0].channelType
      : 'vkontakte',
  );

  watch(
    () => localCampaign.value.messages,
    (newMessages) => {
      if (
        newMessages.length > 0 &&
        newMessages[0] &&
        !newMessages.find((m) => m.channelType === activeMessageTab.value)
      ) {
        activeMessageTab.value = newMessages[0].channelType;
      }
    },
    { deep: true },
  );

  watch(
    () => props.campaign,
    (newCampaign) => {
      const hasLocalChanges =
        localCampaign.value.name !== props.campaign.name ||
        localCampaign.value.description !== (props.campaign.description || '');

      if (!hasLocalChanges) {
        localCampaign.value = { ...newCampaign };
      } else {
        localCampaign.value.messages = [...newCampaign.messages];
        if (newCampaign._id) {
          localCampaign.value._id = newCampaign._id;
        }
        localCampaign.value.isActive = newCampaign.isActive;
      }

      selectedChannels.value = localCampaign.value.messages.map((m) => m.channelType);
    },
    { deep: true },
  );

  const updateChannels = (channels: string[]) => {
    const currentChannels = localCampaign.value.messages.map((m) => m.channelType);

    const existingMessages = [...localCampaign.value.messages];

    channels.forEach((channel) => {
      if (!currentChannels.includes(channel)) {
        existingMessages.push({
          channelType: channel,
          text: '',
          senderAddress: '',
          order: existingMessages.length,
          keyboard: {
            displayType: 'standard',
            buttons: [],
          },
        });
      }
    });

    const filteredMessages = existingMessages.filter((message) =>
      channels.includes(message.channelType),
    );

    filteredMessages.forEach((message, index) => {
      message.order = index;
    });

    localCampaign.value.messages = filteredMessages;
  };

  const updateMessage = (index: number, updatedMessage: ChannelMessage) => {
    localCampaign.value.messages[index] = updatedMessage;
  };

  const moveMessageUp = (index: number) => {
    if (index > 0 && index < localCampaign.value.messages.length) {
      const messages = [...localCampaign.value.messages];
      const current = messages[index];
      const previous = messages[index - 1];
      if (current && previous) {
        messages[index - 1] = current;
        messages[index] = previous;
        messages.forEach((msg, idx) => (msg.order = idx));
        localCampaign.value.messages = messages;
      }
    }
  };

  const moveMessageDown = (index: number) => {
    if (index >= 0 && index < localCampaign.value.messages.length - 1) {
      const messages = [...localCampaign.value.messages];
      const current = messages[index];
      const next = messages[index + 1];
      if (current && next) {
        messages[index] = next;
        messages[index + 1] = current;
        messages.forEach((msg, idx) => (msg.order = idx));
        localCampaign.value.messages = messages;
      }
    }
  };

  const getChannelLabel = (channelType: string) => {
    const option = channelOptions.find((opt) => opt.value === channelType);
    return option?.label || channelType;
  };

  const getChannelIcon = (channelType: string) => {
    const option = channelOptions.find((opt) => opt.value === channelType);
    return option?.icon || 'chat';
  };

  const handleSubmit = () => {

    if (!localCampaign.value.name || localCampaign.value.name.trim() === '') {
      $q.notify({
        message: 'Заполните название кампании',
        color: 'negative',
        icon: 'error',
        timeout: 3000,
      });
      return;
    }

    if (
      !selectedChannels.value ||
      selectedChannels.value.length === 0 ||
      !localCampaign.value.messages ||
      localCampaign.value.messages.length === 0
    ) {
      $q.notify({
        message: 'Выберите хотя бы один канал',
        color: 'negative',
        icon: 'error',
        timeout: 3000,
      });
      return;
    }

    for (const message of localCampaign.value.messages) {
      if (message.keyboard?.buttons) {
        for (let i = 0; i < message.keyboard.buttons.length; i++) {
          const button = message.keyboard.buttons[i];

          if (!button) continue;

          const channelName = getChannelLabel(message.channelType);

          if (!button.text || button.text.trim() === '') {
            $q.notify({
              message: `Заполните текст кнопки в канале "${channelName}"`,
              color: 'negative',
              icon: 'error',
              timeout: 3000,
            });
            return;
          }

          if (button.type === 'url' && (!button.url || button.url.trim() === '')) {
            $q.notify({
              message: `Заполните URL кнопки в канале "${channelName}"`,
              color: 'negative',
              icon: 'error',
              timeout: 3000,
            });
            return;
          }

          if (
            button.type === 'quick_reply' &&
            (!button.quickReplyText || button.quickReplyText.trim() === '')
          ) {
            $q.notify({
              message: `Заполните текст быстрого ответа кнопки в канале "${channelName}"`,
              color: 'negative',
              icon: 'error',
              timeout: 3000,
            });
            return;
          }
        }
      }
    }

    emit('save', localCampaign.value);
  };

  const removeChannel = (channelType: string) => {
    if (localCampaign.value.messages.length <= 1) {
      $q.notify({
        message: 'Нельзя удалить последний канал. Кампания должна содержать хотя бы один канал.',
        color: 'warning',
        icon: 'warning',
        timeout: 3000,
      });
      return;
    }

    const channelLabel = getChannelLabel(channelType);

    $q.dialog({
      title: 'Подтверждение удаления',
      message: `Вы уверены, что хотите удалить канал "${channelLabel}"? Все настройки для этого канала будут потеряны.`,
      cancel: {
        label: 'Отмена',
        color: 'grey',
        flat: true,
      },
      ok: {
        label: 'Удалить',
        color: 'negative',
      },
      persistent: true,
    }).onOk(() => {
      localCampaign.value.messages = localCampaign.value.messages.filter(
        (m) => m.channelType !== channelType,
      );

      selectedChannels.value = selectedChannels.value.filter((channel) => channel !== channelType);

      localCampaign.value.messages.forEach((message, index) => {
        message.order = index;
      });

      $q.notify({
        message: `Канал "${channelLabel}" был удален`,
        color: 'positive',
        icon: 'check',
        timeout: 2000,
      });
    });
  };
</script>

<style lang="scss" scoped>
  .campaign-form {
    &__input {
      .q-field__control {
        min-height: 48px;
      }
    }

    &__select {
      .q-field__control {
        min-height: 48px;
      }
    }

    .input-container {
      width: 100%;
    }
  }

  // Мобильные стили только для экранов меньше 600px
  @media (max-width: 599px) {
    .campaign-form {
      .q-card-section {
        padding: 12px;
      }

      &__input,
      &__select {
        .q-field__control {
          min-height: 44px;
        }
      }

      .q-expansion-item {
        .q-item {
          padding: 8px 12px;
        }
      }
    }
  }
</style>
