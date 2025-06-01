<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Система управления кампаниями</div>

    <div class="row q-gutter-md">
      <!-- Список активных кампаний -->
      <div class="campaign-section">
        <q-card>
          <q-card-section>
            <div class="text-h6">Активные кампании</div>
            <div class="text-caption text-grey">Нажмите на кампанию для открытия чата</div>
          </q-card-section>
          <q-card-section>
            <div v-if="campaigns.length > 0" class="row q-gutter-md">
              <q-card
                v-for="(campaign, index) in campaigns"
                :key="campaign._id || `campaign-${index}`"
                class="col-md-5 col-lg-3 cursor-pointer campaign-card"
                clickable
                @click="openCampaignChat(campaign)"
                bordered
              >
                <q-card-section>
                  <div class="text-h6">{{ campaign.name }}</div>
                  <div class="text-caption text-grey q-mb-sm">{{ campaign.description }}</div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      v-for="message in campaign.messages"
                      :key="message.channelType"
                      :color="getChannelColor(message.channelType)"
                      text-color="white"
                      size="sm"
                      :icon="getChannelIcon(message.channelType)"
                    >
                      {{ getChannelLabel(message.channelType) }}
                    </q-chip>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div v-else class="text-center q-pa-xl text-grey">
              <q-icon name="campaign" size="4rem" class="q-mb-md" />
              <div class="text-h6">Нет активных кампаний</div>
              <div class="text-body2 q-mb-md">Создайте свою первую кампанию</div>
              <q-btn
                color="primary"
                label="Создать кампанию"
                icon="add"
                to="/campaigns"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Диалог чата -->
    <campaign-chat-dialog
      v-model="showChatDialog"
      :campaign="selectedCampaign"
      @close="closeChatDialog"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CampaignChatDialog from 'components/CampaignChatDialog.vue'

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

const $q = useQuasar()

const campaigns = ref<Campaign[]>([])
const showChatDialog = ref(false)
const selectedCampaign = ref<Campaign | null>(null)

const loadCampaigns = async () => {
  try {
    const response = await api.get('/campaigns')
    campaigns.value = response.data.filter((c: Campaign) => c.isActive)
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Ошибка загрузки кампаний',
      icon: 'error',
    })
  }
}

const openCampaignChat = (campaign: Campaign) => {
  selectedCampaign.value = campaign
  showChatDialog.value = true
}

const closeChatDialog = () => {
  showChatDialog.value = false
  selectedCampaign.value = null
}

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

onMounted(() => {
  void loadCampaigns()
})
</script>

<style scoped>
.campaign-section {
  width: 100%;
}

.campaign-card {
  transition: all 0.3s ease;
}

.campaign-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
