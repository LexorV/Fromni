<template>
  <q-dialog v-model="showDialog" position="right" maximized>
    <q-card class="chat-card">
      <q-card-section class="chat-header bg-primary text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ campaign?.name }}</div>
            <div class="text-caption">{{ campaign?.description }}</div>
          </div>
          <q-btn flat round dense icon="close" @click="$emit('close')" />
        </div>
      </q-card-section>

      <!-- Выбор канала -->
      <q-card-section class="q-pa-md bg-grey-1">
        <div class="text-subtitle2 q-mb-sm">Выберите канал для отправки:</div>
        <div class="row q-gutter-sm">
          <q-chip
            v-for="message in campaign?.messages"
            :key="message.channelType"
            :color="
              selectedChannel?.channelType === message.channelType
                ? getChannelColor(message.channelType)
                : 'grey-3'
            "
            :text-color="selectedChannel?.channelType === message.channelType ? 'white' : 'black'"
            clickable
            :icon="getChannelIcon(message.channelType)"
            @click="selectChannel(message)"
          >
            {{ getChannelLabel(message.channelType) }}
          </q-chip>
        </div>
      </q-card-section>

      <!-- Область чата -->
      <q-card-section class="chat-content">
        <div v-if="selectedChannel" class="q-pa-md">
          <!-- История отправленных сообщений -->
          <div v-if="sentMessages.length" class="sent-messages q-mb-md">
            <div class="text-subtitle2 q-mb-sm">История отправки:</div>
            <q-list>
              <q-item v-for="(msg, index) in sentMessages" :key="index" dense>
                <q-item-section side>
                  <q-icon
                    :name="getChannelIcon(msg.channel)"
                    :color="getChannelColor(msg.channel)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ msg.text }}</q-item-label>
                  <q-item-label caption>{{ msg.timestamp.toLocaleTimeString() }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip size="sm" color="positive" text-color="white">Отправлено</q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Поле ввода сообщения с клавиатурой -->
          <div class="message-input-section">
            <!-- Объединенное поле ввода с inline клавиатурой -->
            <div
              v-if="
                selectedChannel.keyboard?.buttons.length &&
                selectedChannel.keyboard.displayType === 'inline'
              "
              class="inline-input-container"
            >
              <q-input
                v-model="messageText"
                placeholder="Введите ваше сообщение..."
                borderless
                autogrow
                :maxlength="getTextLimit()"
                @keyup.enter.ctrl="sendMessage"
                class="inline-input-field"
              >
                <template v-slot:append>
                  <q-btn
                    round
                    dense
                    flat
                    icon="send"
                    color="primary"
                    @click="sendMessage"
                    :disable="!messageText.trim() || !selectedChannel"
                  />
                </template>
              </q-input>

              <!-- Inline кнопки под текстом -->
              <div class="inline-buttons-bottom">
                <q-chip
                  v-for="(button, index) in selectedChannel.keyboard.buttons"
                  :key="index"
                  :color="button.type === 'url' ? 'blue' : 'primary'"
                  text-color="white"
                  clickable
                  :icon="button.type === 'url' ? 'link' : 'chat'"
                  @click="handleButtonClick(button)"
                  size="sm"
                >
                  {{ button.text }}
                </q-chip>
              </div>
            </div>

            <!-- Обычное поле ввода для стандартной клавиатуры или без кнопок -->
            <q-input
              v-else
              v-model="messageText"
              placeholder="Введите ваше сообщение..."
              outlined
              borderless
              autogrow
              :maxlength="getTextLimit()"
              @keyup.enter.ctrl="sendMessage"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  color="primary"
                  @click="sendMessage"
                  :disable="!messageText.trim() || !selectedChannel"
                />
              </template>
            </q-input>

            <!-- Стандартная клавиатура (под полем ввода) -->
            <div
              v-if="
                selectedChannel.keyboard?.buttons.length &&
                selectedChannel.keyboard.displayType === 'standard'
              "
              class="standard-keyboard-container q-mt-sm"
            >
              <div class="row q-gutter-xs">
                <q-btn
                  v-for="(button, index) in selectedChannel.keyboard.buttons"
                  :key="index"
                  :label="button.text"
                  :color="button.type === 'url' ? 'blue' : 'grey-8'"
                  :icon="button.type === 'url' ? 'link' : 'chat'"
                  size="sm"
                  @click="handleButtonClick(button)"
                  class="q-mb-xs"
                />
              </div>
            </div>

            <!-- Ограничения для текущего канала -->
          </div>
        </div>

        <div v-else class="text-center q-pa-xl text-grey">
          <q-icon name="touch_app" size="3rem" class="q-mb-md" />
          <div class="text-h6">Выберите канал для начала чата</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useQuasar } from 'quasar';

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

  interface SentMessage {
    text: string;
    channel: string;
    timestamp: Date;
  }

  const props = defineProps<{
    modelValue: boolean;
    campaign: Campaign | null;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
  }>();

  const $q = useQuasar();

  const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const selectedChannel = ref<ChannelMessage | null>(null);
  const messageText = ref('');
  const sentMessages = ref<SentMessage[]>([]);

  // Сброс состояния при смене кампании
  watch(
    () => props.campaign,
    () => {
      selectedChannel.value = null;
      messageText.value = '';
      sentMessages.value = [];
    },
  );

  const selectChannel = (message: ChannelMessage) => {
    selectedChannel.value = message;
    messageText.value = message.text; // Предзаполняем текстом из кампании
  };

  const getChannelColor = (channelType: string) => {
    const colors = {
      vkontakte: 'blue',
      telegram: 'light-blue',
      whatsapp: 'green',
      sms: 'orange',
    };
    return colors[channelType as keyof typeof colors] || 'grey';
  };

  const getChannelIcon = (channelType: string) => {
    const icons = {
      vkontakte: 'chat',
      telegram: 'telegram',
      whatsapp: 'chat',
      sms: 'sms',
    };
    return icons[channelType as keyof typeof icons] || 'chat';
  };

  const getChannelLabel = (channelType: string) => {
    const labels = {
      vkontakte: 'ВКонтакте',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
    };
    return labels[channelType as keyof typeof labels] || channelType;
  };

  const getTextLimit = () => {
    if (!selectedChannel.value) return 1000;

    const limits = {
      vkontakte: 4096,
      telegram: 4096,
      whatsapp: 1000,
      sms: 160,
    };

    return limits[selectedChannel.value.channelType as keyof typeof limits] || 1000;
  };

  const handleButtonClick = (button: Button) => {
    if (button.type === 'url' && button.url) {
      window.open(button.url, '_blank');
      showButtonNotification(button, 'Открыта ссылка');
    } else if (button.type === 'quick_reply') {
      const newText = button.quickReplyText || button.text;
      if (messageText.value.trim()) {
        messageText.value = messageText.value.trim() + ' ' + newText;
      } else {
        messageText.value = newText;
      }
      showButtonNotification(button, 'Текст добавлен в поле ввода');
    }
  };

  const showButtonNotification = (button: Button, action: string) => {
    $q.notify({
      message: `${action}: "${button.text}"`,
      color: 'positive',
      icon: button.type === 'url' ? 'link' : 'chat',
      timeout: 2000,
    });
  };

  const sendMessage = () => {
    if (!messageText.value.trim() || !selectedChannel.value) return;

    // Имитация отправки сообщения
    $q.notify({
      message: `Отправляется сообщение в ${getChannelLabel(selectedChannel.value.channelType)}: "${messageText.value}"`,
      color: 'info',
      icon: getChannelIcon(selectedChannel.value.channelType),
      timeout: 3000,
    });

    // Добавляем в историю
    sentMessages.value.unshift({
      text: messageText.value,
      channel: selectedChannel.value.channelType,
      timestamp: new Date(),
    });

    // Очищаем поле ввода
    messageText.value = '';

    // Уведомление об успешной отправке
    setTimeout(() => {
      $q.notify({
        message: 'Сообщение успешно отправлено!',
        color: 'positive',
        icon: 'check',
        timeout: 2000,
      });
    }, 1500);
  };
</script>

<style scoped>
  .chat-card {
    width: 100%;
    min-width: 40vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    @media (max-width: 600px) {
      width: 100vw;
      min-width: 100vw;
    }
  }

  .chat-header {
    flex-shrink: 0;
  }

  .chat-content {
    flex: 1;
    overflow-y: auto;
  }

  .sent-messages {
    max-height: 300px;
    overflow-y: auto;
  }

  .message-input-section {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }

  .inline-input-container {
    padding-left: 15px;
    padding-right: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    position: relative;
  }

  .inline-input-field {
    width: 100%;
  }

  .inline-input-field .q-field__control {
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }

  .inline-buttons-bottom {
    padding-bottom: 15px;
    border-radius: 0 0 8px 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .inline-buttons-bottom .q-chip {
    margin: 2px;
    font-size: 12px;
  }

  .standard-keyboard-container {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .standard-keyboard-container .q-btn {
    margin-right: 8px;
  }
</style>
