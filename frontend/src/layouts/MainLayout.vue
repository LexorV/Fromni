<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-subtitle1 text-weight-medium">
          <div class="gt-xs">Система управления кампаниями</div>
          <div class="lt-sm">Кампании</div>
        </q-toolbar-title>

        <!-- Мобильная навигация справа - только для экранов меньше 600px -->
        <div class="lt-sm">
          <q-btn
            flat
            dense
            round
            icon="more_vert"
            @click="showMobileMenu = !showMobileMenu"
          >
            <q-menu v-model="showMobileMenu" auto-close>
              <q-list style="min-width: 150px">
                <q-item
                  to="/"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon name="home" />
                  </q-item-section>
                  <q-item-section>Главная</q-item-section>
                </q-item>
                <q-item
                  to="/campaigns"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon name="campaign" />
                  </q-item-section>
                  <q-item-section>Кампании</q-item-section>
                </q-item>
                <q-item
                  to="/documentation"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon name="book" />
                  </q-item-section>
                  <q-item-section>Документация</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :width="280"
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary">
            <q-icon name="navigation" class="q-mr-sm" />
            Навигация
          </q-item-label>

          <q-item
            to="/"
            clickable
            v-ripple
            class="q-mb-sm"
            exact
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Главная</q-item-label>
              <q-item-label caption>Обзор системы</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            to="/campaigns"
            clickable
            v-ripple
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="campaign" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Кампании</q-item-label>
              <q-item-label caption>Управление кампаниями</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            to="/documentation"
            clickable
            v-ripple
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Документация</q-item-label>
              <q-item-label caption>API и инструкции</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
const showMobileMenu = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss" scoped>
.q-drawer {
  .q-item {
    border-radius: 8px;
    margin: 0 8px;

    &.router-link-active {
      background-color: var(--q-primary) !important;
      color: white;

      .q-icon {
        color: white;
      }
    }
  }
}

.q-header {
  .q-toolbar {
    min-height: 56px;
  }
}

// Мобильные стили только для экранов меньше 600px
@media (max-width: 599px) {
  .q-page-container {
    padding-top: 0;
  }

  .q-drawer {
    .q-item {
      margin: 0 4px;
    }
  }
}
</style>
