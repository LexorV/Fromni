<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg text-center">📚 Документация системы управления кампаниями</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-3">
        <!-- Меню навигации -->
        <q-card flat bordered class="sticky-menu">
          <q-card-section>
            <div class="text-h6">Содержание</div>
          </q-card-section>
          <q-list>
            <q-item clickable @click="scrollTo('overview')">
              <q-item-section>
                <q-item-label>Обзор системы</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('getting-started')">
              <q-item-section>
                <q-item-label>Начало работы</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('creating-campaigns')">
              <q-item-section>
                <q-item-label>Создание кампаний</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('channel-settings')">
              <q-item-section>
                <q-item-label>Настройка каналов</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('keyboard-setup')">
              <q-item-section>
                <q-item-label>Настройка клавиатур</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('chat-interface')">
              <q-item-section>
                <q-item-label>Интерфейс чата</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('channel-limits')">
              <q-item-section>
                <q-item-label>Ограничения каналов</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="scrollTo('troubleshooting')">
              <q-item-section>
                <q-item-label>Решение проблем</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-lg-9">
        <!-- Основное содержание -->
        <div class="documentation-content">

          <!-- Обзор системы -->
          <section id="overview" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">🎯 Обзор системы</h2>
            <q-card flat bordered class="q-pa-md">
              <p class="text-body1">
                Система управления кампаниями позволяет создавать, настраивать и управлять маркетинговыми кампаниями
                для различных каналов связи. Поддерживаются следующие платформы:
              </p>
              <div class="row q-gutter-md q-mt-md">
                <q-chip color="blue" text-color="white" icon="chat">ВКонтакте</q-chip>
                <q-chip color="light-blue" text-color="white" icon="telegram">Telegram</q-chip>
                <q-chip color="green" text-color="white" icon="chat">WhatsApp</q-chip>
                <q-chip color="orange" text-color="white" icon="sms">SMS</q-chip>
              </div>
              <p class="text-body1 q-mt-md">
                Основные возможности:
              </p>
              <ul class="text-body1">
                <li>Создание многоканальных кампаний</li>
                <li>Настройка интерактивных клавиатур</li>
                <li>Тестирование сообщений в режиме реального времени</li>
                <li>Соблюдение ограничений каждой платформы</li>
              </ul>
            </q-card>
          </section>

          <!-- Начало работы -->
          <section id="getting-started" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">🚀 Начало работы</h2>
            <q-card flat bordered class="q-pa-md">
              <ol class="text-body1">
                <li class="q-mb-sm">
                  <strong>Главная страница:</strong> Здесь отображаются все активные кампании.
                  Нажмите на кампанию для открытия чата.
                </li>
                <li class="q-mb-sm">
                  <strong>Создание кампании:</strong> Перейдите в раздел "Кампании" через меню
                  или кнопку "Создать кампанию" на главной странице.
                </li>
                <li class="q-mb-sm">
                  <strong>Тестирование:</strong> После создания кампании используйте чат для
                  тестирования сообщений и клавиатур.
                </li>
              </ol>
            </q-card>
          </section>

          <!-- Создание кампаний -->
          <section id="creating-campaigns" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">📝 Создание кампаний</h2>
            <q-card flat bordered class="q-pa-md">
              <h3 class="text-h6 q-mb-md">Шаг 1: Основная информация</h3>
              <ul class="text-body1 q-mb-md">
                <li><strong>Название:</strong> Укажите понятное название кампании</li>
                <li><strong>Описание:</strong> Добавьте краткое описание (опционально)</li>
                <li><strong>Статус:</strong> Активируйте кампанию для отображения на главной странице</li>
              </ul>

              <h3 class="text-h6 q-mb-md">Шаг 2: Выбор каналов</h3>
              <p class="text-body1 q-mb-md">
                Выберите один или несколько каналов для кампании. Каждый канал будет иметь
                отдельные настройки сообщений и клавиатур.
              </p>

              <q-banner class="bg-info text-white q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                <strong>Совет:</strong> Начните с одного канала для изучения системы,
                затем добавляйте дополнительные каналы.
              </q-banner>
            </q-card>
          </section>

          <!-- Настройка каналов -->
          <section id="channel-settings" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">⚙️ Настройка каналов</h2>
            <q-card flat bordered class="q-pa-md">
              <p class="text-body1 q-mb-md">
                Для каждого выбранного канала необходимо настроить:
              </p>

              <h3 class="text-h6 q-mb-md">Текст сообщения</h3>
              <ul class="text-body1 q-mb-md">
                <li>Введите текст, который будет отправлен пользователям</li>
                <li>Соблюдайте лимиты символов для каждого канала</li>
                <li>Используйте эмодзи для привлечения внимания</li>
              </ul>

              <h3 class="text-h6 q-mb-md">Порядок сообщений</h3>
              <p class="text-body1 q-mb-md">
                Используйте кнопки ↑↓ для изменения порядка отправки сообщений по каналам.
              </p>
            </q-card>
          </section>

          <!-- Настройка клавиатур -->
          <section id="keyboard-setup" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">⌨️ Настройка клавиатур</h2>
            <q-card flat bordered class="q-pa-md">
              <h3 class="text-h6 q-mb-md">Типы клавиатур</h3>

              <div class="row q-gutter-md q-mb-md">
                <q-card flat bordered class="col-12 col-md-5 q-pa-sm">
                  <div class="text-subtitle1 text-primary">📱 Стандартная клавиатура</div>
                  <p class="text-body2">
                    Отображается под полем ввода сообщения. Подходит для основных команд и навигации.
                  </p>
                  <div class="bg-grey-2 q-pa-sm q-mt-sm rounded-borders">
                    <div class="text-caption">Пример отображения:</div>
                    <div class="q-mt-xs">
                      <q-btn size="sm" label="🛍 Товары" class="q-mr-xs q-mb-xs" />
                      <q-btn size="sm" label="💬 Общение" class="q-mr-xs q-mb-xs" />
                      <q-btn size="sm" label="🌐 Сайт" class="q-mr-xs q-mb-xs" />
                    </div>
                  </div>
                </q-card>

                <q-card flat bordered class="col-12 col-md-5 q-pa-sm">
                  <div class="text-subtitle1 text-primary">💬 Inline клавиатура</div>
                  <p class="text-body2">
                    Отображается внутри сообщения под текстом. Более компактная и интегрированная.
                  </p>
                  <div class="bg-grey-2 q-pa-sm q-mt-sm rounded-borders">
                    <div class="text-caption">Пример отображения:</div>
                    <div class="bg-white q-pa-sm q-mt-xs rounded-borders">
                      <div class="text-body2 q-mb-xs">Добро пожаловать!</div>
                      <q-chip size="sm" color="primary" text-color="white" label="📋 Каталог" class="q-mr-xs" />
                      <q-chip size="sm" color="blue" text-color="white" label="🔗 Сайт" />
                    </div>
                  </div>
                </q-card>
              </div>

              <h3 class="text-h6 q-mb-md">Типы кнопок</h3>
              <q-list bordered>
                <q-item>
                  <q-item-section side>
                    <q-chip color="primary" text-color="white" icon="chat" size="sm">Quick Reply</q-chip>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Быстрый ответ</q-item-label>
                    <q-item-label caption>
                      При нажатии добавляет заданный текст в поле ввода
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section side>
                    <q-chip color="blue" text-color="white" icon="link" size="sm">URL</q-chip>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Ссылка</q-item-label>
                    <q-item-label caption>
                      Открывает указанную ссылку в новой вкладке
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </section>

          <!-- Интерфейс чата -->
          <section id="chat-interface" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">💬 Интерфейс чата</h2>
            <q-card flat bordered class="q-pa-md">
              <h3 class="text-h6 q-mb-md">Использование чата</h3>
              <ol class="text-body1 q-mb-md">
                <li><strong>Выбор канала:</strong> Нажмите на желаемый канал в верхней части</li>
                <li><strong>Предпросмотр:</strong> Сообщение и клавиатура отобразятся согласно настройкам</li>
                <li><strong>Тестирование кнопок:</strong> Нажимайте на кнопки для проверки их работы</li>
                <li><strong>Отправка сообщений:</strong> Введите текст и нажмите Enter или кнопку отправки</li>
              </ol>

              <h3 class="text-h6 q-mb-md">Горячие клавиши</h3>
              <q-list dense>
                <q-item>
                  <q-item-section side>
                    <q-chip outline size="sm">Ctrl + Enter</q-chip>
                  </q-item-section>
                  <q-item-section>Отправить сообщение</q-item-section>
                </q-item>
              </q-list>

              <h3 class="text-h6 q-mb-md q-mt-md">История сообщений</h3>
              <p class="text-body1">
                Все отправленные сообщения сохраняются в истории с отметкой времени и канала отправки.
              </p>
            </q-card>
          </section>

          <!-- Ограничения каналов -->
          <section id="channel-limits" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">📊 Ограничения каналов</h2>
            <q-card flat bordered class="q-pa-md">
              <p class="text-body1 q-mb-md">
                Каждый канал имеет свои технические ограничения:
              </p>

              <div class="row q-gutter-md">
                <q-card flat bordered class="col-12 col-lg-5 q-pa-sm">
                  <div class="row items-center q-mb-sm">
                    <q-chip color="blue" text-color="white" icon="chat" size="sm">ВКонтакте</q-chip>
                  </div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Текст: до 4096 символов</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Стандартная клавиатура: до 40 кнопок</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Inline клавиатура: до 10 кнопок</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Поддержка URL кнопок: ✅</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>

                <q-card flat bordered class="col-12 col-lg-5 q-pa-sm">
                  <div class="row items-center q-mb-sm">
                    <q-chip color="light-blue" text-color="white" icon="telegram" size="sm">Telegram</q-chip>
                  </div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Текст: до 4096 символов</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Клавиатура: неограничено</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Текст кнопки: до 64 символов</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Поддержка URL кнопок: ✅</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>

                <q-card flat bordered class="col-12 col-lg-5 q-pa-sm">
                  <div class="row items-center q-mb-sm">
                    <q-chip color="green" text-color="white" icon="chat" size="sm">WhatsApp</q-chip>
                  </div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Текст: до 1000 символов</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Стандартная клавиатура: до 10 кнопок</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Inline клавиатура: до 3 кнопок</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Поддержка URL кнопок: ограничена</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>

                <q-card flat bordered class="col-12 col-lg-5 q-pa-sm">
                  <div class="row items-center q-mb-sm">
                    <q-chip color="orange" text-color="white" icon="sms" size="sm">SMS</q-chip>
                  </div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Текст: до 160 символов</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Клавиатура: не поддерживается</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>URL кнопки: не поддерживаются</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </q-card>
          </section>

          <!-- Решение проблем -->
          <section id="troubleshooting" class="q-mb-xl">
            <h2 class="text-h5 q-mb-md">🔧 Решение проблем</h2>
            <q-card flat bordered class="q-pa-md">
              <h3 class="text-h6 q-mb-md">Частые вопросы</h3>

              <q-expansion-item label="Кампания не отображается на главной странице">
                <div class="q-pa-md">
                  <p>Убедитесь, что кампания активна (включен переключатель "Активная кампания").</p>
                </div>
              </q-expansion-item>

              <q-expansion-item label="Не получается добавить кнопку">
                <div class="q-pa-md">
                  <p>Проверьте лимиты кнопок для выбранного канала. Для SMS кнопки не поддерживаются.</p>
                </div>
              </q-expansion-item>

              <q-expansion-item label="Текст обрезается при сохранении">
                <div class="q-pa-md">
                  <p>Каждый канал имеет лимит символов. Сократите текст согласно ограничениям канала.</p>
                </div>
              </q-expansion-item>

              <q-expansion-item label="Кнопки URL не работают">
                <div class="q-pa-md">
                  <p>Убедитесь, что указана полная ссылка (начинающаяся с http:// или https://) и канал поддерживает URL кнопки.</p>
                </div>
              </q-expansion-item>

              <h3 class="text-h6 q-mb-md q-mt-lg">Техническая поддержка</h3>
              <p class="text-body1">
                Если проблема не решена, обратитесь к разработчикам системы с подробным описанием проблемы.
              </p>
            </q-card>
          </section>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const scrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.sticky-menu {
  position: sticky;
  top: 20px;
}

.documentation-content h2 {
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
}

.documentation-content h3 {
  color: #1976d2;
}

.documentation-content {
  line-height: 1.6;
}

.rounded-borders {
  border-radius: 8px;
}

@media (max-width: 1023px) {
  .sticky-menu {
    position: relative;
    top: 0;
  }
}
</style>


