<template>
  <q-page class="q-pa-md">
    <!-- Заголовок с адаптивным размером -->
    <div class="text-h4 text-h5-xs q-mb-md text-weight-bold text-primary">
      <q-icon name="campaign" class="q-mr-sm" />
      <span class="gt-xs">Управление кампаниями</span>
      <span class="lt-sm">Кампании</span>
    </div>

    <!-- Мобильная версия с вкладками - только для экранов меньше 600px -->
    <div class="lt-sm">
      <q-tabs
        v-model="mobileTab"
        dense
        class="text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="list" label="Список" icon="list" />
        <q-tab
          name="details"
          label="Детали"
          icon="info"
          :disable="!selectedCampaign && !showForm"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="mobileTab" animated>
        <!-- Список кампаний для мобильных -->
        <q-tab-panel name="list" class="q-pa-none">
          <div class="q-pa-md">
            <q-btn
              color="primary"
              label="Создать кампанию"
              @click="createNewCampaign"
              class="q-mb-md full-width"
              icon="add"
              unelevated
            />

            <q-list v-if="campaigns.length > 0" separator bordered class="rounded-borders">
              <q-item
                v-for="(campaign, index) in campaigns"
                :key="campaign._id || `campaign-${index}`"
                clickable
                @click="selectCampaignMobile(campaign)"
                :class="{ 'bg-blue-1': selectedCampaign?._id === campaign._id }"
                class="q-py-md"
              >
                <q-item-section>
                  <q-item-label class="text-weight-medium text-subtitle1">
                    {{ campaign.name }}
                  </q-item-label>
                  <q-item-label caption lines="2" class="q-mt-xs">
                    {{ campaign.description || 'Нет описания' }}
                  </q-item-label>
                  <div class="row items-center q-mt-sm q-gutter-xs">
                    <q-chip
                      size="sm"
                      :color="campaign.isActive ? 'positive' : 'grey'"
                      text-color="white"
                      icon="radio_button_checked"
                    >
                      {{ campaign.isActive ? 'Активна' : 'Неактивна' }}
                    </q-chip>
                    <q-chip size="sm" color="blue-grey" text-color="white" icon="message">
                      {{ campaign.messages.length }} канал(ов)
                    </q-chip>
                  </div>
                </q-item-section>
                <q-item-section side>
                  <div class="column q-gutter-xs">
                    <q-btn
                      size="sm"
                      color="primary"
                      flat
                      round
                      icon="edit"
                      @click.stop="editCampaignMobile(campaign)"
                    >
                      <q-tooltip>Редактировать</q-tooltip>
                    </q-btn>
                    <q-btn
                      size="sm"
                      color="negative"
                      flat
                      round
                      icon="delete"
                      @click.stop="campaign._id && deleteCampaign(campaign._id)"
                    >
                      <q-tooltip>Удалить</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center q-pa-xl text-grey-6">
              <q-icon name="campaign" size="4rem" class="q-mb-md" />
              <div class="text-h6">Нет кампаний</div>
              <div class="text-body2">Создайте вашу первую кампанию</div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="details" class="q-pa-none">
          <div class="q-pa-md">
            <campaign-form
              v-if="showForm"
              :campaign="formCampaign"
              :channel-limits="channelLimits"
              @save="saveCampaign"
              @cancel="hideFormMobile"
            />

            <campaign-details
              v-else-if="selectedCampaign"
              :campaign="selectedCampaign"
              @edit="editCampaignMobile"
              @delete="confirmDeleteCampaign"
              @open-chat="openCampaignChat"
            />

            <div v-else class="text-center q-pa-xl text-grey-6">
              <q-icon name="info" size="3rem" class="q-mb-md" />
              <div class="text-h6">Выберите кампанию</div>
              <div class="text-body2">Перейдите в список и выберите кампанию для просмотра</div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Десктопная версия - только для экранов от 600px -->
    <div class="gt-xs">
      <div class="row q-col-gutter-md">
        <!-- Список кампаний -->
        <div class="col-12 col-lg-4">
          <q-card flat bordered class="full-height">
            <q-card-section class="bg-grey-1">
              <div class="text-h6 text-weight-medium">
                <q-icon name="list" class="q-mr-sm" />
                Список кампаний
              </div>
            </q-card-section>
            <q-card-section>
              <q-btn
                color="primary"
                label="Создать новую кампанию"
                @click="createNewCampaign"
                class="q-mb-md full-width"
                icon="add"
                unelevated
              />

              <q-list v-if="campaigns.length > 0" separator>
                <q-item
                  v-for="(campaign, index) in campaigns"
                  :key="campaign._id || `campaign-${index}`"
                  clickable
                  @click="selectCampaign(campaign)"
                  :class="{ 'bg-blue-1': selectedCampaign?._id === campaign._id }"
                  class="rounded-borders q-mb-xs"
                >
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ campaign.name }}</q-item-label>
                    <q-item-label caption>{{ campaign.description }}</q-item-label>
                    <q-item-label caption>
                      Каналов: {{ campaign.messages.length }} •
                      <q-chip
                        :color="campaign.isActive ? 'positive' : 'grey'"
                        size="xs"
                        text-color="white"
                      >
                        {{ campaign.isActive ? 'Активна' : 'Неактивна' }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="row q-gutter-xs">
                      <q-btn
                        size="sm"
                        color="primary"
                        flat
                        icon="edit"
                        @click.stop="editCampaign(campaign)"
                      >
                        <q-tooltip>Редактировать</q-tooltip>
                      </q-btn>
                      <q-btn
                        size="sm"
                        color="negative"
                        flat
                        icon="delete"
                        @click.stop="campaign._id && deleteCampaign(campaign._id)"
                      >
                        <q-tooltip>Удалить</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-else class="text-center q-pa-md text-grey">
                <q-icon name="campaign" size="3rem" class="q-mb-md" />
                <div>Нет созданных кампаний</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Детали кампании или форма -->
        <div class="col-12 col-lg-8">
          <campaign-form
            v-if="showForm"
            :campaign="formCampaign"
            :channel-limits="channelLimits"
            @save="saveCampaign"
            @cancel="hideForm"
          />

          <campaign-details
            v-else
            :campaign="selectedCampaign"
            @edit="editCampaign"
            @delete="confirmDeleteCampaign"
            @open-chat="openCampaignChat"
          />
        </div>
      </div>
    </div>

    <!-- Диалог чата -->
    <campaign-chat-dialog
      v-model="showChatDialog"
      :campaign="selectedCampaignForChat"
      @close="closeChatDialog"
    />
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  import CampaignForm from 'components/CampaignForm.vue';
  import CampaignDetails from 'components/CampaignDetails.vue';
  import CampaignChatDialog from 'components/CampaignChatDialog.vue';
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

  const $q = useQuasar();

  const campaigns = ref<Campaign[]>([]);
  const selectedCampaign = ref<Campaign | null>(null);
  const showForm = ref(false);
  const formCampaign = ref<Campaign>({
    name: '',
    description: '',
    messages: [],
    isActive: true,
  });
  const channelLimits = ref<AllChannelLimits>({});
  const showChatDialog = ref(false);
  const selectedCampaignForChat = ref<Campaign | null>(null);
  const mobileTab = ref('list');

  const loadCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      campaigns.value = response.data;
    } catch {
      $q.notify({
        color: 'negative',
        message: 'Ошибка загрузки кампаний',
        icon: 'error',
      });
    }
  };

  const loadChannelLimits = async () => {
    try {
      const response = await api.get('/campaigns/channel-limits');
      channelLimits.value = response.data;
    } catch {
      console.error('Ошибка загрузки ограничений каналов:');
    }
  };

  const createNewCampaign = () => {
    formCampaign.value = {
      name: '',
      description: '',
      messages: [],
      isActive: true,
    };
    showForm.value = true;
    // Для мобильных переключаем на вкладку деталей
    if ($q.screen.lt.sm) {
      mobileTab.value = 'details';
    }
  };

  const selectCampaign = (campaign: Campaign) => {
    selectedCampaign.value = campaign;
  };

  const editCampaign = (campaign: Campaign) => {
    formCampaign.value = { ...campaign };
    showForm.value = true;
  };

  const saveCampaign = async (campaign: Campaign) => {
    try {
      if (campaign._id) {
        await api.patch(`/campaigns/${campaign._id}`, campaign);
        $q.notify({
          color: 'positive',
          message: 'Кампания успешно обновлена',
          icon: 'check',
        });
      } else {
        // Создание новой кампании
        await api.post('/campaigns', campaign);
        $q.notify({
          color: 'positive',
          message: 'Кампания успешно создана',
          icon: 'check',
        });
      }

      hideForm();
      await loadCampaigns();

      if ($q.screen.lt.sm) {
        mobileTab.value = 'list';
      }
    } catch {
      $q.notify({
        color: 'negative',
        message: 'Ошибка сохранения кампании',
        icon: 'error',
      });
    }
  };

  const deleteCampaign = (campaignId: string) => {
    $q.dialog({
      title: 'Подтверждение',
      message: 'Вы уверены, что хотите удалить эту кампанию?',
      cancel: true,
      persistent: true,
    }).onOk(() => void performDeleteCampaign(campaignId));
  };

  const confirmDeleteCampaign = (campaign: Campaign) => {
    if (campaign._id) {
      deleteCampaign(campaign._id);
    }
  };

  const performDeleteCampaign = async (campaignId: string) => {
    try {
      await api.delete(`/campaigns/${campaignId}`);
      $q.notify({
        color: 'positive',
        message: 'Кампания успешно удалена',
        icon: 'check',
      });
      await loadCampaigns();
      if (selectedCampaign.value?._id === campaignId) {
        selectedCampaign.value = null;
      }

      if ($q.screen.lt.sm) {
        mobileTab.value = 'list';
      }
    } catch {
      $q.notify({
        color: 'negative',
        message: 'Ошибка удаления кампании',
        icon: 'error',
      });
    }
  };

  const hideForm = () => {
    showForm.value = false;
    formCampaign.value = {
      name: '',
      description: '',
      messages: [],
      isActive: true,
    };
  };

  const openCampaignChat = (campaign: Campaign) => {
    selectedCampaignForChat.value = campaign;
    showChatDialog.value = true;
  };

  const closeChatDialog = () => {
    selectedCampaignForChat.value = null;
    showChatDialog.value = false;
  };

  // Мобильные функции
  const selectCampaignMobile = (campaign: Campaign) => {
    selectedCampaign.value = campaign;
    mobileTab.value = 'details';
  };

  const editCampaignMobile = (campaign: Campaign) => {
    formCampaign.value = { ...campaign };
    showForm.value = true;
    mobileTab.value = 'details';
  };

  const hideFormMobile = () => {
    showForm.value = false;
    formCampaign.value = {
      name: '',
      description: '',
      messages: [],
      isActive: true,
    };
    mobileTab.value = 'list';
  };

  onMounted(() => {
    void loadCampaigns();
    void loadChannelLimits();
  });
</script>
<style scoped></style>
