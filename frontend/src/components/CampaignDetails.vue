<template>
  <q-card v-if="campaign">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ campaign.name }}</div>
          <div class="text-caption">{{ campaign.description || 'Описание не указано' }}</div>
        </div>
        <div class="col-auto">
          <q-chip
            :color="campaign.isActive ? 'positive' : 'grey'"
            :text-color="campaign.isActive ? 'white' : 'black'"
            :icon="campaign.isActive ? 'check_circle' : 'pause_circle'"
            size="sm"
          >
            {{ campaign.isActive ? 'Активна' : 'Неактивна' }}
          </q-chip>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">📊 Общая информация</div>

      <div class="row q-gutter-md">
        <q-card flat bordered class="col-12 col-md-5 q-pa-sm">
          <div class="text-subtitle2 text-primary q-mb-sm">📈 Статистика</div>
          <q-list dense>
            <q-item>
              <q-item-section side>
                <q-icon name="campaign" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>ID кампании</q-item-label>
                <q-item-label caption>{{ campaign._id || 'Не сохранена' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon name="share" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Количество каналов</q-item-label>
                <q-item-label caption>{{ campaign.messages.length }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-icon name="keyboard" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Всего кнопок</q-item-label>
                <q-item-label caption>{{ getTotalButtons() }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card flat bordered class="col-12 col-md-6 q-pa-sm">
          <div class="text-subtitle2 text-primary q-mb-sm">📋 Краткий обзор каналов</div>
          <div class="row q-gutter-xs">
            <q-chip
              v-for="message in campaign.messages"
              :key="message.channelType"
              :color="getChannelColor(message.channelType)"
              text-color="white"
              :icon="getChannelIcon(message.channelType)"
              size="sm"
            >
              {{ getChannelLabel(message.channelType) }}
              <q-badge
                v-if="message.keyboard?.buttons.length"
                color="white"
                text-color="primary"
                :label="message.keyboard.buttons.length"
                floating
              />
            </q-chip>
          </div>
        </q-card>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">📱 Настройки каналов</div>

      <q-list separator>
        <q-expansion-item
          v-for="message in campaign.messages"
          :key="message.channelType"
          :label="getChannelLabel(message.channelType)"
          :icon="getChannelIcon(message.channelType)"
          :header-class="`bg-${getChannelColor(message.channelType)} text-white`"
        >
          <q-card>
            <q-card-section>
              <!-- Информация о сообщении -->
              <div class="q-mb-md">
                <div class="text-subtitle1 q-mb-sm">💬 Текст сообщения</div>
                <q-card flat bordered class="q-pa-sm bg-grey-1">
                  <div class="text-body1">
                    {{ message.text || 'Текст не указан' }}
                  </div>
                  <div class="text-caption text-grey q-mt-sm">
                    Символов: {{ message.text?.length || 0 }} / {{ getTextLimit(message.channelType) }}
                  </div>
                </q-card>
              </div>

              <!-- Информация о клавиатуре -->
              <div v-if="message.keyboard?.buttons.length" class="q-mb-md">
                <div class="text-subtitle1 q-mb-sm">⌨️ Клавиатура</div>

                <div class="row items-center q-mb-sm">
                  <q-chip
                    :color="message.keyboard.displayType === 'inline' ? 'blue' : 'green'"
                    text-color="white"
                    size="sm"
                  >
                    {{ message.keyboard.displayType === 'inline' ? 'Inline' : 'Стандартная' }}
                  </q-chip>
                  <span class="q-ml-sm text-caption text-grey">
                    {{ message.keyboard.buttons.length }}
                    {{ getDeclension(message.keyboard.buttons.length, ['кнопка', 'кнопки', 'кнопок']) }}
                  </span>
                </div>

                <q-list dense bordered>
                  <q-item
                    v-for="(button, buttonIndex) in message.keyboard.buttons"
                    :key="buttonIndex"
                    dense
                  >
                    <q-item-section side>
                      <q-chip
                        :color="button.type === 'url' ? 'orange' : 'primary'"
                        text-color="white"
                        :icon="button.type === 'url' ? 'link' : 'chat'"
                        size="sm"
                      >
                        {{ button.type === 'url' ? 'URL' : 'Reply' }}
                      </q-chip>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ button.text }}</q-item-label>
                      <q-item-label caption v-if="button.type === 'url'">
                        🔗 {{ button.url }}
                      </q-item-label>
                      <q-item-label caption v-else-if="button.quickReplyText">
                        💬 {{ button.quickReplyText }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div v-else class="text-center q-pa-md text-grey">
                <q-icon name="keyboard_hide" size="2rem" class="q-mb-sm" />
                <div>Клавиатура не настроена</div>
              </div>

              <!-- Порядок отправки -->
              <div class="text-caption text-grey">
                <q-icon name="reorder" class="q-mr-xs" />
                Порядок отправки: {{ message.order + 1 }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>

    <!-- Действия -->
    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        color="primary"
        icon="edit"
        label="Редактировать"
        @click="emit('edit', campaign)"
        flat
      />
      <q-btn
        color="positive"
        icon="chat"
        label="Открыть чат"
        @click="emit('openChat', campaign)"
        flat
      />
      <q-btn
        color="negative"
        icon="delete"
        label="Удалить"
        @click="emit('delete', campaign)"
        flat
      />
    </q-card-actions>
  </q-card>

  <q-card v-else class="text-center q-pa-xl">
    <q-icon name="touch_app" size="4rem" color="grey-5" class="q-mb-md" />
    <div class="text-h6 text-grey">Выберите кампанию</div>
    <div class="text-body2 text-grey">Нажмите на кампанию в списке слева для просмотра деталей</div>
  </q-card>
</template>

<script setup lang="ts">
interface Campaign {
  _id?: string
  name: string
  description?: string
  messages: ChannelMessage[]
  isActive: boolean
}

interface ChannelMessage {
  channelType: string
  text: string
  keyboard?: Keyboard
  order: number
}

interface Keyboard {
  displayType: string
  buttons: Button[]
}

interface Button {
  text: string
  type: string
  url?: string
  quickReplyText?: string
}

const props = defineProps<{
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  edit: [campaign: Campaign]
  delete: [campaign: Campaign]
  openChat: [campaign: Campaign]
}>()

const getChannelColor = (channelType: string) => {
  const colors = {
    vkontakte: 'blue',
    telegram: 'light-blue',
    whatsapp: 'green',
    sms: 'orange',
  }
  return colors[channelType as keyof typeof colors] || 'grey'
}

const getChannelIcon = (channelType: string) => {
  const icons = {
    vkontakte: 'chat',
    telegram: 'telegram',
    whatsapp: 'chat',
    sms: 'sms',
  }
  return icons[channelType as keyof typeof icons] || 'chat'
}

const getChannelLabel = (channelType: string) => {
  const labels = {
    vkontakte: 'ВКонтакте',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
  }
  return labels[channelType as keyof typeof labels] || channelType
}

const getTextLimit = (channelType: string) => {
  const limits = {
    vkontakte: 4096,
    telegram: 4096,
    whatsapp: 1000,
    sms: 160,
  }
  return limits[channelType as keyof typeof limits] || 1000
}

const getTotalButtons = () => {
  if (!props.campaign) return 0
  return props.campaign.messages.reduce((total, message) => {
    return total + (message.keyboard?.buttons.length || 0)
  }, 0)
}

const getDeclension = (number: number, words: [string, string, string]) => {
  const cases = [2, 0, 1, 1, 1, 2]
  const index = number % 100 > 4 && number % 100 < 20
    ? 2
    : cases[Math.min(number % 10, 5)] || 2
  return words[index]
}
</script>

<style scoped>
.q-expansion-item__header {
  border-radius: 4px;
}
</style>
